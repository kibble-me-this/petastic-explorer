import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// @mui
import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import Select from '@mui/material/Select';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
// utils
import { fShortenNumber, fCurrency } from 'src/utils/format-number';
// components
import Label from 'src/components/label';
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import { useCheckoutContext } from '../checkout/context';

// ----------------------------------------------------------------------

export default function ProductItem({ product }) {
  const { onAddToCart } = useCheckoutContext();
  const [selectedVariant, setSelectedVariant] = useState('');
  const [coverUrlState, setCoverUrlState] = useState(product.main_image);
  const [titleState, setTitleState] = useState(product.title);
  const [priceState, setPriceState] = useState(product.original_retail_price / 100);
  const [priceSaleState, setPriceSaleState] = useState(product.price / 100);
  const [productIdState, setProductIdState] = useState(product.product_id);
  const [availableValueState, setAvailableValueState] = useState(product?.price);
  const [totalRatings, setTotalRatings] = useState(product.stars);
  const [totalReviews, setTotalReviews] = useState(product.review_count);

  const handleChange = (event) => {
    setSelectedVariant(event.target.value);
    console.log('Selected Variant:', event.target.value);
  };

  const {
    product_id: id,
    brand,
    main_image: originalCoverUrl,
    price: priceSale,
    status: available,
    original_retail_price: price,
    stars,
    review_count,
    all_variants
  } = product;

  const linkTo = paths.product.details(id);

  const handleAddCart = async () => {
    const newProduct = {
      id: productIdState,
      brand,
      originalCoverUrl: coverUrlState,
      available: availableValueState,
      price: priceSaleState,
      quantity: 1,
    };
    try {
      onAddToCart(newProduct);
    } catch (error) {
      console.error(error);
    }
  };

  const renderLabels = (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      sx={{ position: 'absolute', zIndex: 9, top: 16, right: 16 }}
    >
      {!availableValueState && (
        <Label variant="filled" color="error">
          Out of Stock
        </Label>
      )}
    </Stack>
  );

  const renderRating = (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        color: 'text.disabled',
        typography: 'body2',
      }}
    >
      <Rating size="small" value={stars} precision={0.1} readOnly sx={{ mr: 1 }} />
      {`(${fShortenNumber(review_count)} reviews)`}
    </Stack>
  );

  const renderImg = (
    <Box sx={{ position: 'relative', p: 1 }}>
      {availableValueState && (
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

      <Tooltip title={!availableValueState ? 'Out of stock' : ''} placement="bottom-end">
        <Image
          alt={titleState}
          src={coverUrlState}
          ratio="1/1"
          sx={{
            borderRadius: 1.5,
            opacity: !availableValueState ? 0.48 : 1,
            filter: !availableValueState ? 'grayscale(1)' : 'none',
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
        <Typography sx={{ whiteSpace: 'break-spaces' }}>{titleState}</Typography>
        {renderRating}
      </Link>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="column" spacing={0.5} sx={{ typography: 'subtitle1' }}>
          <Stack direction="row" spacing={2.5} alignItems="center" justifyContent="space-between">
            <Box component="span">{fCurrency(priceSaleState)}</Box>
            <Box component="span">
              <Chip
                variant='outlined'
                icon={<img src="/assets/icons/brands/ic_amazon_match.svg" alt="Amazon Icon" />}
                label="Price match"
                sx={{
                  borderRadius: 12,
                  border: '1px solid #F0F0F0',
                  bgcolor: '#F0F0F0',
                }}
              />
            </Box>
          </Stack>
          <Box component="span">
            <Typography variant="caption" sx={{ color: 'text.blue' }}>
              {(3).toFixed(0)}% {'\u24C0'}ibble Cash Back
            </Typography>
          </Box>
        </Stack>
      </Stack>
      {all_variants && all_variants.length > 1 && (
        <Stack direction="column" alignItems="center" spacing={2}>
          <Select value={selectedVariant} onChange={handleChange} sx={{ width: '100%' }}>
            <MenuItem value={selectedVariant}>{selectedVariant}</MenuItem>
            {all_variants.map((variant) => (
              <MenuItem key={variant.product_id} value={variant.product_id}>
                {constructVariantLabel(variant)[1]}
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
  return [variant.product_id, dimensionValues.join(' | ')];
}
