const ESCAPE_TEXT: Partial<Record<string, string>> = {
  _: "{\\_}",
  "{": "{\\{}",
  "}": "{\\}}",
  "\\": "\\textbackslash{}",
  "&": "{\\&}",
  "#": "{\\#}",
  "%": "\\%",
  "^": "{\\^{}}",
  "<": "\\textless{}",
  ">": "\\textgreater{}",
  "|": "\\textbar{}",
  "~": "\\textasciitilde{}",
  $: "{\\$}",
};

const ESCAPE_MATH: Partial<Record<string, string>> = {
  _: "{\\_}",
  "{": "{\\{}",
  "}": "{\\}}",
  "\\": "\\textbackslash{}",
  "&": "{\\&}",
  "#": "{\\#}",
  "%": "{\\%}",
  "^": "{\\char`\\^}",
  "~": "{\\sim}",
  $: "{\\$}",
};

const ESCAPE_CODE: Partial<Record<string, string>> = {
  _: "{\\_}",
  "-": "{-}",
  "'": "\\textquotesingle{}",
  "{": "{\\{}",
  "}": "{\\}}",
  "\\": "\\textbackslash{}",
  "&": "{\\&}",
  "#": "{\\#}",
  "%": "\\%",
  "`": "\\textasciigrave{}",
  "^": "{\\^{}}",
  "+": "{+}",
  "<": "\\textless{}",
  ">": "\\textgreater{}",
  "|": "\\textbar{}",
  "~": "\\textasciitilde{}",
  $: "{\\$}",
};

function regexSpecialChars() {
  // generate new instance for every use
  return /[\\{}$&#^_~%<>|"'`+-]/g;
}

export const literal = {
  textMode: (text: string) =>
    text.replace(regexSpecialChars(), (char) => ESCAPE_TEXT[char] || char),
  mathMode: (text: string) =>
    text.replace(regexSpecialChars(), (char) => ESCAPE_MATH[char] || char),
  codeMode: (text: string) =>
    text.replace(regexSpecialChars(), (char) => ESCAPE_CODE[char] || char),
};
