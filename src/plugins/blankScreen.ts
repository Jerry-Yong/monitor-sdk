
import { BLANK_SCREEN_REPORT_KEY, } from "../constants/constants";

export default {
    name: "blankScreen",
    setup(sdk: any) {
        const onReport = (data: any) => {
            sdk.reporter({
                type: BLANK_SCREEN_REPORT_KEY,
                data: {
                    ...data,
                }
            }, sdk)
        }
        window.addEventListener("load", () => {
            const selectors = [ "#app", "#root", "body", ];
            const isBlank = selectors.every(selector => {
                const element: any = document.querySelector(selector);
                return !element || element.offsetHeight < 20 || element.innerText.trim().length === 0;
            });
            if (isBlank) {
                onReport({
                    url: location.href,
                })
            }
        })

    }
}
