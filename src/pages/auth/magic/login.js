import { Helmet } from 'react-helmet-async';
// sections
import { MagicLoginView } from 'src/sections/auth/magic';

// ----------------------------------------------------------------------

export default function LoginPage() {
  return (
    <>
      <Helmet>
        <title> Petastic: Login</title>
      </Helmet>

      <MagicLoginView />
    </>
  );
}
