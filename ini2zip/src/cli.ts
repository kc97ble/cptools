import * as fs from "fs/promises";
import { z } from "zod";
import * as minimist from "minimist";
import { convertIniToZip } from "./lib";

const Argv = z.object({
  input: z.string(),
  output: z.string(),
});

export async function main() {
  const argv0 = minimist(process.argv.slice(2), {
    alias: { input: ["i"], output: ["o"], help: ["h"] },
    default: { input: "/dev/stdin", output: "/dev/stdout" },
    string: ["input", "output"],
    boolean: ["help"],
  });

  if (argv0.help) {
    console.log(
      [
        "ini2zip - Convert .ini file to .zip file.",
        "OPTIONS",
        "  -i, --input <string>: input file (*.ini, default: /dev/stdin)",
        "  -o, --output <string>: output file (*.zip, default: /dev/stdout)",
        "  -h, --help: show help",
      ].join("\n\n")
    );
    process.exit(0);
  }

  const argv = Argv.parse(argv0);
  const ini = await fs.readFile(argv.input, "utf-8");
  const zip = convertIniToZip(ini);
  await fs.writeFile(argv.output, zip);
}
