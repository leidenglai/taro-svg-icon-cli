import { XmlData } from 'iconfont-parser';
import { Config } from './getConfig';
import { ILocalSvg } from './parseLocalSvg';

export const getLocalIconNames = (data: ILocalSvg[], config: Config) => {
  const names: string[] = [];

  data.forEach((item) => {
    const iconId = item.name
    const iconIdAfterTrim = config.trim_icon_prefix
      ? iconId.replace(
        new RegExp(`^${config.trim_icon_prefix}(.+?)$`),
        (_, value) => value.replace(/^[-_]?(.+?)$/, '$1')
      )
      : iconId;

    names.push(iconIdAfterTrim);
  });

  return names;
};
