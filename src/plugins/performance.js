
import { getCLS, getFID, getLCP, getFCP, getTTFB } from "web-vitals";
import { PERFORMANCE_REPORT_KEY, } from "../constants/constants";

export default {
    name: "performance",
    setup(sdk) {
        const onReport = (data) => {
            sdk.reporter({
                type: PERFORMANCE_REPORT_KEY,
                data: {
                    ...data,
                }
            }, sdk)
        }
        getCLS(metric => {
            onReport({
                type: "CLS",
                value: metric.value,
                name: metric.name,
                delta: metric.delta,
                id: metric.id,
                entries: metric.entries,
            })
        })
        getFID(metric => {
            onReport({
                type: "FID",
                value: metric.value,
                name: metric.name,
                delta: metric.delta,
                id: metric.id,
                entries: metric.entries,
            })
        })
        getLCP(metric => {
            onReport({
                type: "LCP",
                value: metric.value,
                name: metric.name,
                delta: metric.delta,
                id: metric.id,
                entries: metric.entries,
            })
        })
        getFCP(metric => {
            onReport({
                type: "FCP",
                value: metric.value,
                name: metric.name,
                delta: metric.delta,
                id: metric.id,
                entries: metric.entries,
            })
        })
        getTTFB(metric => {
            onReport({
                type: "TTFB",
                value: metric.value,
                name: metric.name,
                delta: metric.delta,
                id: metric.id,
                entries: metric.entries,
            })
        })


    }
}

