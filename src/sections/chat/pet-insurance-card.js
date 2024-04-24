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
import Divider from '@mui/material/Divider';

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

export default function PetInsuranceCard({ post }) {
  const { onAddToCart } = useCheckoutContext();

  const popover = usePopover();

  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const {
    petName,
    premium,
    petCoverUrl,
    author,
    publish,
    createdAt,
    totalShares,
    totalComments,
    description,
  } = post;

  // const [coverUrlState, setCoverUrlState] = useState(''); // Renamed to avoid conflict
  const [titleState, setTitleState] = useState('Rainwalk Insurance'); // State for title
  const [priceState, setPriceState] = useState(''); // State for price
  // const [priceSaleState, setPriceSaleState] = useState('');
  const [productIdState, setProductIdState] = useState('rainwalk'); // State for product_id

  const [brand, setProductBrand] = useState('Rainwalk Insurance');
  const [originalCoverUrl, setOriginalCoverUrl] = useState(''); // Renamed to avoid conflict
  const [priceSale, setPriceSale] = useState('');




  useEffect(() => {
    // Move the setCoverUrlState call inside useEffect to run only once after component mount
    setOriginalCoverUrl(petCoverUrl);
    setPriceSale(premium * 100);
  }, [petCoverUrl, premium]);

  const handleAddCart = async () => {
    const newProduct = {
      id: productIdState, // Save productIdState as id
      brand,
      originalCoverUrl,
      // available,
      priceSale,      // size: selectedSize,
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
          marginTop: 1,
          minWidth: 150
        }}
      >
        <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
          {' '}
          <Box
            sx={{
              width: 108, // Set width to 108px
              height: 108,
              position: 'relative',
              flexShrink: 0,

              m: 2,
              background: 'gray',
              borderRadius: 2,
            }}
          >
            <Image
              alt={petName}
              src={petCoverUrl}
              sx={{
                width: '100%', // Ensure the image fills its container
                height: '100%', // Ensure the image fills its container
                borderRadius: 2
              }}
            />          </Box>
          <Stack
            sx={{
              p: (theme) => theme.spacing(2, 2, 1, 1),
              flexGrow: 1,
            }}
          >


            <Stack spacing={0.5}>

              <TextMaxLine variant="chat_body" line={2} sx={{ fontWeight: 'bold' }}>
                {petName}&lsquo;s Insurance
              </TextMaxLine>
              <TextMaxLine variant="chat_author" sx={{ color: '#808080', fontWeight: '400' }}>
                by Rainwalk
              </TextMaxLine>{' '}
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <TextMaxLine variant="chat_author" sx={{ color: '#000', fontWeight: '400' }}>
                  {fCurrency(premium)}
                </TextMaxLine>
                <TextMaxLine variant="chat_author" sx={{ color: '#808080', fontWeight: '400' }}>
                  /mo
                </TextMaxLine>
              </Box>
            </Stack>



          </Stack>
        </Stack>
        <Box
          sx={{
            backgroundColor: '#F0F0F0',
            borderRadius: 2,
            p: 2,
            mx: 2,
            mb: 2,
          }}
        >
          {/* Stack of horizontal rows */}
          <Stack direction="column" spacing={1}>
            {/* Row 1 */}
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="chat_author">Start Date</Typography>
              <Typography variant="chat_body">04/01/24</Typography>
            </Stack>
            {/* Row 2 */}
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="chat_author">Term</Typography>
              <Typography variant="chat_body">Monthly</Typography>
            </Stack>
            {/* Row 3 */}
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="chat_author">Deductable</Typography>
              <Typography variant="chat_body">$500</Typography>
            </Stack>
            {/* Row 4 */}
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="chat_author">Annual Limit</Typography>
              <Typography variant="chat_body">$10,000</Typography>
            </Stack>
            {/* Row 5 */}
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="chat_author">Co-insurance</Typography>
              <Typography variant="chat_body">90%</Typography>
            </Stack>
            {/* Row 6 */}
            <Divider
              orientation='horizontal'
              flexItem
              sx={{ borderStyle: 'bold' }}
            />
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="chat_author">24/7 Online Vet</Typography>
              <Typography variant="chat_body">INCLUDED</Typography>
            </Stack>
          </Stack>

        </Box >

        <Button
          size="small"
          color="inherit"
          variant="outlined"
          // target="_blank"
          // rel="noopener"
          // href={paths.petsSignUp}
          onClick={handleAddCart}
          // endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={18} sx={{ ml: -0.5 }} />}
          sx={[outlineButton, { m: 2 }]}

        >
          Transfer Insurance
        </Button>
      </Stack >


    </>
  );
}

PetInsuranceCard.propTypes = {
  post: PropTypes.shape({
    author: PropTypes.object,
    petCoverUrl: PropTypes.string,
    createdAt: PropTypes.instanceOf(Date),
    description: PropTypes.string,
    publish: PropTypes.string,
    petName: PropTypes.string,
    totalComments: PropTypes.number,
    totalShares: PropTypes.number,
    premium: PropTypes.number,
  }),
};
