const ESCAPE: Partial<Record<string, string>> = {
  "\\": "\\textbackslash{}",
  "{": "\\{",
  "}": "\\}",
  $: "\\$",
  "&": "\\&",
  "#": "\\#",
  "^": "\\^{}",
  _: "\\_",
  "~": "\\textasciitilde{}",
  "%": "\\%",
  "<": "\\textless{}",
  ">": "\\textgreater{}",
  "|": "\\textbar{}",
  '"': "``",
  "'": "\\textquotesingle{}",
  "`": "\\textasciigrave{}",
};

export const literal = {
  textMode: (text: string) =>
    text.replace(/[\\{}$&#^_~%<>|]/g, (char) => ESCAPE[char] || char),
  mathMode: (text: string) =>
    text.replace(/[{}$&#%]/g, (char) => ESCAPE[char] || char),
};
