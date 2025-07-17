
import { createReporter } from "./reporter";
import { getUserId } from "./storage";
import pluginSystem from "./plugins";   

export default class MonitorSDK {
    constructor(config) {
        const { url, userId, } = config;
        this.url = url;
        this.userId = userId || getUserId();
        this.plugins = [];
        this.pluginSystem = pluginSystem(this);
        this.reporter = createReporter(this.url, this.userId);
    }

    use(plugin) {
        this.pluginSystem.install(plugin);
    }
    init() {
        this.plugins.forEach(plugin => this.use(plugin));
    }

}

