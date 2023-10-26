import { m } from 'framer-motion';
// @mui
import { styled, alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
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

  const renderDescription = (
    <Box
      sx={{
        textAlign: {
          xs: 'center',
          md: 'left',
        },
        width: 1, // Make the Box expand to full width
        ml: 12, // Add a margin of 8 units to the left
      }}
    >
      <Box
        component={m.div}
        variants={varFade().inDown}
        sx={{ color: 'common.main', mb: 3, typography: 'h2' }}
      >
        Get started with
        <br /> Minimal kit today
      </Box>

      <m.div variants={varFade().in}>
        <Typography variant="h4" sx={{ mb: 4, color: alpha(theme.palette.text.secondary, 0.7) }}>
          Parent purrfectly with the magical <br />
          superpawers of blockchain and pet care AI.
        </Typography>
      </m.div>

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent={{ xs: 'center', md: 'flex-start' }}
        spacing={2}
      >
        <m.div variants={varFade().inRight}>
          <Button
            size="large"
            color="inherit"
            variant="outlined"
            target="_blank"
            rel="noopener"
            href={paths.components}
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
          mb: 16,
          backgroundImage: 'url(/assets/background/explorer.svg)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          borderRadius: 2,
          pb: { xs: 5, md: 0 },
        }}
      >
        {renderDescription}
        {renderImg}
      </Stack>
    </Container>
  );
}
