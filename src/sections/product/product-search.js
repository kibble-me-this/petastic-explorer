import PropTypes from 'prop-types';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
// @mui
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';
// routes
import { useRouter } from 'src/routes/hooks';
// components
import Iconify from 'src/components/iconify';
import SearchNotFound from 'src/components/search-not-found';
import { useState } from 'react';

// ----------------------------------------------------------------------

export default function ProductSearch({ query, results, onSearch, hrefItem, loading, onSelectProduct }) {
  const [inputValue, setInputValue] = useState(query); // Controlled input state
  const [isClearing, setIsClearing] = useState(false); // Track when the input is being cleared
  const router = useRouter();

  const handleClick = (id, title) => {
    // Trigger the callback to select the product
    onSelectProduct(id);
    // Set the input value to the selected product's title (optional)
    setInputValue(title);
  };

  const handleKeyUp = (event) => {
    if (inputValue) {
      if (event.key === 'Enter') {
        const selectItem = results.filter((product) => product.title === inputValue)[0];
        if (selectItem) {
          handleClick(selectItem.product_id, selectItem.title);
        }
      }
    }
  };

  const handleInputChange = (event, newValue) => {
    setInputValue(newValue); // Keep inputValue updated
    if (newValue === '') {
      setIsClearing(true); // Mark as clearing if input is empty
      onSearch(''); // Trigger the search logic with an empty string to reset
    } else {
      setIsClearing(false); // Reset clearing state
      onSearch(newValue); // Trigger the search logic with the new value
    }
  };

  return (
    <Autocomplete
      sx={{ width: { xs: 1, sm: 260 } }}
      loading={loading}
      autoHighlight
      popupIcon={null}
      options={results}
      inputValue={inputValue} // Bind inputValue to the input field
      onInputChange={handleInputChange}
      getOptionLabel={(option) => option.title}
      noOptionsText={<SearchNotFound query={query} sx={{ bgcolor: 'unset' }} />}
      isOptionEqualToValue={(option, value) => option.product_id === value.product_id}
      clearOnBlur={false} // Prevent clearing when losing focus
      clearOnEscape // Allow clearing on escape key
      slotProps={{
        popper: {
          placement: 'bottom-start',
          sx: {
            minWidth: 320,
          },
        },
        paper: {
          sx: {
            [` .${autocompleteClasses.option}`]: {
              pl: 0.75,
            },
          },
        },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search..."
          onKeyUp={handleKeyUp}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ ml: 1, color: 'text.disabled' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <>
                {loading ? <Iconify icon="svg-spinners:8-dots-rotate" sx={{ mr: -3 }} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={(props, product, { inputValue: searchInputValue }) => { // Renamed inputValue to searchInputValue
        const matches = match(product.title, searchInputValue);
        const parts = parse(product.title, matches);

        return (
          <Box component="li" {...props} onClick={() => handleClick(product.product_id, product.title)} key={product.product_id}>
            <Avatar
              key={product.product_id}
              alt={product.title}
              src={product.main_image}
              variant="rounded"
              sx={{
                width: 48,
                height: 48,
                flexShrink: 0,
                mr: 1.5,
                borderRadius: 1,
              }}
            />

            <div key={searchInputValue}>
              {parts.map((part, index) => (
                <Typography
                  key={index}
                  component="span"
                  color={part.highlight ? 'primary' : 'textPrimary'}
                  sx={{
                    typography: 'body2',
                    fontWeight: part.highlight ? 'fontWeightSemiBold' : 'fontWeightMedium',
                  }}
                >
                  {part.text}
                </Typography>
              ))}
            </div>
          </Box>
        );
      }}
    />
  );
}

ProductSearch.propTypes = {
  hrefItem: PropTypes.func,
  loading: PropTypes.bool,
  onSearch: PropTypes.func,
  query: PropTypes.string,
  results: PropTypes.array,
  onSelectProduct: PropTypes.func, // Prop to handle product selection
};
