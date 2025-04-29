// navbarReducer.js
import {
    TOGGLE_MOBILE_MENU,
    TOGGLE_DROPDOWN,
    LOGIN_USER,
    LOGOUT_USER,
    SET_SEARCH_QUERY,
    LOGIN_FAILED
} from '../actions/navbarActions.js';

const initialState = {
    mobileMenuOpen: false,
    isDropdownOpen: false,
    isLoggedIn: !!(localStorage.getItem('token') || sessionStorage.getItem('token')),
    user: null,
    searchQuery: '',
    error: null
};

const navbarReducer = (state = initialState, action) => {
    switch (action.type) {
        case TOGGLE_MOBILE_MENU:
            return {
                ...state,
                mobileMenuOpen: !state.mobileMenuOpen
            };
        case TOGGLE_DROPDOWN:
            return {
                ...state,
                isDropdownOpen: !state.isDropdownOpen
            };
        case LOGIN_USER:
            return {
                ...state,
                isLoggedIn: true,
                user: action.payload.user,
                error: null
            };
        case LOGOUT_USER:
            return {
                ...state,
                isLoggedIn: false,
                user: null,
                error: null
            };
        case SET_SEARCH_QUERY:
            return {
                ...state,
                searchQuery: action.payload
            };
        case LOGIN_FAILED:
            return {
                ...state,
                error: action.payload
            };
        default:
            return state;
    }
};

export default navbarReducer;