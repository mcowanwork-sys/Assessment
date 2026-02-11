
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // We remove the 'define' block entirely to allow the platform's 
  // secret injection mechanism to provide process.env.API_KEY at runtime.
});
