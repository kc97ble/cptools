#!/usr/bin/env node

require("ts-node").register();
const path = require("path");
const { main } = require(path.resolve(__dirname, "../src/cli.ts"));

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
