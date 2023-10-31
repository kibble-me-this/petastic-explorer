import { m } from 'framer-motion';
// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// components
import { MotionViewport, varFade } from 'src/components/animate';
// CSS class for grayscale SVG images
const grayscaleCss = {
  filter: 'grayscale(100%)', // Apply grayscale filter
};

// ----------------------------------------------------------------------

const CARDS = [
  {
    icon: ' /assets/icons/home/ic_passport.svg',
    tech: 'BLOCKCHAIN',
    title: "Your Pet's Diary",
    description:
      "We assist you in storing your pet's vital information, including medical records, vaccinations, and reminders, in one secure digital location you solely own, eliminating paper records.",
  },
  {
    icon: ' /assets/icons/home/ic_development.svg',
    tech: 'ARTIFICIAL INTELLIGENCE',
    title: 'Personal Pet Concierge',
    description:
      "Unlock your pet's data with Petastic and gain superpawers through our AI pet concierge. It guides you, addressing both your pet's and your needs, for simplified pet care.",
  },
  {
    icon: ' /assets/icons/home/ic_coin.svg',
    tech: 'PLAY-TO-EARN',
    title: 'Infinite Rewards',
    description:
      'By actively engaging with your Pet Concierge, contribute to the global pet ecosystem, earn rewards, and help enhance the system, benefiting fellow pet parents in the community.',
  },
];

// ----------------------------------------------------------------------

export default function HomeMinimal() {
  return (
    <Container
      component={MotionViewport}
      sx={{
        py: { xs: 10, md: 15 },
      }}
    >
      <Stack
        spacing={3}
        sx={{
          textAlign: 'center',
          mb: { xs: 5, md: 10 },
        }}
      >
        <m.div variants={varFade().inUp}>
          <Typography
            component="div"
            variant="overline"
            sx={{ color: 'text.disabled', textTransform: 'uppercase' }}
          >
            magical superpawers
          </Typography>
        </m.div>

        <m.div variants={varFade().inDown}>
          <Typography variant="h2">How does it work?</Typography>
        </m.div>
      </Stack>

      <Box
        gap={{ xs: 3, lg: 10 }}
        display="grid"
        alignItems="center"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
      >
        {CARDS.map((card, index) => (
          <m.div variants={varFade().inUp} key={card.title}>
            <Card
              sx={{
                textAlign: 'center',
                boxShadow: { md: 'none' },
                bgcolor: 'background.default',
                p: (theme) => theme.spacing(10, 5),
                position: 'relative',
                ...(index === 1 && {
                  boxShadow: (theme) => ({
                    md: `-40px 40px 80px ${
                      theme.palette.mode === 'light'
                        ? alpha(theme.palette.grey[500], 0.16)
                        : alpha(theme.palette.common.black, 0.4)
                    }`,
                  }),
                }),
              }}
            >
              {/* Container for the pink circle and icon */}
              <Box sx={{ position: 'relative' }}>
                {/* Pink circle background */}
                <Box
                  component="img"
                  src="/assets/icons/home/ic_pink.svg" // Path to your pink circle SVG
                  alt="Pink Circle"
                  sx={{
                    position: 'absolute',
                    top: -10,
                    left: 15,
                    width: '120%', // Make the pink circle cover the entire container
                    height: '120%', // Make the pink circle cover the entire container
                  }}
                />

                {/* Icon */}
                <Box
                  component="img"
                  src={card.icon}
                  alt={card.title}
                  sx={{
                    mx: 'auto',
                    width: 48,
                    height: 48,
                    position: 'relative',
                    zIndex: 1, // Ensure the icon is in front of the pink circle
                    ...grayscaleCss,
                  }}
                />
              </Box>
              <Typography
                component="div"
                variant="overline"
                sx={{ color: 'text.disabled', mt: 6, mb: 0.5 }}
              >
                {card.tech}
              </Typography>
              <Typography variant="h5" sx={{ mt: 0, mb: 2 }}>
                {card.title}
              </Typography>

              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {card.description}
              </Typography>
            </Card>
          </m.div>
        ))}
      </Box>
    </Container>
  );
}
