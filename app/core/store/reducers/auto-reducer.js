const actions = require.context('../actions', true, /^((?!\.d\.ts).)*(\.ts)$/);
const actionsH = {};
export const initialState = {};
actions.keys().forEach((item) => {
    const actionItem = Object.assign({}, actions(item));
    if (actionItem.initialState) {
        Object.assign(initialState, actionItem.initialState);
    }
    delete actionItem.initialState;
    for (const key in actionItem) {
        actionsH[key] = actionItem[key];
    }
});
export function reducer(state, action) {
    const actionFn = actionsH[action.type];
    const resState = (actionFn && actionFn(action.data, state, action)) || {};
    return Object.assign({}, state, resState);
}
