import { Config } from './getConfig';
import { ILocalSvgs } from './parseLocalSvg';

/**
 * 生成所有图标名称
 * 如果配置前缀，加上前缀
 */
export const getLocalIconNames = (data: ILocalSvgs, config: Config) => {
  return data.reduce<string[]>((names, { name }) => {
    const iconIdAfterTrim = config.trim_icon_prefix
      ? name.replace(new RegExp(`^${config.trim_icon_prefix}(.+?)$`), (_, value) => value.replace(/^[-_]?(.+?)$/, '$1'))
      : name;

    names.push(iconIdAfterTrim);

    return names;
  }, []);
};
