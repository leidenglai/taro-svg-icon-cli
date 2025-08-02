import fs from 'fs';
import path from 'path';
import * as mkdirp from 'mkdirp';
import * as glob from 'glob';
import colors from 'colors';
import { generateLocalCase, nameToHump } from './utils';
import { replaceCss, replaceInstead, replaceIsRpx, replaceNames, replaceSize, replaceSvgCode } from './utils/replace';
import { Config } from '../getConfig';
import { ILocalSvgs } from '../parseLocalSvg';
import { getTemplate } from '../getTemplate';

interface CompModel {
  name: string;
  js: string;
  css?: string;
  template?: string;
}

export const generateVueComponent = (data: ILocalSvgs, config: Config) => {
  const names: string[] = [];
  const saveDir = path.resolve(config.save_dir);

  mkdirp.sync(saveDir);
  glob.sync(path.join(saveDir, '*')).forEach((file) => fs.unlinkSync(file));

  (data as ILocalSvgs).forEach((item) => {
    const iconId = item.name;
    const iconIdAfterTrim = config.trim_icon_prefix
      ? iconId.replace(new RegExp(`^${config.trim_icon_prefix}(.+?)$`), (_, value) =>
          value.replace(/^[-_.=+#@!~*]+(.+?)$/, '$1'),
        )
      : iconId;

    names.push(iconIdAfterTrim);
    const comp: CompModel = {
      name: iconIdAfterTrim,
      css: getTemplate('vue.css'),
      js: getTemplate('vue.js'),
    };

    comp.js = replaceSvgCode(
      comp.js,
      generateLocalCase(item.svgStr, {
        hexToRgb: true,
      }),
    );

    comp.js = replaceSize(comp.js, config.default_icon_size);
    comp.js = replaceInstead(comp.js);
    comp.js = replaceIsRpx(comp.js, config.use_rpx);
    comp.js = replaceCss(comp.js, comp.css || '');

    fs.writeFileSync(path.join(saveDir, comp.name + '.vue'), comp.js);

    console.log(`${colors.green('√')} 生成图标 "${colors.yellow(iconId)}"`);
  });
  const importStrs = names.map((name) => `import ${nameToHump(name)} from './${name}.vue;'`);
  const compsStrs = names.map((name) => `${nameToHump(name)}, `);
  let enptyStr = replaceNames(getTemplate('vue-entry.js'), names);
  enptyStr = enptyStr.replace(/#import#/g, importStrs.join('\n'));
  enptyStr = enptyStr.replace(/#comps#/g, compsStrs.join(''));

  fs.writeFileSync(path.join(saveDir, 'index.vue'), enptyStr);

  console.log(`\n${colors.green('√')} 所有图标已放入文件夹: ${colors.green(config.save_dir)}\n`);
};
