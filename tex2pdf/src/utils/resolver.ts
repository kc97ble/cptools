import * as path from "path";
import * as fs from "fs/promises";
import { BufferIsh, FileEntryIsh, FileEntry } from "../typing";
import { assert } from "../utils";

export async function resolveBuffer(bufferIsh: BufferIsh): Promise<Buffer> {
  switch (bufferIsh.type) {
    case "buffer":
      return bufferIsh.data;
    case "file":
      return await fs.readFile(bufferIsh.path);
    case "lib":
      assert(bufferIsh.name === "freecontest.2023Q4.sty");
      return await fs.readFile(
        path.join(
          __dirname,
          "..",
          "..",
          "..",
          "_assets",
          "freecontest.2023Q4.sty"
        )
      );
    default:
      throw new Error("not implemented");
  }
}

export async function resolveFileEntry(
  fileEntryIsh: FileEntryIsh
): Promise<FileEntry> {
  if (typeof fileEntryIsh === "string") {
    return await resolveFileEntry({
      name: path.basename(fileEntryIsh),
      data: { type: "file", path: fileEntryIsh },
    });
  }

  return {
    name: fileEntryIsh.name,
    data: await resolveBuffer(fileEntryIsh.data),
  };
}
