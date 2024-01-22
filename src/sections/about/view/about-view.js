// @mui
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

// _mock
import { _mapContact } from 'src/_mock';

import AboutHero from '../about-hero';
import AboutWhat from '../about-what';
import AboutTeam from '../about-team';
import AboutVision from '../about-vision';
import AboutTestimonials from '../about-testimonials';

//
import ContactMap from '../../contact/contact-map';
import ContactHero from '../../contact/contact-hero';
import ContactForm from '../../contact/contact-form';

// ----------------------------------------------------------------------

export default function AboutView() {
  return (
    <>
      <AboutHero />

      <AboutWhat />

      <AboutVision />

      {/* <AboutTestimonials /> */}

      {/* <ContactHero /> */}

      {/* <Container sx={{ py: 10 }}>
        <Box
          gap={10}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            md: 'repeat(2, 1fr)',
          }}
        >
          <ContactForm />
        </Box>
      </Container> */}
    </>
  );
}
