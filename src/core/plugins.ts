
export default function pluginSystem(sdk: any) {
    return {
        install(plugin: any) {
            if (!plugin || !plugin.setup || typeof (plugin.setup) !== "function") {
                throw new Error("[pluginSystem]: plugin必须为function--install:");
            }
            plugin.setup(sdk);
        },
        batchInstall(plugins: any) {
            if (!Array.isArray(plugins)) {
                throw new Error("[pluginSystem]: plugins必须为数组--batchInstall:");
            }
            plugins.forEach(plugin => this.install(plugin));
        },

    }
}
