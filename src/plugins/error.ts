
import { JS_ERROR_REPORT_KEY, } from "../constants/constants";
import { patchPromise } from "../patches/promise";

export default {
    name: "error",
    setup(sdk: any) {
        const onReport = (data: any) => {
            sdk.reporter({
                type: JS_ERROR_REPORT_KEY,
                data: {
                    ...data,
                }
            }, sdk)
        }
        // 监听 JS 错误和资源加载失败
		window.addEventListener("error", event => {
			const target: any = event.target || event.srcElement;

			if (target && (target instanceof HTMLImageElement || target instanceof HTMLScriptElement || target instanceof HTMLLinkElement)) {
				// 资源加载失败
                onReport({
                    type: "resource-error",
                    tagName: target.tagName.toLowerCase(),
                    // @ts-ignore
                    url: target?.src || target?.href,
                    outerHTML: target.outerHTML,
                    message: `Resource load failed: ${ target.tagName }`,
                })
			} else {
				// JS 错误
                onReport({
                    type: "js-error",
                    message: event.message,
                    filename: event.filename,
                    position: `${ event.lineno }:${ event.colno }`,
                    stack: event.error ? event.error.stack : "",
                });
			}
		}, true);// 捕获阶段，确保捕获资源错误
        patchPromise({
			onCatch(res: { error: any, from: any }) {
			    const { error, from, } = res;
				onReport({
					message: error?.message || String(error),
					stack: error?.stack || "",
					from,
				});
			}
		});

    }
}

