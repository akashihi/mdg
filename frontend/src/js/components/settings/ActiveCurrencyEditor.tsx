import React, { Fragment, useState } from 'react';
import { CurrencyEditorProps } from '../../containers/CurrencyEditor';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import { Currency } from '../../api/model';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export function ActiveCurrencyEditor(props: CurrencyEditorProps) {
    const [selectedActive, setSelectedActive] = useState<number>(0);
    const [selectedInactive, setSelectedInactive] = useState<number>(0);

    const currencyToListItems = (c: Currency[], selected: number, setter: typeof setSelectedActive) =>
        c.map((item, index) => {
            return (
                <ListItem key={item.id} dense>
                    <ListItemButton selected={selected === index} onClick={() => setter(index)}>
                        <ListItemText primary={item.name} />
                    </ListItemButton>
                </ListItem>
            );
        });

    return (
        <Fragment>
            <Backdrop open={!props.available}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={4} md={4} lg={4}>
                    Available currencies:
                    <List
                        sx={{
                            position: 'relative',
                            overflow: 'auto',
                            maxHeight: 160,
                            margin: '1em',
                        }}>
                        {currencyToListItems(props.inactiveCurrencies, selectedInactive, setSelectedInactive)}
                    </List>
                </Grid>
                <Grid item xs={6} sm={1} md={1} lg={1}>
                    <Button
                        color="primary"
                        onClick={() => props.updateCurrency(false, props.activeCurrencies[selectedActive])}>
                        &lt;&lt;
                    </Button>
                </Grid>
                <Grid item xs={6} sm={1} md={1} lg={1}>
                    <Button
                        color="primary"
                        onClick={() => props.updateCurrency(true, props.inactiveCurrencies[selectedInactive])}>
                        &gt;&gt;
                    </Button>
                </Grid>
                <Grid item xs={12} sm={4} md={4} lg={4}>
                    Active currencies:
                    <List
                        sx={{
                            position: 'relative',
                            overflow: 'auto',
                            maxHeight: 160,
                            margin: '1em',
                        }}>
                        {currencyToListItems(props.activeCurrencies, selectedActive, setSelectedActive)}
                    </List>
                </Grid>
            </Grid>
        </Fragment>
    );
}

export default ActiveCurrencyEditor;
