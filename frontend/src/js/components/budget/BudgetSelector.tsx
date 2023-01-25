import React, {Fragment, useEffect, useState} from "react";
import {ShortBudget} from "../../api/model";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import {BudgetSelectorProps} from "../../containers/BudgetSelectorTool";

function BudgetSelector(props: BudgetSelectorProps) {
    const [currentlySelectedBudget, setCurrentlySelectedBudget] = useState<number | undefined>(-1);

    useEffect(() => {
        setCurrentlySelectedBudget(props.activeBudgetId);
    }, [props.activeBudgetId]);

    const onBudgetSelect = (id: string | number) => {
        if (id === 'next') {
            props.loadNextBudgetPage();
        } else {
            setCurrentlySelectedBudget(id as number);
            if (props.onChange) {
                props.onChange(id as number);
            }
        }
    };

    const applySelectedBudget = () => {
        if (currentlySelectedBudget != undefined) {
            props.apply(currentlySelectedBudget);
        }
    };

    const budgetList = props.budgets.map((b: ShortBudget, index: number) => (
        <MenuItem key={index} value={b.id}>{`${b.term_beginning} - ${b.term_end}`}</MenuItem>
    ));
    if (props.nextAvailable) {
        budgetList.push(
            <MenuItem key="next" value="next">
                Load more budgets
            </MenuItem>
        );
    }
    return (
        <Fragment>
            <Select
                disabled={props.budgets.length === 0}
                value={currentlySelectedBudget}
                onChange={ev => onBudgetSelect(ev.target.value)}>
                {budgetList}
            </Select>
            <Button
                color="primary"
                variant="outlined"
                onClick={applySelectedBudget}
                disabled={currentlySelectedBudget == undefined}>
                Select budget
            </Button>
        </Fragment>
    )
}

export default BudgetSelector;
