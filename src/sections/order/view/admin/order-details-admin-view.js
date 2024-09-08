import PropTypes from 'prop-types';
import { useState, useCallback, useEffect } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
// routes
import { paths } from 'src/routes/paths';
// _mock
import { ORDER_STATUS_OPTIONS } from 'src/_mock';
import { useGetOrders } from 'src/api/order';
// components
import { useSettingsContext } from 'src/components/settings';
//
import OrderDetailsInfo from './order-details-info';
import OrderDetailsItems from './order-details-item';
import OrderDetailsToolbar from './order-details-toolbar';
import OrderDetailsHistory from './order-details-history';

// ----------------------------------------------------------------------

export default function OrderDetailsView({ accountId, id }) {
  const settings = useSettingsContext();

  const { orders } = useGetOrders(accountId);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [status, setStatus] = useState('');
  const [trackingObtained, setTrackingObtained] = useState([]);

  useEffect(() => {
    if (orders) {
      const foundOrder = orders.find((orderItem) => orderItem.id === id);
      setCurrentOrder(foundOrder);
      setStatus(foundOrder?.status || '');

      if (foundOrder) {
        const obtainedTracking = foundOrder.delivery?.trackingNumbers?.tracking_obtained || [];
        setTrackingObtained(obtainedTracking);
      }
    }
  }, [orders, id]);

  const handleChangeStatus = useCallback((newValue) => {
    setStatus(newValue);
  }, []);

  const safeGet = (obj, path, defaultValue) => path.split('.').reduce((res, key) => (res && res[key] !== undefined) ? res[key] : defaultValue, obj);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      {currentOrder && (
        <>
          <OrderDetailsToolbar
            backLink={paths.admin.order.root}  // Adjust the backlink for admin routes
            orderNumber={currentOrder.orderNumber}
            createdAt={new Date(currentOrder.createdAt)}
            status={status}
            onChangeStatus={handleChangeStatus}
            statusOptions={ORDER_STATUS_OPTIONS}
            trackingObtained={trackingObtained}
          />

          <Grid container spacing={3}>
            <Grid xs={12} md={8}>
              <Stack spacing={3} direction={{ xs: 'column-reverse', md: 'column' }}>
                <OrderDetailsItems
                  items={currentOrder.items}
                  taxes={currentOrder.taxes}
                  shipping={currentOrder.shipping}
                  discount={currentOrder.discount}
                  subTotal={currentOrder.subTotal}
                  totalAmount={currentOrder.totalAmount}
                />

                <OrderDetailsHistory history={trackingObtained} />
              </Stack>
            </Grid>

            <Grid xs={12} md={4}>
              <OrderDetailsInfo
                customer={currentOrder.customer}
                delivery={currentOrder.delivery || {}}
                payment={safeGet(currentOrder, 'payment', {})}
                shippingAddress={currentOrder.shippingAddress || {}}  // Ensure this is at least an empty object
                trackingObtained={trackingObtained}
              />
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  );
}

OrderDetailsView.propTypes = {
  accountId: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};