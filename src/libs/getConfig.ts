import path from 'path';
import fs from 'fs';
import colors from 'colors';
import minimist from 'minimist';
import defaultConfig from './iconfont.json';
import { PLATFORM_MAP } from './maps';

export enum PLATFORM {
  WEAPP = 'weapp',
  H5 = 'h5',
  ALIPAY = 'alipay',
}

export interface Config {
  /** 保存地址 */
  save_dir: string;
  /** 是否使用typescript */
  use_typescript?: boolean;
  /** 编译平台 */
  platforms: PLATFORM[];
  /** 是否使用rpx */
  use_rpx: boolean;
  /** 设计稿宽度 */
  design_width?: string | number;
  /** 图标前缀 */
  trim_icon_prefix: string;
  /** 默认图标font-size */
  default_icon_size: number;
  /** 本地保存svg图地址 */
  local_svgs: string;
}

let cacheConfig: Config;

export const getConfig = (argv?: string[]) => {
  if (cacheConfig) {
    return cacheConfig;
  }

  const args = minimist<{ config: string }>(argv || process.argv.slice(2));
  let configFilePath = 'iconfont.json';

  if (args.config && typeof args.config === 'string') {
    configFilePath = args.config;
  }

  const targetFile = path.resolve(configFilePath);

  if (!fs.existsSync(targetFile)) {
    console.warn(colors.red(`配置文件 "${configFilePath}" 不存在, 你是不是忘记生成了？`));
    process.exit(1);
  }

  const config = require(targetFile) as Config;

  if (!config.local_svgs) {
    console.warn(colors.red('你需要提供 "local_svgs" 配置'));
    process.exit(1);
  }

  if (Array.isArray(config.platforms)) {
    config.platforms = [...new Set(config.platforms)];
  } else {
    if (config.platforms === '*') {
      config.platforms = Object.keys(PLATFORM_MAP) as PLATFORM[];
    } else {
      config.platforms = [];
    }
  }

  config.save_dir = config.save_dir || defaultConfig.save_dir;
  config.default_icon_size = config.default_icon_size || defaultConfig.default_icon_size;

  cacheConfig = config;

  return config;
};
