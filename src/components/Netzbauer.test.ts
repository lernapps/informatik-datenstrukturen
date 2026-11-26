import { expect, test } from "vite-plus/test";
import { distances, sameEdges, toggle } from "./Netz.ts";
import { check, describe, generate, mistakes, reason, show, solution, wrong } from "./Netzbauer.ts";

const names = ["Jona", "Selin", "Mia", "Tom", "Lea"];
const messages = [
  "Bei {a} fehlt noch eine Kante.",
  "Die Kante {a} – {b} steht nicht in der Liste.",
  "Der Pfeil {a} → {b} zeigt falsch herum.",
];
const friends = {
  names,
  directed: false,
  task: "Lege die Kanten an.",
  line: "{a} ist mit {b} befreundet.",
  mistakes: messages,
};
const links = { ...friends, directed: true, line: "Die Seite {a} verweist auf {b}." };

test("every task has four to six edges, touches every node, and its solution passes", () => {
  for (const props of [friends, links]) {
    for (let seed = 1; seed <= 50; seed++) {
      const task = generate(seed, props);
      expect(task.edges.length).toBeGreaterThanOrEqual(4);
      expect(task.edges.length).toBeLessThanOrEqual(6);
      expect(new Set(task.edges.flat()).size).toBe(5);
      expect(generate(seed, props)).toEqual(task);
      expect(check(task, solution(task))).toBe(true);
      expect(check(task, wrong(task))).toBe(false);
      for (const answer of mistakes(task, props)) if (answer !== undefined) expect(check(task, answer)).toBe(false);
    }
  }
});

test("without direction A – B is B – A, in any order; with direction it is not", () => {
  const task = generate(3, friends);
  const flipped = solution(task)
    .map((edge) => [edge[1], edge[0]] as const)
    .reverse();
  expect(check(task, flipped)).toBe(true);
  const arrows = generate(3, links);
  expect(arrows.edges.some((a) => arrows.edges.some((b) => a[0] === b[1] && a[1] === b[0]))).toBe(false);
  const reversed = solution(arrows).map((edge) => [edge[1], edge[0]] as const);
  expect(check(arrows, reversed)).toBe(false);
});

test("each mistake gets its own message, naming the node or the edge", () => {
  const task = {
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
    ] as [number, number][],
    directed: true,
  };
  expect(reason(task, task.edges.slice(1), links)).toBe("Bei Jona fehlt noch eine Kante.");
  expect(reason(task, [...task.edges, [0, 4]], links)).toBe("Die Kante Jona – Lea steht nicht in der Liste.");
  expect(reason(task, [[1, 0], ...task.edges.slice(1)], links)).toBe("Der Pfeil Selin → Jona zeigt falsch herum.");
  expect(reason(task, task.edges, links)).toBeUndefined();
});

test("describe shows the list as the learner reads it", () => {
  const task = {
    edges: [
      [0, 1],
      [2, 4],
    ] as [number, number][],
    directed: false,
  };
  expect(describe(task, friends, "de")).toEqual({
    task: "Lege die Kanten an.\n\n- Jona ist mit Selin befreundet.\n- Mia ist mit Lea befreundet.",
    solution: "Jona – Selin, Mia – Lea",
  });
  expect(show([], task, friends, "en")).toBe("no edges");
});

test("the shared logic: toggling, comparing and the fewest edges between nodes", () => {
  expect(toggle(toggle([], [0, 1], false), [1, 0], false)).toEqual([]);
  expect(toggle([], [2, 2], false)).toEqual([]);
  expect(sameEdges([[0, 1]], [[1, 0]], true)).toBe(false);
  const ring: [number, number][] = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
  ];
  expect(distances(4, ring, 0, false)).toEqual([0, 1, 2, 1]);
  expect(distances(4, ring, 0, true)).toEqual([0, 1, 2, 3]);
  expect(distances(5, ring, 0, true)[4]).toBe(-1);
});
