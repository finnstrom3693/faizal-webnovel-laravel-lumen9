// navbarActions.js

import api from '../api.js';

export const TOGGLE_MOBILE_MENU = 'TOGGLE_MOBILE_MENU';
export const TOGGLE_DROPDOWN = 'TOGGLE_DROPDOWN';
export const LOGIN_USER = 'LOGIN_USER';
export const LOGOUT_USER = 'LOGOUT_USER';
export const SET_SEARCH_QUERY = 'SET_SEARCH_QUERY';
export const LOGIN_FAILED = 'LOGIN_FAILED'; 

export const toggleMobileMenu = () => ({
  type: TOGGLE_MOBILE_MENU
});

export const toggleDropdown = () => ({
  type: TOGGLE_DROPDOWN
});

export const loginUser = (credentials) => async (dispatch) => {
  try {
    const res = await api.post('api/auth/login', {
      email: credentials.email,
      password: credentials.password
    });
    
    const { access_token, user } = res.data.data;

    // Save token based on rememberMe
    if (credentials.rememberMe) {
      localStorage.setItem('token', access_token);
    } else {
      sessionStorage.setItem('token', access_token);
    }

    dispatch({
      type: LOGIN_USER,
      payload: { 
        user: {
          name: user.username || credentials.email.split('@')[0],
          email: user.email
        }, 
        token: access_token 
      }
    });
    
    return Promise.resolve(); // For the component to know it succeeded
  } catch (err) {
    dispatch({
      type: LOGIN_FAILED,
      payload: err.response?.data?.message || 'Login failed'
    });
    return Promise.reject(err); // For the component to catch the error
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    await api.post('api/auth/logout', {}, {
      headers: { Authorization: `Bearer ${token}` }
    });

    localStorage.removeItem('token');
    sessionStorage.removeItem('token');

    dispatch({ type: LOGOUT_USER });
  } catch (err) {
    console.error('Logout error', err);
  }
};

export const checkAuth = () => async (dispatch) => {
  const token = sessionStorage.getItem('token') || localStorage.getItem('token');
  if (!token) return;

  try {
    const res = await api.get('api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    dispatch({
      type: LOGIN_USER,
      payload: { user: res.data.data, token }
    });
  } catch (err) {
    // If token is invalid, clear it
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    dispatch({ type: LOGOUT_USER });
  }
};

export const setSearchQuery = (query) => {
  return {
      type: SET_SEARCH_QUERY,
      payload: query
  };
};