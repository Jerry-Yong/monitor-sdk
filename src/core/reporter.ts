
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { getEnv } from "./env";
import { getUserId } from "./storage";
declare const navigator: any;

let deviceId = "";

const getPayload = (data: any) => {
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

export function createReporter(url: string, userId: string, isOnline: boolean) {
    let queue: any[] = [];
    let flushing: boolean = false;
    let timer: any = null;

    const fetchPost = (url: string, payload: any, isOnline: boolean) => {
        if (!isOnline) {
            console.log("[Reporter]: 非线上环境，暂停上报--fetchPost:", payload);
            return;
        }
        let xhr: any = new XMLHttpRequest();
        xhr.open("post", url, true)
        xhr.send(JSON.stringify(payload))
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    try {
                        // console.log('[wboperationlog]: responseText--fetchPost:', xhr.responseText)
                        // const json = JSON.parse(xhr.responseText)
                    } catch (error) {
                        console.error("[reporter]：error--fetchPost:", error);
                    }
                } else {
                    console.error("[reporter]：xhr--fetchPost:", xhr);
                }
            }
        }
    }
    const fetchBeacon = (url: string, payload: any, isOnline: boolean) => {
        if (!isOnline) {
            console.log("[Reporter]: 非线上环境，暂停上报--fetchBeacon:", payload);
            return;
        }
        navigator.sendBeacon(url, JSON.stringify(payload));
    }

    const _flush = async () => {
        if (!deviceId) {
            const fp = await FingerprintJS.load();
            const { visitorId } = await fp.get();
            deviceId = visitorId;
        }
        if (flushing || queue.length === 0) return;
        flushing = true;
        // 一条一条取出数据进行上报，而不是批量上报
        while (queue.length > 0) {
            const data = queue.shift(); // 取出第一条数据
            const payload = {
                content: encodeURIComponent(JSON.stringify({
                    ...data,
                    ...getPayload({ deviceId: deviceId, }),
                })),
                uid: userId,
            }
            if (navigator?.sendBeacon) {
                fetchBeacon(url, payload, isOnline);
            } else {
                fetchPost(url, payload, isOnline);
            }
            // 每条数据上报后稍微延迟一下，避免过于频繁的请求
            if (queue.length > 0) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
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

    return function report(data: any) {
        queue.push(data);
        if (queue.length >= 10) {
            _flush();
        } else {
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            timer = setTimeout(() => {
                _flush();
            }, 1000);
        }
    }
}
