import * as chalk from "chalk";
import { SpawnOptionsWithoutStdio, spawn } from "child_process";

export async function run(
  [exec, ...args]: string[],
  options?: SpawnOptionsWithoutStdio
): Promise<{
  stdout: Buffer;
  stderr: Buffer;
  code: number | null;
  signal: NodeJS.Signals | null;
}> {
  return new Promise((resolve, reject) => {
    const stdoutChunks: Buffer[] = [];
    const stderrChunks: Buffer[] = [];
    const childProcess = spawn(exec, args, options);
    childProcess.on("error", (err) => reject(err));
    childProcess.stdin.end();

    childProcess.stdout.on("data", (data: Buffer) => {
      process.stderr.write(chalk.blue(data.toString()));
      return stdoutChunks.push(data);
    });

    childProcess.stderr.on("data", (data: Buffer) => {
      process.stderr.write(chalk.yellow(data.toString()));
      return stderrChunks.push(data);
    });

    childProcess.on("close", (code, signal) => {
      resolve({
        stdout: Buffer.concat(stdoutChunks),
        stderr: Buffer.concat(stderrChunks),
        code,
        signal,
      });
    });
  });
}
