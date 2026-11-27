import { expect, test } from "vite-plus/test";
import {
  broken,
  check,
  describe,
  generate,
  mistakes,
  reason,
  solution,
  wrong,
  type Answer,
} from "./Hypertextbaukasten.ts";

const props = {
  pages: ["Startseite", "Schule", "Bus", "Schwimmbad", "Bücherei"],
  task: "Baue den Stadtführer.",
  ruleReach: "Jede Seite in höchstens {k} Klicks.",
  ruleStart: "Höchstens {m} Links auf der Startseite.",
  ruleBack: "Jede Seite hat einen Link zur Startseite.",
  ruleMust: "{a} verlinkt {b}.",
  mistakes: [
    "{a} erreichst du nicht.",
    "Bis {a} brauchst du {n} Klicks, erlaubt sind {k}.",
    "Auf der Startseite stehen {n} Links, erlaubt sind {m}.",
    "Von {a} führt kein Link zur Startseite.",
    "Es fehlt der Link von {a} zu {b}.",
  ],
};

test("every task has a solution; each typical mistake breaks its own rule", () => {
  for (let seed = 1; seed <= 50; seed++) {
    const task = generate(seed, props);
    expect(generate(seed, props)).toEqual(task);
    expect(task.must[0]).not.toBe(0);
    expect(task.must[0]).not.toBe(task.must[1]);
    expect(check(task, solution(task))).toBe(true);
    expect(check(task, wrong(task))).toBe(false);
    mistakes(task).forEach((answer, rule) => {
      if (answer === undefined) return;
      expect(check(task, answer)).toBe(false);
      expect(broken(task, answer, 5)?.rule).toBe(rule);
    });
  }
});

test("another hypertext that keeps the rules is right too", () => {
  const task = { k: 2, m: 2, must: [1, 2] as const };
  const other: Answer = [
    [0, 1],
    [0, 3],
    [1, 2],
    [3, 4],
    [1, 0],
    [2, 0],
    [3, 0],
    [4, 0],
    [2, 1],
  ];
  expect(check(task, other)).toBe(true);
  const near = { k: 1, m: 0, must: [3, 4] as const };
  expect(check(near, [...solution(near)].reverse())).toBe(true);
});

test("the message names the rule and the page", () => {
  const task = { k: 2, m: 2, must: [1, 2] as const };
  const back: Answer = [
    [1, 0],
    [2, 0],
    [3, 0],
    [4, 0],
  ];
  expect(reason(task, [[0, 1], [1, 2], [0, 3], ...back], props)).toBe("Bücherei erreichst du nicht.");
  expect(reason(task, [[0, 1], [1, 2], [2, 3], [3, 4], ...back], props)).toBe(
    "Bis Schwimmbad brauchst du 3 Klicks, erlaubt sind 2.",
  );
  expect(reason(task, [[0, 1], [0, 2], [0, 3], [0, 4], [1, 2], ...back], props)).toBe(
    "Auf der Startseite stehen 4 Links, erlaubt sind 2.",
  );
  expect(
    reason(
      task,
      [
        [0, 1],
        [1, 2],
        [0, 3],
        [3, 4],
        [1, 0],
        [2, 0],
        [3, 0],
      ],
      props,
    ),
  ).toBe("Von Bücherei führt kein Link zur Startseite.");
  expect(reason(task, [[0, 1], [1, 4], [0, 3], [3, 2], ...back], props)).toBe("Es fehlt der Link von Schule zu Bus.");
  expect(reason(task, solution(task), props)).toBeUndefined();
});

test("describe lists the rules as the learner reads them", () => {
  const task = { k: 2, m: 2, must: [1, 2] as const };
  expect(describe(task, props, "de").task).toBe(
    "Baue den Stadtführer.\n\n- Jede Seite in höchstens 2 Klicks.\n- Höchstens 2 Links auf der Startseite.\n- Jede Seite hat einen Link zur Startseite.\n- Schule verlinkt Bus.",
  );
  const near = { k: 1, m: 0, must: [1, 2] as const };
  expect(describe(near, props, "de").task).not.toContain("Höchstens");
});
