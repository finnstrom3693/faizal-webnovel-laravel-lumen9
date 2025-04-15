import { combineReducers } from 'redux';
import navbarReducer from './navbarReducer.js';

const rootReducer = combineReducers({
  navbar: navbarReducer,
  // Add other reducers here as your app grows
});

export default rootReducer;