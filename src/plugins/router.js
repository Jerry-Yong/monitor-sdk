
import { ROUTER_REPORT_KEY, } from "../constants/constants";

export default {
    name: "router",
    setup(sdk) {
        const onReport = (from, to) => {
            sdk.reporter({
                type: ROUTER_REPORT_KEY,
                data: {
                    from, 
                    to,
                }
            }, sdk)
        }
        const onRouterChange = (cb) => {
            let prev = location.href

            window.addEventListener("hashchange", () => {
                const next = location.href
                callback({ from: prev, to: next, type: "hashchange" })
                prev = next
            })
          
            window.addEventListener("popstate", () => {
                const next = location.href
                callback({ from: prev, to: next, type: "popstate" })
                prev = next
            })
          
            const methods = ["pushState", "replaceState"]
            methods.forEach(method => {
                const original = history[method]
                history[method] = function (...args) {
                    const result = original.apply(this, args)
                    const next = location.href
                    callback({ from: prev, to: next, type: method })
                    prev = next
                    return result
                }
            })
        }

        onRouterChange(data => {
            const { from, to } = data;
            onReport(from, to);
        })

    },

}
