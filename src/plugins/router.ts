
import { ROUTER_REPORT_KEY, } from "../constants/constants";
declare const history: any;

export default {
    name: "router",
    setup(sdk: any) {
        const onReport = (from: string, to: string) => {
            sdk.reporter({
                type: ROUTER_REPORT_KEY,
                data: {
                    from,
                    to,
                }
            }, sdk)
        }
        const onRouterChange = (cb: any) => {
            let prev: any = location.href;
            window.addEventListener("hashchange", () => {
                const next = location.href;
                cb({ from: prev, to: next, type: "hashchange" });
                prev = next;
            })

            window.addEventListener("popstate", () => {
                const next: any = location.href;
                cb({ from: prev, to: next, type: "popstate" });
                prev = next;
            })

            const methods = ["pushState", "replaceState"];
            methods.forEach(method => {
                // @ts-ignore
                const original: any = history[method];
                // @ts-ignore
                history[method] = function (...args: any[]) {
                    // @ts-ignore
                    const result: any = original.apply(this, args);
                    const next: any = location.href;
                    cb({ from: prev, to: next, type: method });
                    prev = next;
                    return result;
                }
            })
        }

        onRouterChange((data: any) => {
            const { from, to } = data;
            onReport(from, to);
        })

    },

}
