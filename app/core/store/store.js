import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { reducer, initialState } from './reducers/auto-reducer';
export const store = createStore(reducer, initialState, applyMiddleware(thunk));
