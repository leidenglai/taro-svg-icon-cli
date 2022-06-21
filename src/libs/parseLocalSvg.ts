import glob from "glob";
import path from "path";
import { parseString } from "xml2js";
import { Config } from "../libs/getConfig";
import * as fs from "fs";
import { XmlData } from "../commands";

export interface ILocalSvg {
  svgStr: string;
  name: string;
  styleType: boolean;
}

const parseLocalSvg = async ({ local_svgs }: Config): Promise<XmlData> => {
  if (!local_svgs) {
    return {
      svg: {
        symbol: [],
      },
    };
  }

  const localDir = path.resolve(local_svgs);
  const localSvg = glob.sync(path.join(localDir, "**/*.svg"));

  const symbolList = localSvg.map((currentValue) => {
    let svgStr = fs.readFileSync(currentValue, "utf-8");

    /**
     * 去除注释,title,desc等不需要的标签
     */
    svgStr = svgStr
      .substring(svgStr.indexOf("<svg "), svgStr.indexOf("</svg>") + 6)
      .replace(/<!-(.*?)->/g, "")
      .replace(/<title>(.*?)<\/title>/g, "")
      .replace(/<desc>(.*?)<\/desc>/g, "");

    const styleType = !!~svgStr.indexOf("</style>");

    const source = {
      svgStr,
      name: path.basename(currentValue, ".svg"),
      styleType,
    };

    return new Promise<XmlData["svg"]["symbol"][0]>((resolve, reject) => {
      parseString(source.svgStr, { rootName: "svg" }, (err: Error, result) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            $: {
              id: source.name,
              viewBox: result.svg.$.viewBox,
            },
            path: result.svg.path,
          });
        }
      });
    });
  });

  const data = await Promise.all(symbolList);

  return {
    svg: {
      symbol: data,
    },
  };
};

export default parseLocalSvg;
