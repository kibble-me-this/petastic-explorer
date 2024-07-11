import PropTypes from 'prop-types';
import { useEffect, useReducer, useCallback, useMemo, useState } from 'react';
// utils
import { Magic } from 'magic-sdk';
import { NearExtension } from '@magic-ext/near';
import { OAuthExtension } from '@magic-ext/oauth';
import { axiosInstance, endpoints } from 'src/utils/axios';
//
import { AuthContext } from './auth-context';
import { isValidToken, setSession } from './utils';

// ----------------------------------------------------------------------

// NOTE:
// We only build demo at basic level.
// Customer will need to do some extra handling yourself if you want to extend the logic and other features...

// ----------------------------------------------------------------------

const initialState = {
  user: null,
  loading: true,
};

const reducer = (state, action) => {
  if (action.type === 'INITIAL') {
    return {
      loading: false,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGIN') {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === 'REGISTER') {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGOUT') {
    return {
      ...state,
      user: null,
    };
  }
  console.log('reducer state: ', state);
  return state;
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

  const initialize = useCallback(async () => {
    try {
      const accessToken = sessionStorage.getItem(STORAGE_KEY);
      if (accessToken) {
        setSession(accessToken);
        let user = null;

        if (magic) {
          const magicIsLoggedIn = await magic.user.isLoggedIn();
          if (magicIsLoggedIn) {
            user = await magic.user.getMetadata();
            dispatch({
              type: 'LOGIN',
              payload: { user },
            });
          }
        }

        dispatch({
          type: 'INITIAL',
          payload: { user },
        });
      } else {
        dispatch({
          type: 'INITIAL',
          payload: { user: null },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: 'INITIAL',
        payload: { user: null },
      });
    }
  }, [magic]); // Ensure magic is included in dependencies

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
      console.log('Calling loginMagic:', email);
      try {
        if (magic) {
          // Check if the magic instance exists in the state
          // Send the Magic link to the user's email
          const res = await magic.auth.loginWithMagicLink({ email });
          const accessToken = await magic.user.getIdToken();
          setSession(accessToken);

          // Check if the user is logged in
          const magicIsLoggedIn = await magic.user.isLoggedIn();
          if (magicIsLoggedIn) {
            // If the user is logged in, retrieve user metadata
            const user = await magic.user.getMetadata();
            const publicAddress = user.publicAddress;

            console.log('userMetadata', user);

            // You can now use this user metadata or NEAR public address as needed

            // Update the session with the NEAR public address or any other necessary data
            // setSession(publicAddress);

            // Update the context to reflect the user's authentication status
            dispatch({
              type: 'LOGIN',
              payload: {
                user, // Use the actual user data received from getMetadata
              },
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
  console.log('state.user: ', state.user);

  console.log('checkAuthenticated: ', checkAuthenticated);
  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'magic',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      //
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
