import glob from 'glob';
import path from 'path';
import { Config } from '../libs/getConfig';
import * as fs from 'fs';
import { optimize } from 'svgo';

export interface ILocalSvg {
  svgStr: string;
  name: string;
  styleType: boolean;
}

const parseLocalSvg = ({ local_svgs }: Config) => {
  if (!local_svgs) {
    return Promise.resolve([]);
  }

  const localDir = path.resolve(local_svgs);
  const localSvg = glob.sync(path.join(localDir, '**/*.svg'));

  const svgs = localSvg.reduce<ILocalSvg[]>((previousValue, currentValue) => {
    let svgStr = fs.readFileSync(currentValue, 'utf-8');

    // 添加svg压缩
    const optimizeSVG = optimize(svgStr, {
      // all config fields are also available here
      // https://github.com/svg/svgo#built-in-plugins
      multipass: true,
    });

    svgStr = optimizeSVG.data;

    const styleType = !!~svgStr.indexOf('</style>');

    previousValue.push({ svgStr, name: path.basename(currentValue, '.svg'), styleType });

    return previousValue;
  }, []);

  return Promise.resolve(svgs);
};

export default parseLocalSvg;
