import { IconButton, SvgIcon } from '@mui/material'

export function Icon(props) {
    return (
        <IconButton>
            <SvgIcon component={props.icon} />
        </IconButton>
    );
}