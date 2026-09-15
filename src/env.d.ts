// Modulo virtuale del runtime Workers: le variabili e i binding sono tipizzati
// localmente in src/pages/api/richiesta.ts (RuntimeEnv).
declare module 'cloudflare:workers' {
  export const env: Record<string, unknown>;
}
