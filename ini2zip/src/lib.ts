import { z } from "zod";
import * as Ini from "ini";
import * as path from "path";
import * as AdmZip from "adm-zip";

export function convertIniToZip(ini: string) {
  const obj: Record<string, string> = z
    .record(z.string())
    .parse(Ini.parse(ini));
  const zip = new AdmZip();
  Object.entries(obj).forEach(([key, val]) => {
    const { dir, base } = path.parse(key);
    zip.addLocalFile(val, dir, base);
  });
  return zip.toBuffer();
}
