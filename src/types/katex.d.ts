declare module "react-katex" {
  import type { ComponentType } from "react";
  export const InlineMath: ComponentType<{ math: string; [key: string]: unknown }>;
  export const BlockMath: ComponentType<{ math: string; [key: string]: unknown }>;
}
