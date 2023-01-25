import React, { Fragment, ReactElement } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import AssetReportSimple from './AssetReportSimple';
import { ReportParams } from '../../api/api';
import BudgetExecutionReport from "./BudgetExecutionReport";

export function BudgetReportCollection(props: ReportParams): ReactElement {
    return (
        <Fragment>
            <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>Assets by time</AccordionSummary>
                <AccordionDetails>
                    Budget cashflow report
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>Detailed assets by time</AccordionSummary>
                <AccordionDetails>
                    <BudgetExecutionReport
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

export default BudgetReportCollection;
