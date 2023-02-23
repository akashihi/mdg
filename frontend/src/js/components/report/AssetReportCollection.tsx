import React, { Fragment, ReactElement } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import AssetReportSimple from './AssetReportSimple';
import AssetReportCurrency from './AssetReportCurrency';
import AssetReportType from './AssetReportType';
import { ReportParams } from '../../api/api';

export function AssetReportCollection(props: ReportParams): ReactElement {
    return (
        <Fragment>
            <Accordion defaultExpanded TransitionProps={{ unmountOnExit: true }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>Assets by time</AccordionSummary>
                <AccordionDetails>
                    <AssetReportSimple
                        startDate={props.startDate}
                        endDate={props.endDate}
                        granularity={props.granularity}
                        primaryCurrencyName={props.primaryCurrencyName}
                    />
                </AccordionDetails>
            </Accordion>
            <Accordion TransitionProps={{ unmountOnExit: true }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>Detailed assets by time</AccordionSummary>
                <AccordionDetails>
                    <AssetReportCurrency
                        startDate={props.startDate}
                        endDate={props.endDate}
                        granularity={props.granularity}
                        primaryCurrencyName={props.primaryCurrencyName}
                    />
                </AccordionDetails>
            </Accordion>
            <Accordion TransitionProps={{ unmountOnExit: true }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>Asset structure</AccordionSummary>
                <AccordionDetails>
                    <AssetReportType
                        startDate={props.startDate}
                        endDate={props.endDate}
                        granularity={props.granularity}
                        primaryCurrencyName={props.primaryCurrencyName}
                    />
                </AccordionDetails>
            </Accordion>
        </Fragment>
    );
}

export default AssetReportCollection;
