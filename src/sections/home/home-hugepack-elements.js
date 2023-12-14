import { useState, useCallback } from 'react';
import { m } from 'framer-motion';
// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Tab from '@mui/material/Tab';
import Chip from '@mui/material/Chip';
import Tabs from '@mui/material/Tabs';
import Radio from '@mui/material/Radio';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Alert from '@mui/material/Alert';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Slider from '@mui/material/Slider';
import Switch from '@mui/material/Switch';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Unstable_Grid2';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import AlertTitle from '@mui/material/AlertTitle';
import AvatarGroup from '@mui/material/AvatarGroup';
import ToggleButton from '@mui/material/ToggleButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import CircularProgress from '@mui/material/CircularProgress';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// routes
import { paths } from 'src/routes/paths';
// _mock
import { _mock } from 'src/_mock';
// components
import Label from 'src/components/label';
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import { MotionViewport, varFade } from 'src/components/animate';

import { ChatView } from 'src/sections/chat/view';
import { outlineButton } from 'src/theme/css';

import ComponentCard from '../_examples/component-card';
import { foundationNav, muiNav, extraNav } from '../_examples/config-navigation';

// ----------------------------------------------------------------------

export default function HomeHugePackElements() {
  const mdUp = useResponsive('up', 'md');

  const [slider, setSlider] = useState(24);

  const [select, setSelect] = useState('Option 1');

  const [app, setApp] = useState('chat');

  const [rating, setRating] = useState(2);

  const [currentTab, setCurrentTab] = useState('Angular');

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const handleChangeSelect = useCallback((event) => {
    setSelect(event.target.value);
  }, []);

  const viewAllBtn = (
    <m.div variants={varFade().inUp} style={{ marginTop: '20px' }}>
      <Button
        size="large"
        color="inherit"
        variant="outlined"
        target="_blank"
        rel="noopener"
        href={paths.register}
        endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={18} sx={{ ml: -0.5 }} />}
        sx={outlineButton}
      >
        Join the Alpha Test
      </Button>
    </m.div>
  );

  const renderFeatures = (
    <Stack spacing={1}>
      <Stack spacing={1}>
        <Typography variant="h5">Components</Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Feature 1, Feature 2, Feature 3...
        </Typography>
      </Stack>

      <Grid container spacing={3}>
        {foundationNav.map((item) => (
          <Grid item xs={12} md={4} key={item.name}>
            <ComponentCard item={item} />
          </Grid>
        ))}
      </Grid>
    </Stack>
  );

  const renderDescription = (
    <Stack
      sx={{
        textAlign: { xs: 'center', md: 'unset' },
        pl: { md: 5 },
        pt: { md: 2 },
        height: '100%', // Set the height to 100%
        display: 'flex', // Use flexbox
        flexDirection: 'column', // Stack the items vertically
        justifyContent: 'center', // Center vertically
      }}
    >
      <m.div variants={varFade().inUp}>
        <Typography component="div" variant="overline" sx={{ color: 'text.disabled' }}>
          Introducing Petastic
        </Typography>
      </m.div>

      <m.div variants={varFade().inUp}>
        <Typography variant="h2" sx={{ my: 3 }}>
          Pet care,
          <br />
          purrsonalized.
        </Typography>
      </m.div>

      <m.div variants={varFade().inUp}>
        <Typography
          sx={{
            mb: 5,
            color: 'text.secondary',
          }}
        >
          Petastic simplifies pet care for you. Conveniently store your pet&apos;s records and
          explore tailored products and services specific to their exact needs. Give it a whirl!
        </Typography>
      </m.div>

      {mdUp && viewAllBtn}
    </Stack>
  );

  const renderContent = (
    <>
      <Box>
        <ChatView sx={{ m: 1 }} />
      </Box>
    </>
  );

  return (
    <Container
      component={MotionViewport}
      sx={{
        py: { xs: 10, md: 15 },
      }}
    >
      <Grid container direction={{ xs: 'column', md: 'row-reverse' }} spacing={5}>
        {mdUp ? ( // For desktop layout
          <>
            <Grid item xs={12} md={7}>
              {renderContent}
            </Grid>
            <Grid item xs={12} md={5}>
              {renderDescription}
            </Grid>
          </>
        ) : (
          // For mobile layout
          <>
            {' '}
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              {renderDescription}
              {viewAllBtn}
            </Grid>
            <Grid item xs={12}>
              {renderContent}
            </Grid>
          </>
        )}
      </Grid>
    </Container>
  );
}
