
export function singleton(clasname) {
    let instance = null;
    const proxy = new Proxy(clasname, {
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
