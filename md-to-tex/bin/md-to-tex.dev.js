#!/usr/bin/env node

require("ts-node").register();
const { main } = require("../src/cli.ts");

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
