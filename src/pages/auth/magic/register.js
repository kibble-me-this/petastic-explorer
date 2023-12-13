import { Helmet } from 'react-helmet-async';
// sections
import { MagicRegisterView } from 'src/sections/auth/magic';

// ----------------------------------------------------------------------

export default function RegisterPage() {
  return (
    <>
      <Helmet>
        <title> Petastic: Register</title>
      </Helmet>

      <MagicRegisterView />
    </>
  );
}
