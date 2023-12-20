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

const ESCAPE_EXMP: Partial<Record<string, string>> = {
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

const ESCAPE_VERB: Partial<Record<string, string>> = {};

function regexSpecialChars() {
  // generate new instance for every use
  return /[\\{}$&#^_~%<>|"'`+-]/g;
}

export const literal = {
  textMode: (text: string) =>
    text.replace(regexSpecialChars(), (char) => ESCAPE_TEXT[char] || char),
  mathMode: (text: string) =>
    text.replace(regexSpecialChars(), (char) => ESCAPE_MATH[char] || char),
  exmpMode: (text: string) =>
    text.replace(regexSpecialChars(), (char) => ESCAPE_EXMP[char] || char),
  verbMode: (text: string) =>
    text.replace(regexSpecialChars(), (char) => ESCAPE_VERB[char] || char),
};
