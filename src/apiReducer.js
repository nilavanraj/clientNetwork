import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { apiReducer } from './apiThunk';

const rootReducer = combineReducers({
  // Add other reducers here
  api: apiReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
