// Camel and Snake Case Conversions

export const snakeToCamel = (text: string): string | undefined => {
  if (!text) {
    console.error("Text is required");
    return;
  }
  return text.replace(/(_\w)/g, (k) => k[1]!.toUpperCase());
};

export const camelToSnake = (text: string): string | undefined => {
  if (!text) {
    console.error("Text is required");
    return;
  }
  return text.replace(/([A-Z])/g, "_$1").toLowerCase();
};

export const snakeToTitle = (text: string): string | undefined => {
  if (!text) {
    console.error("Text is required");
    return;
  }
  return text.replace(/(_\w)/g, (k) => k[1]!.toUpperCase());
};

export const camelToTitle = (text: string): string | undefined => {
  if (!text) {
    console.error("Text is required");
    return;
  }
  return text
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
};

export const isCamelOrSnake = (text: string): "camel" | "snake" | "neither" => {
  // Check if there is no indicator of camel or snake case
  if (!/[A-Z]|_/.test(text)) {
    return "neither";
  }
  return /[A-Z]/.test(text) ? "camel" : "snake";
};

const symbols = [
  "Ξ",
  "Ψ",
  "Ω",
  "ℵ",
  "ℶ",
  "ℷ",
  "ℸ",
  "⅀",
  "∀",
  "∃",
  "∄",
  "∅",
  "∆",
  "∇",
  "∈",
  "∉",
  "∊",
  "∋",
  "∌",
  "∍",
  "∎",
  "∏",
  "∐",
  "∑",
  "⟁",
  "⟂",
  "⟃",
  "⟄",
  "⟅",
  "⟆",
  "⟇",
  "⟈",
  "⟉",
  "⟊",
  "⟌",
];
