import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

import dotenv from "dotenv";
dotenv.config()

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      SERVER_URL: JSON.stringify(env.SERVER_URL),
    }
  }
})
