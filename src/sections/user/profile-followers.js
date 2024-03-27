import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';
// @mui
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';

// utils
import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

// api
import { useGetFosters } from 'src/api/fosters';
// routes
import { paths } from 'src/routes/paths';
// components
import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';
import Iconify from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';

import CustomPopover, { usePopover } from 'src/components/custom-popover';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { AddressNewFormFoster } from 'src/sections/address';





// ----------------------------------------------------------------------

export default function ProfileFollowers({ followers, account_id }) {
  const settings = useSettingsContext();

  const addressForm = useBoolean();

  const { fosters, isLoading, isEmpty } = useGetFosters(account_id);

  const _mockFollowed = followers.slice(4, 8).map((i) => i.id);

  const [followed, setFollowed] = useState(_mockFollowed);

  const handleClick = useCallback(
    (item) => {
      const selected = followed.includes(item)
        ? followed.filter((value) => value !== item)
        : [...followed, item];

      setFollowed(selected);
    },
    [followed]
  );

  const renderNotFound = <EmptyContent filled title="No Fosters" sx={{ py: 10 }} />;

  return (
    <>
      <Container
        maxWidth={settings.themeStretch ? false : 'lg'}
        sx={{
          mb: 15,
        }}
      >
        <CustomBreadcrumbs
          heading="Fosters"
          links={[
            {},
          ]}
          action={
            <Button
              // disabled
              // component={RouterLink}
              // href={paths.dashboard.user.new}
              // variant="contained"
              // startIcon={<Iconify icon="mingcute:add-line" />}
              size="small"
              color="primary"
              onClick={addressForm.onTrue}
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Foster
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        {/* {(notFound || productsEmpty) && renderNotFound} */}
        {isEmpty && renderNotFound}
        <Box
          gap={3}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          }}
        >
          {fosters.map((follower) => (
            <FollowerItem
              key={follower.id}
              follower={follower}
              selected={followed.includes(follower.id)}
              onSelected={() => handleClick(follower.id)}
            />
          ))}
        </Box>
        <AddressNewFormFoster
          account_id={account_id}
          open={addressForm.value}
          onClose={addressForm.onFalse}
        // onCreate={checkout.onCreateBilling}
        />
      </Container>
    </>
  );
}

ProfileFollowers.propTypes = {
  followers: PropTypes.array,
  account_id: PropTypes.string,
};

// ----------------------------------------------------------------------

function FollowerItem({ follower, selected, onSelected }) {
  const popover = usePopover();

  const { id, name, country, avatarUrl, addressType, city, state, fullAddress, phoneNumber } = follower;

  return (
    <>
      <Card
      // sx={{
      //   display: 'flex',
      //   alignItems: 'center',
      //   p: (theme) => theme.spacing(3, 2, 3, 3),
      // }}
      >
        <IconButton onClick={popover.onOpen} sx={{ position: 'absolute', top: 8, right: 8 }}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>

        <Stack sx={{ p: 3, pb: 2 }}>
          <Avatar
            // alt={company.name}
            // src={company.logo}
            variant="rounded"
            sx={{ width: 48, height: 48, mb: 2 }}
          />

          <ListItemText
            sx={{ mb: 1 }}
            primary={
              // <Link component={RouterLink} href={paths.dashboard.job.details(id)} color="inherit">
              //   {name}
              // </Link>
              name

            }

            secondary={
              <>
                <Iconify icon="mingcute:location-fill" width={16} sx={{ flexShrink: 0, mr: 0.5 }} />
                {city}, {state}
              </>
            }
            primaryTypographyProps={{
              typography: 'subtitle1',
            }}
            secondaryTypographyProps={{
              mt: 1,
              component: 'span',
              typography: 'caption',
              color: 'text.disabled',
            }}
          />

          <Stack
            spacing={0.5}
            direction="row"
            alignItems="center"
            sx={{ color: 'primary.main', typography: 'caption' }}
          >
            <Iconify width={16} icon="solar:users-group-rounded-bold" />
            X Pets
          </Stack>
        </Stack>

        {/* <Divider sx={{ borderStyle: 'dashed' }} />
        <Box rowGap={1.5} display="grid" gridTemplateColumns="repeat(2, 1fr)" sx={{ p: 3 }}>
          {[
            {
              label: "hi", // experience,
              icon: <Iconify width={16} icon="carbon:skill-level-basic" sx={{ flexShrink: 0 }} />,
            },
            {
              label: "hi", // employmentTypes.join(', '),
              icon: <Iconify width={16} icon="solar:clock-circle-bold" sx={{ flexShrink: 0 }} />,
            },
            {
              label: "hi", // salary.negotiable ? 'Negotiable' : fCurrency(salary.price),
              icon: <Iconify width={16} icon="solar:wad-of-money-bold" sx={{ flexShrink: 0 }} />,
            },
            {
              label: "hi", // role,
              icon: <Iconify width={16} icon="solar:user-rounded-bold" sx={{ flexShrink: 0 }} />,
            },
          ].map((item) => (
            <Stack
              key={item.label}
              spacing={0.5}
              flexShrink={0}
              direction="row"
              alignItems="center"
              sx={{ color: 'text.disabled', minWidth: 0 }}
            >
              {item.icon}
              <Typography variant="caption" noWrap>
                {item.label}
              </Typography>
            </Stack>
          ))}
        </Box> */}

        {/* <Avatar alt={name} src={avatarUrl} sx={{ width: 48, height: 48, mr: 2 }} /> */}

        {/* <ListItemText
        primary={name}
        secondary={
          <>
            <Iconify icon="mingcute:location-fill" width={16} sx={{ flexShrink: 0, mr: 0.5 }} />
            {country}
          </>
        }
        primaryTypographyProps={{
          noWrap: true,
          typography: 'subtitle2',
        }}
        secondaryTypographyProps={{
          mt: 0.5,
          noWrap: true,
          display: 'flex',
          component: 'span',
          alignItems: 'center',
          typography: 'caption',
          color: 'text.disabled',
        }}
      /> */}

        {/* <Button
        size="small"
        variant={selected ? 'text' : 'outlined'}
        color={selected ? 'success' : 'inherit'}
        startIcon={
          selected ? <Iconify width={18} icon="eva:checkmark-fill" sx={{ mr: -0.75 }} /> : null
        }
        onClick={onSelected}
        sx={{ flexShrink: 0, ml: 1.5 }}
      >
        {selected ? 'Active' : 'Available'}
      </Button> */}
      </Card>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          disabled
          onClick={() => {
            popover.onClose();
            // onView();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          View
        </MenuItem>

        <MenuItem
          disabled
          onClick={() => {
            popover.onClose();
            // onEdit();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

        <MenuItem
          disabled
          onClick={() => {
            popover.onClose();
            // onDelete();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>
    </>
  );
}

FollowerItem.propTypes = {
  follower: PropTypes.object,
  onSelected: PropTypes.func,
  selected: PropTypes.bool,
};
