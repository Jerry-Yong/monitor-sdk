
export default function pluginSystem(sdk) {
    return {
        install(plugin) {
            if (!plugin || !plugin.setup || typeof (plugin.setup) !== "function") {
                throw new Error("[pluginSystem]: plugin必须为function--install:", plugin);
            }
            plugin.setup(sdk);
        },
        batchInstall(plugins) {
            if (!Array.isArray(plugins)) {
                throw new Error("[pluginSystem]: plugins必须为数组--batchInstall:", plugins);
            }
            plugins.forEach(plugin => this.install(plugin));
        },
        
    }
}
