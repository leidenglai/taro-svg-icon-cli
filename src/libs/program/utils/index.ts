import { replaceColor, replaceFill, replaceHexToRgb, replaceStroke } from './replace';

/**
 * @param data
 * @param config
 * @returns
 */
export const generateLocalCase = (
  data: string,
  config?: {
    hexToRgb: boolean;
  },
) => {
  let template = data;
  template = template.replace(/"/g, "'");
  // 替换所有颜色
  template = replaceColor(template, (match) => {
    return config?.hexToRgb ? replaceHexToRgb(match) : match;
  });
  template = template.replace(/[;,/?:@&=+$#<>%]/g, (matched) => encodeURIComponent(matched));
  // 替换换行符或过个空格
  template = template.replace(/[\r\n\s]+/g, ' ');
  template = template.replace(/width%3D'(\w+)'/, `width%3D'{{svgSize}}px'`);
  template = template.replace(/height%3D'(\w+)'/, `height%3D'{{svgSize}}px'`);

  if (/fill%3D/.test(template)) {
    // 替换fill
    template = replaceFill(template, (match, p1) => {
      return `fill%3D'{{(isStr ? colors : colors[0]) || '${p1}'}}'`;
    });
  } else {
    // 在svg标签添加fill
    template = template.replace(/%3Csvg/, "%3Csvg fill%3D'{{(isStr ? colors : colors[0]) || ''}}'");
  }

  if (/stroke%3D/.test(template)) {
    // 替换stroke
    template = replaceStroke(template, (match, p1) => {
      return `stroke%3D'{{(isStr ? colors : colors[0]) || '${p1}'}}'`;
    });
  }

  return template;
};

/**
 * @param name 中划线转换驼峰命名
 * @returns
 */
export function nameToHump(name: string) {
  name = name.replace(/^(\w)/g, (all, letter) => letter.toUpperCase());
  return name.replace(/\-(\w)/g, (all, letter) => letter.toUpperCase());
}
