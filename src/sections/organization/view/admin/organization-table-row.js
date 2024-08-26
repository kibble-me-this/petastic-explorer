import PropTypes from 'prop-types';
import { format } from 'date-fns';
// @mui
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function OrganizationTableRow({
    row,
    selected,
    onSelectRow,
    onDeleteRow,
    onEditRow,
    onViewRow,
}) {
    const {
        primary_account: {
            shelter_details: { shelter_name_common: name, shelter_logo_url: logoUrl } = {},
            created_at: createdAt,
            contact_info: { city, state } = {},
        },
        role,
        isActive,
        petCount,
    } = row;

    const confirm = useBoolean();
    const popover = usePopover();

    // Validate createdAt
    const createdDate = new Date(createdAt);
    const isValidCreatedAt = !Number.isNaN(createdDate.getTime());

    // Limit the number of characters for shelter_name_common to 30
    const truncatedName = name && name.length > 30 ? `${name.slice(0, 30)}...` : name;

    return (
        <>
            <TableRow hover selected={selected}>
                <TableCell padding="checkbox">
                    <Checkbox disabled checked={selected} onClick={onSelectRow} />
                </TableCell>

                <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                        alt={name}
                        src={logoUrl}
                        variant="rounded"
                        sx={{ width: 32, height: 32, mr: 2 }}
                    />
                    <ListItemText
                        disableTypography
                        primary={
                            <Link
                                noWrap
                                color="inherit"
                                variant="subtitle2"
                                onClick={onViewRow}
                                sx={{ cursor: 'pointer' }}
                            >
                                {truncatedName}  {/* Display truncated name */}
                            </Link>
                        }
                    // secondary={
                    //     <Box component="div" sx={{ typography: 'body2', color: 'text.disabled' }}>
                    //         {role}
                    //     </Box>
                    // }
                    />
                </TableCell>

                <TableCell>
                    {isValidCreatedAt ? (
                        <ListItemText
                            primary={format(createdDate, 'dd MMM yyyy')}
                            secondary={format(createdDate, 'p')}
                            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
                            secondaryTypographyProps={{
                                mt: 0.5,
                                component: 'span',
                                typography: 'caption',
                            }}
                        />
                    ) : (
                        <ListItemText
                            primary="Invalid Date"
                            secondary="Invalid Date"
                            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
                            secondaryTypographyProps={{
                                mt: 0.5,
                                component: 'span',
                                typography: 'caption',
                            }}
                        />
                    )}
                </TableCell>

                <TableCell>
                    {city}, {state}
                </TableCell>

                <TableCell>{petCount}</TableCell>

                <TableCell>
                    <Label variant="soft" color={isActive ? 'success' : 'default'}>
                        {isActive ? 'Active' : 'Inactive'}
                    </Label>
                </TableCell>

                <TableCell align="right">
                    <IconButton color={popover.open ? 'primary' : 'default'} onClick={popover.onOpen}>
                        <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
                </TableCell>
            </TableRow>

            <CustomPopover
                open={popover.open}
                onClose={popover.onClose}
                arrow="right-top"
                sx={{ width: 140 }}
            >
                <MenuItem
                    disabled
                    onClick={() => {
                        onViewRow();
                        popover.onClose();
                    }}
                >
                    <Iconify icon="solar:eye-bold" />
                    View
                </MenuItem>

                <MenuItem
                    disabled
                    onClick={() => {
                        onEditRow();
                        popover.onClose();
                    }}
                >
                    <Iconify icon="solar:pen-bold" />
                    Edit
                </MenuItem>

                <MenuItem
                    disabled
                    onClick={() => {
                        confirm.onTrue();
                        popover.onClose();
                    }}
                    sx={{ color: 'error.main' }}
                >
                    <Iconify icon="solar:trash-bin-trash-bold" />
                    Delete
                </MenuItem>
            </CustomPopover>

            <ConfirmDialog
                open={confirm.value}
                onClose={confirm.onFalse}
                title="Delete"
                content="Are you sure want to delete?"
                action={
                    <Button variant="contained" color="error" onClick={onDeleteRow}>
                        Delete
                    </Button>
                }
            />
        </>
    );
}

OrganizationTableRow.propTypes = {
    row: PropTypes.object.isRequired,
    selected: PropTypes.bool,
    onSelectRow: PropTypes.func,
    onDeleteRow: PropTypes.func,
    onEditRow: PropTypes.func,
    onViewRow: PropTypes.func,
};
