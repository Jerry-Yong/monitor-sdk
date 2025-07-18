
export function singleton(clasname: any) {
    let instance: any = null;
    const proxy: any = new Proxy(clasname, {
        construct(target, args) {
            if (!instance) {
                instance = Reflect.construct(target, args);
            }
            return instance;
        }
    })
    proxy.prototype.constructor = proxy;
    return proxy;
}
