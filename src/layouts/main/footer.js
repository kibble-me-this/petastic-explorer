// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
// routes
import { paths } from 'src/routes/paths';
import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
// _mock
import { _socials } from 'src/_mock';
// components
import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

const LINKS = [
  {
    headline: 'Minimal',
    children: [
      {
        name: 'Blog',
        href: paths.post.root,
        style: { pointerEvents: 'none' },
      },
      {
        name: 'About us',
        href: '/?id=e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4',
        style: { pointerEvents: 'none' },
      },
      {
        name: 'Terms and Condition',
        href: '/?id=e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4',
        style: { pointerEvents: 'none' },
      },
      {
        name: 'Privacy Policy',
        href: '/?id=e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4',
        style: { pointerEvents: 'none' },
      },
    ],
  },
];

// ----------------------------------------------------------------------

export default function Footer() {
  const pathname = usePathname();

  const isHome = pathname === '/';

  const simpleFooter = (
    <Box
      component="footer"
      sx={{
        py: 5,
        textAlign: 'center',
        position: 'relative',
        background: 'rgba(0, 0, 0, 0)', // This makes the box fully transparent
      }}
    >
      <Container>
        <Logo sx={{ mb: 1, mx: 'auto' }} />

        <Typography variant="caption" component="div">
          © Petastic Inc / Made with sunshine in California and Florida
        </Typography>
      </Container>
    </Box>
  );

  const mainFooter = (
    <Box
      component="footer"
      sx={{
        position: 'relative',
        bgcolor: 'background.default',
      }}
    >
      <Divider />

      <Container
        sx={{
          pt: 10,
          pb: 5,
          textAlign: { xs: 'center', md: 'unset' },
        }}
      >
        <Grid
          container
          justifyContent={{
            xs: 'center',
            md: 'space-between',
          }}
        >
          <Grid xs={8} md={3}>
            <Logo sx={{ mb: 3 }} />
          </Grid>

          <Grid xs={12} md={5}>
            <Stack spacing={5} direction={{ xs: 'column', md: 'row' }}>
              {LINKS.map((list) => (
                <Stack
                  key={list.headline}
                  spacing={2}
                  alignItems={{ xs: 'center', md: 'flex-start' }}
                  sx={{ width: 1 }}
                >
                  {list.children.map((link) => (
                    <Link
                      key={link.name}
                      component={RouterLink}
                      href={link.href}
                      color="inherit"
                      variant="body2"
                    >
                      {link.name}
                    </Link>
                  ))}
                </Stack>
              ))}
            </Stack>
          </Grid>

          <Grid xs={8} md={4}>
            <Typography component="div" variant="overline">
              Your pet is unique and we understand that.{' '}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                // maxWidth: 270,
                mx: { xs: 'auto', md: 'unset' },
              }}
            >
              Petastic © is the world&apos;s only open pet database designed to house billions of
              pets worldwide, simplifying pet care for all and delivering personalized products and
              services to our beloved furbabies.
            </Typography>
            {/** 
            <Stack
              direction="row"
              justifyContent={{ xs: 'center', md: 'flex-start' }}
              sx={{
                mt: 3,
                mb: { xs: 5, md: 0 },
              }}
            >
              {_socials.map((social) => (
                <IconButton
                  key={social.name}
                  sx={{
                    '&:hover': {
                      bgcolor: alpha(social.color, 0.08),
                    },
                  }}
                >
                  <Iconify color={social.color} icon={social.icon} />
                </IconButton>
              ))}
            </Stack>
            */}
          </Grid>
        </Grid>

        <Typography variant="body2" sx={{ mt: 10, textAlign: 'center' }}>
          © Petastic Inc / Made with sunshine in California and Florida
        </Typography>
      </Container>
    </Box>
  );

  return !isHome ? mainFooter : mainFooter;
}
