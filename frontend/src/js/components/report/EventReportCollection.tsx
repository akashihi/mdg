import React, { Fragment } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import EventsReportByAccount from './EventsReportByAccount';
import EventsReportByWeight from './EventsReportByWeight';
import { ReportParams } from '../../api/api';

export interface EventReportProps extends ReportParams {
    type: string;
}

export function EventReportCollection(props: EventReportProps) {
    return (
        <Fragment>
            <Accordion defaultExpanded TransitionProps={{ unmountOnExit: true }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>{props.type} operations by account</AccordionSummary>
                <AccordionDetails>
                    <EventsReportByAccount
                        startDate={props.startDate}
                        endDate={props.endDate}
                        granularity={props.granularity}
                        primaryCurrencyName={props.primaryCurrencyName}
                        type={props.type}
                    />
                </AccordionDetails>
            </Accordion>
            <Accordion TransitionProps={{ unmountOnExit: true }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>{props.type} accounts weight</AccordionSummary>
                <AccordionDetails>
                    <EventsReportByWeight
                        startDate={props.startDate}
                        endDate={props.endDate}
                        granularity={props.granularity}
                        primaryCurrencyName={props.primaryCurrencyName}
                        type={props.type}
                    />
                </AccordionDetails>
            </Accordion>
        </Fragment>
    );
}

export default EventReportCollection;
