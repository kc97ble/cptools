import path = require("path");
import { z } from "zod";

export const BufferIsh = z.preprocess(
  (value) => {
    if (typeof value === "string" && value.startsWith("{")) {
      return JSON.parse(value);
    } else if (typeof value === "string") {
      return { type: "file", path: value };
    } else {
      return value;
    }
  },
  z.union([
    z.object({
      type: z.literal("fetch"),
      uri: z.string(),
    }),
    z.object({
      type: z.literal("file"),
      path: z.string(),
    }),
    z.object({
      type: z.literal("buffer"),
      data: z.instanceof(Buffer),
    }),
    z.object({
      type: z.literal("s3"),
      bucket: z.string(),
      key: z.string(),
    }),
    z.object({
      type: z.literal("lib"),
      name: z.enum(["freecontest.2023Q4.sty"]),
    }), //
  ])
);

export type BufferIsh = z.infer<typeof BufferIsh>;

export const FileEntryIsh = z.preprocess((value) => {
  if (typeof value === "string" && value.startsWith("{")) {
    return JSON.parse(value);
  } else if (typeof value === "string") {
    return { name: path.basename(value), data: { type: "file", path: value } };
  } else {
    return value;
  }
}, z.object({ name: z.string(), data: BufferIsh }));

export type FileEntryIsh = z.infer<typeof FileEntryIsh>;

export const FileEntry = z.object({
  name: z.string(),
  data: z.instanceof(Buffer),
});

export type FileEntry = z.infer<typeof FileEntry>;

export const OutputSpec = z.preprocess(
  (value) => {
    if (value === "-") {
      return { type: "file", path: "/dev/stdout" };
    } else if (typeof value === "string" && value.startsWith("{")) {
      return JSON.parse(value);
    } else {
      return { type: "file", path: value };
    }
  },
  z.union([
    z.object({ type: z.literal("file"), path: z.string() }),
    z.object({ type: z.literal("s3"), bucket: z.string() }), //
  ])
);

export type OutputSpec = z.infer<typeof OutputSpec>;
