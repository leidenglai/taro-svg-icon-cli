import * as glob from 'glob';
import path from 'path';
import * as fs from 'fs';
import { optimize } from 'svgo';
import { Config } from '../libs/getConfig';

export type ILocalSvgs = {
  /** xml字符串 */
  svgStr: string;
  /** 文件名 */
  name: string;
  /** xml包含style */
  styleType: boolean;
}[];

/**
 * 解析本地svg资源
 * 并且将svg xml精简压缩
 * @returns
 */
export default async function parseLocalSvg({ local_svgs }: Config) {
  if (!local_svgs) {
    return Promise.resolve([]);
  }
  const localDir = path.resolve(local_svgs);
  const localSvgPaths = glob.sync(path.join(localDir, '**/*.svg'));
  const svgs = localSvgPaths.reduce<ILocalSvgs>((svgSources, svgPath) => {
    // 添加svg压缩
    const optimizeSVG = optimize(fs.readFileSync(svgPath, 'utf-8'), {
      // all config fields are also available here
      // https://github.com/svg/svgo#built-in-plugins
      multipass: true,
      plugins: [
        {
          name: 'preset-default',
          params: {
            overrides: {
              // 覆盖默认参数
              removeViewBox: false,
            },
          },
        },
        'removeStyleElement',
        {
          name: 'removeAttrs',
          params: {
            attrs: 'class',
          },
        },
      ],
    });
    const svgXml = optimizeSVG.data;
    const styleType = !!~svgXml.indexOf('</style>');

    svgSources.push({ svgStr: svgXml, name: path.basename(svgPath, '.svg'), styleType });

    return svgSources;
  }, []);

  return svgs;
}
