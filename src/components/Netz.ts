// Shared logic of the networks of this explainer: edges of a graph, with or without direction, ways between nodes and
// the drawing in the style of the tree of lernapps/informatik-daten-codieren (#491, images/baum-zimmer.svg): nodes as
// rounded boxes with a border of #333, edges as straight lines, white background. Used by Netzbauer and
// Hypertextbaukasten.

/** An edge from node `0` to node `1`, by the nodes' index. Without direction the order does not matter. */
export type Edge = readonly [number, number];

/** A small seeded random generator (mulberry32), so that a task number always gives the same task. */
export function random(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** The key of an edge: with direction "a>b", without direction the smaller index first, "a-b". */
export const key = (edge: Edge, directed: boolean): string =>
  directed ? `${edge[0]}>${edge[1]}` : `${Math.min(...edge)}-${Math.max(...edge)}`;

/** The edges as a set of keys; an edge named twice counts once, a loop from a node to itself not at all. */
export const keys = (edges: readonly Edge[], directed: boolean): Set<string> =>
  new Set(edges.filter((edge) => edge[0] !== edge[1]).map((edge) => key(edge, directed)));

/** Whether two lists name the same edges. */
export function sameEdges(a: readonly Edge[], b: readonly Edge[], directed: boolean): boolean {
  const left = keys(a, directed);
  const right = keys(b, directed);
  return left.size === right.size && [...left].every((k) => right.has(k));
}

/** The edges of `a` that `b` lacks. */
export const without = (a: readonly Edge[], b: readonly Edge[], directed: boolean): Edge[] => {
  const other = keys(b, directed);
  return a.filter((edge) => edge[0] !== edge[1] && !other.has(key(edge, directed)));
};

/** Adds the edge if it is not there, else removes it. */
export function toggle(edges: readonly Edge[], edge: Edge, directed: boolean): Edge[] {
  if (edge[0] === edge[1]) return [...edges];
  const k = key(edge, directed);
  return edges.some((e) => key(e, directed) === k) ? edges.filter((e) => key(e, directed) !== k) : [...edges, edge];
}

/** The fewest edges from `start` to every node, following the direction if there is one; -1 where no way leads. */
export function distances(count: number, edges: readonly Edge[], start: number, directed: boolean): number[] {
  const result = Array.from({ length: count }, () => -1);
  result[start] = 0;
  const queue = [start];
  while (queue.length > 0) {
    const node = queue.shift() ?? start;
    for (const [a, b] of edges) {
      const next = a === node ? b : !directed && b === node ? a : -1;
      if (next >= 0 && next < count && result[next] === -1) {
        result[next] = (result[node] ?? 0) + 1;
        queue.push(next);
      }
    }
  }
  return result;
}

/** A node placed in the drawing: its centre. */
export interface Point {
  x: number;
  y: number;
}

/** The size of the drawing and of a node box, in the units of its viewBox. */
export const WIDTH = 340;
export const HEIGHT = 280;
export const BOX_W = 92;
export const BOX_H = 44;

/** `count` nodes on an ellipse, the first at the top, clockwise. */
export function circle(count: number): Point[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = -Math.PI / 2 + (2 * Math.PI * i) / count;
    return {
      x: Math.round(WIDTH / 2 + (WIDTH / 2 - BOX_W / 2 - 4) * Math.cos(angle)),
      y: Math.round(HEIGHT / 2 + (HEIGHT / 2 - BOX_H / 2 - 4) * Math.sin(angle)),
    };
  });
}

/** Where the line from `from` towards `to` leaves the box around `to`, so that an arrow head ends at its border. */
export function border(from: Point, to: Point, gap = 3): Point {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const scale = Math.min(
    dx === 0 ? Infinity : (BOX_W / 2 + gap) / Math.abs(dx),
    dy === 0 ? Infinity : (BOX_H / 2 + gap) / Math.abs(dy),
  );
  return { x: to.x - dx * scale, y: to.y - dy * scale };
}

/** A text of the props with {name} placeholders filled in. */
export const fill = (text: string, values: Record<string, string | number>): string =>
  text.replace(/\{(\w+)\}/g, (whole, name: string) => (name in values ? String(values[name]) : whole));
