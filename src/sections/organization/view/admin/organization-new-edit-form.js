import PropTypes from 'prop-types';
import { useState, useEffect, useMemo } from 'react';
import { useForm, useFieldArray, FormProvider as RHFormProvider } from 'react-hook-form';
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
    const [dialogOpen, setDialogOpen] = useState(false); // State to control dialog open/close
    const [accountId, setAccountId] = useState('');
    const [showEmailFields, setShowEmailFields] = useState(false);

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
            affiliatedEmails: [],
        }),
        [selectedShelter]
    );

    // Main Form Methods
    const mainFormMethods = useForm({
        resolver: yupResolver(ShelterFormSchema),
        defaultValues,
    });

    const { reset: resetMainForm, handleSubmit: handleMainSubmit, formState: { isSubmitting: isMainSubmitting }, register, control } = mainFormMethods;
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'affiliatedEmails',
    });

    useEffect(() => {
        if (selectedShelter) {
            resetMainForm(defaultValues);
        }
    }, [selectedShelter, defaultValues, resetMainForm]);

    // Dialog Form Methods
    const dialogFormMethods = useForm({
        resolver: yupResolver(ShelterFormSchema),
        defaultValues: {
            shelterName: '',
            email: '',
            city: '',
            state: '',
        },
    });

    const { reset: resetDialogForm, handleSubmit: handleDialogSubmit, formState: { isSubmitting: isDialogSubmitting }, register: dialogRegister, formState: { errors: dialogErrors } } = dialogFormMethods;

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

    const handleMainFormSubmit = handleMainSubmit(async (data) => {
        try {
            if (!selectedShelter || !selectedShelter.account_id) {
                enqueueSnackbar('Please select a shelter before submitting.', { variant: 'error' });
                return;
            }

            const newUserPayload = {
                email: data.email,
                company: selectedShelter.shelterName,
                role: "Ecosystem User",
                affiliations: [
                    {
                        role: ["admin"],
                        shelterId: selectedShelter.account_id,
                        shelterName: selectedShelter.shelterName,
                        affiliateSystemRoles: ["admin"],
                    }
                ]
            };

            const response = await fetch('https://uot4ttu72a.execute-api.us-east-1.amazonaws.com/default/handleCreateUser', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUserPayload),
            });

            if (!response.ok) throw new Error('Failed to create user');

            enqueueSnackbar('User created successfully!', { variant: 'success' });
            resetMainForm();
            setShowEmailFields(false);
        } catch (error) {
            enqueueSnackbar('Failed to create user', { variant: 'error' });
        }
    });

    const handleDialogFormSubmit = handleDialogSubmit(async (data) => {
        setLoading(true);
        try {
            const payload = {
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
                        },
                    },
                },
            };

            const response = await fetch('https://uot4ttu72a.execute-api.us-east-1.amazonaws.com/default/handleCreateOrganization', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error('Failed to create organization');

            const responseData = await response.json();
            setAccountId(responseData.account_id);
            enqueueSnackbar('Organization created successfully!', { variant: 'success' });
            setDialogOpen(false);
            resetDialogForm();
        } catch (error) {
            enqueueSnackbar('Failed to create organization', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    });

    // Define the dialog open/close handlers
    const handleDialogOpen = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    return (
        <Grid container spacing={3}>
            {/* Main Form */}
            <Grid xs={12} md={8}>
                <Card>
                    <RHFormProvider {...mainFormMethods}>
                        <form onSubmit={handleMainFormSubmit}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 2 }}>
                                <Typography variant="h6">Claim Organization Form</Typography>
                                <IconButton onClick={handleDialogOpen}>
                                    <Iconify icon="mingcute:add-line" />
                                </IconButton>
                            </Stack>

                            <Stack spacing={3} sx={{ p: 3 }}>
                                <Stack spacing={1.5} direction="row" alignItems="center">
                                    <Autocomplete
                                        sx={{ flexGrow: 1 }}
                                        options={shelterResults || []}
                                        loading={loading}
                                        autoHighlight
                                        getOptionLabel={(option) => `${option.name} (${option.city}, ${option.state}, ${option.account_id})`}
                                        renderOption={(props, option) => (
                                            <li {...props}>
                                                <Stack>
                                                    <Typography variant="body1">{option.name}</Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        {`${option.city}, ${option.state} - ID: ${option.account_id}`}
                                                    </Typography>
                                                </Stack>
                                            </li>
                                        )}
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

                                {/* Dynamic Email Fields */}
                                {showEmailFields && fields.map((field, index) => (
                                    <Stack key={field.id} direction="row" alignItems="center" spacing={2} mt={3}>
                                        <TextField
                                            fullWidth
                                            label={`Affiliated Account Email ${index + 1}`}
                                            {...register(`affiliatedEmails.${index}.email`)}
                                            error={!!mainFormMethods.formState.errors.affiliatedEmails?.[index]?.email}
                                            helperText={mainFormMethods.formState.errors.affiliatedEmails?.[index]?.email?.message}
                                        />
                                        <IconButton color="error" onClick={() => remove(index)} disabled={fields.length === 1}>
                                            <Iconify icon="solar:trash-bin-trash-bold" />
                                        </IconButton>
                                    </Stack>
                                ))}

                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        setShowEmailFields(true);
                                        append({ email: '' });
                                    }}
                                    sx={{ mt: 2 }}
                                    disabled={!selectedShelter}
                                >
                                    Assign User
                                </Button>
                            </Stack>

                            <Grid xs={12}>
                                <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
                                    <LoadingButton
                                        size="large"
                                        variant="contained"
                                        loading={isMainSubmitting}
                                        type="submit"
                                    >
                                        Submit
                                    </LoadingButton>
                                </Stack>
                            </Grid>
                        </form>
                    </RHFormProvider>

                    {accountId && (
                        <Grid xs={12}>
                            <Alert severity="success">
                                Organization created successfully! Account ID: {accountId}
                            </Alert>
                        </Grid>
                    )}
                </Card>
            </Grid>

            {/* Dialog Form */}
            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>Add New Organization</DialogTitle>
                <RHFormProvider {...dialogFormMethods}>
                    <form onSubmit={handleDialogFormSubmit}>
                        <DialogContent>
                            <DialogContentText>
                                Please fill in the following information.
                            </DialogContentText>
                            <Stack spacing={2} sx={{ mt: 2 }}>
                                <TextField
                                    label="Organization Name"
                                    fullWidth
                                    {...dialogRegister('shelterName')}
                                    error={!!dialogErrors.shelterName}
                                    helperText={dialogErrors.shelterName?.message}
                                />
                                <TextField
                                    label="Email"
                                    fullWidth
                                    {...dialogRegister('email')}
                                    error={!!dialogErrors.email}
                                    helperText={dialogErrors.email?.message}
                                />
                                <TextField
                                    label="City"
                                    fullWidth
                                    {...dialogRegister('city')}
                                    error={!!dialogErrors.city}
                                    helperText={dialogErrors.city?.message}
                                />
                                <TextField
                                    label="State"
                                    fullWidth
                                    {...dialogRegister('state')}
                                    error={!!dialogErrors.state}
                                    helperText={dialogErrors.state?.message}
                                />
                            </Stack>
                        </DialogContent>

                        <DialogActions>
                            <Button onClick={handleDialogClose}>Cancel</Button>
                            <LoadingButton
                                type="submit"
                                loading={isDialogSubmitting}
                                variant="contained"
                            >
                                Submit
                            </LoadingButton>
                        </DialogActions>
                    </form>
                </RHFormProvider>
            </Dialog>
        </Grid>
    );
}

ShelterForm.propTypes = {
    currentJob: PropTypes.object,
};
