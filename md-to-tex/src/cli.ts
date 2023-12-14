import { z } from "zod";
import * as fs from "fs";
import * as minimist from "minimist";

import { convertMdToTex } from "./lib";

const Params = z.object({
  input: z.string().min(1),
  output: z.string().min(1),
});

export async function main() {
  const argv = minimist(process.argv.slice(2));

  if (argv.help || argv.h) {
    console.log(
      [
        "Convert .md file to .tex file for problem setters.",
        "OPTIONS",
        "  -i, --input INPUT: input file (*.md)",
        "  -o, --output OUTPUT: output file (*.tex)",
        "  -h, --help: show help",
      ].join("\n\n")
    );
    process.exit(0);
  }

  const params = Params.parse({
    input: argv.input || argv.i || "/dev/stdin",
    output: argv.output || argv.o || "/dev/stdout",
  });

  const md = await fs.promises.readFile(params.input, "utf-8");
  const tex = await convertMdToTex(md);
  await fs.promises.writeFile(params.output, tex, "utf-8");
}
