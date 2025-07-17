
import { NETWORK_REPORT_KEY, STATIC_ERROR_REPORT_KEY, } from "../constants/constants";


export default {
    name: "network",
    setup(sdk) {
        const onApiReport = (data) => {
            sdk.reporter({
                type: NETWORK_REPORT_KEY,
                data: {
                    ...data,
                },
            }, sdk)
        }
        const onStaticReport = (data) => {
            // sdk.reporter({
            //     type: STATIC_ERROR_REPORT_KEY,
            //     data: {
            //         ...data,
            //     },
            // }, sdk)
        }
        const onReport = (data) => {
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
        const isStaticResource = (url) => {
            return /\.(png|jpe?g|gif|webp|svg|mp4|mp3|js|css|woff2?|ttf|map)(\?.*)?$/i.test(url);
        }
        const handleFetch = () => {
            if (!window.fetch || window.fetch.__is_monitored__) {
                return;
            }

            const originFetch = window.fetch;
            const wrappedFetch = async function (...args) {
                const [input, init] = args
                const method = (init?.method || "GET").toUpperCase()
                const url = typeof input === "string" ? input : input.url
                const body = init?.body;
            
                try {
                    const res = await originFetch.apply(this, args)
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
                } catch (error) {
                    onReport({
                        url,
                        method,
                        status: res.status,
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
            const XHR = XMLHttpRequest.prototype;
            if (XHR.__is_monitored__) {
                return;
            }
          
            const originOpen = XHR.open;
            const originSend = XHR.send;
          
            XHR.open = function (method, url, ...rest) {
                this._monitorMethod = method;
                this._monitorUrl = url;
                return originOpen.call(this, method, url, ...rest);
            }
          
            XHR.send = function (body) {
                const xhr = this
          
                xhr.addEventListener('loadend', function () {
                    const method = xhr._monitorMethod;
                    const url = xhr._monitorUrl;
          
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
