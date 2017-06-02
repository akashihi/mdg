import React, {Component} from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import {GridList, GridTile} from 'material-ui/GridList';
import {Grid, Row, Col} from 'react-flexbox-grid';

import Transaction from './Transaction';

export default class OperationsPage extends Component {
    render() {
        return <div>
            <Card>
                <CardHeader
                    title='Showing from 02-05-2017 till 02-06-2017'
                    actAsExpander={true}
                    showExpandableButton={true}
                />
                <CardText expandable={true}>
                    Filter is here
                </CardText>
            </Card>
            <Divider/>
            <GridList cols={1} cellHeight='auto'>
                <GridTile>
                    <Card>
                        <CardHeader>
                            <Grid>
                                <Row>
                                    <Col xs={1}/>
                                    <Col xs={1}>Date</Col>
                                    <Col xs={3}>Comment</Col>
                                    <Col xs={2}>Amount</Col>
                                    <Col xs={2}>Accounts</Col>
                                    <Col xs={2}>Tags</Col>
                                    <Col xs={1}/>
                                </Row>
                            </Grid>
                        </CardHeader>
                    </Card>
                </GridTile>
                <GridTile>
                    <Transaction/>
                </GridTile>
                <GridTile>
                    <Transaction/>
                </GridTile>
                <GridTile>
                    <Transaction/>
                </GridTile>
                <GridTile>
                    <Transaction/>
                </GridTile>
                <GridTile>
                    <Transaction/>
                </GridTile>
                <GridTile>
                    <Transaction/>
                </GridTile>
                <GridTile>
                    <Transaction/>
                </GridTile>
                <GridTile>
                    <Transaction/>
                </GridTile>
                <GridTile>
                    <Transaction/>
                </GridTile>
                <GridTile>
                    <Transaction/>
                </GridTile>
            </GridList>
        </div>;
    }
}
