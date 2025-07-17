
import MonitorSDK from "./core";
import router from "./plugins/router";
import performance from "./plugins/performance";
import network from "./plugins/network";
import track from "./plugins/track";
import error from "./plugins/error";
import blankScreen from "./plugins/blankScreen";

export function initMonitor(config) {
    const sdk = new MonitorSDK(config);
    
    sdk.pluginSystem.batchInstall([
        router,
        performance,
        network,
        track,
        error,
        blankScreen,
    ]);

    return sdk;
}

