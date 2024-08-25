import PropTypes from 'prop-types';
import { useCallback } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
// components
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function OrganizationTableToolbar({
    filters,
    onFilters,
    accountId,
    onAccountIdChange,
    accountIds = [],  // Default to an empty array
}) {
    const popover = usePopover();

    const handleFilterName = useCallback(
        (event) => {
            onFilters('name', event.target.value);
        },
        [onFilters]
    );

    const handleAccountIdChange = useCallback(
        (event) => {
            onAccountIdChange(event.target.value);
        },
        [onAccountIdChange]
    );

    return (
        <>
            <Stack
                spacing={2}
                alignItems={{ xs: 'flex-end', md: 'center' }}
                direction={{
                    xs: 'column',
                    md: 'row',
                }}
                sx={{
                    p: 2.5,
                    pr: { xs: 2.5, md: 1 },
                }}
            >
                {/* Filter by Account ID */}
                <FormControl
                    sx={{
                        flexShrink: 0,
                        width: { xs: 1, md: 200 },
                    }}
                >
                    <TextField
                        select
                        label="Account ID"
                        value={accountId || ''}
                        onChange={handleAccountIdChange}
                        sx={{ minWidth: 200 }}
                    >
                        {accountIds.length > 0 &&
                            accountIds.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                    </TextField>
                </FormControl>

                {/* Search by Organization Name */}
                <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
                    <TextField
                        fullWidth
                        value={filters.name || ''}
                        onChange={handleFilterName}
                        placeholder="Search organization..."
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                                </InputAdornment>
                            ),
                        }}
                    />

                    {/* Popover for additional actions */}
                    <IconButton onClick={popover.onOpen}>
                        <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
                </Stack>
            </Stack>

            {/* Custom Popover for additional actions */}
            <CustomPopover
                open={popover.open}
                onClose={popover.onClose}
                arrow="right-top"
                sx={{ width: 140 }}
            >
                <MenuItem
                    disabled
                    onClick={() => {
                        popover.onClose();
                    }}
                >
                    <Iconify icon="solar:import-bold" />
                    Import
                </MenuItem>

                <MenuItem
                    disabled
                    onClick={() => {
                        popover.onClose();
                    }}
                >
                    <Iconify icon="solar:export-bold" />
                    Export
                </MenuItem>
            </CustomPopover>
        </>
    );
}

OrganizationTableToolbar.propTypes = {
    filters: PropTypes.shape({
        name: PropTypes.string,
    }).isRequired,
    onFilters: PropTypes.func.isRequired,
    accountId: PropTypes.string,
    onAccountIdChange: PropTypes.func.isRequired,
    accountIds: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
        })
    ),
};
