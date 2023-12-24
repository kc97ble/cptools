import { z } from "zod";
import * as fs from "fs/promises";
import * as minimist from "minimist";
import { convertTexToPdf } from "./lib";
import { BufferIsh, FileEntryIsh, OutputSpec } from "./typing";
import { resolveBuffer, resolveFileEntry } from "./utils/resolver";

const Argv = z.object({
  input: z.string(),
  assets: z.union([z.string().array(), z.string()]).nullish(),
  output: z.string(),
});

export async function main() {
  const argv0 = minimist(process.argv.slice(2), {
    alias: { input: ["i"], assets: ["a"], output: ["o"], help: ["h"] },
    default: { input: "/dev/stdin", output: "/dev/stdout" },
    string: ["input", "assets", "output"],
    boolean: ["help"],
  });

  if (argv0.help) {
    console.log(
      [
        "tex2pdf - Convert .tex file to .pdf file using pdflatex.",
        "OPTIONS",
        "  -i, --input <string|BufferIsh>: input file (*.tex)",
        "  -a, --assets <string|FileEntryIsh>: asset files",
        "  -o, --output <string|OutputSpec>: output file (*.pdf)",
        "  -h, --help: show help",
      ].join("\n\n")
    );
    process.exit(0);
  }

  const argv = Argv.parse(argv0);
  const inputBuffer = await resolveBuffer(BufferIsh.parse(argv.input));
  const outputSpec = OutputSpec.parse(argv.output);

  const assetFiles = await Promise.all(
    toArray(argv.assets).map(async (item) => {
      return await resolveFileEntry(FileEntryIsh.parse(item));
    })
  );

  const { outputBuffer } = await convertTexToPdf({ inputBuffer, assetFiles });

  switch (outputSpec.type) {
    case "file":
      await fs.writeFile(outputSpec.path, outputBuffer);
      break;
    case "s3":
      throw new Error("not implemented");
  }
}

function toArray<T>(value: T[] | T | null | undefined): T[] {
  if (value == null) {
    return [];
  } else if (Array.isArray(value)) {
    return value;
  } else {
    return [value];
  }
}
