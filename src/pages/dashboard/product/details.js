import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { ProductDetailsView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

export default function ProductDetailsPage() {
  const params = useParams();

  const { accountId, id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Product Details</title>
      </Helmet>

      <ProductDetailsView accountId={accountId} id={id} />
    </>
  );
}