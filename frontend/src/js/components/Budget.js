import React, {Component} from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

export default class Budget extends Component {
    render() {
        return (
            <Card>
                <CardHeader title="1 Apr 2017 - 30 Apr 2017"/>
                <CardText>
                    <p>Income: 1500/8080</p>
                    <p>Expense: 9000/270</p>
                </CardText>
            </Card>
        )
    }
}
