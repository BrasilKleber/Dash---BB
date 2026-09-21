
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    chunkSizeWarningLimit: 1000, // Aumenta o limite do aviso para 1MB (apps complexas costumam ser maiores)
    rollupOptions: {
      output: {
        manualChunks: {
          // Separa as bibliotecas pesadas em ficheiros próprios
          vendor: ['react', 'react-dom'],
          charts: ['recharts'],
          icons: ['lucide-react'],
          ai: ['@google/genai']
        }
      }
    }
  },
  server: {
    port: 3000
  }
});
