import { Helmet } from 'react-helmet-async';
// sections
import { UserCardsView } from 'src/sections/pet/view';

// ----------------------------------------------------------------------

export default function UserCardsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Pet Cards</title>
      </Helmet>

      <UserCardsView />
    </>
  );
}
