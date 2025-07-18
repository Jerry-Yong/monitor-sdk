
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
    server: {
        cors: false,
        open: true,
        port: 5172,
    },
    optimizeDeps: {
        include: ["web-vitals"], // 你使用了 web-vitals，可加入这里
    },
    build: {
        rollupOptions: {
            output: {
                globals: {
                    axios: "axios"
                }
            },
            external: ["axios", "vue"] // 不打包 axios 等第三方依赖
        }
    },
    plugins: [
        vue()
    ],
})

