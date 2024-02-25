import React, { useState, useEffect } from 'react';

import PropTypes from 'prop-types';
// @mui
import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import { formHelperTextClasses } from '@mui/material/FormHelperText';
import Select from '@mui/material/Select';

// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
// utils
import { fCurrency } from 'src/utils/format-number';
// components
import Label from 'src/components/label';
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import { ColorPreview } from 'src/components/color-utils';
import FormProvider, { RHFSelect } from 'src/components/hook-form';

//
import { useCheckoutContext } from '../checkout/context';

// ----------------------------------------------------------------------

export default function ProductItem({ product }) {
  const { onAddToCart } = useCheckoutContext();
  const [selectedSize, setSelectedSize] = useState(null);

  const [selectedVariant, setSelectedVariant] = useState('');

  useEffect(() => {
    const initialVariant = constructVariantLabel(product); // Change this to whatever initial value you want
    setSelectedVariant(initialVariant);
  }, [product]);

  const handleVariantChange = (event) => {
    setSelectedVariant(event.target.value);
  };

  const {
    product_id: id,
    brand,
    title,
    name,
    main_image: coverUrl,
    price,
    colors,
    status: available,
    original_retail_price: priceSale,
    newLabel,
    saleLabel,
  } = product;

  const formattedPrice = price / 100;
  const formattedPriceSale = priceSale ? priceSale / 100 : null;

  const linkTo = paths.product.details(id);

  const handleAddCart = async () => {
    const newProduct = {
      id,
      name,
      coverUrl,
      available,
      price: formattedPrice,
      size: selectedSize,
      // colors: [colors[0]],
      // size: sizes[0],
      quantity: 1,
    };
    try {
      onAddToCart(newProduct);
    } catch (error) {
      console.error(error);
    }
  };

  // const renderLabels = (newLabel.enabled || saleLabel.enabled) && (
  //   <Stack
  //     direction="row"
  //     alignItems="center"
  //     spacing={1}
  //     sx={{ position: 'absolute', zIndex: 9, top: 16, right: 16 }}
  //   >
  //     {newLabel.enabled && (
  //       <Label variant="filled" color="info">
  //         {newLabel.content}
  //       </Label>
  //     )}
  //     {saleLabel.enabled && (
  //       <Label variant="filled" color="error">
  //         {saleLabel.content}
  //       </Label>
  //     )}
  //   </Stack>
  // );

  const renderLabels = (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      sx={{ position: 'absolute', zIndex: 9, top: 16, right: 16 }}
    >
      {/* <Label variant="filled" color="info">
        hello{' '}
      </Label> */}
      {priceSale && (
        <Label variant="filled" color="error">
          {(((formattedPriceSale - formattedPrice) / formattedPriceSale) * 100).toFixed(0)}% Off
        </Label>
      )}
    </Stack>
  );

  const renderImg = (
    <Box sx={{ position: 'relative', p: 1 }}>
      {!!available && (
        <Fab
          color="warning"
          size="medium"
          className="add-cart-btn"
          onClick={handleAddCart}
          sx={{
            right: 16,
            bottom: 16,
            zIndex: 9,
            opacity: 0,
            position: 'absolute',
            transition: (theme) =>
              theme.transitions.create('all', {
                easing: theme.transitions.easing.easeInOut,
                duration: theme.transitions.duration.shorter,
              }),
          }}
        >
          <Iconify icon="solar:cart-plus-bold" width={24} />
        </Fab>
      )}

      <Tooltip title={!available && 'Out of stock'} placement="bottom-end">
        <Image
          alt={name}
          src={coverUrl}
          ratio="1/1"
          sx={{
            borderRadius: 1.5,
            ...(!available && {
              opacity: 0.48,
              filter: 'grayscale(1)',
            }),
          }}
        />
      </Tooltip>
    </Box>
  );

  const renderContent = (
    <Stack spacing={2.5} sx={{ p: 3, pt: 2 }}>
      <Link
        component={RouterLink}
        href={linkTo}
        color="inherit"
        variant="subtitle2"
        noWrap
        sx={{ textDecoration: 'none', color: 'inherit', pointerEvents: 'none', cursor: 'default' }}
      >
        {brand}
        <Typography sx={{ whiteSpace: 'break-spaces' }}>{title}</Typography>
      </Link>

      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" spacing={0.5} sx={{ typography: 'subtitle1' }}>
          {priceSale && (
            <Box component="span" sx={{ color: 'text.disabled', textDecoration: 'line-through' }}>
              {fCurrency(formattedPriceSale)}
            </Box>
          )}

          <Box component="span">{fCurrency(formattedPrice)}</Box>
        </Stack>
      </Stack>

      {product.all_variants.length > 1 && (
        <Stack direction="column" alignItems="center" spacing={2}>
          <Select value={selectedVariant} onChange={handleVariantChange} sx={{ width: '100%' }}>
            <MenuItem value={selectedVariant}>{selectedVariant}</MenuItem>
            {product.all_variants.map((variant) => (
              <MenuItem key={variant.product_id} value={constructVariantLabel(variant)}>
                {constructVariantLabel(variant)}
              </MenuItem>
            ))}
          </Select>
        </Stack>
      )}
    </Stack>
  );

  return (
    <Card
      sx={{
        '&:hover .add-cart-btn': {
          opacity: 1,
        },
      }}
    >
      {renderLabels}

      {renderImg}

      {renderContent}
    </Card>
  );
}

ProductItem.propTypes = {
  product: PropTypes.object,
};

function constructVariantLabel(variant) {
  const dimensionValues = variant.variant_specifics.map((spec) => spec.value);
  return `${dimensionValues.join(' | ')}`;
}
