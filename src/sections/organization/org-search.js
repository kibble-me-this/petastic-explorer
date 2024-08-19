import PropTypes from 'prop-types';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
// @mui
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';

import { useSearchOrganizations } from 'src/api/organization';

// components
import Iconify from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';
import SearchNotFound from 'src/components/search-not-found';

// ----------------------------------------------------------------------

export default function OrganizationSearch({ query, onSearch, accountIds, hrefItem }) {
  const router = useRouter();

  // Use `useSearchOrganizations` hook to fetch and filter organizations
  const { searchResults, searchLoading, searchError, searchEmpty } = useSearchOrganizations(query, accountIds);

  const handleClick = (id) => {
    router.push(hrefItem(id));
  };

  return (
    <Autocomplete
      sx={{ width: { xs: 1, sm: 260 } }}
      autoHighlight
      popupIcon={null}
      options={searchResults}  // Use filtered search results from the hook
      loading={searchLoading}
      noOptionsText={searchEmpty ? <SearchNotFound query={query} sx={{ bgcolor: 'unset' }} /> : "No Results"}
      getOptionLabel={(option) => option.primary_account?.shelter_details?.shelter_name_common || ''}
      onInputChange={(event, newValue) => onSearch(newValue)}  // Ensure `onSearch` is being called
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search..."
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ ml: 1, color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
      )}
      renderOption={(props, org, { inputValue }) => {
        const matches = match(org.primary_account.shelter_details.shelter_name_common, inputValue);
        const parts = parse(org.primary_account.shelter_details.shelter_name_common, matches);

        return (
          <Box
            component="li" {...props}
            // onClick={() => handleClick(org.primary_account.account_id)}
            key={org.primary_account.account_id}
          >
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
          </Box>
        );
      }}
    />
  );
}

OrganizationSearch.propTypes = {
  hrefItem: PropTypes.func.isRequired,
  query: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
  accountIds: PropTypes.array.isRequired,
};
