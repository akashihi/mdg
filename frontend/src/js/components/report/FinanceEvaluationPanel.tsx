import React, { Fragment, useEffect, useState } from 'react';
import ReactSpeedometer from 'react-d3-speedometer';
import * as API from '../../api/api';
import { EvaluationReport } from '../../api/models/Report';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import { FinanceEvaluationPanelProps } from '../../containers/FinanceEvaluation';

export function FinanceEvaluationPanel(props: FinanceEvaluationPanelProps) {
    const [report, setReport] = useState<EvaluationReport>({ income: 0, debt: 0, budget: 0, cash: 0, state: 0 });
    const [loading, setLoading] = useState<boolean>(false);
    const [etag, setEtag] = useState<string|undefined>(undefined)

    useEffect(() => {
        setLoading(true);
        (async () => {
            const result = await API.loadEvaluationReport(etag);
            if (result.ok) {
                if (result.val.some) {
                    setReport(result.val.val);
                }
                setLoading(false);
            } else {
                props.reportError(result.val);
            }
        })();
    }, []);
    return (
        <Fragment>
            <Backdrop open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <CardHeader
                title="Overall financial grade"
                sx={{
                    paddingTop: '0px',
                    textAlign: 'center',
                }}
            />
            <CardContent
                sx={{
                    overflowX: 'hidden',
                    overflowY: 'auto',
                }}>
                <Grid
                    container
                    spacing={2}
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                    }}>
                    <Grid item xs={12} sm={2} md={2} lg={2} sx={{ margin: '20px' }}>
                        <ReactSpeedometer
                            value={report.state}
                            maxSegmentLabels={5}
                            maxValue={100}
                            segments={100}
                            currentValueText="Overall score"
                        />
                    </Grid>
                    <Grid item xs={12} sm={2} md={2} lg={2} sx={{ margin: '20px' }}>
                        <ReactSpeedometer
                            value={report.cash}
                            maxSegmentLabels={4}
                            maxValue={100}
                            customSegmentStops={[0, 35, 75, 100]}
                            segmentColors={['firebrick', 'gold', 'limegreen']}
                            currentValueText="Cash availability"
                        />
                    </Grid>
                    <Grid item xs={12} sm={2} md={2} lg={2} sx={{ margin: '20px' }}>
                        <ReactSpeedometer
                            value={report.budget}
                            maxSegmentLabels={4}
                            maxValue={100}
                            customSegmentStops={[0, 80, 90, 100]}
                            segmentColors={['firebrick', 'gold', 'limegreen']}
                            currentValueText="Budget execution accuracy"
                        />
                    </Grid>
                    <Grid item xs={12} sm={2} md={2} lg={2} sx={{ margin: '20px' }}>
                        <ReactSpeedometer
                            value={report.debt}
                            maxSegmentLabels={4}
                            maxValue={100}
                            customSegmentStops={[0, 30, 60, 100]}
                            segmentColors={['limegreen', 'gold', 'firebrick']}
                            currentValueText="Debt load"
                        />
                    </Grid>
                    <Grid item xs={12} sm={2} md={2} lg={2} sx={{ margin: '20px' }}>
                        <ReactSpeedometer
                            value={report.income}
                            maxSegmentLabels={5}
                            minValue={-3}
                            maxValue={3}
                            customSegmentStops={[-3, -2, -1, 1, 2, 3]}
                            segmentColors={['firebrick', 'firebrick', 'firebrick', 'gold', 'limegreen']}
                            currentValueText="Income level"
                        />
                    </Grid>
                </Grid>
            </CardContent>
        </Fragment>
    );
}

export default FinanceEvaluationPanel;
