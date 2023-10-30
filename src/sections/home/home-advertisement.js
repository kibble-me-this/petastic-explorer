import { m } from 'framer-motion';
// @mui
import { styled, alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// theme
import { bgGradient, outlineButton } from 'src/theme/css';
// routes
import { paths } from 'src/routes/paths';
// components
import Iconify from 'src/components/iconify';
import { MotionViewport, varFade } from 'src/components/animate';

// ----------------------------------------------------------------------

export default function HomeAdvertisement() {
  const theme = useTheme();

  const mdUp = useResponsive('up', 'md');

  const renderDescription = (
    <Box
      sx={{
        textAlign: mdUp ? 'left' : 'center',
        width: 1,
        ml: mdUp ? 12 : 0,
      }}
    >
      {mdUp ? (
        <m.div variants={varFade().in}>
          <Box
            component={m.div}
            variants={varFade().inDown}
            sx={{ color: 'common.main', mb: 3, typography: 'h2' }}
          >
            The Pet&apos;s Network
          </Box>
          <Typography
            variant="body1"
            sx={{ mb: 4, color: alpha(theme.palette.text.secondary, 0.7) }}
          >
            Petastic is a decentralized network purpose-built to <br />
            identify, track, and manage the lives of all pets on earth.
          </Typography>
        </m.div>
      ) : (
        <m.div variants={varFade().in}>
          <Box
            sx={{
              mt: -10, // Shift the Box up by 20px
            }}
          >
            <Box
              component={m.div}
              variants={varFade().inDown}
              sx={{ color: 'common.main', mb: 3, typography: 'h3', fontWeight: 'bold' }}
            >
              The Pet&apos;s Network
            </Box>
            <Typography
              variant="body1"
              sx={{ mb: 48, color: alpha(theme.palette.text.secondary, 0.7) }}
            >
              Petastic is a decentralized network purpose-built to identify, track, and manage the
              lives of all pets on earth.
            </Typography>
          </Box>
        </m.div>
      )}

      <Stack
        direction={mdUp ? 'row' : 'column'}
        justifyContent={mdUp ? 'flex-start' : 'center'}
        spacing={2}
      >
        <m.div variants={varFade().inRight}>
          <Button
            size="large"
            color="inherit"
            variant="outlined"
            target="_blank"
            rel="noopener"
            href={paths.explorer}
            endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={18} sx={{ ml: -0.5 }} />}
            sx={outlineButton}
          >
            The Pet&apos;s Network
          </Button>
        </m.div>
      </Stack>
    </Box>
  );

  const renderImg = (
    <Stack
      component={m.div}
      variants={varFade().inUp}
      alignItems="center"
      sx={{
        width: '100%', // Ensure the Stack takes up the entire width
        position: 'relative', // Add position property
      }}
    >
      <Box
        component={m.img}
        animate={{
          y: [-5, 0, -5],
        }}
        transition={{ duration: 4, repeat: Infinity }}
        alt="coins"
        src="/assets/background/explorer_coins.png"
        sx={{
          // Keep the original size of the image
          maxWidth: '100%',
          height: 'auto',
          position: 'absolute', // Add position property
          // right: '-120px', // Align to the right
          bottom: '-210px',
          // marginRight: '-100px', // Use negative margin to adjust positioning
          // marginBottom: '-100px', // Use negative margin to adjust positioning
        }}
      />
    </Stack>
  );

  return (
    <Container component={MotionViewport}>
      <Stack
        alignItems="center"
        direction={{ xs: 'column', md: 'row' }}
        height="458px"
        sx={{
          my: 16,
          backgroundImage: mdUp
            ? 'url(/assets/background/explorer.svg)' // Use this image for md and up
            : 'url(/assets/background/explorer_pets_xs.png)', // Use this image for xs and sm          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          borderRadius: 2,
          pb: { xs: 5, md: 0 },
        }}
      >
        {renderDescription}
        {mdUp && renderImg}
      </Stack>
    </Container>
  );
}
