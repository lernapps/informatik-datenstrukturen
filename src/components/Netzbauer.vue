<script setup lang="ts">
// The learner draws a graph from a list of pairs, for the task of the number seed. The nodes are buttons, placed on a
// circle in the style of the tree of #491 (rounded boxes, border #333, white figure). Tapping one node, then another,
// adds the edge between them, or removes it if it is there; with direction the arrow points from the first to the
// second. Below the figure the edges stand as text, each with a button to remove it, so that everything works with
// the keyboard and a screen reader. The logic is in Netzbauer.ts and Netz.ts; the explainer draws "Prüfen".
import { computed, ref } from "vue";
import { BOX_H, BOX_W, HEIGHT, WIDTH, border, circle, fill, toggle, type Edge } from "./Netz.ts";
import { generate, lines } from "./Netzbauer.ts";

const props = defineProps<{
  /** The names of the nodes, the same in every language. @verbatim */
  names: string[];
  /** Whether the edges have a direction (arrows). */
  directed: boolean;
  /** What to do, above the list. */
  task: string;
  /** One line of the list, with {a} and {b}. */
  line: string;
  /** Shown while one node is chosen, with {a}. */
  chosen: string;
  /** The heading of the list of edges drawn. */
  drawn: string;
  /** Shown while no edge is drawn. */
  empty: string;
  /** The label of the button that removes an edge, with {a} and {b}. */
  remove: string;
  /** The app's messages for the typical mistakes, in the order of about.mistakes. */
  mistakes: string[];
  /** The task number, which the explainer gives. */
  seed: number;
  /** Whether the explainer checked the answer drawn now. */
  checked: boolean;
}>();
const emit = defineEmits<{ answer: [Edge[] | undefined] }>();

const current = computed(() => generate(props.seed, props));
const places = computed(() => circle(props.names.length));
const edges = ref<Edge[]>([]);
const first = ref<number | undefined>(undefined);

const sign = computed(() => (props.directed ? "→" : "–"));
const name = (index: number) => props.names[index] ?? "";

/** The line of an edge, from border to border, so that an arrow head ends at the box of its target. */
function segment(edge: Edge) {
  const from = places.value[edge[0]] ?? { x: 0, y: 0 };
  const to = places.value[edge[1]] ?? { x: 0, y: 0 };
  const start = border(to, from, 0);
  const end = border(from, to, props.directed ? 4 : 0);
  return { x1: start.x, y1: start.y, x2: end.x, y2: end.y };
}

function choose(index: number): void {
  if (first.value === undefined) {
    first.value = index;
    return;
  }
  if (first.value !== index) {
    edges.value = toggle(edges.value, [first.value, index], props.directed);
    emit("answer", edges.value.length === 0 ? undefined : edges.value);
  }
  first.value = undefined;
}

function drop(edge: Edge): void {
  edges.value = toggle(edges.value, edge, props.directed);
  emit("answer", edges.value.length === 0 ? undefined : edges.value);
}

const percent = (value: number, whole: number) => `${(value / whole) * 100}%`;
</script>

<template>
  <div class="netzbauer">
    <p>{{ task }}</p>
    <ul>
      <li v-for="text in lines(current, props)" :key="text">{{ text }}</li>
    </ul>
    <div class="netzbauer-figure" :class="{ 'netzbauer-checked': checked }">
      <svg :viewBox="`0 0 ${WIDTH} ${HEIGHT}`" aria-hidden="true">
        <defs>
          <marker
            id="netzbauer-pfeil"
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
          v-for="edge in edges"
          :key="`${edge[0]}-${edge[1]}`"
          v-bind="segment(edge)"
          stroke="#333"
          stroke-width="2"
          :marker-end="directed ? 'url(#netzbauer-pfeil)' : undefined"
        />
      </svg>
      <button
        v-for="(place, index) in places"
        :key="index"
        type="button"
        class="netzbauer-node"
        :aria-pressed="first === index"
        :style="{
          left: percent(place.x - BOX_W / 2, WIDTH),
          top: percent(place.y - BOX_H / 2, HEIGHT),
          width: percent(BOX_W, WIDTH),
          height: percent(BOX_H, HEIGHT),
        }"
        @click="choose(index)"
      >
        {{ name(index) }}
      </button>
    </div>
    <p aria-live="polite" class="netzbauer-status">
      {{ first === undefined ? "" : fill(chosen, { a: name(first) }) }}
    </p>
    <p class="netzbauer-drawn">{{ drawn }}</p>
    <p v-if="edges.length === 0">{{ empty }}</p>
    <ul v-else class="netzbauer-list">
      <li v-for="edge in edges" :key="`${edge[0]}-${edge[1]}`">
        <span>{{ name(edge[0]) }} {{ sign }} {{ name(edge[1]) }}</span>
        <button type="button" @click="drop(edge)">
          {{ fill(remove, { a: name(edge[0]), b: name(edge[1]) }) }}
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.netzbauer-figure {
  position: relative;
  width: 100%;
  max-width: 26rem;
  min-width: 18rem;
  aspect-ratio: 340 / 280;
  border: 1px solid var(--page-border);
}

.netzbauer-figure svg {
  display: block;
  width: 100%;
  height: 100%;
}

/* a node of the figure: white box with the border of the tree of #491, whatever the theme */
.netzbauer-node {
  position: absolute;
  min-height: 44px;
  padding: 0 0.25rem;
  border: 2px solid #333;
  border-radius: 8px;
  background: #fff;
  color: #222;
  font: inherit;
  cursor: pointer;
}

/* the first node chosen: light blue like the root of #491, a thicker border and the status text below */
.netzbauer-node[aria-pressed="true"] {
  border-width: 4px;
  background: #e8f0fb;
}

.netzbauer-node:focus-visible {
  outline: 3px solid var(--page-accent);
  outline-offset: 2px;
}

.netzbauer-status {
  min-height: 1.5em;
}

.netzbauer-drawn {
  margin-bottom: 0.25rem;
  font-weight: bold;
}

.netzbauer-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-left: 0;
  list-style: none;
}

.netzbauer-list li {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.netzbauer-list button {
  min-height: 44px;
}
</style>
