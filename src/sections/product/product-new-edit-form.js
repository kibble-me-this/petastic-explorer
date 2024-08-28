import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useMemo, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
// routes
import { paths } from 'src/routes/paths';
// hooks
import { useAuthContext } from 'src/auth/hooks';
import { useResponsive } from 'src/hooks/use-responsive';
// api
import { createProduct } from 'src/api/product';
import { useGetAffiliations } from 'src/api/organization';
// components
import { useSnackbar } from 'src/components/snackbar';
import { useRouter } from 'src/routes/hooks';
import FormProvider, {
  RHFTextField,
} from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function ProductNewEditForm({ currentProduct }) {
  const router = useRouter();

  const { user } = useAuthContext();

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  // Fetch affiliations using the useGetAffiliations hook
  const { affiliates } = useGetAffiliations(user?.pid || null);

  const accountIds = useMemo(() =>
    affiliates ? affiliates.map(affiliation => ({
      value: affiliation.shelterId,
      label: affiliation.shelterName,
    })) : [],
    [affiliates]
  );

  const NewProductSchema = Yup.object().shape({
    iban: Yup.string().required('IBAN is required'),
    accountId: Yup.string().required('Account ID is required'),
  });

  const defaultValues = useMemo(
    () => ({
      iban: currentProduct?.iban || '',
      accountId: currentProduct?.accountId || accountIds[0]?.value || '',
    }),
    [currentProduct, accountIds]
  );

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentProduct) {
      reset(defaultValues);
    }
  }, [currentProduct, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const products = data.iban.split(/\s*,\s*|\n/).filter(Boolean).map(asin => ({
        id: asin,
        createdAt: new Date().toISOString(),
        publish: 'published',
      }));

      const eventData = {
        account_id: data.accountId,
        products,
      };

      await createProduct(eventData);
      reset();
      enqueueSnackbar(currentProduct ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.product.root);
    } catch (error) {
      console.error(error);
    }
  });

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Details
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Title, short description, image...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <FormControl
              sx={{
                flexShrink: 0,
                width: { xs: 1, md: 200 },
              }}
            >
              <TextField
                select
                label="Account ID"
                value={values.accountId || ''}
                onChange={(event) => methods.setValue('accountId', event.target.value)}
                sx={{ minWidth: 200 }}
              >
                {accountIds.length > 0 &&
                  accountIds.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
              </TextField>
            </FormControl>
            <RHFTextField
              name="iban"
              label="Enter list of Amazon ASIN values"
              multiline
              rows={4}
              placeholder="e.g. B08N5WRWNW, B07PGL2ZSL, B07FZ8S74R"
              helperText="Please enter each ASIN value on a new line or separate them with commas."
            />
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

        <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
          {!currentProduct ? 'Create Products' : 'Save Changes'}
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderDetails}
        {renderActions}
      </Grid>
    </FormProvider>
  );
}

ProductNewEditForm.propTypes = {
  currentProduct: PropTypes.object,
};
