import fs from 'fs';
import path, { basename } from 'path';
import * as mkdirp from 'mkdirp';
import * as glob from 'glob';
import colors from 'colors';
import { generateLocalCase } from './utils';
import { replaceIsRpx, replaceNames, replaceSize } from './utils/replace';
import { Config } from '../getConfig';
import { getTemplate } from '../getTemplate';
import { ILocalSvgs } from '../parseLocalSvg';

export const generateAlipayComponent = (data: ILocalSvgs, config: Config) => {
  const svgTemplates: string[] = [];
  const names: string[] = [];
  const saveDir = path.resolve(config.save_dir);
  const fileName = basename(config.save_dir) || 'iconfont';

  mkdirp.sync(saveDir);
  glob.sync(path.join(saveDir, '*')).forEach((file) => fs.unlinkSync(file));

  data.forEach((item) => {
    const iconId = item.name;
    const iconIdAfterTrim = config.trim_icon_prefix
      ? iconId.replace(new RegExp(`^${config.trim_icon_prefix}(.+?)$`), (_, value) =>
          value.replace(/^[-_.=+#@!~*]+(.+?)$/, '$1'),
        )
      : iconId;

    names.push(iconIdAfterTrim);
    svgTemplates.push(
      `<!--${iconIdAfterTrim}-->\n<view a:if="{{name === '${iconIdAfterTrim}'}}" style="background-image: url({{quot}}data:image/svg+xml, ${generateLocalCase(
        item.svgStr,
        {
          hexToRgb: true,
        },
      )}{{quot}});` + ' width: {{svgSize}}px; height: {{svgSize}}px; " class="icon" />',
    );

    console.log(`${colors.green('√')} 生成图标 "${colors.yellow(iconId)}"`);
  });

  fs.writeFileSync(path.join(saveDir, fileName + '.acss'), getTemplate('alipay.acss'));
  fs.writeFileSync(path.join(saveDir, fileName + '.axml'), svgTemplates.join('\n\n'));

  let jsFile = getTemplate('alipay.js');

  jsFile = replaceSize(jsFile, config.default_icon_size);
  jsFile = replaceNames(jsFile, names);
  jsFile = replaceIsRpx(jsFile, config.use_rpx);

  fs.writeFileSync(path.join(saveDir, fileName + '.js'), jsFile);
  fs.writeFileSync(path.join(saveDir, fileName + '.json'), getTemplate('alipay.json'));

  console.log(`\n${colors.green('√')} 所有图标已放入文件夹: ${colors.green(config.save_dir)}\n`);
};
