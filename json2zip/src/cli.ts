import { z } from "zod";
import * as fs from "fs";
import * as minimist from "minimist";
import { convertJsonToZip } from "./lib";

const Params = z.object({
  input: z.string().min(1),
  output: z.string().min(1),
});

export async function main() {
  const argv = minimist(process.argv.slice(2), {
    alias: { input: ["i"], output: ["o"], help: ["h"] },
    default: { input: "/dev/stdin", output: "/dev/stdout" },
    string: ["input", "output"],
    boolean: ["help"],
  });

  if (argv.help) {
    console.log(
      [
        "Create a .zip file based on the instructions from a .json file",
        "OPTIONS",
        "  -i, --input INPUT: input file (*.json)",
        "  -o, --output OUTPUT: output file (*.zip)",
        "  -h, --help: show help",
      ].join("\n\n")
    );
    process.exit(0);
  }

  const params = Params.parse(argv);
  const json = await fs.promises.readFile(params.input, "utf-8");
  const zip = convertJsonToZip(json);
  await fs.promises.writeFile(params.output, zip);
}
