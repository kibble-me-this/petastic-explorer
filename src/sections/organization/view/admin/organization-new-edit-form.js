import PropTypes from 'prop-types';
import { useState, useEffect, useMemo } from 'react';
import { useForm, FormProvider as RHFormProvider } from 'react-hook-form';
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

export default function ShelterForm({ currentJob }) {
    const { enqueueSnackbar } = useSnackbar();

    const [shelterResults, setShelterResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedShelter, setSelectedShelter] = useState(null);
    const [accountId, setAccountId] = useState('');
    const [submitLoading, setSubmitLoading] = useState(false); // Loading state for submit button
    const [dialogOpen, setDialogOpen] = useState(false); // Dialog open/close state

    // Validation Schema for both forms
    const ShelterFormSchema = Yup.object().shape({
        shelterName: Yup.string(),
        email: Yup.string().email('Invalid email').required('Email is required'),
    });

    const defaultValues = useMemo(
        () => ({
            email: '',
        }),
        []
    );

    // Main form methods (for claiming an organization)
    const mainFormMethods = useForm({
        resolver: yupResolver(ShelterFormSchema),
        defaultValues,
    });

    // New Organization form methods (for adding a new organization)
    const newOrgFormMethods = useForm({
        resolver: yupResolver(ShelterFormSchema),
        defaultValues: {
            shelterName: '',
            email: '',
            city: '',
            state: '',
        },
    });

    const { reset: resetMainForm, handleSubmit: handleMainSubmit, formState: { errors }, register } = mainFormMethods;
    const { reset: resetNewOrgForm, handleSubmit: handleNewOrgSubmit, formState: { errors: orgErrors }, register: orgRegister } = newOrgFormMethods;

    useEffect(() => {
        if (selectedShelter) {
            resetMainForm(defaultValues);
        }
    }, [selectedShelter, defaultValues, resetMainForm]);

    // Fetch shelters logic
    const fetchShelters = useMemo(
        () =>
            debounce(async (partialName) => {
                if (!partialName) return;
                setLoading(true);
                try {
                    const response = await fetch(`https://uot4ttu72a.execute-api.us-east-1.amazonaws.com/default/getSheltersByPartialName?partialName=${partialName}`);
                    const data = await response.json();
                    setShelterResults(Array.isArray(data) ? data : []);
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
        if (newValue) {
            fetchShelters(newValue);
        }
    };

    // Main form submit handler for claiming an organization
    const handleMainFormSubmit = handleMainSubmit(async (data) => {
        try {
            setSubmitLoading(true); // Set loading to true when form submission starts

            if (!selectedShelter || !selectedShelter.account_id) {
                enqueueSnackbar('Please select a shelter before submitting.', { variant: 'error' });
                setSubmitLoading(false); // Reset loading state on error
                return;
            }

            const newUserPayload = {
                email: data.email,
                company: selectedShelter.name,
                role: "Ecosystem User",
                affiliations: [
                    {
                        role: ["admin"],
                        shelterId: selectedShelter.account_id,
                        shelterName: selectedShelter.name,
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
        } catch (error) {
            enqueueSnackbar('Failed to create user', { variant: 'error' });
        } finally {
            setSubmitLoading(false); // Reset loading state once the request is finished
        }
    });

    // New organization form submit handler for adding a new organization
    const handleNewOrgFormSubmit = handleNewOrgSubmit(async (data) => {
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
            resetNewOrgForm();
            setDialogOpen(false); // Close the dialog upon successful submission
        } catch (error) {
            enqueueSnackbar('Failed to create organization', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    });

    // Dialog open/close handlers
    const handleDialogOpen = () => setDialogOpen(true);
    const handleDialogClose = () => setDialogOpen(false);

    return (
        <Grid container spacing={3}>
            {/* Main Form for claiming an organization */}
            <Grid xs={12} md={6}>
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
                                {/* Shelter Autocomplete */}
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
                                    }}
                                    noOptionsText="No Results"
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            placeholder="Type to find an organization..."
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

                                <TextField
                                    label="Email"
                                    fullWidth
                                    {...register('email')}
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                />
                            </Stack>

                            <Grid xs={12}>
                                <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
                                    <LoadingButton
                                        size="large"
                                        variant="contained"
                                        type="submit"
                                        loading={submitLoading} // Bind the loading state to the button
                                    >
                                        Submit
                                    </LoadingButton>
                                </Stack>
                            </Grid>
                        </form>
                    </RHFormProvider>
                </Card>
            </Grid>

            {/* Dialog for New Organization Form */}
            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>Add New Organization</DialogTitle>
                <RHFormProvider {...newOrgFormMethods}>
                    <form onSubmit={handleNewOrgFormSubmit}>
                        <DialogContent>
                            <DialogContentText>
                                Please fill in the following information.
                            </DialogContentText>
                            <Stack spacing={2} sx={{ mt: 2 }}>
                                <TextField
                                    label="Organization Name"
                                    fullWidth
                                    {...orgRegister('shelterName')}
                                    error={!!orgErrors.shelterName}
                                    helperText={orgErrors.shelterName?.message}
                                />
                                <TextField
                                    label="Email"
                                    fullWidth
                                    {...orgRegister('email')}
                                    error={!!orgErrors.email}
                                    helperText={orgErrors.email?.message}
                                />
                                <TextField
                                    label="City"
                                    fullWidth
                                    {...orgRegister('city')}
                                    error={!!orgErrors.city}
                                    helperText={orgErrors.city?.message}
                                />
                                <TextField
                                    label="State"
                                    fullWidth
                                    {...orgRegister('state')}
                                    error={!!orgErrors.state}
                                    helperText={orgErrors.state?.message}
                                />
                            </Stack>
                        </DialogContent>

                        <DialogActions>
                            <Button onClick={handleDialogClose}>Cancel</Button>
                            <LoadingButton
                                type="submit"
                                variant="contained"
                                loading={loading}
                            >
                                Submit
                            </LoadingButton>
                        </DialogActions>
                    </form>
                </RHFormProvider>
            </Dialog>

            {/* Success message for account ID */}
            {accountId && (
                <Grid xs={12}>
                    <Alert severity="success">
                        Organization created successfully! Account ID: {accountId}
                    </Alert>
                </Grid>
            )}
        </Grid>
    );
}

ShelterForm.propTypes = {
    currentJob: PropTypes.object,
};
