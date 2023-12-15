import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
import { alpha, useTheme, styled } from '@mui/material/styles';
import {
  Box,
  Card,
  Typography,
  Stack,
  Button,
  Switch,
  Avatar,
  ListItemText,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  IconButton,
  Grid,
  FormControlLabel,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

// utils
import { fShortenNumber } from 'src/utils/format-number';
import { bgBlur } from 'src/theme/css';

// _mock
import { _socials } from 'src/_mock';
// assets
import { AvatarShape } from 'src/assets/illustrations';
// components
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import FormProvider, {
  RHFSwitch,
  RHFTextField,
  // RHFUploadAvatar,
  // RHFAutocomplete,
} from 'src/components/hook-form';
import generateVersion5UUID from '../../utils/uuidv5';

import { handlePetAdoption, sendEmail } from './petastic-api';

// ----------------------------------------------------------------------

const StyledCard = styled(Card)(({ theme }) => ({
  ...bgBlur({ color: '#FFFFFF' }),
  position: 'relative',
  width: '100%',
  height: '100%',
  transformStyle: 'preserve-3d',
  transition: 'transform 0.6s',
  boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.2)',
  '&.flipped': {
    transform: 'rotateY(180deg)',
  },
}));

export default function PetCard({ user, filteredAndSortedPets, updateFilteredAndSortedPets }) {
  const popover = usePopover();

  const theme = useTheme();

  const {
    name,
    pet_passport_id,
    avatar_file_name,
    breed,
    gender,
    status,
    shelter_name_common,
    age,
  } = user;

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  return (
    <>
      <StyledCard sx={{ textAlign: 'center' }}>
        <Box sx={{ position: 'relative' }}>
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <Label
              onClick={popover.onOpen}
              color={(status === 'adoptable' && 'info') || 'success'}
              endIcon={<Iconify icon="eva:more-vertical-fill" sx={{ height: '10px' }} />}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                position: 'absolute',
                top: '16px',
                zIndex: 9,
                ml: 2,
              }}
            >
              {status}
            </Label>
          </Box>

          <Image src={avatar_file_name} alt={avatar_file_name} ratio="1/1" />
        </Box>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mt: 2, mb: 1.5 }}
        >
          <ListItemText
            primary={name}
            secondary={breed}
            primaryTypographyProps={{
              typography: 'chat_body',
              textAlign: 'left',
              color: '#345BFF',
              fontWeight: '800',
            }}
            secondaryTypographyProps={{
              typography: 'chat_author',
              component: 'span',
              textAlign: 'left',
              fontWeight: '400',
            }}
            sx={{ ml: 2 }}
          />{' '}
          {/* Empty spacer */}
          <div style={{ flex: 1 }} />
          <Image src="/assets/images/avatars/near.svg" sx={{ mr: 2.5, mb: 2.5 }} />
        </Stack>

        <Box
          display="grid"
          gridTemplateColumns="repeat(3, 1fr)"
          sx={{ py: 3, typography: 'subtitle1' }}
        >
          <div>
            <Typography variant="chat_caption" component="div" sx={{ mb: 0.5, color: '#808080' }}>
              GENDER
            </Typography>
            <Typography
              variant="chat_author"
              component="div"
              sx={{ mb: 0.5, color: 'black', fontWeight: '600' }}
            >
              {gender}
            </Typography>
          </div>

          <div>
            <Typography variant="chat_caption" component="div" sx={{ mb: 0.5, color: '#808080' }}>
              LIFE STAGE
            </Typography>

            <Typography
              variant="chat_author"
              component="div"
              sx={{ mb: 0.5, color: 'black', fontWeight: '600' }}
            >
              {age.life_stage}
            </Typography>
          </div>

          <div>
            <Typography variant="chat_caption" component="div" sx={{ mb: 0.5, color: '#808080' }}>
              WEIGHT{' '}
            </Typography>
            <Typography
              variant="chat_author"
              component="div"
              sx={{ mb: 0.5, color: 'black', fontWeight: '600' }}
            >
              {fShortenNumber(status)}
            </Typography>
          </div>
        </Box>
      </StyledCard>
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="bottom-center"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
            // router.push(paths.dashboard.post.details(title));
            setIsConfirmDialogOpen(true);
          }}
        >
          <Iconify icon="solar:eye-bold" />
          Transfer
        </MenuItem>

        <MenuItem
          disabled
          onClick={() => {
            popover.onClose();
            setIsEditDialogOpen(true);
            // router.push(paths.dashboard.post.edit(title));
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

        <MenuItem
          disabled
          onClick={() => {
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Lock
        </MenuItem>
      </CustomPopover>

      {/* Render the ConfirmTransferDialog here */}
      <ConfirmTransferDialog
        open={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        pet={user}
        // pet_owner_id={pet_owner_id} // Pass pet_owner_id
        // pet_passport_id={pet_passport_id} // Pass pet_passport_id
        new_status="adoptable"
        // callback={updatePetStatusCallback} // Pass the callback function as a prop
        filteredAndSortedPets={filteredAndSortedPets}
        updateFilteredAndSortedPets={updateFilteredAndSortedPets}
      />
    </>
  );
}

PetCard.propTypes = {
  user: PropTypes.object,
  filteredAndSortedPets: PropTypes.array,
  updateFilteredAndSortedPets: PropTypes.func,
};

// ConfirmTransferDialog component
function ConfirmTransferDialog({
  open,
  onClose,
  pet,
  // _pet_owner_id,
  // _pet_passport_id,
  // new_status,
  // callback,
  filteredAndSortedPets,
  updateFilteredAndSortedPets,
}) {
  const [page, setPage] = useState(1);

  // const mockPetData = {
  //   pet_passport_id: '12345', // Replace with a unique ID
  //   metadata: {
  //     title: 'Fluffy',
  //     description:
  //       '{"species": "Dog", "gender": "Male", "breed": "Golden Retriever", "life-stage": "Adult"}',
  //     media: ['image1.jpg', 'image2.jpg'],
  //   },
  //   pet_owner_id: '6789', // Replace with the owner's ID
  //   status: 'Available',
  // };

  // Destructure pet data
  const { name, pet_passport_id, current_owner_description, type, breed } = pet;

  // const { pet_passport_id, metadata, pet_owner_id, status } = pet; // mockPetData; // pet;
  // const { title, description, media } = metadata;
  // const { species, gender, breed, 'life-stage': lifeStage } = JSON.parse(description);
  // const userID = user.publicAddress;

  const NewUserSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    phoneNumber: Yup.string().required('Phone number is required'),
    zipCode: Yup.string().required('Zip code is required'),
    // not required
    trial: Yup.string(),
    fallback: Yup.boolean(),
  });

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    // defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      console.log('data : ', data);

      // Prepare the request data including the new owner info
      const currentAccountId = current_owner_description.owner_id;
      // const newOwnerAccountId = generateVersion5UUID(data.email);
      const newOwnerInfo = {
        account_type: null,
        owner_id: null, // newOwnerAccountId,
        issuer: null,
        trial_period: data.trial,
        public_address: null,
        wallet_type: 'magic',
        location_zip: data.zipCode,
        email: data.email,
        phone_number: data.phoneNumber,
      };

      console.log('handlePetAdoption pet_passport_id: ', pet_passport_id);

      // Make the API request to handle pet adoption
      const handlePetAdoptionResponse = await handlePetAdoption(
        pet_passport_id,
        currentAccountId,
        newOwnerInfo
      );

      if (handlePetAdoptionResponse.success) {
        // If the pet adoption is successful, update the pet status locally
        const updatedPets = filteredAndSortedPets.map((p) =>
          p.pet_passport_id === pet.pet_passport_id
            ? { ...p, status: 'adopted' } // Update the status for the transferred pet
            : p
        );

        // Send email using sendEmail function (replace with your service and template details)
        const conversationId = 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4'; // WIP call helper function to create conversationId
        const petPassport = pet_passport_id;
        const userEmail = data.email;
        const emailResponse = await sendEmail(
          userEmail,
          conversationId,
          petPassport
          // newOwnerAccountId
        );

        if (!emailResponse.success) {
          // Handle email sending error here
          console.error('Email sending error:', emailResponse.message);
          return;
        }

        // Call the callback function to update filteredAndSortedPets
        updateFilteredAndSortedPets(updatedPets);

        // Close the dialog
        onClose();
      } else {
        // Handle pet adoption failure
        console.error('Pet adoption failed:', handlePetAdoptionResponse.message);
      }
    } catch (error) {
      // Handle any other errors here
      console.error('An error occurred:', error);
    }
  });

  return (
    <Dialog open={open} fullWidth maxWidth="xs" onClose={onClose}>
      <DialogTitle>
        {(() => {
          switch (page) {
            case 1:
              return 'Transfer guardianship';
            case 2:
              return 'Review';
            default:
              return 'All Done';
          }
        })()}
      </DialogTitle>
      {page === 1 && (
        <Stack spacing={2}>
          <DialogContent sx={{ overflow: 'unset' }}>
            <Stack direction="column" spacing={2} sx={{ mb: 3 }}>
              <Typography style={{ fontWeight: 'bold' }}>I want to transfer:</Typography>
              <ListItemText
                primary={`${name} the ${type.split(':').pop()}`}
                secondary={` an ${breed}`}
                secondaryTypographyProps={{ component: 'span', mt: 0.5 }}
                sx={{ paddingLeft: '16px' }}
              />
            </Stack>
            <Stack spacing={3}>
              <Typography style={{ fontWeight: 'bold' }}>To the following human: </Typography>
              <FormProvider methods={methods} onSubmit={onSubmit}>
                <Stack spacing={3}>
                  <RHFTextField name="email" label="Email Address" />
                  <RHFTextField name="phoneNumber" label="Phone Number" />
                  <RHFTextField name="zipCode" label="Zip/Code" />
                  <RHFSwitch
                    name="trial"
                    labelPlacement="start"
                    label={
                      <>
                        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                          Trial Period
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Enabling this feature will make the transfer of {name}`&apos;`s
                          guardianship temporary for 30 days.
                        </Typography>
                      </>
                    }
                    sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
                  />
                  <RHFSwitch
                    name="fallback"
                    labelPlacement="start"
                    label={
                      <>
                        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                          Fallback Transfer
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Remain as the fallback guardian in case the new guardian is unable to care
                          for {name}.
                        </Typography>
                      </>
                    }
                    sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
                  />
                  <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                    <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                      Confirm Transfer
                    </LoadingButton>
                  </Stack>
                </Stack>
              </FormProvider>
            </Stack>
          </DialogContent>
        </Stack>
      )}
      <DialogActions>{page === 3 && <Button onClick={onClose}>Close</Button>}</DialogActions>
    </Dialog>
  );
}

ConfirmTransferDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  pet: PropTypes.object,
  filteredAndSortedPets: PropTypes.array,
  updateFilteredAndSortedPets: PropTypes.func,
};
