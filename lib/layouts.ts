export type LayoutKind = "apartment" | "commercial";

export type ObjectLayout = {
  src: string;
  label: string;
  area: number;
  kind: LayoutKind;
};
