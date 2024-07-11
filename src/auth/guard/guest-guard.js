import PropTypes from 'prop-types';
import { useCallback, useEffect } from 'react';
// routes
import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';
//
import { useAuthContext } from '../hooks';

export default function GuestGuard({ children }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { authenticated, initializing } = useAuthContext(); // Include initializing state

  const returnTo = searchParams.get('returnTo') || paths.dashboard.root;

  const check = useCallback(() => {
    if (!initializing) {
      if (authenticated) {
        router.replace(returnTo);
      }
    }
  }, [authenticated, returnTo, router, initializing]);

  useEffect(() => {
    check();
  }, [check]);

  if (initializing || authenticated) {
    return null; // Optionally, render a loading indicator here
  }

  return <>{children}</>;
}

GuestGuard.propTypes = {
  children: PropTypes.node,
};
