import React, { Component, Fragment } from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import AssetReportSimple from './AssetReportSimple'
import AssetReportCurrency from './AssetReportCurrency'
import AssetReportType from './AssetReportType'

export default class AssetReportCollection extends Component {
  render () {
    const props = this.props
    return (
      <>
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            Assets by time
          </AccordionSummary>
          <AccordionDetails>
            <AssetReportSimple actions={props.actions} data={props.simpleAssetReport} currency={props.currencyName} />
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            Detailed assets by time
          </AccordionSummary>
          <AccordionDetails>
            <AssetReportCurrency actions={props.actions} data={props.currencyAssetReport} currency={props.currencyName} />
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            Asset structure
          </AccordionSummary>
          <AccordionDetails>
            <AssetReportType actions={props.actions} data={props.assetReportType} currency={props.currencyName} />
          </AccordionDetails>
        </Accordion>
      </>
    )
  }
}
