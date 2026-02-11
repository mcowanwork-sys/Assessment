
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Manual 'define' for process.env.API_KEY is removed to prevent build-time clobbering.
  // The platform handles secret injection at runtime.
});
