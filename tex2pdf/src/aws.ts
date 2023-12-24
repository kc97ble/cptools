import { z } from "zod";
import { BufferIsh, FileEntryIsh } from "./typing";
import { BSON } from "bson";

const Params = z.object({
  input: BufferIsh,
  extra: FileEntryIsh.array(),
});

type Params = z.infer<typeof Params>;

export async function handler(params: Params) {
  console.log(params);
}

export async function request(params: Params) {
  // send request using S3
  // receive response using S3
}
