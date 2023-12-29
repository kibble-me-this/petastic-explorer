import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useState, useEffect } from 'react'; // Import useState and useEffect

export function EmptyContentLogo({ title, imgUrl, action, filled, description, sx, ...other }) {
  const [animatedTitle, setAnimatedTitle] = useState(''); // State to store the animated title
  const [charIndex, setCharIndex] = useState(0); // State to keep track of the current character index

  useEffect(() => {
    // Create a function to update the animated title character by character
    const animateTitle = () => {
      if (charIndex < title.length) {
        setAnimatedTitle((prevTitle) => prevTitle + title.charAt(charIndex));
        setCharIndex((prevIndex) => prevIndex + 1);
      }
    };

    // Start the typing animation when the component mounts
    const typingInterval = setInterval(animateTitle, 100); // Adjust the interval as needed

    // Clear the interval when the animation is complete
    return () => {
      clearInterval(typingInterval);
    };
  }, [charIndex, title]);

  return (
    <Stack
      flexGrow={1}
      alignItems="center"
      justifyContent="center"
      sx={{
        px: 3,
        height: 1,
        ...(filled && {
          borderRadius: 2,
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
          border: (theme) => `dashed 1px ${alpha(theme.palette.grey[500], 0.08)}`,
        }),
        ...sx,
      }}
      {...other}
    >
      <Box
        component="img"
        alt="empty content"
        src={imgUrl || '/logo/logo_single_outline.svg'}
        sx={{ mt: 30, width: 1, maxWidth: 100 }}
      />

      {/* Display the animated title */}
      <Typography
        variant="h6"
        component="span"
        sx={{ mt: 1, color: 'text.disabled', textAlign: 'center' }}
      >
        {animatedTitle}
      </Typography>

      {description && (
        <Typography variant="caption" sx={{ mt: 1, color: 'text.disabled', textAlign: 'center' }}>
          {description}
        </Typography>
      )}

      {action && action}
    </Stack>
  );
}

EmptyContentLogo.propTypes = {
  action: PropTypes.node,
  description: PropTypes.string,
  filled: PropTypes.bool,
  imgUrl: PropTypes.string,
  sx: PropTypes.object,
  title: PropTypes.string,
};
