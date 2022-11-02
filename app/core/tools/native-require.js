/**
 * 跳过 webpack 使用原生 require
 */
export let nativeRequire;
try {
    nativeRequire =
        global.__non_webpack_require__ === 'function'
            ? global.__non_webpack_require__
            : eval('require');
}
catch (_a) {
    nativeRequire = () => {
        throw new Error('Require Error!');
    };
}
