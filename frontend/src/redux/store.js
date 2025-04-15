import { createStore } from 'redux';
import rootReducer from './reducers/rootReducer.js';

const store = createStore(
  rootReducer,
  // Add Redux DevTools Extension support
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;