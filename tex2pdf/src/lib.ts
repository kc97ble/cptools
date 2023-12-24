import * as fs from "node:fs/promises";
import * as path from "node:path";
import { FileEntry } from "./typing";
import { assert } from "./utils";
import {
  readFilesFromDir,
  withTempDirectory,
  writeFilesToDir,
} from "./utils/file";
import { run } from "./utils/process";

export async function convertTexToPdf({
  inputBuffer,
  assetFiles,
}: {
  inputBuffer: Buffer;
  assetFiles: FileEntry[];
}): Promise<{
  outputBuffer: Buffer;
  outputMap: Map<string, Buffer>;
}> {
  return await withTempDirectory(async (baseDir) => {
    const inputDir = path.join(baseDir, "input");
    await fs.mkdir(inputDir, { recursive: true });
    const inputMap = new Map([["main.tex", inputBuffer]]);
    await writeFilesToDir(inputDir, inputMap);

    const assetDir = path.join(baseDir, "assets");
    await fs.mkdir(assetDir, { recursive: true });
    const assetMap = new Map(assetFiles.map((item) => [item.name, item.data]));
    await writeFilesToDir(assetDir, assetMap);

    const outputDir = path.join(baseDir, "output");
    await fs.mkdir(outputDir, { recursive: true });

    const { stdout, stderr } = await run(
      [
        "/usr/bin/env",
        "pdflatex",
        "-output-directory",
        outputDir,
        path.join(inputDir, "main.tex"),
      ],
      { cwd: assetDir }
    );

    const outputMap = await readFilesFromDir(outputDir);
    outputMap.set("stdout", stdout);
    outputMap.set("stderr", stderr);

    const outputBuffer = outputMap.get("main.pdf");
    assert(outputBuffer, "main.pdf is not found");

    return { outputBuffer, outputMap };
  });
}
