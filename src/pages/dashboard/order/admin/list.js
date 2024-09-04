import { Helmet } from 'react-helmet-async';
// sections
import { OrderListAdminView } from 'src/sections/order/view';

// ----------------------------------------------------------------------

export default function OrderListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Order List</title>
      </Helmet>

      <OrderListAdminView />
    </>
  );
}
