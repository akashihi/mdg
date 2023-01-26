import React, {Fragment, ReactElement, useEffect, useState} from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { ReportParams } from '../../api/api';
import BudgetExecutionReport from "./BudgetExecutionReport";
import BudgetSelectorTool from "../../containers/BudgetSelectorTool";

export function BudgetReportCollection(props: ReportParams): ReactElement {
    const [selectedBudget, setsSelectedBudget] = useState<number | undefined>(-1);
    return (
        <Fragment>
            <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>Assets by time</AccordionSummary>
                <AccordionDetails>
                    <BudgetSelectorTool onChange={setsSelectedBudget}/>
                    {selectedBudget}
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
