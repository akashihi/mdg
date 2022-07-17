import React, { useEffect } from 'react';
import { BudgetOverviewProps } from '../../containers/BudgetOverview';
import BudgetInfo from './BudgetInfo';

export function BudgetOverviewPanel(props: BudgetOverviewProps) {
    useEffect(() => {
        props.getCurrentBudget();
    }, []);

    return <BudgetInfo short budget={props.budget} />;
}

export default BudgetOverviewPanel;
