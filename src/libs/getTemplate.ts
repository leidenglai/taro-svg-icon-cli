import fs from 'fs';
import path from 'path';

/**
 * 读取模版文件
 * @returns
 */
export const getTemplate = (fileName: string) => {
  return fs.readFileSync(path.join(__dirname, `../templates/${fileName}.template`)).toString();
};
