import React, { useState, useEffect } from 'react';

import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Badge from '@mui/material/Chip';

// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// utils
import { fDate } from 'src/utils/format-time';
import { fShortenNumber, fCurrency, fData } from 'src/utils/format-number';
// components
import Label from 'src/components/label';
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import TextMaxLine from 'src/components/text-max-line';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import { outlineButton } from 'src/theme/css';
import { Typography } from '@mui/material';

import { useCheckoutContext } from '../checkout/context';


// ---------------------------------------------------------------------

export default function PetFoodCard({ post }) {
  const { onAddToCart } = useCheckoutContext();

  const popover = usePopover();

  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const {
    title,
    author,
    publish,
    coverUrl,
    createdAt,
    totalViews,
    totalShares,
    totalComments,
    description,
  } = post;

  const [coverUrlState, setCoverUrlState] = useState(''); // Renamed to avoid conflict
  const [titleState, setTitleState] = useState(''); // State for title
  const [priceState, setPriceState] = useState(''); // State for price
  const [priceSaleState, setPriceSaleState] = useState('');
  const [productIdState, setProductIdState] = useState('B0BMDXNDD2'); // State for product_id

  useEffect(() => {
    // Move the setCoverUrlState call inside useEffect to run only once after component mount
    setCoverUrlState(coverUrl);
    setPriceSaleState(totalViews);
  }, [coverUrl, totalViews]);

  const handleAddCart = async () => {
    const newProduct = {
      id: productIdState, // Save productIdState as id
      titleState,
      coverUrlState,
      // available,
      price: priceSaleState,
      // size: selectedSize,
      quantity: 1,
    };
    try {
      onAddToCart(newProduct);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Stack
        component={Card}
        direction="column"
        sx={{
          marginTop: 1, // Add margin on top (adjust the value as needed)
        }}
      >
        <Stack direction="row">
          {' '}
          <Box
            sx={{
              // width: 180,
              height: 135,
              position: 'relative',
              flexShrink: 0,
              p: 2,
            }}
          >
            <Image alt={title} src={coverUrl} sx={{ height: 1, borderRadius: 1 }} />
          </Box>
          <Stack
            sx={{
              p: (theme) => theme.spacing(2, 2, 1, 1),
              flexGrow: 1, // Allow the text stack to grow to fill available space
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#00A76F',
                    borderRadius: '4px',
                    justifyContent: 'center',
                    marginRight: '4px', // Add margin to separate the elements
                    mb: 0.5,
                  }}
                >
                  <Typography
                    variant="chat_caption"
                    sx={{
                      color: 'white',
                      fontSize: '9px',
                      fontWeight: 'normal',
                      px: 0.8,
                      py: 0.2,
                    }}
                  >
                    {fData(publish)}
                  </Typography>
                </Box>

                <Typography
                  variant="chat_caption"
                  sx={{
                    color: '#00A76F',
                    fontSize: '9px',
                    fontWeight: 'normal',
                    pb: 0.3,
                  }}
                >
                  Breed Score
                </Typography>
              </Box>

              <Box
                component="span"
                sx={{ typography: 'caption', color: 'text.red', fontSize: '10px' }}
              >
                {fDate(createdAt)}
              </Box>
            </Stack>

            <Stack spacing={0.5}>
              {/* <Link
                color="inherit"
                component={RouterLink}
                href={paths.dashboard.post.details(title)}
                sx={{ fontSize: '10px' }}
              > */}
              <TextMaxLine variant="chat_body" line={2}>
                {title}
              </TextMaxLine>
              {/* </Link> */}
              <TextMaxLine variant="chat_author" sx={{ color: '#808080', fontWeight: '400' }}>
                by {description}
              </TextMaxLine>{' '}
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <TextMaxLine variant="chat_author" sx={{ color: '#000', fontWeight: '400' }}>
                  {fCurrency(totalViews)}
                </TextMaxLine>
                <TextMaxLine variant="chat_author" sx={{ color: '#808080', fontWeight: '400' }}>
                  /mo
                </TextMaxLine>
              </Box>
            </Stack>
            {/** 
            <Stack direction="row" alignItems="center">
              <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
                <Iconify icon="eva:more-horizontal-fill" />
              </IconButton>

              <Stack
                spacing={1.5}
                direction="row"
                justifyContent="flex-end"
                sx={{
                  typography: 'caption',
                  color: 'text.disabled',
                  fontSize: '10px',
                }}
              >
                <Stack direction="row" alignItems="center">
                  <Iconify icon="eva:message-circle-fill" width={16} sx={{ mr: 0.5 }} />
                  {fShortenNumber(totalComments)}
                </Stack>

                <Stack direction="row" alignItems="center">
                  <Iconify icon="solar:eye-bold" width={16} sx={{ mr: 0.5 }} />
                  {fShortenNumber(totalViews)}
                </Stack>

                <Stack direction="row" alignItems="center">
                  <Iconify icon="solar:share-bold" width={16} sx={{ mr: 0.5 }} />
                  {fShortenNumber(totalShares)}
                </Stack>
              </Stack>
            </Stack>
            */}
          </Stack>
        </Stack>
        <Button
          size="small"
          color="inherit"
          variant="outlined"
          // target="_blank"
          // rel="noopener"
          // href={paths.petsSignUp}
          onClick={handleAddCart}
          // endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={18} sx={{ ml: -0.5 }} />}
          sx={{
            borderColor: 'red', // Change to your desired color
            mx: 2,
            mb: 2,
          }}
        >
          Add to Cart
        </Button>
      </Stack>


    </>
  );
}

PetFoodCard.propTypes = {
  post: PropTypes.shape({
    author: PropTypes.object,
    coverUrl: PropTypes.string,
    createdAt: PropTypes.instanceOf(Date),
    description: PropTypes.string,
    publish: PropTypes.string,
    title: PropTypes.string,
    totalComments: PropTypes.number,
    totalShares: PropTypes.number,
    totalViews: PropTypes.number,
  }),
};
