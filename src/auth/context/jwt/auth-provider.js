import PropTypes from 'prop-types';
import { useEffect, useReducer, useCallback, useMemo, useState } from 'react';
// utils
import { Magic } from 'magic-sdk';
import { NearExtension } from '@magic-ext/near';
import { OAuthExtension } from '@magic-ext/oauth';
import { axiosInstance, endpoints } from 'src/utils/axios'; // Removed fetcherANYML as it's no longer needed
//
import { AuthContext } from './auth-context';
import { isValidToken, setSession } from './utils';

// ----------------------------------------------------------------------

const initialState = {
  user: null,
  loading: true,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'INITIAL':
      return {
        loading: false,
        user: action.payload.user,
      };
    case 'LOGIN':
      return {
        ...state,
        user: action.payload.user,
      };
    case 'REGISTER':
      return {
        ...state,
        user: action.payload.user,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
};

// ----------------------------------------------------------------------

const STORAGE_KEY = 'accessToken';

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [magic, setMagic] = useState(null); // Create a state to hold the magic instance

  useEffect(() => {
    const magicInstance = new Magic(process.env.REACT_APP_MAGIC_PUBLISHABLE_KEY, {
      extensions: [new NearExtension({ rpcUrl: '' })],
    });
    setMagic(magicInstance); // Initialize once and use this instance
  }, []);

  const fetchUserByEmail = async (email) => {
    try {
      const response = await fetch(`https://uot4ttu72a.execute-api.us-east-1.amazonaws.com/default/handleGetUsers?email=${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Error fetching user: ${response.statusText}`);
      }

      const data = await response.json();

      // Assuming the response contains a "user" field with the user data
      return data.user ? data.user : null;
    } catch (error) {
      console.error('Error fetching user by email:', error);
      return null;
    }
  };


  const initialize = useCallback(async () => {
    try {
      const accessToken = sessionStorage.getItem(STORAGE_KEY);
      if (accessToken && magic) {
        setSession(accessToken);

        const magicIsLoggedIn = await magic.user.isLoggedIn();
        if (magicIsLoggedIn) {
          // Retrieve user metadata from Magic
          const user = await magic.user.getMetadata();

          // Fetch the user from your database by email
          const dbUser = await fetchUserByEmail(user.email);

          if (dbUser) {
            // Get the pid from the returned users data
            user.pid = dbUser.pid;
          } else {
            throw new Error('User not found in database');
          }

          // Dispatch the updated user object
          dispatch({
            type: 'LOGIN',
            payload: { user },
          });
        } else {
          dispatch({ type: 'INITIAL', payload: { user: null } });
        }
      } else {
        dispatch({
          type: 'INITIAL',
          payload: { user: null },
        });
      }
    } catch (error) {
      console.error('Initialization error:', error);
      dispatch({
        type: 'INITIAL',
        payload: { user: null },
      });
    }
  }, [magic]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (email, password) => {
    const data = {
      email,
      password,
    };

    const response = await axiosInstance.post(endpoints.auth.login, data);
    const { accessToken, user } = response.data;

    setSession(accessToken);

    dispatch({
      type: 'LOGIN',
      payload: {
        user,
      },
    });
  }, []);

  const loginMagic = useCallback(
    async (email) => {
      try {
        if (magic) {
          // Send the Magic link to the user's email
          await magic.auth.loginWithMagicLink({ email });
          const accessToken = await magic.user.getIdToken();
          setSession(accessToken);

          // Check if the user is logged in
          const magicIsLoggedIn = await magic.user.isLoggedIn();
          if (magicIsLoggedIn) {
            // Retrieve user metadata from Magic
            const user = await magic.user.getMetadata();

            // Fetch the user from your database by email
            const dbUser = await fetchUserByEmail(user.email);

            if (dbUser) {
              // Get the pid from the returned users data
              user.pid = dbUser.pid;
            } else {
              throw new Error('User not found in database');
            }

            // Dispatch the updated user object
            dispatch({
              type: 'LOGIN',
              payload: { user },
            });
          }
        }
      } catch (error) {
        console.error('Magic login error:', error);
      }
    },
    [magic]
  );

  // REGISTER
  const register = useCallback(async (email, password, firstName, lastName) => {
    const data = {
      email,
      password,
      firstName,
      lastName,
    };

    const response = await axiosInstance.post(endpoints.auth.register, data);
    const { accessToken, user } = response.data;

    sessionStorage.setItem(STORAGE_KEY, accessToken);

    dispatch({
      type: 'REGISTER',
      payload: {
        user,
      },
    });
  }, []);

  // LOGOUT
  const logout = useCallback(async () => {
    setSession(null);
    dispatch({
      type: 'LOGOUT',
    });
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';
  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'magic',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      login,
      loginMagic,
      register,
      logout,
    }),
    [login, loginMagic, logout, register, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};
