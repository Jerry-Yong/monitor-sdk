
declare const navigator: any;

export function getEnv() {
    return {
        ua: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
    }
}
