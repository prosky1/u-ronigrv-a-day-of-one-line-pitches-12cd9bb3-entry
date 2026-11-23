// A Day of One-Line Pitches
// Entry: one sentence that convinces a friend who has never coded to let
// an AI agent build their first app idea on make.fun. The program writes
// that sentence, exactly as the judge will read it, to /output/entry.txt.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const PITCH =
  "You already have the idea — let an AI agent on make.fun build your first app free while you watch it take shape.";

const OUT_PATH = "/output/entry.txt";
const MAX_CHARS = 240;

// Count characters the way the gate does: UTF-16 code units of the string.
function charCount(text: string): number {
  return text.length;
}

// A sentence ends on one of . ! ? that is not part of a dotted name such as
// make.fun. Strip the brand name first so its dot is never miscounted.
function sentenceEndCount(text: string): number {
  const cleaned = text.split("make.fun").join("makefun");
  return [...cleaned].filter((ch) => ch === "." || ch === "!" || ch === "?").length;
}

// Gate 1: length. The competition allows 1 to 240 characters, no more.
const length = charCount(PITCH);
if (length < 1 || length > MAX_CHARS) {
  throw new Error(`Pitch must be 1-${MAX_CHARS} characters, got ${length}`);
}

// Gate 2: the entry must carry real words, not only whitespace.
if (PITCH.trim().length === 0) {
  throw new Error("Pitch must not be only whitespace");
}

// Gate 3: exactly one sentence, and it must end on its closing full stop.
if (sentenceEndCount(PITCH) !== 1 || !PITCH.endsWith(".")) {
  throw new Error("Pitch must be exactly one sentence ending with a period");
}

// Gate 4: one line only — no line breaks inside the pitch.
if (PITCH.includes("\n") || PITCH.includes("\r")) {
  throw new Error("Pitch must contain no line breaks");
}

// Gate 4b: the brand appears exactly once — a repeated "make.fun" would
// read like a slogan, not a sentence spoken to a friend.
if (PITCH.split("make.fun").length - 1 !== 1) {
  throw new Error('Pitch must mention "make.fun" exactly once');
}

// Gate 5: the pitch must still make the case it was written to make.
// Every load-bearing element of the offer has to survive untouched:
// the friend already owns the idea, the builder is an AI agent on
// make.fun, the first app is free, and the friend watches it take shape.
const LOAD_BEARING = [
  "already have the idea",
  "AI agent",
  "make.fun",
  "first app",
  "free",
  "watch it take shape",
];
for (const phrase of LOAD_BEARING) {
  if (!PITCH.includes(phrase)) {
    throw new Error(`Pitch lost a load-bearing phrase: ${phrase}`);
  }
}

mkdirSync(dirname(OUT_PATH), { recursive: true });
writeFileSync(OUT_PATH, PITCH, "utf8");

// Read the file back and confirm it is byte-identical to the pitch, so a
// truncated or re-encoded write can never reach the judge. The em dash in
// the pitch is 3 bytes in UTF-8, so the file must be 114 bytes, not 112.
const written = readFileSync(OUT_PATH, "utf8");
if (written !== PITCH) {
  throw new Error("Verification failed: /output/entry.txt differs from the pitch");
}
if (Buffer.byteLength(written, "utf8") !== 114) {
  throw new Error(`Verification failed: expected 114 bytes, got ${Buffer.byteLength(written, "utf8")}`);
}
console.log(`Wrote ${length} characters to ${OUT_PATH}`);
