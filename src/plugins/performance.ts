
import { onCLS, onFID, onLCP, onFCP, onTTFB, } from "web-vitals";
import { PERFORMANCE_REPORT_KEY, } from "../constants/constants";

export default {
    name: "performance",
    setup(sdk: any) {
        const onReport = (data: any) => {
            sdk.reporter({
                type: PERFORMANCE_REPORT_KEY,
                data: {
                    ...data,
                }
            }, sdk)
        }
        // 布局偏移，目标值：衡量页面中可视元素意外移动的视觉稳定性，目标值 <= 0.1
        onCLS(metric => {
            onReport({
                type: "CLS",
                value: metric.value,
                name: metric.name,
                delta: metric.delta,
                id: metric.id,
                entries: metric.entries,
            })
        })
        //首次输入延迟：用户首次交互到浏览器处理的时间，目标值 <= 1s
        onFID(metric => {
            onReport({
                type: "FID",
                value: metric.value,
                name: metric.name,
                delta: metric.delta,
                id: metric.id,
                entries: metric.entries,
            })
        })
        // 最大内容绘制：页面主内容完成绘制所需时间，目标值 <= 2.5s
        onLCP(metric => {
            onReport({
                type: "LCP",
                value: metric.value,
                name: metric.name,
                delta: metric.delta,
                id: metric.id,
                entries: metric.entries,
            })
        })
        // 首次内容绘制：首次绘制任何文本/图片的时间，目标值 <= 1.8s
        onFCP(metric => {
            onReport({
                type: "FCP",
                value: metric.value,
                name: metric.name,
                delta: metric.delta,
                id: metric.id,
                entries: metric.entries,
            })
        })
        // 首字节时间：浏览器请求页面到接收到第一个字节的时间，目标值 <= 0.2s
        onTTFB(metric => {
            onReport({
                type: "TTFB",
                value: metric.value,
                name: metric.name,
                delta: metric.delta,
                id: metric.id,
                entries: metric.entries,
            })
        })
        // 统计长任务
        const onTBT = () => {
            let observer;
            try {
                observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        onReport({
                            type: "TTFB",
                            value: entry.duration,
                            name: entry.name,
                            delta: "",
                            id: "",
                            entries: "",
                        })
                    }
                });
                observer.observe({ type: "longtask", buffered: true });
            } catch (e) {
                console.warn("[performance]：TBT not supported", e);
            }
        }
        onTBT();
        /*
        // 总阻塞时间（较新版本才支持）：FCP 与 TTI 之间阻塞主线程超 50ms 的总时长，目标值 <= 0.2s
        onTBT(metric => {
            console.log("[performance]：metric--onTBT:", metric);
            onReport({
                type: "TTFB",
                value: metric.value,
                name: metric.name,
                delta: metric.delta,
                id: metric.id,
                entries: metric.entries,
            })
        })
        */


    }
}

