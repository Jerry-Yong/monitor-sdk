
import { TRACK_REPORT_KEY, } from "../constants/constants";

export default {
    name: "track",
    setup(sdk) {
        const onReport = (data) => {
            sdk.reporter({
                type: TRACK_REPORT_KEY,
                data: {
                    ...data,
                }
            }, sdk)
        }

    }
}

