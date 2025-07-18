
import { NETWORK_REPORT_KEY, STATIC_ERROR_REPORT_KEY, } from "../constants/constants";
declare const window: any;

export default {
    name: "network",
    setup(sdk: any) {
        const onApiReport = (data: any) => {
            sdk.reporter({
                type: NETWORK_REPORT_KEY,
                data: {
                    ...data,
                },
            }, sdk)
        }
        const onStaticReport = (data: any) => {
            sdk.reporter({
                type: STATIC_ERROR_REPORT_KEY,
                data: {
                    ...data,
                },
            }, sdk)
        }
        const onReport = (data: any) => {
            const { url, method, status, response, params, } = data;
            if (isStaticResource(url)) {
                onStaticReport({
                    url,
                    method,
                    status,
                    response,
                    params,
                })
            } else {
                onApiReport({
                    url,
                    method,
                    status,
                    response,
                    params,
                })
            }
        }
        const isStaticResource = (url: string) => {
            return /\.(png|jpe?g|gif|webp|svg|mp4|mp3|js|css|woff2?|ttf|map)(\?.*)?$/i.test(url);
        }
        const handleFetch = () => {
            if (!window.fetch || window.fetch.__is_monitored__) {
                return;
            }

            const originFetch: any = window.fetch;
            // @ts-ignore
            const wrappedFetch = async function (...args) {
                const [input, init] = args;
                const method = (init?.method || "GET").toUpperCase()
                const url = typeof input === "string" ? input : input.url
                const body = init?.body;

                try {
                    // @ts-ignore
                    const res: any = await originFetch.apply(this, args)
                    if (!res.ok) {
                        const responseText = await res.clone().text();
                        onReport({
                            url,
                            method,
                            status: res.status,
                            response: responseText,
                            params: body,
                        })
                    }
                    return res;
                } catch (error: any) {
                    onReport({
                        url,
                        method,
                        status: error?.status,
                        response: typeof error === "object" ? JSON.stringify(error) : error,
                        params: body,
                    })
                    throw error;
                }
            }
            wrappedFetch.__is_monitored__ = true;
            window.fetch = wrappedFetch;
        }
        const handleXHR = () => {
            const XHR: any = XMLHttpRequest.prototype;
            if (XHR.__is_monitored__) {
                return;
            }

            const originOpen: any = XHR.open;
            const originSend: any = XHR.send;

            XHR.open = function (method: string, url: string, ...rest: any[]) {
                this._monitorMethod = method;
                this._monitorUrl = url;
                return originOpen.call(this, method, url, ...rest);
            }

            XHR.send = function (body: any) {
                const xhr = this

                xhr.addEventListener('loadend', function () {
                    const method: string = xhr._monitorMethod;
                    const url: string = xhr._monitorUrl;

                    if (xhr.status >= 400) {
                        onReport({
                            url,
                            method,
                            status: xhr.status,
                            response: xhr.responseText,
                            params: body,
                        })
                    }
              })

              return originSend.call(xhr, body)
            }

            XHR.__is_monitored__ = true;
        }
        const handleAxios = () => {

        }
        handleFetch();
        handleXHR();
        handleAxios();
    }
}
