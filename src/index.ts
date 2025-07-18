
import MonitorSDK from "./core";
import performance from "./plugins/performance";
import track from "./plugins/track";
import error from "./plugins/error";
// import router from "./plugins/router";
import network from "./plugins/network";
import blankScreen from "./plugins/blankScreen";

export function initMonitor(config: { logType: string; url?: string; userId?: string; isOnline?: boolean }) {
    if (!config?.logType) {
        throw `[initMonitor]: logType为必填参数`;
    }
    const sdk: any = new MonitorSDK(config);

    sdk.pluginSystem.batchInstall([
        performance,
        track,
        error,
        // router,
        network,
        blankScreen,
    ]);

    return sdk;
}

