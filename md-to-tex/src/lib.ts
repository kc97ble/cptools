import { marked } from "marked";
import { CustomRenderer, REQUIRED_PACKAGES } from "./classes/CustomRenderer";

export async function convertMdToTex(text: string) {
  const body = await marked.parse(text, { renderer: new CustomRenderer() });
  return (
    [
      "\\documentclass[12pt,a4paper,oneside]{article}",
      REQUIRED_PACKAGES.join("\n"),
      "\\renewcommand{\\baselinestretch}{1.2}",
      "\\begin{document}",
      body,
      "\\end{document}",
    ].join("\n\n") + "\n"
  );
}
