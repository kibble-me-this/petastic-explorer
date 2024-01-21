import { m } from 'framer-motion';
// @mui
import { useTheme, alpha } from '@mui/material/styles';
import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// components
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import { MotionViewport, varFade } from 'src/components/animate';

// ----------------------------------------------------------------------

export default function AboutVision() {
  const theme = useTheme();

  const renderImg = (
    <Image
      src="/assets/images/about/miami-ww2.jpg"
      alt="about-vision"
      overlay={alpha(theme.palette.grey[900], 0.58)}
      ratio="16/9"
    />
  );

  const renderLogo = (
    <Stack
      direction="row"
      flexWrap="wrap"
      alignItems="center"
      justifyContent="center"
      sx={{
        width: 1,
        zIndex: 9,
        bottom: 0,
        opacity: 0.58,
        position: 'absolute',
        py: { xs: 1.5, md: 2.5 },
      }}
    >
      {['purina', 'tiny', 'near', 'amazon', 'ev3', 'bff'].map((logo) => (
        <Box
          component={m.img}
          key={logo}
          variants={varFade().in}
          alt={logo}
          src={`/assets/icons/brands/ic_brand_${logo}.svg`}
          sx={{
            m: { xs: 1.5, md: 2.5 },
            height: { xs: 20, md: 32 },
          }}
        />
      ))}
    </Stack>
  );

  return (
    <Box
      sx={{
        pb: 10,
        position: 'relative',
        bgcolor: 'background.neutral',
        '&:before': {
          top: 0,
          left: 0,
          width: 1,
          content: "''",
          position: 'absolute',
          height: { xs: 80, md: 120 },
          bgcolor: 'background.default',
        },
      }}
    >
      <Container component={MotionViewport}>
        <Box
          sx={{
            mb: 10,
            borderRadius: 2,
            display: 'flex',
            overflow: 'hidden',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative', // Ensure stacking context
          }}
        >
          {renderImg}
          {renderLogo}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              zIndex: 1, // Ensure text is above the image
            }}
          >
            <m.div variants={varFade().inRight}>
              <Typography variant="h2" sx={{ mb: 3, opacity: 0.58, color: 'common.white' }}>
                Our Backers
              </Typography>
            </m.div>
            <m.div variants={varFade().inUp}>
              <Typography variant="h3" sx={{ maxWidth: 800, mx: 'auto', opacity: 0.58, color: 'common.white' }}>
                Our vision offering the best product nulla vehicula tortor scelerisque ultrices
                malesuada.
              </Typography>
            </m.div>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
