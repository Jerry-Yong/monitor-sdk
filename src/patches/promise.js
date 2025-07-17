
export function patchPromise({ onCatch }) {
	const originThen = Promise.prototype.then;
	const originCatch = Promise.prototype.catch;

	function wrapHandler(handler, type) {
		return function (...args) {
			try {
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

	Promise.prototype.then = function (onFulfilled, onRejected) {
		return originThen.call(
			this,
			onFulfilled && wrapHandler(onFulfilled, 'then'),
			onRejected && wrapHandler(onRejected, 'then:reject')
		);
	};

	Promise.prototype.catch = function (onRejected) {
		return originCatch.call(this, onRejected && wrapHandler(onRejected, 'catch'));
	};
}

