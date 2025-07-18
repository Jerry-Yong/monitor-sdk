
export function patchPromise(data: { onCatch: any }) {
    const { onCatch, } = data;
    // @ts-ignore
	const originThen = Promise.prototype.then;
    // @ts-ignore
	const originCatch = Promise.prototype.catch;

	function wrapHandler(handler: any, type: any) {
        // @ts-ignore
		return function (...args) {
			try {
                // @ts-ignore
				return handler.apply(this, args);
			} catch (err) {
				// 将错误回调给外部
				onCatch?.({
					error: err,
					from: type
				});
				throw err;
			}
		};
	}
    // @ts-ignore
	Promise.prototype.then = function (onFulfilled: any, onRejected: any) {
		return originThen.call(
			this,
			onFulfilled && wrapHandler(onFulfilled, "then"),
			onRejected && wrapHandler(onRejected, 'then:reject')
		);
	};
    // @ts-ignore
	Promise.prototype.catch = function (onRejected: any) {
		return originCatch.call(this, onRejected && wrapHandler(onRejected, 'catch'));
	};
}

