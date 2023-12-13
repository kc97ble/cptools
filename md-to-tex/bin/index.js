#!/usr/bin/env node

require("ts-node").register();

const { z } = require("zod");
const { convertMdToTex } = require("../src/index.ts");
const minimist = require("minimist");
const Fs = require("fs");

const Params = z.object({
  input: z.string().min(1),
  output: z.string().min(1),
});

async function main() {
  const argv = minimist(process.argv.slice(2));
  const params = Params.parse({
    input: argv.input || argv.i,
    output: argv.output || argv.o,
  });

  const md = await Fs.promises.readFile(params.input, "utf-8");
  const tex = await convertMdToTex(md);
  await Fs.promises.writeFile(params.output, tex, "utf-8");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
