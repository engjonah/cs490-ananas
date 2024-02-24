import { Tooltip, IconButton, SvgIcon } from '@mui/material'

export function Icon(props) {
  return (
    <Tooltip title={props.tooltip}>
      <IconButton>
        <SvgIcon component={props.icon} />
      </IconButton>
    </Tooltip>
  );
}