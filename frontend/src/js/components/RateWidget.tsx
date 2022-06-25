import React, { Fragment } from 'react'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListSubheader from '@mui/material/ListSubheader'
import Divider from '@mui/material/Divider'
import { RateViewerState } from '../containers/RateViewer'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export const RateWidget = (props:RateViewerState) => {
    return (
        <Fragment>
            <Backdrop open={!props.available}>
                <CircularProgress color='inherit' />
            </Backdrop>
            <List>
                <ListSubheader>Currency rates</ListSubheader>
                <Divider />
                {props.rates.map(r => <ListItem key={r.id}><ListItemText primary={r.currencyCode} secondary={r.rate}/></ListItem>)}
            </List>
        </Fragment>
    )
}

export default RateWidget;
