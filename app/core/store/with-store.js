import { connect } from 'react-redux';
/**
 * 挂载 Redux Store
 * @param options
 * @param mapStates
 */
export function withStore(options) {
    return connect(mapStates(options), (dispatch) => new Object({ dispatch }), undefined, {
        forwardRef: true,
    });
}
export function mapStates(options) {
    return (states) => {
        const resState = {};
        if (options instanceof Array) {
            options.forEach((val) => {
                if (typeof val === 'string') {
                    resState[val] = states[val];
                }
                else {
                    Object.assign(resState, mapAliasStates(val, states));
                }
            });
        }
        else {
            Object.assign(resState, mapAliasStates(options, states));
        }
        return resState;
    };
}
function mapAliasStates(alias, states) {
    const resState = {};
    for (const key in alias) {
        const statesKey = alias[key];
        resState[key] = states[statesKey];
    }
    return resState;
}
