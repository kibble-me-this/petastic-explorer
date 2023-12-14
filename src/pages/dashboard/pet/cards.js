import { Helmet } from 'react-helmet-async';
// sections
import { PetCardsView } from 'src/sections/pet/view';

// ----------------------------------------------------------------------

export default function PetCardsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Pet Cards</title>
      </Helmet>

      <PetCardsView />
    </>
  );
}
