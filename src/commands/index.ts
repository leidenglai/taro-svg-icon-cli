#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import glob from 'glob';
import colors from 'colors';
import mkdirp from 'mkdirp';
import { Config, PLATFORM, getConfig } from '../libs/getConfig';
import { PLATFORM_MAP } from '../libs/maps';
import { filterMiniProgramConfig } from '../libs/filterConfig';
import { generateUsingComponent } from '../libs/generateUsingComponent';
import { getLocalIconNames } from '../libs/getLocalIconNames';
import parseLocalSvg, { ILocalSvgs } from '../libs/parseLocalSvg';
import { generateAlipayComponent } from '../libs/program/generateAlipayComponent';
import { generateWechatComponent } from '../libs/program/generateWechatComponent';

const config = getConfig();

function getXmlData(config: Config): Promise<ILocalSvgs> {
  return parseLocalSvg(config);
}

/**
 * 清空文件夹
 */
function unlinkFile(dir: string) {
  glob.sync(path.resolve(dir, '*')).forEach((dirOrFile) => {
    if (fs.statSync(dirOrFile).isDirectory()) {
      unlinkFile(dirOrFile);
      fs.rmdirSync(dirOrFile);
    } else {
      fs.unlinkSync(dirOrFile);
    }
  });
}

getXmlData(config)
  .then((result) => {
    if (!config.platforms.length) {
      console.warn(`\nPlatform is required.\n`);
      return;
    }

    mkdirp.sync(config.save_dir);
    unlinkFile(config.save_dir);

    const iconNames = getLocalIconNames(result, config);

    // generateUsingComponent(config, iconNames);

    config.platforms.forEach((platform) => {
      let iconfontLib = PLATFORM_MAP[platform];
      if (!iconfontLib) {
        console.warn(`\n不存在处理 ${colors.red(platform)} 端的lib.\n`);
        return;
      }
      console.log(`\n开始创建 ${colors.green(platform)} 端图标\n`);
      let execFile = path.join(...iconfontLib.split('/'));
      const execMethod = path.basename(execFile);

      if (platform === PLATFORM.ALIPAY) {
        generateAlipayComponent(result, filterMiniProgramConfig(config, platform));
      } else if (platform === PLATFORM.WEAPP) {
        generateWechatComponent(result, filterMiniProgramConfig(config, platform));
      }

      generateUsingComponent(config, iconNames, platform);
    });
  })
  .catch((e) => {
    console.error(colors.red(e.message || 'Unknown Error'));
    process.exit(1);
  });
