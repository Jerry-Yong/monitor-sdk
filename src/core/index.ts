
import { createReporter } from "./reporter";
import pluginSystem from "./plugins";
import { REPORT_URL, } from "../constants/constants";

export default class MonitorSDK {
    url: string = "";
    logType: string = "";
    isOnline: boolean = true;
    userId: string = "";
    plugins: any[] = [];
    pluginSystem: any;
    reporter: any;
    constructor(config: { logType: string; url?: string; userId?: string; isOnline?: boolean }) {
        const { logType, url, userId, isOnline, } = config;
        if (!logType) {
            throw `[MonitorSDK]: logType为必填参数`;
        }
        this.url = url || REPORT_URL;
        this.isOnline = isOnline ?? true;
        this.logType = logType ;
        this.userId = userId || "Guest";
        this.plugins = [];
        this.pluginSystem = pluginSystem(this);
        this.reporter = createReporter(this.url, this.userId, this.isOnline);
    }

    use(plugin: any) {
        this.pluginSystem.install(plugin);
    }
    init() {
        this.plugins.forEach(plugin => this.use(plugin));
    }

}

