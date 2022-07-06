import React, {Fragment, useState} from 'react';
import moment, {Moment} from 'moment';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import DatePicker from 'react-date-picker'
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';

import AssetReportCollection from './AssetReportCollection'
import BudgetExecutionReport from './BudgetExecutionReport'
import EventReportCollection from './EventReportCollection'
import {ReportsViewerProps} from "../../containers/ReportsViewer";

export interface ReportProps {
    startDate: Moment;
    endDate: Moment;
    granularity: number;
    primaryCurrencyName: string;
}

export function ReportsPage(props: ReportsViewerProps) {
    const [startDate, setStartDate] = useState<Moment>(moment().subtract(1, 'month'));
    const [endDate, setEndDate] = useState<Moment>(moment());
    const [granularity, setGranularity] = useState<number>(7);
    const [tabValue, setTabValue] = useState<string>('asset');

    return (
        <Fragment>
            <Grid  container spacing={2} sx={{marginTop: "15px"}}>
                <Grid item xs={6} sm={6} md={2} lg={2}>Report start date</Grid>
                <Grid item xs={6} sm={6} md={3} lg={3}><DatePicker format='d/M/yyyy' value={startDate.toDate()} onChange={(value) => setStartDate(moment(value))}/></Grid>
                <Grid item xs={6} sm={6} md={2} lg={2}>Report last date</Grid>
                <Grid item xs={6} sm={6} md={3} lg={3}><DatePicker format='d/M/yyyy' value={endDate.toDate()} onChange={(value) => setEndDate(moment(value))}/></Grid>
                <Grid item xs={6} sm={6} md={2} lg={2}>
                    <FormControl fullWidth={true}>
                        <InputLabel htmlFor={'granularity'}>Granularity</InputLabel>
                        <Select value={granularity}
                                onChange={(ev) => setGranularity(ev.target.value as number)}
                                inputProps={{id: 'granularity'}}>
                            <MenuItem value={1}>1 day</MenuItem>
                            <MenuItem value={7}>Week</MenuItem>
                            <MenuItem value={14}>2 weeks</MenuItem>
                            <MenuItem value={30}>Month</MenuItem>
                            <MenuItem value={92}>3 months</MenuItem>
                            <MenuItem value={365}>Year</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <Tabs value={tabValue} onChange={(_, value) => setTabValue(value)} centered variant={'fullWidth'}>
                <Tab label='Asset report' value='asset'/>
                <Tab label='Budget report' value='budget'/>
                <Tab label='Incomes report' value='income'/>
                <Tab label='Expenses report' value='expenses'/>
            </Tabs>
            {tabValue == 'asset' && <AssetReportCollection startDate={startDate} endDate={endDate} granularity={granularity} primaryCurrencyName={props.primaryCurrencyName}/>}
            {tabValue == 'budget' && <BudgetExecutionReport startDate={startDate} endDate={endDate} granularity={granularity} primaryCurrencyName={props.primaryCurrencyName}/>}
            {tabValue == 'income' && <EventReportCollection startDate={startDate} endDate={endDate} granularity={granularity} primaryCurrencyName={props.primaryCurrencyName} type='income'/>}
            {tabValue == 'expenses' && <EventReportCollection startDate={startDate} endDate={endDate} granularity={granularity} primaryCurrencyName={props.primaryCurrencyName} type='expense'/>}
        </Fragment>
    )
}

export default ReportsPage;
