/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly MODE: string
  readonly BASE_URL: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// For Jest tests
declare global {
  var React: typeof import('react');
  
  namespace NodeJS {
    interface Global {
      import: {
        meta: {
          env: ImportMetaEnv
        }
      }
    }
  }
} 