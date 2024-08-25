import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
// components
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function OrganizationTableFiltersResult({
    filters,
    onFilters,
    //
    onResetFilters,
    //
    results,
    ...other
}) {
    const handleRemoveRole = (inputValue) => {
        const newValue = filters.roles.filter((item) => item !== inputValue);
        onFilters('roles', newValue);
    };

    const handleRemoveLocation = (inputValue) => {
        const newValue = filters.locations.filter((item) => item !== inputValue);
        onFilters('locations', newValue);
    };

    return (
        <Stack spacing={1.5} {...other}>
            <Box sx={{ typography: 'body2' }}>
                <strong>{results}</strong>
                <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
                    results found
                </Box>
            </Box>

            <Stack flexGrow={1} spacing={1} direction="row" flexWrap="wrap" alignItems="center">
                {!!filters.roles.length && (
                    <Block label="Roles:">
                        {filters.roles.map((item) => (
                            <Chip key={item} label={item} size="small" onDelete={() => handleRemoveRole(item)} />
                        ))}
                    </Block>
                )}

                {!!filters.locations.length && (
                    <Block label="Locations:">
                        {filters.locations.map((item) => (
                            <Chip
                                key={item}
                                label={item}
                                size="small"
                                onDelete={() => handleRemoveLocation(item)}
                            />
                        ))}
                    </Block>
                )}

                <Button
                    color="error"
                    onClick={onResetFilters}
                    startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                >
                    Clear
                </Button>
            </Stack>
        </Stack>
    );
}

OrganizationTableFiltersResult.propTypes = {
    filters: PropTypes.object,
    onFilters: PropTypes.func,
    onResetFilters: PropTypes.func,
    results: PropTypes.number,
};

// ----------------------------------------------------------------------

function Block({ label, children, sx, ...other }) {
    return (
        <Stack
            component={Paper}
            variant="outlined"
            spacing={1}
            direction="row"
            sx={{
                p: 1,
                borderRadius: 1,
                overflow: 'hidden',
                borderStyle: 'dashed',
                ...sx,
            }}
            {...other}
        >
            <Box component="span" sx={{ typography: 'subtitle2' }}>
                {label}
            </Box>

            <Stack spacing={1} direction="row" flexWrap="wrap">
                {children}
            </Stack>
        </Stack>
    );
}

Block.propTypes = {
    children: PropTypes.node,
    label: PropTypes.string,
    sx: PropTypes.object,
};
