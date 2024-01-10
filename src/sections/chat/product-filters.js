import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

import { chatButton } from 'src/theme/css';


import InputBase, { inputBaseClasses } from '@mui/material/InputBase';

// ----------------------------------------------------------------------

function InputRange({ type, value, onBlur }) {
  const min = value[0];
  const max = value[1];

  const handleBlurInputRange = (event) => {
    const inputValue = Number(event.target.value);

    if (inputValue < 0) {
      onBlur(type === 'min' ? 0 : min);
    } else if (inputValue > 200) {
      onBlur(type === 'min' ? 200 : max);
    } else {
      onBlur(inputValue);
    }
  };

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: 1 }}>
      <Typography
        variant="caption"
        sx={{
          flexShrink: 0,
          color: 'text.disabled',
          textTransform: 'capitalize',
          fontWeight: 'fontWeightSemiBold',
        }}
      >
        {`${type} ($)`}
      </Typography>

      <InputBase
        fullWidth
        value={type === 'min' ? min : max}
        onChange={handleBlurInputRange}
        onBlur={handleBlurInputRange}
        inputProps={{
          step: 10,
          min: 0,
          max: 200,
          type: 'number',
          'aria-labelledby': 'input-slider',
        }}
        sx={{
          maxWidth: 48,
          borderRadius: 0.75,
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
          [`& .${inputBaseClasses.input}`]: {
            pr: 1,
            py: 0.75,
            textAlign: 'right',
            typography: 'body2',
          },
        }}
      />
    </Stack>
  );
}

InputRange.propTypes = {
  type: PropTypes.oneOf(['min', 'max']),
  value: PropTypes.arrayOf(PropTypes.number),
  onBlur: PropTypes.func,
};

export default function ProductFilters({
  open,
  onOpen,
  onClose,
  filters: initialFilters, // Use initialFilters instead of filters directly
  canReset,
}) {
  const marksLabel = [...Array(21)].map((_, index) => {
    const value = index * 10;
    const firstValue = index === 0 ? `$${value}` : `${value}`;
    return {
      value,
      label: index % 4 ? '' : firstValue,
    };
  });

  const [filters, setFilters] = useState(initialFilters); // Use state to manage filters

  const handleFilterPriceRange = useCallback(
    (event, newValue) => {
      setFilters((prevFilters) => ({
        ...prevFilters,
        priceRange: newValue,
      }));
    },
    [setFilters]
  );

  const handleBlurInputRange = (type, inputValue) => {
    const min = filters.priceRange[0];
    const max = filters.priceRange[1];

    if (inputValue < 0) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        priceRange: [0, max],
      }));
    } else if (inputValue > 200) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        priceRange: [200, max],
      }));
    } else if (type === 'min') {
      setFilters((prevFilters) => ({
        ...prevFilters,
        priceRange: [inputValue, max],
      }));
    } else if (type === 'max') {
      setFilters((prevFilters) => ({
        ...prevFilters,
        priceRange: [min, inputValue],
      }));
    }
  };

  return (
    <>
    <Paper sx={{ backgroundColor: 'white', p: 2, borderRadius: 1 }}>
      <Stack>
        <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
          Your Monthly Budget Range
        </Typography>
  
        <Stack direction="row" spacing={5} sx={{ my: 2 }}>
          <InputRange
            type="min"
            value={filters.priceRange}
            onBlur={(value) => handleBlurInputRange('min', value)}
          />
          <InputRange
            type="max"
            value={filters.priceRange}
            onBlur={(value) => handleBlurInputRange('max', value)}
          />
        </Stack>
  
        <Slider
          value={filters.priceRange}
          onChange={handleFilterPriceRange}
          step={10}
          min={0}
          max={200}
          marks={marksLabel}
          getAriaValueText={(value) => `$${value}`}
          valueLabelFormat={(value) => `$${value}`}
          sx={{
            alignSelf: 'center',
            width: `calc(100% - 24px)`,
          }}
        />
      </Stack>
    </Paper>
    <Button
        sx={chatButton}>Submit Budget
        </Button>

          
</>
  );
}

ProductFilters.propTypes = {
  open: PropTypes.bool,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  canReset: PropTypes.bool,
  filters: PropTypes.object, // Make sure filters are provided as props
};
