import { marked } from "marked";
import { literal } from "../utils/escape";
import { unescape } from "../utils/unescape";
import { assert } from "../utils/assert";
import { renderCodeBlock, renderCodeInline } from "../utils/render";

export const REQUIRED_PACKAGES = [
  "\\usepackage[utf8]{vietnam}",
  "\\usepackage[english]{babel}",
  "\\usepackage{freecontest}",
  "\\usepackage[normalem]{ulem}",
  "\\usepackage{hyperref}",
  "\\usepackage{amssymb}",
] as const;

export class CustomRenderer extends marked.Renderer {
  // blocks

  code(html: string, infostring: string | undefined, escaped: boolean): string {
    assert(REQUIRED_PACKAGES.includes("\\usepackage{freecontest}"));
    return renderCodeBlock(escaped ? unescape(html) : html, infostring);
  }

  blockquote(body: string): string {
    return "\\begin{quote}\n" + body + "\n\\end{quote}\n\n";
  }

  html(): string {
    return "\\errmessage{html is not supported}\n\n";
  }

  heading(body: string, level: 1 | 2 | 3 | 4 | 5 | 6): string {
    assert(REQUIRED_PACKAGES.includes("\\usepackage{freecontest}"));
    switch (level) {
      case 1:
        return "\\problemtitle{" + body + "}\n\n";
      case 2:
        return "\\heading{" + body + "}\n\n";
      default:
        return "\\errmessage{heading 3, 4, 5, 6 are not supported}\n\n";
    }
  }

  hr(): string {
    return "\\pagebreak\n\n";
  }

  list(body: string, ordered: boolean): string {
    if (ordered) {
      return "\\begin{enumerate}\n" + body + "\\end{enumerate}\n\n";
    } else {
      return "\\begin{itemize}\n" + body + "\\end{itemize}\n\n";
    }
  }

  listitem(body: string): string {
    return "\\item " + body + "\n";
  }

  checkbox(checked: boolean): string {
    assert(REQUIRED_PACKAGES.includes("\\usepackage{amssymb}"));
    return !checked ? "$\\square$" : "$\\boxtimes$";
  }

  paragraph(body: string): string {
    return body + "\n\n";
  }

  table(): string {
    return "\\errmessage{table is not supported}\n\n";
  }

  tablerow(): string {
    return "\\errmessage{tablerow is not supported}\n\n";
  }

  tablecell(): string {
    return "\\errmessage{tablecell is not supported}\n\n";
  }

  // inlines

  strong(body: string): string {
    return "\\textbf{" + body + "}";
  }

  em(body: string): string {
    return "\\emph{" + body + "}";
  }

  codespan(html: string): string {
    return renderCodeInline(unescape(html));
  }

  br(): string {
    return "\n\n";
  }

  del(body: string): string {
    assert(REQUIRED_PACKAGES.includes("\\usepackage[normalem]{ulem}"));
    return "\\sout{" + body + "}";
  }

  link(href: string | null, _title: string | null, text: string): string {
    assert(REQUIRED_PACKAGES.includes("\\usepackage{hyperref}"));
    return `\\href{${href}}{${text}}`;
  }

  image(): string {
    return "\\errmessage{image is not supported}\n\n";
  }

  text(html: string): string {
    return literal.textMode(unescape(html));
  }
}
