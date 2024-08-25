import { Helmet } from 'react-helmet-async';
// sections
import { ProductListAdminView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

export default function ProductCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new product</title>
      </Helmet>

      <ProductListAdminView />
    </>
  );
}
