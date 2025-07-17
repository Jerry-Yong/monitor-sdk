
import { getEnv } from "./env";
import { getUserId } from "./storage";
import { singleton } from "../utils/singleton";

const getPayload = (data) => {
    const env = getEnv();
    const userId = getUserId();
    return {
        ...data,
        env,
        userId,
        timestamp: Date.now(),
        pageUrl: location.href,
        pageTitle: document.title,
    }
}
export function createReporter(url, userId) {
    let queue = [];
    let flushing = false;
    let timer = null;
    
    const _flush = (sdk) => {
        if (flushing || queue.length === 0) return;
        flushing = true;
        const data = queue.splice(0);
        const payload = JSON.stringify({
            ...data,
            ...getPayload(),
        })
        if (navigator.sendBeacon) {
            navigator.sendBeacon(url, payload);
        } else {
            fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: payload,
                keepalive: true,
            }).then(() => {}).catch((error) => {
                console.error("[report]: error--_flush:", error);
            });
        }
        flushing = false;
    }

    window.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") {
            _flush();
        }
    });
    window.addEventListener("beforeunload", () => {
        // 页面即将卸载前（点击关闭/刷新），但某些移动端不支持，同时不适合异步请求，适用于组织当前页面关闭
    })
    window.addEventListener("pagehide", () => {
        
    })
    window.addEventListener("unload", () => {
        // 页面完全卸载（关闭标签页或跳转），不适合异步请求，常常不触发 sendBeacon
    })    

    return function report(data, sdk) {
        queue.push(data);
        if (queue.length >= 10) {
            _flush();
        } else {
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            timer = setTimeout(() => {
                _flush(sdk);
            }, 1000);
        }
    }
}