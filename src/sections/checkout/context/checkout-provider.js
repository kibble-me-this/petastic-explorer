import PropTypes from 'prop-types';
import uniq from 'lodash/uniq';
import { useEffect, useMemo, useCallback } from 'react';
// hooks
import { useLocalStorage, getStorage } from 'src/hooks/use-local-storage';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// _mock
import { PRODUCT_CHECKOUT_STEPS } from 'src/_mock/_product';
//
import { CheckoutContext } from './checkout-context';

// ----------------------------------------------------------------------

const STORAGE_KEY = 'checkout';

const initialState = {
  activeStep: 0,
  items: [],
  subTotal: 0,
  total: 0,
  discount: 0,
  shipping: 0,
  billing: null,
  totalItems: 0,
  accountID: '', // Add accountID to the initial state
  orderNumber: '' // Add orderNumber to the initial state
};

export function CheckoutProvider({ children }) {
  const router = useRouter();

  const { state, update, reset } = useLocalStorage(STORAGE_KEY, initialState);

  const onUpdateOrderNumber = useCallback((orderNumber) => {
    update('orderNumber', orderNumber);
  }, [update]);

  const onUpdateAccountID = useCallback((newAccountID) => {
    update('accountID', newAccountID);
  }, [update]);

  const onGetCart = useCallback(() => {
    const totalItems = state.items.reduce((total, item) => total + item.quantity, 0);

    const subTotal = state.items.reduce((total, item) => total + item.quantity * item.priceSale, 0);

    update('subTotal', subTotal);
    update('totalItems', totalItems);
    update('billing', state.activeStep === 1 ? null : state.billing);
    update('discount', state.items.length ? subTotal * .05 : 0);
    update('shipping', state.items.length ? state.shipping : 0);
    update('total', state.subTotal + state.shipping);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state.accountID,
    state.items,
    state.activeStep,
    state.billing,
    state.discount,
    state.shipping,
    state.subTotal,
  ]);

  useEffect(() => {
    const restored = getStorage(STORAGE_KEY);

    if (restored) {
      onGetCart();
    }
  }, [onGetCart]);

  const onAddToCart = useCallback(
    (newItem) => {
      const updatedItems = state.items.map((item) => {
        if (item.id === newItem.id) {
          return {
            ...item,
            quantity: item.quantity + 1,
          };
        }
        return item;
      });

      if (!updatedItems.some((item) => item.id === newItem.id)) {
        updatedItems.push(newItem);
      }

      update('items', updatedItems);
    },
    [update, state.items]
  );

  const onDeleteCart = useCallback(
    (itemId) => {
      const updatedItems = state.items.filter((item) => item.id !== itemId);

      update('items', updatedItems);
    },
    [update, state.items]
  );

  const onBackStep = useCallback(() => {
    update('activeStep', state.activeStep - 1);
  }, [update, state.activeStep]);

  // useEffect(() => {
  //   if (state.activeStep === PRODUCT_CHECKOUT_STEPS.length && state.orderNumber) {
  //     router.push(paths.dashboard.order.details(state.accountID, state.orderNumber));
  //   }
  // }, [state.activeStep, state.orderNumber, state.accountID, router]);

  const onNextStep = useCallback(() => {
    const nextStep = state.activeStep + 1;
    update('activeStep', nextStep);
  }, [update, state.activeStep]);

  const onGotoStep = useCallback(
    (step) => {
      update('activeStep', step);
    },
    [update]
  );

  const onIncreaseQuantity = useCallback(
    (itemId) => {
      const updatedItems = state.items.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            quantity: item.quantity + 1,
          };
        }
        return item;
      });

      update('items', updatedItems);
    },
    [update, state.items]
  );

  const onDecreaseQuantity = useCallback(
    (itemId) => {
      const updatedItems = state.items.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            quantity: item.quantity - 1,
          };
        }
        return item;
      });

      update('items', updatedItems);
    },
    [update, state.items]
  );

  const onCreateBilling = useCallback(
    (address) => {
      update('billing', address);

      onNextStep();
    },
    [onNextStep, update]
  );

  const onApplyDiscount = useCallback(
    (discount) => {
      update('discount', discount);
    },
    [update]
  );

  const onApplyShipping = useCallback(
    (shipping) => {
      update('shipping', shipping);
    },
    [update]
  );

  const completed = state.activeStep === PRODUCT_CHECKOUT_STEPS.length;

  const onReset = useCallback(() => {
    if (completed) {
      reset();
      router.replace(`${paths.dashboard.org.root}/${state.accountID}`);
    }
  }, [completed, reset, router, state.accountID]);

  const memoizedValue = useMemo(
    () => ({
      ...state,
      completed,
      onAddToCart,
      onDeleteCart,
      onIncreaseQuantity,
      onDecreaseQuantity,
      onCreateBilling,
      onApplyDiscount,
      onApplyShipping,
      onBackStep,
      onNextStep,
      onGotoStep,
      onReset,
      onUpdateAccountID,
      onUpdateOrderNumber,
    }),
    [
      completed,
      onAddToCart,
      onApplyDiscount,
      onApplyShipping,
      onBackStep,
      onCreateBilling,
      onDecreaseQuantity,
      onDeleteCart,
      onGotoStep,
      onIncreaseQuantity,
      onNextStep,
      onReset,
      state,
      onUpdateAccountID,
      onUpdateOrderNumber,
    ]
  );

  return <CheckoutContext.Provider value={memoizedValue}>{children}</CheckoutContext.Provider>;
}

CheckoutProvider.propTypes = {
  children: PropTypes.node,
};
