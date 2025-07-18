
import { TRACK_REPORT_KEY, } from "../constants/constants";

interface MonitorSDK {
    reporter: (data: any, sdk: any) => void;
    track?: (data: any) => void;
}

export default {
    name: "track",
    setup(sdk: MonitorSDK) {
        const onReport = (data: any) => {

            sdk.reporter({
                type: TRACK_REPORT_KEY,
                data: {
                    ...data,
                }
            }, sdk)
        }
        // 将 track 方法绑定到 SDK 实例上
        sdk.track = onReport;
    }
}

