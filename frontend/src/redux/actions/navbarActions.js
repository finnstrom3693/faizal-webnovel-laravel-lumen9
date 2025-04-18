export const TOGGLE_MOBILE_MENU = 'TOGGLE_MOBILE_MENU';
export const TOGGLE_DROPDOWN = 'TOGGLE_DROPDOWN';
export const LOGIN_USER = 'LOGIN_USER';
export const LOGOUT_USER = 'LOGOUT_USER';
export const SET_SEARCH_QUERY = 'SET_SEARCH_QUERY';

export const toggleMobileMenu = () => ({
  type: TOGGLE_MOBILE_MENU
});

export const toggleDropdown = () => ({
  type: TOGGLE_DROPDOWN
});

export const loginUser = (userData) => ({
  type: LOGIN_USER,
  payload: userData
});

export const logoutUser = () => ({
  type: LOGOUT_USER
});

export const setSearchQuery = (query) => {
  return {
      type: SET_SEARCH_QUERY,
      payload: query
  };
};