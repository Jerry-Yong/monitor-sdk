
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
    build: {
        lib: {
            entry: "src/index.js",
            name: "MonitorSDK",
            fileName: format => `monitor-sdk.${ format }.js`,
            formats: ["es", "umd"]
        },
        rollupOptions: {
            output: {
                globals: {
                    axios: "axios"
                }
            },
            external: ["axios"] // 不打包 axios 等第三方依赖
        }
    },
    plugins: [
        dts(),
    ],
});
