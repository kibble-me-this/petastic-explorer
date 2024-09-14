import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
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
// components
import { ProductItemSkeleton } from './product-skeleton';
import { useCheckoutContext } from '../checkout/context';

// ----------------------------------------------------------------------

export default function ProductItem({ product }) {
  const { onAddToCart } = useCheckoutContext();
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]?.product_id || ''); // Initially set to the first product's variant if available
  const [coverUrlState, setCoverUrlState] = useState(product.main_image);
  const [titleState, setTitleState] = useState(product.title);
  const [priceSaleState, setPriceSaleState] = useState(product.price / 100); // Initially the product's price
  const [productIdState, setProductIdState] = useState(product.product_id);
  const [availableValueState, setAvailableValueState] = useState(product?.price);
  const [totalRatings, setTotalRatings] = useState(product.stars);
  const [totalReviews, setTotalReviews] = useState(product.review_count);
  const [loading, setLoading] = useState(false); // Loading state for variant details
  const [variantSize, setVariantSize] = useState('UNKNOWN'); // Define variantSize state

  // Function to fetch product and variant details from your Lambda endpoint
  const fetchVariantDetails = async (productId) => {
    setLoading(true); // Start loading
    try {
      const response = await axios.post('https://uot4ttu72a.execute-api.us-east-1.amazonaws.com/default/getZincProductDetailsByID', { productIds: [productId] });

      // Parse the response body, since it's a JSON string
      const parsedBody = JSON.parse(response.data.body);

      // Extract the product data
      const productData = parsedBody.products[0];
      return productData;
    } catch (error) {
      console.error('Error fetching variant details:', error);
      return null;
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleChange = async (event) => {
    const variantId = event.target.value;

    // Fetch the variant details from your Lambda endpoint
    const variantDetails = await fetchVariantDetails(variantId);

    if (variantDetails) {
      // Update the item's display with fetched attributes
      setSelectedVariant(variantId);
      setCoverUrlState(variantDetails.main_image || product.main_image); // Update image
      setProductIdState(variantDetails.product_id || variantId);
      setTitleState(variantDetails.title || product.title); // Update title if variant has a different title
      setPriceSaleState(variantDetails.price / 100 || priceSaleState); // Update price once fetched
      setTotalRatings(variantDetails.stars || totalRatings);
      setTotalReviews(variantDetails.review_count || totalReviews);

      // Check if variant_specifics exists before trying to access it
      if (variantDetails.variant_specifics && Array.isArray(variantDetails.variant_specifics)) {
        const foundVariantSize = variantDetails.variant_specifics.find(
          (specific) => specific.dimension.toLowerCase() === 'size'
        );
        setVariantSize(foundVariantSize ? foundVariantSize.value : 'UNKNOWN');
      } else {
        setVariantSize('UNKNOWN');
      }
    }
  };

  const handleAddCart = async () => {
    const newProduct = {
      id: selectedVariant || productIdState, // Use the selected variant's product ID, fallback to productIdState
      brand: product.brand,
      title: titleState, // Add the title to the product object
      originalCoverUrl: coverUrlState, // Use the variant-specific image if available
      available: availableValueState, // Use the variant's availability (price) status
      price: priceSaleState || product.price / 100, // Use the selected variant's price or fallback to the product's price
      quantity: 1, // Default to 1
      size: variantSize || 'UNKNOWN', // Pass the selected variant size to the cart
    };

    try {
      // Add the product (or variant) to the cart via the context function
      onAddToCart(newProduct);
    } catch (error) {
      // Log any error encountered during the process
      console.error('Error adding product to cart:', error);
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
      <Rating size="small" value={totalRatings} precision={0.1} readOnly sx={{ mr: 1 }} />
      {`(${fShortenNumber(totalReviews)} reviews)`}
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
          disabledEffect
          useIntersectionObserver
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
        href={paths.product.details(product.product_id)}
        color="inherit"
        variant="subtitle2"
        noWrap
        sx={{ textDecoration: 'none', color: 'inherit', pointerEvents: 'none', cursor: 'default' }}
      >
        <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
          {product.brand || 'Unknown Brand'}
        </Typography>
        <Typography sx={{ whiteSpace: 'break-spaces' }}>{titleState}</Typography>
        {renderRating}
      </Link>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="column" spacing={0.5} sx={{ typography: 'subtitle1' }}>
          <Stack direction="row" spacing={2.5} alignItems="center" justifyContent="space-between">
            <Box component="span">
              {fCurrency(priceSaleState)} {/* Show the price */}
            </Box>
            <Box component="span">
              <Chip
                variant="outlined"
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
      {/* Show dropdown only if the product has more than 1 variant */}
      {product.variants && product.variants.length > 1 && (
        <Stack direction="column" alignItems="center" spacing={2}>
          <Select
            value={selectedVariant}
            onChange={handleChange}
            sx={{ width: '100%' }}
          >
            {product.variants.map((variant) => (
              <MenuItem key={variant.product_id} value={variant.product_id}>
                {variant.variant_specifics
                  ?.map((specific) => specific.value.toUpperCase()) // Convert each attribute to uppercase
                  .join(' / ') || 'UNKNOWN VARIANT'}
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
      {loading ? (
        <ProductItemSkeleton /> // Skeleton is shown when loading
      ) : (
        <>
          {renderLabels}
          {renderImg}
          {renderContent}
        </>
      )}
    </Card>
  );
}

ProductItem.propTypes = {
  product: PropTypes.object,
};
