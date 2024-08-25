import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useMemo, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import ButtonBase from '@mui/material/ButtonBase';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// assets
import { countries } from 'src/assets/data';
// components
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
    RHFTextField,
    RHFAutocomplete,
} from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function OrganizationNewEditForm({ currentOrganization }) {
    const router = useRouter();

    const mdUp = useResponsive('up', 'md');

    const { enqueueSnackbar } = useSnackbar();

    const NewOrganizationSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        description: Yup.string().required('Description is required'),
        location: Yup.string().required('Location is required'),
    });

    const defaultValues = useMemo(
        () => ({
            name: currentOrganization?.name || '',
            description: currentOrganization?.description || '',
            location: currentOrganization?.location || '',
            countries: currentOrganization?.countries || [],
        }),
        [currentOrganization]
    );

    const methods = useForm({
        resolver: yupResolver(NewOrganizationSchema),
        defaultValues,
    });

    const {
        reset,
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    useEffect(() => {
        if (currentOrganization) {
            reset(defaultValues);
        }
    }, [currentOrganization, defaultValues, reset]);

    const onSubmit = handleSubmit(async (data) => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 500));
            reset();
            enqueueSnackbar(currentOrganization ? 'Update success!' : 'Create success!');
            router.push(paths.dashboard.organization.root);
            console.info('DATA', data);
        } catch (error) {
            console.error(error);
        }
    });

    const renderDetails = (
        <>
            {mdUp && (
                <Grid md={4}>
                    <Typography variant="h6" sx={{ mb: 0.5 }}>
                        Organization Details
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Name, description, logo...
                    </Typography>
                </Grid>
            )}

            <Grid xs={12} md={8}>
                <Card>
                    {!mdUp && <CardHeader title="Details" />}

                    <Stack spacing={3} sx={{ p: 3 }}>
                        <Stack spacing={1.5}>
                            <Typography variant="subtitle2">Organization Name</Typography>
                            <RHFTextField name="name" placeholder="Ex: Animal Shelter..." />
                        </Stack>

                        <Stack spacing={1.5}>
                            <Typography variant="subtitle2">Description</Typography>
                            <RHFTextField name="description" placeholder="Brief description of the organization" multiline rows={4} />
                        </Stack>
                    </Stack>
                </Card>
            </Grid>
        </>
    );

    const renderLocation = (
        <>
            {mdUp && (
                <Grid md={4}>
                    <Typography variant="h6" sx={{ mb: 0.5 }}>
                        Location
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Country, region...
                    </Typography>
                </Grid>
            )}

            <Grid xs={12} md={8}>
                <Card>
                    {!mdUp && <CardHeader title="Location" />}

                    <Stack spacing={3} sx={{ p: 3 }}>
                        <Stack spacing={1.5}>
                            <Typography variant="subtitle2">Country</Typography>
                            <RHFAutocomplete
                                name="countries"
                                placeholder="Select country"
                                multiple
                                disableCloseOnSelect
                                options={countries.map((option) => option.label)}
                                getOptionLabel={(option) => option}
                                renderTags={(selected, getTagProps) =>
                                    selected.map((option, index) => (
                                        <Chip
                                            {...getTagProps({ index })}
                                            key={option}
                                            label={option}
                                            size="small"
                                            color="info"
                                            variant="soft"
                                        />
                                    ))
                                }
                            />
                        </Stack>
                    </Stack>
                </Card>
            </Grid>
        </>
    );

    const renderActions = (
        <>
            {mdUp && <Grid md={4} />}
            <Grid xs={12} md={8} sx={{ display: 'flex', alignItems: 'center' }}>
                <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Publish"
                    sx={{ flexGrow: 1, pl: 3 }}
                />

                <LoadingButton
                    type="submit"
                    variant="contained"
                    size="large"
                    loading={isSubmitting}
                    sx={{ ml: 2 }}
                >
                    {!currentOrganization ? 'Create Organization' : 'Save Changes'}
                </LoadingButton>
            </Grid>
        </>
    );

    return (
        <FormProvider methods={methods} onSubmit={onSubmit}>
            <Grid container spacing={3}>
                {renderDetails}
                {renderLocation}
                {renderActions}
            </Grid>
        </FormProvider>
    );
}

OrganizationNewEditForm.propTypes = {
    currentOrganization: PropTypes.object,
};
