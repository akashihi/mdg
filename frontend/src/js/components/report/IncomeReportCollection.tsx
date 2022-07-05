import React, { Fragment } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import IncomeReportEventsAccount from './IncomeReportEventsAccount';
import IncomeByAccountWeight from './IncomeByAccountWeight';
import {ReportProps} from "./ReportsPage";

export function IncomeReportCollection(props: ReportProps) {
    return (
      <Fragment>
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            Income operations by account
          </AccordionSummary>
          <AccordionDetails>
            <IncomeReportEventsAccount startDate={props.startDate} endDate={props.endDate} granularity={props.granularity} primaryCurrencyName={props.primaryCurrencyName}/>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            Income accounts weight
          </AccordionSummary>
          <AccordionDetails>
              {/*<IncomeByAccountWeight  startDate={props.startDate} endDate={props.endDate} granularity={props.granularity} primaryCurrencyName={props.primaryCurrencyName}/>*/}
          </AccordionDetails>
        </Accordion>
      </Fragment>
    )
}

export default IncomeReportCollection;
