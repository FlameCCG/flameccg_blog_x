/// <reference types="vite/client" />

import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    title: string;
    role?: number[];
  }
}

interface EnvMeta extends Record<string, string> {
  VITE_SERVER_URL: string;
}
