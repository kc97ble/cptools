import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as os from "node:os";
import { rimraf } from "rimraf";

export async function withTempDirectory<T>(
  callback: (tempDir: string) => Promise<T>
): Promise<T> {
  await fs.mkdir(path.join(os.tmpdir(), "tex2pdf"), { recursive: true });
  const prefix = path.join(os.tmpdir(), "tex2pdf", "temp-");
  const tempDir = await fs.mkdtemp(prefix);

  try {
    return await callback(tempDir);
  } finally {
    await rimraf(tempDir);
  }
}

export async function writeFilesToDir(dir: string, files: Map<string, Buffer>) {
  await Promise.all(
    Array.from(files.entries()).map(async ([filePath, fileContent]) => {
      const pth = path.join(dir, filePath);
      await fs.mkdir(path.dirname(pth), { recursive: true });
      await fs.writeFile(pth, fileContent);
    })
  );
}

export async function readFilesFromDir(dir: string) {
  const filesMap: Map<string, Buffer> = new Map();
  const files = await fs.readdir(dir);

  await Promise.all(
    files.map(async (fileName) => {
      const filePath = path.join(dir, fileName);
      const fileStat = await fs.stat(filePath);
      if (!fileStat.isFile()) return;
      const fileContent = await fs.readFile(filePath);
      filesMap.set(fileName, fileContent);
    })
  );

  return filesMap;
}
