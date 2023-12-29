#!/usr/bin/env node

const path = require("path");
const { main } = require(path.resolve(__dirname, "../dist/cli.js"));

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
