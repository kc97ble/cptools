import { z } from "zod";
import * as path from "path";
import * as AdmZip from "adm-zip";

export function convertJsonToZip(json: string) {
  const obj: Record<string, string> = z
    .record(z.string())
    .parse(JSON.parse(json));
  const zip = new AdmZip();
  Object.entries(obj).forEach(([key, val]) => {
    const { dir, base } = path.parse(key);
    zip.addLocalFile(val, dir, base);
  });
  return zip.toBuffer();
}
