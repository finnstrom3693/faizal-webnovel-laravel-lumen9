import {
    FETCH_SEARCH_RESULTS_REQUEST,
    FETCH_SEARCH_RESULTS_SUCCESS,
    FETCH_SEARCH_RESULTS_FAILURE,
    CLEAR_SEARCH_RESULTS
  } from '../actions/searchActions.js';
  
  const initialState = {
    results: [],
    loading: false,
    error: null
  };
  
  const searchReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_SEARCH_RESULTS_REQUEST:
        return {
          ...state,
          loading: true,
          error: null
        };
      case FETCH_SEARCH_RESULTS_SUCCESS:
        return {
          ...state,
          loading: false,
          results: action.payload,
          error: null
        };
      case FETCH_SEARCH_RESULTS_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload
        };
      case CLEAR_SEARCH_RESULTS:
        return {
          ...state,
          results: [],
          error: null
        };
      default:
        return state;
    }
  };
  
  export default searchReducer;