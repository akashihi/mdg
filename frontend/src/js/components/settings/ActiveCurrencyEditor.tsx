import React, {Fragment, useState} from 'react';
import {CurrencyEditorProps} from "../../containers/CurrencyEditor";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import Currency from "../../models/Currency";
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

export function ActiveCurrencyEditor(props: CurrencyEditorProps) {
    const [selectedActive, setSelectedActive] = useState(null);
    const [selectedInactive, setSelectedInactive] = useState(null);

    const currencyToListItems = (c: Currency[], selected: number, setter: typeof setSelectedActive) => c.map((item, index) => {
        return (
            <ListItem key={item.id} dense>
                <ListItemButton selected={selected === index} onClick={(_) => setter(index)}>
                    <ListItemText primary={item.name}/>
                </ListItemButton>
            </ListItem>
        )
    })

    return (
        <Fragment>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={4} md={4} lg={4}>
                    <List sx={{
                        position: 'relative',
                        overflow: 'auto',
                        maxHeight: 160,
                        margin: '1em'
                    }}>
                        {currencyToListItems(props.inactiveCurrencies, selectedInactive, setSelectedInactive)}
                    </List>
                </Grid>
                <Grid item xs={6} sm={1} md={1} lg={1}>
                    <Button color='primary' onClick={() => props.updateCurrency(props.activeCurrencies[selectedActive], false)}>&lt;&lt;</Button>
                </Grid>
                <Grid item xs={6} sm={1} md={1} lg={1}>
                    <Button color='primary' onClick={() => props.updateCurrency(props.inactiveCurrencies[selectedInactive], true)}>&gt;&gt;</Button>
                </Grid>
                <Grid item xs={12} sm={4} md={4} lg={4}>
                    <List sx={{
                        position: 'relative',
                        overflow: 'auto',
                        maxHeight: 160,
                        margin: '1em'
                    }}>
                        {currencyToListItems(props.activeCurrencies, selectedActive, setSelectedActive)}
                    </List>
                </Grid>
            </Grid>
        </Fragment>
    )
}

export default ActiveCurrencyEditor;
