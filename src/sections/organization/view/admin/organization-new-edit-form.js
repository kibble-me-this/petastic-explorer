import PropTypes from 'prop-types';
import { useState, useEffect, useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form'; // Import useFieldArray for dynamic fields
import { yupResolver } from '@hookform/resolvers/yup';
import debounce from 'lodash/debounce';
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { CircularProgress, TextField, InputAdornment, Button, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Alert } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import * as Yup from 'yup';
// Components
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider from 'src/components/hook-form';

export default function ShelterForm({ currentJob }) {
    const { enqueueSnackbar } = useSnackbar();

    const [shelterResults, setShelterResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedShelter, setSelectedShelter] = useState(null);
    const [customShelter, setCustomShelter] = useState('');
    const [isCustomShelter, setIsCustomShelter] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [accountId, setAccountId] = useState(''); // State to store the account_id

    // Schema for validation using Yup
    const ShelterFormSchema = Yup.object().shape({
        shelterName: Yup.string().required('Organization name is required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        city: Yup.string().required('City is required'),
        state: Yup.string().required('State is required'),
        affiliatedEmails: Yup.array()
            .of(
                Yup.object().shape({
                    email: Yup.string().email('Invalid email').required('Email is required'),
                })
            )
            .min(1, 'At least one email is required'),
    });

    const defaultValues = useMemo(
        () => ({
            Name: selectedShelter?.name || '',
            email: '',
            city: '',
            state: '',
            affiliatedEmails: [{ email: '' }],
        }),
        [selectedShelter]
    );

    const methods = useForm({
        resolver: yupResolver(ShelterFormSchema),
        defaultValues,
    });

    const { reset, handleSubmit, formState: { isSubmitting, errors }, register, control } = methods;

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'affiliatedEmails',
    });

    useEffect(() => {
        if (selectedShelter) {
            reset(defaultValues);
        }
    }, [selectedShelter, defaultValues, reset]);

    const fetchShelters = useMemo(
        () =>
            debounce(async (partialName) => {
                if (!partialName) return;
                setLoading(true);
                try {
                    const response = await fetch(`https://uot4ttu72a.execute-api.us-east-1.amazonaws.com/default/getSheltersByPartialName?partialName=${partialName}`);
                    const data = await response.json();
                    setShelterResults(Array.isArray(data) ? data : []);
                    setIsCustomShelter(false);
                } catch (error) {
                    enqueueSnackbar('Failed to fetch shelters', { variant: 'error' });
                    setShelterResults([]);
                } finally {
                    setLoading(false);
                }
            }, 500),
        [enqueueSnackbar]
    );

    const onInputChange = (event, newValue) => {
        setCustomShelter(newValue);

        if (newValue) {
            fetchShelters(newValue);
        }

        if (!shelterResults.some((shelter) => shelter.name === newValue)) {
            setIsCustomShelter(true);
        } else {
            setIsCustomShelter(false);
        }
    };

    const onSubmit = handleSubmit(async (data) => {
        try {
            console.log('Submitting form with data:', data);
            enqueueSnackbar('Organization data saved successfully!');
            reset();
        } catch (error) {
            console.error(error);
            enqueueSnackbar('Failed to save shelter data', { variant: 'error' });
        }
    });

    const handleDialogOpen = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const handleCustomShelterSubmit = async (data) => {
        setLoading(true);
        try {
            // Make POST request to the Lambda endpoint
            const response = await fetch('https://uot4ttu72a.execute-api.us-east-1.amazonaws.com/default/handleCreateOrganization', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    newOrganization: {
                        primary_account: {
                            contact_info: {
                                email: data.email,
                                city: data.city,
                                state: data.state,
                            },
                            shelter_details: {
                                shelter_name_common: data.shelterName,
                                shelter_name_path: data.shelterName.toLowerCase().replace(/ /g, '-'),
                            }
                        },
                    },
                }),
            });

            const responseData = await response.json();

            if (!response.ok) throw new Error('Failed to submit shelter information');

            // Store the account_id in the state
            setAccountId(responseData.account_id);

            enqueueSnackbar('Organization data saved successfully!', { variant: 'success' });
            setDialogOpen(false); // Close the dialog on success
        } catch (error) {
            console.error(error);
            enqueueSnackbar('Failed to save shelter data', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Card>
                {/* Header with Icon */}
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 2 }}>
                    <Typography variant="h6">Organization Form</Typography>
                    <IconButton onClick={handleDialogOpen}>
                        <Iconify icon="mingcute:add-line" />
                    </IconButton>
                </Stack>

                {/* Dialog Box */}
                <Dialog open={dialogOpen} onClose={handleDialogClose}>
                    <DialogTitle>Add New Organization</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please fill in the following information.
                        </DialogContentText>

                        <Stack spacing={2} sx={{ mt: 2 }}>
                            <TextField
                                label="Organization Name"
                                fullWidth
                                {...register('shelterName')}
                                error={!!errors.shelterName}
                                helperText={errors.shelterName?.message}
                            />
                            <TextField
                                label="Email"
                                fullWidth
                                {...register('email')}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                            />
                            <TextField
                                label="City"
                                fullWidth
                                {...register('city')}
                                error={!!errors.city}
                                helperText={errors.city?.message}
                            />
                            <TextField
                                label="State"
                                fullWidth
                                {...register('state')}
                                error={!!errors.state}
                                helperText={errors.state?.message}
                            />
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDialogClose}>Cancel</Button>
                        <LoadingButton
                            onClick={handleSubmit(handleCustomShelterSubmit)}
                            loading={loading || isSubmitting}
                            variant="contained"
                        >
                            Submit
                        </LoadingButton>
                    </DialogActions>
                </Dialog>

                <Grid container spacing={3}>
                    <Grid xs={12}>
                        <Card>
                            <Stack spacing={3} sx={{ p: 3 }}>
                                <Stack spacing={1.5} direction="row" alignItems="center">
                                    <Autocomplete
                                        sx={{ flexGrow: 1 }}
                                        options={shelterResults || []}
                                        loading={loading}
                                        autoHighlight
                                        getOptionLabel={(option) =>
                                            `${option.name} (${option.city}, ${option.state})`
                                        } // Label includes the name, city, and state
                                        renderOption={(props, option) => (
                                            <li {...props}>
                                                <Stack>
                                                    <Typography variant="body1">{option.name}</Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        {`${option.city}, ${option.state} - ID: ${option.account_id}`}
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        {`Number of Pets: ${option.numberOfPets}`}
                                                    </Typography>
                                                </Stack>
                                            </li>
                                        )} // Render custom option with name, city, state, account_id, and number of pets
                                        onInputChange={(_, newValue) => onInputChange(_, newValue)}
                                        onChange={(event, newValue) => {
                                            setSelectedShelter(newValue);
                                            setCustomShelter('');
                                            setIsCustomShelter(false);
                                        }}
                                        noOptionsText="No Results"
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                placeholder="Type to find a organization..."
                                                InputProps={{
                                                    ...params.InputProps,
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Iconify icon="eva:search-fill" sx={{ ml: 1, color: 'text.disabled' }} />
                                                        </InputAdornment>
                                                    ),
                                                    endAdornment: (
                                                        <>
                                                            {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                                            {params.InputProps.endAdornment}
                                                        </>
                                                    ),
                                                }}
                                            />
                                        )}
                                    />
                                </Stack>

                                {/* Dynamic email fields */}
                                {fields.map((field, index) => (
                                    <Stack key={field.id} direction="row" alignItems="center" spacing={2} mt={3}>
                                        <TextField
                                            fullWidth
                                            label={`Affiliated Account Email ${index + 1}`}
                                            {...register(`affiliatedEmails.${index}.email`)}
                                            error={!!errors.affiliatedEmails?.[index]?.email}
                                            helperText={errors.affiliatedEmails?.[index]?.email?.message}
                                        />
                                        <IconButton
                                            color="error"
                                            onClick={() => remove(index)}
                                            disabled={fields.length === 1} // Prevent removing the last email field
                                        >
                                            <Iconify icon="solar:trash-bin-trash-bold" />
                                        </IconButton>
                                    </Stack>
                                ))}

                                <Button
                                    variant="outlined"
                                    onClick={() => append({ email: '' })}
                                    sx={{ mt: 2 }}
                                >
                                    Add Email
                                </Button>
                            </Stack>
                        </Card>
                    </Grid>

                    <Grid xs={12}>
                        <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
                            <LoadingButton
                                size="large"
                                variant="contained"
                                loading={isSubmitting}
                                onClick={handleSubmit(onSubmit)}
                            >
                                Save Organization Info
                            </LoadingButton>
                        </Stack>
                    </Grid>

                    {/* Show the account_id after successful submission */}
                    {accountId && (
                        <Grid xs={12}>
                            <Alert severity="success">
                                Organization created successfully! Account ID: {accountId}
                            </Alert>
                        </Grid>
                    )}
                </Grid>
            </Card>
        </FormProvider>
    );
}

ShelterForm.propTypes = {
    currentJob: PropTypes.object,
};
