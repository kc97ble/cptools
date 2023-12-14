#!/usr/bin/env node

require("ts-node").register();
const { main } = require("../dist/cli.js");

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
