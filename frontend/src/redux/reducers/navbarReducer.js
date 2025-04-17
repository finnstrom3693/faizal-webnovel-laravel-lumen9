import {
    TOGGLE_MOBILE_MENU,
    TOGGLE_DROPDOWN,
    LOGIN_USER,
    LOGOUT_USER
} from '../actions/navbarActions.js';

const initialState = {
    mobileMenuOpen: false,
    isDropdownOpen: false,
    isLoggedIn: false,
    user: null,
    searchQuery: ''
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
                user: action.payload
            };
        case LOGOUT_USER:
            return {
                ...state,
                isLoggedIn: false,
                user: null
            };
        case 'SET_SEARCH_QUERY':
            return {
                ...state,
                searchQuery: action.payload
            };
        default:
            return state;
    }
};

export default navbarReducer;