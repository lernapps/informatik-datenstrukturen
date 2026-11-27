// The logic of Hypertextbaukasten.vue: the learner builds a small hypertext of five pages by adding links from page to
// page, so that the rules of the task hold. Page 0 is the home page. A task is a set of rules; an answer is the links
// the learner added (a directed graph). The check reads the rules on the graph, never a model solution: every
// hypertext that keeps the rules is right.
import { type Edge, distances, fill, keys, random } from "./Netz.ts";

/** The props the logic needs. */
export interface Props {
  /** The names of the pages; the first is the home page. */
  pages: readonly string[];
  /** What to do, above the rules. */
  task: string;
  /** The rule on clicks, with {k}. */
  ruleReach: string;
  /** The rule on the number of links on the home page, with {m}. */
  ruleStart: string;
  /** The rule on the way back. */
  ruleBack: string;
  /** The rule on one link that must be there, with {a} and {b}. */
  ruleMust: string;
  /** The app's messages, in the order of about.mistakes, with {a}, {b}, {n}, {k} and {m}. */
  mistakes?: readonly string[];
}

export interface Task {
  /** At most this many clicks from the home page to every page. */
  k: number;
  /** At most this many links on the home page; 0 for no such rule. */
  m: number;
  /** The link from page must[0] to page must[1] has to be there. */
  must: Edge;
}

/** The links the learner added, from one page to another. */
export type Answer = Edge[];

/** The first rule an answer breaks: which rule, and the pages and numbers its message names. */
export interface Broken {
  rule: number;
  a: number;
  b: number;
  n: number;
}

/** The number of pages; the build gives five, the logic works for any number from three. */
const count = (props: Props) => props.pages.length;

/** The task of `seed`: one link that must be there, and either one click to every page or two clicks with at most two links on the home page. */
export function generate(seed: number, props: Props): Task {
  // spread neighbouring task numbers apart, so that task 1, 2 and 3 differ
  const next = random(Math.imul(seed, 2654435761) >>> 0);
  const others = Array.from({ length: count(props) - 1 }, (_, i) => i + 1);
  const a = others[Math.floor(next() * others.length)] ?? 1;
  const rest = others.filter((p) => p !== a);
  const b = rest[Math.floor(next() * rest.length)] ?? 2;
  const near = next() < 0.25;
  return { k: near ? 1 : 2, m: near ? 0 : 2, must: [a, b] };
}

/** The first rule the links break, in the order of about.mistakes; undefined when every rule holds. */
export function broken(task: Task, answer: Answer, pages: number): Broken | undefined {
  const links = answer.filter((e) => e[0] !== e[1]);
  const far = distances(pages, links, 0, true);
  const unreachable = far.findIndex((d) => d < 0);
  if (unreachable > 0) return { rule: 0, a: unreachable, b: 0, n: 0 };
  const tooFar = far.findIndex((d) => d > task.k);
  if (tooFar > 0) return { rule: 1, a: tooFar, b: 0, n: far[tooFar] ?? 0 };
  const onStart = keys(
    links.filter((e) => e[0] === 0),
    true,
  ).size;
  if (task.m > 0 && onStart > task.m) return { rule: 2, a: 0, b: 0, n: onStart };
  const back = keys(links, true);
  for (let page = 1; page < pages; page++) if (!back.has(`${page}>0`)) return { rule: 3, a: page, b: 0, n: 0 };
  if (!back.has(`${task.must[0]}>${task.must[1]}`)) return { rule: 4, a: task.must[0], b: task.must[1], n: 0 };
  return undefined;
}

/** The pages other than the home page and the two of the link that must be there, in order. */
function free(task: Task, pages: number): number[] {
  return Array.from({ length: pages - 1 }, (_, i) => i + 1).filter((p) => p !== task.must[0] && p !== task.must[1]);
}

/** Every page links back to the home page. */
const backLinks = (pages: number): Edge[] => Array.from({ length: pages - 1 }, (_, i) => [i + 1, 0] as const);

/** A right answer, built for five pages; the check accepts any other that keeps the rules. */
export function solution(task: Task, pages = 5): Answer {
  const [a, b] = task.must;
  const [c, ...more] = free(task, pages);
  const forward: Edge[] =
    task.k === 1
      ? Array.from({ length: pages - 1 }, (_, i) => [0, i + 1] as const)
      : [[0, a], [a, b], [0, c ?? b], ...more.map((d) => [c ?? b, d] as const)];
  const links = [...forward, ...backLinks(pages)];
  return task.k === 1 ? [...links, [a, b]] : links;
}

/** A wrong answer: the right one without the link back from the last page. */
export function wrong(task: Task): Answer {
  return solution(task).filter((e) => !(e[0] === 4 && e[1] === 0));
}

/** The answer of each typical mistake of about.mistakes, for five pages; undefined where the rules of the task rule it out. */
export function mistakes(task: Task, _props?: Props): (Answer | undefined)[] {
  const [a, b] = task.must;
  const [c, d] = free(task, 5) as [number, number];
  const back = backLinks(5);
  return [
    // a page nobody links to
    [[0, a], [a, b], [0, c], ...back],
    // a chain: the last page too many clicks away
    task.k === 2 ? [[0, a], [a, b], [b, c], [c, d], ...back] : [[0, a], [a, b], [a, c], [a, d], ...back],
    // every page linked from the home page, though at most two are allowed
    task.m > 0 ? [[0, 1], [0, 2], [0, 3], [0, 4], [a, b], ...back] : undefined,
    // no way back from one page
    solution(task).filter((e) => !(e[0] === d && e[1] === 0)),
    // the link that must be there is missing
    task.k === 2 ? [[0, a], [a, d], [0, c], [c, b], ...back] : [[0, 1], [0, 2], [0, 3], [0, 4], ...back],
  ];
}

/** Whether every rule holds. */
export function check(task: Task, answer: Answer): boolean {
  return broken(task, answer, 5) === undefined;
}

const name = (props: Props, page: number) => props.pages[page] ?? "?";

/** The app's message for the first rule the answer breaks, naming the page it is about. */
export function reason(task: Task, answer: Answer, props: Props, _lang?: string): string | undefined {
  const found = broken(task, answer, count(props));
  const message = found === undefined ? undefined : props.mistakes?.[found.rule];
  if (found === undefined || message === undefined) return undefined;
  return fill(message, { a: name(props, found.a), b: name(props, found.b), n: found.n, k: task.k, m: task.m });
}

/** The rules of the task as the learner reads them. */
export function rules(task: Task, props: Props): string[] {
  const values = { a: name(props, task.must[0]), b: name(props, task.must[1]), k: task.k, m: task.m };
  return [
    fill(props.ruleReach, values),
    ...(task.m > 0 ? [fill(props.ruleStart, values)] : []),
    fill(props.ruleBack, values),
    fill(props.ruleMust, values),
  ];
}

/** An answer as text: the links, with arrows. */
export function show(answer: Answer, _task?: Task, props?: Props, lang?: string): string {
  if (answer.length === 0) return lang === "en" ? "no links" : "keine Links";
  return answer.map((e) => (props ? `${name(props, e[0])} → ${name(props, e[1])}` : `${e[0]} → ${e[1]}`)).join(", ");
}

/** The task as a learner sees it, and one solution. */
export function describe(task: Task, props: Props, lang: string): { task: string; solution: string } {
  return {
    task: `${props.task}\n\n${rules(task, props)
      .map((rule) => `- ${rule}`)
      .join("\n")}`,
    solution: `${lang === "en" ? "One possible solution" : "Eine mögliche Lösung"}: ${show(solution(task, count(props)), task, props, lang)}`,
  };
}

/** The task once, with {Regeln} for its rules. */
export function template(props: Props, _lang: string): string {
  return `${props.task} {Regeln}`;
}

/** What sets a task: its rules. */
export function params(task: Task, props: Props, _lang: string): Record<string, string> {
  return { Regeln: rules(task, props).join(" ") };
}

/** What the exercise is, for a tutor. */
export const about = {
  task: {
    de: "Das Kind baut einen Hypertext aus fünf Seiten, die erste ist die Startseite. Auf jeder Seitenkarte wählt es im Feld „Link auf“ eine andere Seite und tippt „Link anlegen“. Die Vorschau lässt es den Hypertext durchklicken. Die Regeln der Aufgabe stehen darüber. Dann drückt es „Prüfen“.",
    en: "The child builds a hypertext of five pages; the first is the home page. On each page card, they choose another page in the field “Link to” and tap “Add link”. The preview lets them click through the hypertext. The rules of the task are above it. Then they press “Check”.",
  },
  answer: {
    de: "Die Links, die das Kind angelegt hat, jeder von einer Seite zu einer anderen.",
    en: "The links the child added, each from one page to another.",
  },
  correct: {
    de: "Richtig, wenn jede Regel gilt: jede Seite in höchstens k Klicks von der Startseite erreichbar, höchstens m Links auf der Startseite (falls verlangt), von jeder Seite ein Link zurück zur Startseite, und der verlangte Link ist da. Es gibt viele richtige Lösungen.",
    en: "Right if every rule holds: every page reachable from the home page in at most k clicks, at most m links on the home page (if asked), a link back to the home page from every page, and the link asked for is there. There are many right solutions.",
  },
  mistakes: [
    {
      de: "Eine Seite ist von der Startseite aus nicht erreichbar.",
      en: "A page cannot be reached from the home page.",
    },
    { de: "Eine Seite braucht zu viele Klicks.", en: "A page needs too many clicks." },
    { de: "Auf der Startseite stehen zu viele Links.", en: "The home page has too many links." },
    {
      de: "Von einer Seite führt kein Link zurück zur Startseite.",
      en: "There is no link back to the home page from one page.",
    },
    { de: "Der verlangte Link fehlt.", en: "The link asked for is missing." },
  ],
};
