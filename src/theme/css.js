// @mui
import { alpha } from '@mui/material/styles';
import { dividerClasses } from '@mui/material/Divider';
import { checkboxClasses } from '@mui/material/Checkbox';
import { menuItemClasses } from '@mui/material/MenuItem';
import { autocompleteClasses } from '@mui/material/Autocomplete';

// ----------------------------------------------------------------------

export const paper = ({ theme, bgcolor, dropdown }) => ({
  ...bgBlur({
    blur: 20,
    opacity: 0.9,
    color: theme.palette.background.paper,
    ...(!!bgcolor && {
      color: bgcolor,
    }),
  }),
  backgroundImage: 'url(/assets/cyan-blur.png), url(/assets/red-blur.png)',
  backgroundRepeat: 'no-repeat, no-repeat',
  backgroundPosition: 'top right, left bottom',
  backgroundSize: '50%, 50%',
  ...(theme.direction === 'rtl' && {
    backgroundPosition: 'top left, right bottom',
  }),
  ...(dropdown && {
    padding: theme.spacing(0.5),
    boxShadow: theme.customShadows.dropdown,
    borderRadius: theme.shape.borderRadius * 1.25,
  }),
});

// ----------------------------------------------------------------------

export const blueButton = (theme) => ({
  backgroundColor: theme.palette.primary.main,
  borderRadius: 16,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(1, 3), // Adjust padding values as needed
  maxWidth: '100%', // Add this line to limit the button's width
  whiteSpace: 'nowrap', // Prevent text from wrapping to a new line
  overflow: 'hidden', // Hide any overflow text
  textOverflow: 'ellipsis', // Show an ellipsis (...) if the text overflows
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.8),
  },
});

export const chatButton = (theme) => ({
  color: '#345BFF', // Updated text color
  display: 'flex',
  height: '36px',
  padding: '8px 12px',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '6px',
  alignSelf: 'stretch',
  borderRadius: '8px',
  background: '#FFEEEB',
  borderColor: '#FFF',
  mt: 2,
  fontSize: '14px',
  width: '100%',
  '&:hover': {
    background: '#FDDCDA', // Darker background color on hover
  },
  '&:disabled': {
    color: '#345BFF',
    borderColor: '#FFF',
    background: '#FFEEEB',
  },
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
});

export const outlineButton = (theme) => ({
  variant: 'outlined',
  size: 'large',
  color: 'primary',
  padding: theme.spacing(1, 3), // Adjust padding values as needed
  maxWidth: '100%', // Add this line to limit the button's width
  whiteSpace: 'nowrap', // Prevent text from wrapping to a new line
  overflow: 'hidden', // Hide any overflow text
  borderRadius: 16,
  textOverflow: 'ellipsis', // Show an ellipsis (...) if the text overflows
});

// ----------------------------------------------------------------------

export const menuItem = (theme) => ({
  ...theme.typography.body2,
  padding: theme.spacing(0.75, 1),
  borderRadius: theme.shape.borderRadius * 0.75,
  '&:not(:last-of-type)': {
    marginBottom: 4,
  },
  [`&.${menuItemClasses.selected}`]: {
    fontWeight: theme.typography.fontWeightSemiBold,
    backgroundColor: theme.palette.action.selected,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  [`& .${checkboxClasses.root}`]: {
    padding: theme.spacing(0.5),
    marginLeft: theme.spacing(-0.5),
    marginRight: theme.spacing(0.5),
  },
  [`&.${autocompleteClasses.option}[aria-selected="true"]`]: {
    backgroundColor: theme.palette.action.selected,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  [`&+.${dividerClasses.root}`]: {
    margin: theme.spacing(0.5, 0),
  },
});

// ----------------------------------------------------------------------

export function bgBlur(props) {
  const color = props?.color || '#000000';
  const blur = props?.blur || 6;
  const opacity = props?.opacity || 0.8;
  const imgUrl = props?.imgUrl;

  if (imgUrl) {
    return {
      position: 'relative',
      backgroundImage: `url(${imgUrl})`,
      '&:before': {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 9,
        content: '""',
        width: '100%',
        height: '100%',
        backdropFilter: `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`,
        backgroundColor: alpha(color, opacity),
      },
    };
  }

  return {
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
    backgroundColor: alpha(color, opacity),
  };
}

// ----------------------------------------------------------------------

export function bgGradient(props) {
  const direction = props?.direction || 'to bottom';
  const startColor = props?.startColor;
  const endColor = props?.endColor;
  const imgUrl = props?.imgUrl;
  const color = props?.color;

  if (imgUrl) {
    return {
      background: `linear-gradient(${direction}, ${startColor || color}, ${
        endColor || color
      }), url(${imgUrl})`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center center',
    };
  }

  return {
    background: `linear-gradient(${direction}, ${startColor}, ${endColor})`,
  };
}

// ----------------------------------------------------------------------

export function textGradient(value) {
  return {
    background: `-webkit-linear-gradient(${value})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  };
}

// ----------------------------------------------------------------------

export const hideScroll = {
  x: {
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
    overflowX: 'scroll',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  y: {
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
    overflowY: 'scroll',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
};
