import React, {Component} from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import Divider from 'material-ui/Divider';
import Drawer from 'material-ui/Drawer';
import DatePicker from 'material-ui/DatePicker';

import BudgetEntry from './BudgetEntry'
import Budget from './Budget'

export default class BudgetPage extends Component {
    render() {
        return (
            <div>
                <Drawer open={true}>
                    <DatePicker hintText="Budget beginning" container="inline" />
                    <DatePicker hintText="Budget end" container="inline" />
                    <IconButton><FontIcon className="material-icons">add_circle_outline</FontIcon></IconButton>
                    <Divider/>
                    <Budget/>
                    <Budget/>
                    <Budget/>
                    <Budget/>
                    <Budget/>
                    <Budget/>
                    <Budget/>
                    <Budget/>
                    <Budget/>
                    <Budget/>
                    <Budget/>
                    <Budget/>
                    <Budget/>
                    <Budget/>
                    <Budget/>
                    <Budget/>
                    <Budget/>
                </Drawer>
                <Card>
                    <CardHeader title="1 Apr 2017 - 30 Apr 2017 Budget"/>
                    <CardText>
                        <IconButton><FontIcon className="material-icons">chevron_left</FontIcon></IconButton>
                        <Divider/>
                        <p>Assets at first budget day: 9000</p>
                        <p>Expected assets at last budget day: 100500</p>
                        <p>Actual assets at last budget day: 3.62</p>
                        <p>Income: 1500 actual / 8080 expected</p>
                        <p>Spendings: 9000 actual / 270 expected</p>
                        <p>Today's spending: 0 allowed/ 2600 actual</p>
                        <Divider/>
                        <BudgetEntry/>
                        <BudgetEntry/>
                        <BudgetEntry/>
                        <BudgetEntry/>
                        <BudgetEntry/>
                        <BudgetEntry/>
                        <BudgetEntry/>
                        <BudgetEntry/>
                        <BudgetEntry/>
                        <BudgetEntry/>
                        <BudgetEntry/>
                        <BudgetEntry/>
                        <BudgetEntry/>
                        <BudgetEntry/>
                        <BudgetEntry/>
                        <BudgetEntry/>
                        <BudgetEntry/>
                        <BudgetEntry/>
                        <BudgetEntry/>
                        <BudgetEntry/>
                    </CardText>
                </Card>
            </div>
        )
    }
}
