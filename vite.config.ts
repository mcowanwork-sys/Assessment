
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // This allows the browser to access process.env.API_KEY directly
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || ''),
    // This shims the rest of the env object if needed
    'process.env': {
      API_KEY: JSON.stringify(process.env.API_KEY || '')
    }
  }
});
