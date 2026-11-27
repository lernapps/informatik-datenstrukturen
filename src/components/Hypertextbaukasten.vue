<script setup lang="ts">
// The learner builds a small hypertext for the task of the number seed: five page cards, the first the home page. On
// each card a select names another page and a button adds the link, so that nothing needs dragging and everything
// works with the keyboard. A drawing beside the cards shows the hypertext as a directed graph in the style of the tree
// of #491. "Vorschau" lets the learner click through it from the home page, as a reader would. The logic is in
// Hypertextbaukasten.ts and Netz.ts; the explainer draws "Prüfen".
import { computed, nextTick, ref } from "vue";
import { BOX_H, BOX_W, HEIGHT, WIDTH, border, circle, fill, key, type Edge } from "./Netz.ts";
import { generate, rules } from "./Hypertextbaukasten.ts";

const props = defineProps<{
  /** The names of the pages; the first is the home page. */
  pages: string[];
  /** What to do, above the rules. */
  task: string;
  /** The rule on clicks, with {k}. */
  ruleReach: string;
  /** The rule on the links of the home page, with {m}. */
  ruleStart: string;
  /** The rule on the way back. */
  ruleBack: string;
  /** The rule on one link that must be there, with {a} and {b}. */
  ruleMust: string;
  /** The heading of the links on a card. */
  linksOnPage: string;
  /** Shown on a card without links. */
  none: string;
  /** The label of the select on a card. */
  linkTo: string;
  /** The button that adds the link chosen. */
  add: string;
  /** The visible label of the button that removes a link. */
  remove: string;
  /** Its name for screen readers, with {a} and {b}. */
  removeLabel: string;
  /** The button that opens the preview. */
  preview: string;
  /** The button that closes it. */
  close: string;
  /** In the preview: where the reader is, with {a}. */
  here: string;
  /** In the preview: a page without links. */
  deadEnd: string;
  /** In the preview: back to the home page, as starting again. */
  restart: string;
  /** The app's messages for the typical mistakes, in the order of about.mistakes. */
  mistakes: string[];
  /** The task number, which the explainer gives. */
  seed: number;
  /** Whether the explainer checked the answer shown now. */
  checked: boolean;
}>();
const emit = defineEmits<{ answer: [Edge[] | undefined] }>();

const current = computed(() => generate(props.seed, props));
const links = ref<Edge[]>([]);
const choice = ref<number[]>(props.pages.map((_, page) => (page === 0 ? 1 : 0)));
const reading = ref<number | undefined>(undefined);
const places = computed(() => circle(props.pages.length));
const page = (index: number) => props.pages[index] ?? "";

const linksOf = (from: number) => links.value.filter((e) => e[0] === from);
const targets = (from: number) =>
  props.pages.map((_, to) => to).filter((to) => to !== from && !links.value.some((e) => e[0] === from && e[1] === to));

function changed(): void {
  emit("answer", links.value.length === 0 ? undefined : links.value);
}

function addLink(from: number): void {
  const options = targets(from);
  const to = options.includes(choice.value[from] ?? -1) ? (choice.value[from] ?? -1) : options[0];
  if (to === undefined) return;
  links.value = [...links.value, [from, to]];
  choice.value[from] = targets(from)[0] ?? 0;
  changed();
}

const cards = ref<HTMLElement[]>([]);

/** Removes a link and keeps the keyboard focus on its card. */
function removeLink(edge: Edge): void {
  links.value = links.value.filter((e) => key(e, true) !== key(edge, true));
  choice.value[edge[0]] = targets(edge[0])[0] ?? 0;
  changed();
  void nextTick(() => cards.value[edge[0]]?.querySelector<HTMLElement>("select, button")?.focus());
}

function segment(edge: Edge) {
  const from = places.value[edge[0]] ?? { x: 0, y: 0 };
  const to = places.value[edge[1]] ?? { x: 0, y: 0 };
  const both = links.value.some((e) => e[0] === edge[1] && e[1] === edge[0]);
  // two links between the same pages: each arrow on its own side
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy) || 1;
  const shift = both ? 6 : 0;
  const a = { x: from.x - (dy / length) * shift, y: from.y + (dx / length) * shift };
  const b = { x: to.x - (dy / length) * shift, y: to.y + (dx / length) * shift };
  const start = border(b, a, 0);
  const end = border(a, b, 4);
  return { x1: start.x, y1: start.y, x2: end.x, y2: end.y };
}
</script>

<template>
  <div class="hypertext">
    <p>{{ task }}</p>
    <ul>
      <li v-for="rule in rules(current, props)" :key="rule">{{ rule }}</li>
    </ul>
    <div class="hypertext-work">
      <div class="hypertext-cards">
        <div
          v-for="(name, from) in pages"
          :key="from"
          ref="cards"
          class="hypertext-card"
          :class="{ 'hypertext-home': from === 0 }"
        >
          <p class="hypertext-title">{{ name }}</p>
          <p class="hypertext-small">{{ linksOnPage }}</p>
          <p v-if="linksOf(from).length === 0" class="hypertext-small">{{ none }}</p>
          <ul v-else class="hypertext-links">
            <li v-for="edge in linksOf(from)" :key="edge[1]">
              <span>→ {{ page(edge[1]) }}</span>
              <button
                type="button"
                class="hypertext-button"
                :aria-label="fill(removeLabel, { a: name, b: page(edge[1]) })"
                @click="removeLink(edge)"
              >
                {{ remove }}
              </button>
            </li>
          </ul>
          <div v-if="targets(from).length > 0" class="hypertext-add">
            <label>
              {{ linkTo }}
              <select v-model.number="choice[from]">
                <option v-for="to in targets(from)" :key="to" :value="to">{{ page(to) }}</option>
              </select>
            </label>
            <button type="button" class="hypertext-button" @click="addLink(from)">{{ add }}</button>
          </div>
        </div>
      </div>
      <svg class="hypertext-graph" :viewBox="`0 0 ${WIDTH} ${HEIGHT}`" aria-hidden="true">
        <defs>
          <marker
            id="hypertext-pfeil"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto"
          >
            <path d="M0 0 L10 5 L0 10 Z" fill="#333" />
          </marker>
        </defs>
        <rect :width="WIDTH" :height="HEIGHT" fill="#fff" />
        <line
          v-for="edge in links"
          :key="key(edge, true)"
          v-bind="segment(edge)"
          stroke="#333"
          stroke-width="2"
          marker-end="url(#hypertext-pfeil)"
        />
        <g v-for="(place, index) in places" :key="index">
          <rect
            :x="place.x - BOX_W / 2"
            :y="place.y - BOX_H / 2"
            :width="BOX_W"
            :height="BOX_H"
            rx="8"
            :fill="index === 0 ? '#e8f0fb' : '#fff'"
            stroke="#333"
            stroke-width="2"
          />
          <text :x="place.x" :y="place.y + 5" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#222">
            {{ page(index) }}
          </text>
        </g>
      </svg>
    </div>
    <p>
      <button v-if="reading === undefined" type="button" class="hypertext-button" @click="reading = 0">
        {{ preview }}
      </button>
    </p>
    <div v-if="reading !== undefined" class="hypertext-preview">
      <p aria-live="polite">
        <strong>{{ fill(here, { a: page(reading) }) }}</strong>
      </p>
      <p v-if="linksOf(reading).length === 0">{{ deadEnd }}</p>
      <ul v-else class="hypertext-read">
        <li v-for="edge in linksOf(reading)" :key="edge[1]">
          <button type="button" class="hypertext-link" @click="reading = edge[1]">{{ page(edge[1]) }}</button>
        </li>
      </ul>
      <p class="hypertext-row">
        <button type="button" class="hypertext-button" @click="reading = 0">{{ restart }}</button>
        <button type="button" class="hypertext-button" @click="reading = undefined">{{ close }}</button>
      </p>
    </div>
  </div>
</template>

<style scoped>
.hypertext-work {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: flex-start;
}

.hypertext-cards {
  display: grid;
  flex: 1 1 18rem;
  grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
  gap: 0.5rem;
}

.hypertext-card {
  padding: 0.5rem 0.75rem;
  border: 2px solid var(--page-border);
  border-radius: 8px;
  background: var(--page-surface);
}

/* the home page: a thicker border, like the light blue root of the drawing */
.hypertext-home {
  border-width: 4px;
  border-color: var(--page-accent);
}

.hypertext-title {
  margin: 0 0 0.25rem;
  font-weight: bold;
}

.hypertext-small {
  margin: 0.25rem 0;
  color: var(--page-muted);
}

.hypertext-links,
.hypertext-read {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 0.25rem 0;
  padding-left: 0;
  list-style: none;
}

.hypertext-links li,
.hypertext-add,
.hypertext-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.hypertext-add {
  margin-top: 0.5rem;
}

.hypertext-add label {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.hypertext-add select {
  min-height: 44px;
  font: inherit;
}

.hypertext-button {
  min-height: 44px;
  padding: 0 0.75rem;
  border: 2px solid var(--page-accent);
  border-radius: 6px;
  background: var(--page-background);
  color: var(--page-accent);
  font: inherit;
  cursor: pointer;
}

/* a link of the preview: looks like a link on a web page */
.hypertext-link {
  min-height: 44px;
  padding: 0;
  border: none;
  background: none;
  color: var(--page-accent);
  font: inherit;
  font-weight: bold;
  text-decoration: underline;
  cursor: pointer;
}

.hypertext-button:focus-visible,
.hypertext-link:focus-visible,
.hypertext-add select:focus-visible {
  outline: 3px solid var(--page-accent);
  outline-offset: 2px;
}

.hypertext-graph {
  flex: 1 1 16rem;
  max-width: 24rem;
  border: 1px solid var(--page-border);
}

.hypertext-preview {
  padding: 0.75rem;
  border: 2px solid var(--page-border);
  border-radius: 8px;
}
</style>
