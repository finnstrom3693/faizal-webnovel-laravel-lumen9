import { combineReducers } from 'redux';
import navbarReducer from './navbarReducer.js';
import searchReducer from './searchReducer.js';
// Import other reducers as needed

const rootReducer = combineReducers({
  navbar: navbarReducer,
  search: searchReducer,
  // Add other reducers here
});

export default rootReducer;