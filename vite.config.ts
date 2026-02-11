
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // We remove the manual 'define' block to allow the platform's injection 
  // mechanism to provide process.env.API_KEY at runtime.
});
