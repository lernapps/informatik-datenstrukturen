// The logic of Netzbauer.vue: a list of pairs (friendships, or links from one page to another) is given, and the
// learner draws the graph by adding an edge for each pair. A task is the set of edges; an answer is the edges the
// learner drew. Without direction, A – B is the same edge as B – A; with direction, A → B is not B → A. The check
// compares the sets of edges, never the drawing: where the nodes are does not matter.
import { type Edge, fill, keys, random, sameEdges, without } from "./Netz.ts";

/** The props the logic needs. */
export interface Props {
  /** The names of the nodes, the same in every language. */
  names: readonly string[];
  /** Whether the edges have a direction (arrows) or not (lines). */
  directed: boolean;
  /** What to do, shown above the list. */
  task: string;
  /** One line of the list, with {a} and {b} for the two names. */
  line: string;
  /** The app's messages: an edge missing at {a}, an edge {a} {b} too many, an arrow {a} {b} the wrong way round. */
  mistakes?: readonly string[];
}

export interface Task {
  /** The edges of the graph to draw, in the order of the list. */
  edges: Edge[];
  /** Whether the edges have a direction. */
  directed: boolean;
}

/** The edges the learner drew. */
export type Answer = Edge[];

/** Every pair of nodes, with direction both ways. */
function pairs(count: number, directed: boolean): Edge[] {
  const result: Edge[] = [];
  for (let a = 0; a < count; a++)
    for (let b = 0; b < count; b++) if (a !== b && (directed || a < b)) result.push([a, b]);
  return result;
}

/**
 * The task of `seed`: four to six edges, every node at one of them at least, and with direction never both A → B and
 * B → A, so that an arrow drawn the wrong way round is always a mistake.
 */
export function generate(seed: number, props: Props): Task {
  const count = props.names.length;
  const next = random(seed);
  for (let attempt = 0; ; attempt++) {
    const all = pairs(count, props.directed);
    for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(next() * (i + 1));
      [all[i], all[j]] = [all[j] ?? all[i] ?? [0, 1], all[i] ?? [0, 1]];
    }
    const size = 4 + Math.floor(next() * 3);
    const chosen: Edge[] = [];
    for (const edge of all) {
      if (chosen.length === size) break;
      if (props.directed && chosen.some((e) => e[0] === edge[1] && e[1] === edge[0])) continue;
      chosen.push(edge);
    }
    const touched = new Set(chosen.flat());
    if (touched.size === count || attempt > 50) {
      chosen.sort((x, y) => x[0] - y[0] || x[1] - y[1]);
      return { edges: chosen, directed: props.directed };
    }
  }
}

/** Whether the learner drew exactly the edges of the list. */
export function check(task: Task, answer: Answer): boolean {
  return sameEdges(task.edges, answer, task.directed);
}

/** The right answer. */
export function solution(task: Task): Answer {
  return task.edges.map((edge) => [edge[0], edge[1]] as const);
}

/** A wrong answer: the first edge left out. */
export function wrong(task: Task): Answer {
  return task.edges.slice(1);
}

/** A pair of nodes that is no edge of the task, in neither direction. */
function noEdge(task: Task, count: number): Edge {
  const used = keys(task.edges, false);
  for (let a = 0; a < count; a++) for (let b = a + 1; b < count; b++) if (!used.has(`${a}-${b}`)) return [a, b];
  return [0, 0];
}

/** The answer of each typical mistake of about.mistakes: an edge left out, an edge too many, an arrow reversed. */
export function mistakes(task: Task, props: Props): (Answer | undefined)[] {
  const extra = noEdge(task, props.names.length);
  const first = task.edges[0] ?? [0, 1];
  return [
    wrong(task),
    extra[0] === extra[1] ? undefined : [...solution(task), extra],
    task.directed ? [[first[1], first[0]], ...task.edges.slice(1)] : undefined,
  ];
}

const name = (props: Props, index: number) => props.names[index] ?? "?";

/** The app's message for a wrong answer: an arrow the wrong way round, an edge too many, or an edge missing. */
export function reason(task: Task, answer: Answer, props: Props, _lang?: string): string | undefined {
  const messages = props.mistakes ?? [];
  const extra = without(answer, task.edges, task.directed);
  const missing = without(task.edges, answer, task.directed);
  const reversed = extra.find((e) => missing.some((m) => m[0] === e[1] && m[1] === e[0]));
  if (task.directed && reversed && messages[2] !== undefined)
    return fill(messages[2], { a: name(props, reversed[0]), b: name(props, reversed[1]) });
  const first = extra[0];
  if (first && messages[1] !== undefined)
    return fill(messages[1], { a: name(props, first[0]), b: name(props, first[1]) });
  const lacking = missing[0];
  if (lacking && messages[0] !== undefined) return fill(messages[0], { a: name(props, lacking[0]) });
  return undefined;
}

/** The lines of the list, as the learner reads them. */
export const lines = (task: Task, props: Props): string[] =>
  task.edges.map((edge) => fill(props.line, { a: name(props, edge[0]), b: name(props, edge[1]) }));

/** An answer as text: the edges, with a dash or an arrow. */
export function show(answer: Answer, task?: Task, props?: Props, lang?: string): string {
  if (answer.length === 0) return lang === "en" ? "no edges" : "keine Kanten";
  const sign = (task?.directed ?? props?.directed) ? " → " : " – ";
  return answer
    .map((edge) => `${props ? name(props, edge[0]) : edge[0]}${sign}${props ? name(props, edge[1]) : edge[1]}`)
    .join(", ");
}

/** The task as a learner sees it, and its solution. */
export function describe(task: Task, props: Props, lang: string): { task: string; solution: string } {
  return {
    task: `${props.task}\n\n${lines(task, props)
      .map((line) => `- ${line}`)
      .join("\n")}`,
    solution: show(solution(task), task, props, lang),
  };
}

/** The task once, with {Liste} for the list. */
export function template(props: Props, _lang: string): string {
  return `${props.task} {Liste}`;
}

/** What sets a task: the list. */
export function params(task: Task, props: Props, _lang: string): Record<string, string> {
  return { Liste: lines(task, props).join(" ") };
}

/** What the exercise is, for a tutor. */
export const about = {
  task: {
    de: "Eine Liste von Paaren ist gegeben (Freundschaften oder Verweise von einer Seite auf eine andere). Das Kind legt für jedes Paar eine Kante an: erst den einen Knoten antippen, dann den anderen. Mit Richtung zeigt der Pfeil vom ersten zum zweiten Knoten. Dann drückt es „Prüfen“.",
    en: "A list of pairs is given (friendships, or links from one page to another). The child adds an edge for each pair: first tap one node, then the other. With direction, the arrow points from the first node to the second. Then they press “Check”.",
  },
  answer: {
    de: "Die Kanten, die das Kind angelegt hat; wo die Knoten stehen, ist egal.",
    en: "The edges the child added; where the nodes are does not matter.",
  },
  correct: {
    de: "Richtig, wenn genau die Kanten der Liste da sind. Ohne Richtung ist A – B dieselbe Kante wie B – A.",
    en: "Right if exactly the edges of the list are there. Without direction, A – B is the same edge as B – A.",
  },
  mistakes: [
    { de: "Eine Kante der Liste fehlt.", en: "An edge of the list is missing." },
    { de: "Eine Kante zu viel, die nicht in der Liste steht.", en: "One edge too many, which is not in the list." },
    { de: "Ein Pfeil zeigt in die falsche Richtung.", en: "An arrow points the wrong way." },
  ],
};
