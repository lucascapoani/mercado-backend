/// <reference types="vite/client" />

// Declaração de tipos para módulos CSS
declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}

// Declaração de tipos para outros assets
declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}
