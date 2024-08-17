// @mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
// routes
import { RouterLink } from 'src/routes/components';
// assets
import { MaintenanceIllustration } from 'src/assets/illustrations';

// ----------------------------------------------------------------------

export default function MaintenanceView() {
  return (
    <Stack sx={{ alignItems: 'center', mt: 50 }}>
      <Typography variant="h3" sx={{ mb: 2 }}>
        Petastic currently under maintenance
      </Typography>

      <Typography sx={{ color: 'text.secondary' }}>
        We&apos;ll be bark on Monday!
      </Typography>

      <MaintenanceIllustration sx={{ my: 10, height: 240 }} />

      {/** 
      <Button component={RouterLink} href="/" size="large" variant="contained">
        Go to Home
      </Button>
      */}
    </Stack>
  );
}
