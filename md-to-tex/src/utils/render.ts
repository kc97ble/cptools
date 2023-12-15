import { z } from "zod";
import { literal } from "./escape";
import * as JsYaml from "js-yaml";

const OPERATORS: Partial<Record<string, string>> = {
  "<=": " \\le ",
  ">=": " \\ge ",
  "==": " = ",
  "!=": " \\ne ",
  "===": " \\equiv ",
  "*": " \\times ",
  "<": " < ",
  ">": " > ",
};

export function renderCodeInline(code: string) {
  let m: RegExpMatchArray | null = null;

  if ((m = code.match(/^\$((?:\\\$|[^$])*)\$$/))) {
    return `$${m[1]}$`;
  } else if ((m = code.match(/^\"((?:\\\"|[^"])*)\"$/))) {
    return "\\texttt{" + literal.textMode(m[1]) + "}";
  } else if ((m = code.match(/^\'((?:\\\'|[^'])*)\'$/))) {
    return "\\texttt{" + literal.textMode(m[1]) + "}";
  }

  const chunks: string[] = [];

  while (code) {
    if ((m = code.match(/^\$((?:\\\$|[^$])*)\$(.*)$/))) {
      chunks.push(`{${m[1]}}`);
      code = m[2];
    } else if ((m = code.match(/^\"((?:\\\"|[^"])*)\"(.*)$/))) {
      chunks.push("\\mathtt{" + literal.mathMode(m[1]) + "}");
      code = m[2];
    } else if ((m = code.match(/^\'((?:\\\'|[^'])*)\'(.*)$/))) {
      chunks.push("\\mathtt{" + literal.mathMode(m[1]) + "}");
      code = m[2];
    } else if ((m = code.match(/^([!*<=>]+)(.*)$/))) {
      chunks.push(OPERATORS[m[1]] || m[1]);
      code = m[2];
    } else if ((m = code.match(/^([A-Za-z][A-Za-z0-9]*)(.*)$/))) {
      chunks.push(m[1].length > 1 ? "\\mathit{" + m[1] + "}" : m[1]);
      code = m[2];
    } else if ((m = code.match(/^([0-9](?:[0-9]|[,][0-9]|[.])*)(.*)$/))) {
      chunks.push(m[1].replace(/,/g, "\\,"));
      code = m[2];
    } else if ((m = code.match(/^([_^])(.*)$/))) {
      chunks.push(m[1]);
      code = m[2];
    } else {
      chunks.push(literal.mathMode(code[0]));
      code = code.slice(1);
    }
  }

  return "$" + chunks.join("").replace(/(\s)\s+/g, "$1") + "$";
}

const TestCase = z.object({
  input: z.string(),
  output: z.string(),
  notes: z.string().nullish(),
});

type TestCase = z.infer<typeof TestCase>;

export function renderTestCases(list: TestCase[]) {
  const two = function* () {
    yield "\\begin{example}%";
    for (const test of list) {
      yield "  \\exmp{%";
      yield* test.input
        .trim()
        .split("\n")
        .map((line) => literal.codeMode(line) || "~");
      yield "  }{%";
      yield* test.output
        .trim()
        .split("\n")
        .map((line) => literal.codeMode(line) || "~");
      yield "  }%";
    }
    yield "\\end{example}%";
  };

  const three = function* () {
    yield "\\begin{examplethree}%";
    for (const test of list) {
      yield "  \\exmp{%";
      yield* test.input
        .trim()
        .split("\n")
        .map((line) => literal.codeMode(line) || "~");
      yield "  }{%";
      yield* test.output
        .trim()
        .split("\n")
        .map((line) => literal.codeMode(line) || "~");
      yield "  }{%";
      yield* (test.notes || "")
        .trim()
        .split("\n")
        .map((line) => literal.codeMode(line) || "~");
      yield "  }%";
    }
    yield "\\end{examplethree}%";
  };

  if (list.some((test) => test.notes)) {
    return Array.from(three()).join("\n") + "\n\n";
  } else {
    return Array.from(two()).join("\n") + "\n\n";
  }
}

export function renderCodeBlock(code: string, infostring: string | undefined) {
  switch (infostring) {
    case "yaml": {
      const docs = JsYaml.loadAll(code) //
        .flatMap((doc) => (Array.isArray(doc) ? doc : [doc]));
      const sp = TestCase.array().safeParse(docs);
      if (sp.success) {
        return renderTestCases(sp.data);
      } else {
        return (
          "\\errmessage{invalid code block}\n\n" +
          "\\begin{verbatim}\n" +
          JSON.stringify(sp.error, null, 2) +
          "\n\\end{verbatim}\n\n"
        );
      }
    }
    default: {
      return (
        "\\begin{verbatim}\n" + literal.codeMode(code), "\n\\end{verbatim}\n\n"
      );
    }
  }
}
