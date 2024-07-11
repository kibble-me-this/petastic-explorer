import PropTypes from 'prop-types';
import { useEffect, useCallback, useState } from 'react';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
//
import { useAuthContext } from '../hooks';

const loginPaths = {
  magic: paths.auth.magic.login,
  jwt: paths.auth.jwt.login,
  auth0: paths.auth.auth0.login,
  amplify: paths.auth.amplify.login,
  firebase: paths.auth.firebase.login,
};

export default function AuthGuard({ children }) {
  const router = useRouter();
  const { authenticated, method, initializing } = useAuthContext(); // Include initializing state
  const [checked, setChecked] = useState(false);

  const check = useCallback(() => {
    if (!initializing) {
      if (!authenticated) {
        const searchParams = new URLSearchParams({ returnTo: window.location.pathname }).toString();
        const loginPath = loginPaths[method];
        router.replace(`${loginPath}?${searchParams}`);
      } else {
        setChecked(true);
      }
    }
  }, [authenticated, method, router, initializing]);

  useEffect(() => {
    check();
  }, [check]);

  if (!checked || initializing) {
    return null; // Optionally, render a loading indicator here
  }

  return <>{children}</>;
}

AuthGuard.propTypes = {
  children: PropTypes.node,
};
