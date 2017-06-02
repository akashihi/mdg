import React, {Component} from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import {GridList, GridTile} from 'material-ui/GridList';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Checkbox from 'material-ui/Checkbox';

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
                    <Card>
                        <CardHeader
                            actAsExpander={false}
                            showExpandableButton={true}>
                            <Grid>
                                <Row>
                                    <Col xs={1}><Checkbox/></Col>
                                    <Col xs={1}>2017-31-05</Col>
                                    <Col xs={3}>Blackjack and hookers</Col>
                                    <Col xs={2}>
                                        <div style={{color: 'red'}}> -100500</div>
                                    </Col>
                                    <Col xs={2}>Asset, Rent</Col>
                                    <Col xs={2}>Black jack, Hookers, Usd</Col>
                                    <Col xs={1}>Actions</Col>
                                </Row>
                            </Grid>
                        </CardHeader>
                        <CardText expandable={true}>
                            <Grid>
                                <Row>
                                    <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Account:</Col>
                                    <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                                </Row>
                                <Row><Col xs={6} xsOffset={6} mdOffset={10} md={2} lgOffset={10} lg={2}><Divider/></Col></Row>
                                <Row>
                                    <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Account:</Col>
                                    <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                                </Row>
                                <Row><Col xs={6} xsOffset={6} mdOffset={10} md={2} lgOffset={10} lg={2}><Divider/></Col></Row>
                                <Row>
                                    <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Account:</Col>
                                    <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                                </Row>
                                <Row><Col xs={6} xsOffset={6} mdOffset={10} md={2} lgOffset={10} lg={2}><Divider/></Col></Row>
                                <Row><Col xs={12} sm={12} mdOffset={6} md={6} lgOffset={6} lg={6}><Divider/></Col></Row>
                                <Row>
                                    <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Earned:</Col>
                                    <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                                </Row>
                                <Row>
                                    <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Kept:</Col>
                                    <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                                </Row>
                                <Row>
                                    <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Spent:</Col>
                                    <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                                </Row>
                            </Grid>
                        </CardText>
                    </Card>
                </GridTile>
                <GridTile>
                    <Card>
                        <CardHeader
                            actAsExpander={false}
                            showExpandableButton={true}>
                            <Grid>
                                <Row>
                                    <Col xs={1}><Checkbox/></Col>
                                    <Col xs={1}>2017-31-05</Col>
                                    <Col xs={3}>Blackjack and hookers</Col>
                                    <Col xs={2}>
                                        <div style={{color: 'red'}}> -100500</div>
                                    </Col>
                                    <Col xs={2}>Asset, Rent</Col>
                                    <Col xs={2}>Black jack, Hookers, Usd</Col>
                                    <Col xs={1}>Actions</Col>
                                </Row>
                            </Grid>
                        </CardHeader>
                        <CardText expandable={true}>
                            <Grid>
                                <Row>
                                    <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Account:</Col>
                                    <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                                </Row>
                                <Row><Col xs={6} xsOffset={6} mdOffset={10} md={2} lgOffset={10} lg={2}><Divider/></Col></Row>
                                <Row>
                                    <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Account:</Col>
                                    <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                                </Row>
                                <Row><Col xs={6} xsOffset={6} mdOffset={10} md={2} lgOffset={10} lg={2}><Divider/></Col></Row>
                                <Row>
                                    <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Account:</Col>
                                    <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                                </Row>
                                <Row><Col xs={6} xsOffset={6} mdOffset={10} md={2} lgOffset={10} lg={2}><Divider/></Col></Row>
                                <Row><Col xs={12} sm={12} mdOffset={6} md={6} lgOffset={6} lg={6}><Divider/></Col></Row>
                                <Row>
                                    <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Earned:</Col>
                                    <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                                </Row>
                                <Row>
                                    <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Kept:</Col>
                                    <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                                </Row>
                                <Row>
                                    <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Spent:</Col>
                                    <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                                </Row>
                            </Grid>
                        </CardText>
                    </Card>
                </GridTile>
                <GridTile>
                    <Card>
                        <CardHeader
                            actAsExpander={false}
                            showExpandableButton={true}>
                            <Grid>
                                <Row>
                                    <Col xs={1}><Checkbox/></Col>
                                    <Col xs={1}>2017-31-05</Col>
                                    <Col xs={3}>Blackjack and hookers</Col>
                                    <Col xs={2}>
                                        <div style={{color: 'red'}}> -100500</div>
                                    </Col>
                                    <Col xs={2}>Asset, Rent</Col>
                                    <Col xs={2}>Black jack, Hookers, Usd</Col>
                                    <Col xs={1}>Actions</Col>
                                </Row>
                            </Grid>
                        </CardHeader>
                        <CardText expandable={true}>
                            <Grid>
                                <Row>
                                    <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Account:</Col>
                                    <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                                </Row>
                                <Row><Col xs={6} xsOffset={6} mdOffset={10} md={2} lgOffset={10} lg={2}><Divider/></Col></Row>
                                <Row>
                                    <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Account:</Col>
                                    <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                                </Row>
                                <Row><Col xs={6} xsOffset={6} mdOffset={10} md={2} lgOffset={10} lg={2}><Divider/></Col></Row>
                                <Row>
                                    <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Account:</Col>
                                    <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                                </Row>
                                <Row><Col xs={6} xsOffset={6} mdOffset={10} md={2} lgOffset={10} lg={2}><Divider/></Col></Row>
                                <Row><Col xs={12} sm={12} mdOffset={6} md={6} lgOffset={6} lg={6}><Divider/></Col></Row>
                                <Row>
                                    <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Earned:</Col>
                                    <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                                </Row>
                                <Row>
                                    <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Kept:</Col>
                                    <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                                </Row>
                                <Row>
                                    <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Spent:</Col>
                                    <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                                </Row>
                            </Grid>
                        </CardText>
                    </Card>
                </GridTile>
                <GridTile>
                    <Card>
                        <CardHeader
                            actAsExpander={false}
                            showExpandableButton={true}>
                            <Grid>
                                <Row>
                                    <Col xs={1}><Checkbox/></Col>
                                    <Col xs={1}>2017-31-05</Col>
                                    <Col xs={3}>Blackjack and hookers</Col>
                                    <Col xs={2}>
                                        <div style={{color: 'red'}}> -100500</div>
                                    </Col>
                                    <Col xs={2}>Asset, Rent</Col>
                                    <Col xs={2}>Black jack, Hookers, Usd</Col>
                                    <Col xs={1}>Actions</Col>
                                </Row>
                            </Grid>
                        </CardHeader>
                        <CardText expandable={true}>
                            <Grid>
                                <Row>
                                    <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Account:</Col>
                                    <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                                </Row>
                                <Row><Col xs={6} xsOffset={6} mdOffset={10} md={2} lgOffset={10} lg={2}><Divider/></Col></Row>
                                <Row>
                                    <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Account:</Col>
                                    <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                                </Row>
                                <Row><Col xs={6} xsOffset={6} mdOffset={10} md={2} lgOffset={10} lg={2}><Divider/></Col></Row>
                                <Row>
                                    <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Account:</Col>
                                    <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                                </Row>
                                <Row><Col xs={6} xsOffset={6} mdOffset={10} md={2} lgOffset={10} lg={2}><Divider/></Col></Row>
                                <Row><Col xs={12} sm={12} mdOffset={6} md={6} lgOffset={6} lg={6}><Divider/></Col></Row>
                                <Row>
                                    <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Earned:</Col>
                                    <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                                </Row>
                                <Row>
                                    <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Kept:</Col>
                                    <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                                </Row>
                                <Row>
                                    <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Spent:</Col>
                                    <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                                </Row>
                            </Grid>
                        </CardText>
                    </Card>
                </GridTile>
                <GridTile>
                    <Card>
                        <CardHeader
                            actAsExpander={false}
                            showExpandableButton={true}>
                            <Grid>
                                <Row>
                                    <Col xs={1}><Checkbox/></Col>
                                    <Col xs={1}>2017-31-05</Col>
                                    <Col xs={3}>Blackjack and hookers</Col>
                                    <Col xs={2}>
                                        <div style={{color: 'red'}}> -100500</div>
                                    </Col>
                                    <Col xs={2}>Asset, Rent</Col>
                                    <Col xs={2}>Black jack, Hookers, Usd</Col>
                                    <Col xs={1}>Actions</Col>
                                </Row>
                            </Grid>
                        </CardHeader>
                        <CardText expandable={true}>
                            <Grid>
                                <Row>
                                    <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Account:</Col>
                                    <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                                </Row>
                                <Row><Col xs={6} xsOffset={6} mdOffset={10} md={2} lgOffset={10} lg={2}><Divider/></Col></Row>
                                <Row>
                                    <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Account:</Col>
                                    <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                                </Row>
                                <Row><Col xs={6} xsOffset={6} mdOffset={10} md={2} lgOffset={10} lg={2}><Divider/></Col></Row>
                                <Row>
                                    <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Account:</Col>
                                    <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                                </Row>
                                <Row><Col xs={6} xsOffset={6} mdOffset={10} md={2} lgOffset={10} lg={2}><Divider/></Col></Row>
                                <Row><Col xs={12} sm={12} mdOffset={6} md={6} lgOffset={6} lg={6}><Divider/></Col></Row>
                                <Row>
                                    <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Earned:</Col>
                                    <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                                </Row>
                                <Row>
                                    <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Kept:</Col>
                                    <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                                </Row>
                                <Row>
                                    <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Spent:</Col>
                                    <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                                </Row>
                            </Grid>
                        </CardText>
                    </Card>
                </GridTile>
                <GridTile>
                    <Card>
                        <CardHeader
                            actAsExpander={false}
                            showExpandableButton={true}>
                            <Grid>
                                <Row>
                                    <Col xs={1}><Checkbox/></Col>
                                    <Col xs={1}>2017-31-05</Col>
                                    <Col xs={3}>Blackjack and hookers</Col>
                                    <Col xs={2}>
                                        <div style={{color: 'red'}}> -100500</div>
                                    </Col>
                                    <Col xs={2}>Asset, Rent</Col>
                                    <Col xs={2}>Black jack, Hookers, Usd</Col>
                                    <Col xs={1}>Actions</Col>
                                </Row>
                            </Grid>
                        </CardHeader>
                        <CardText expandable={true}>
                            <Grid>
                                <Row>
                                    <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Account:</Col>
                                    <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                                </Row>
                                <Row><Col xs={6} xsOffset={6} mdOffset={10} md={2} lgOffset={10} lg={2}><Divider/></Col></Row>
                                <Row>
                                    <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Account:</Col>
                                    <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                                </Row>
                                <Row><Col xs={6} xsOffset={6} mdOffset={10} md={2} lgOffset={10} lg={2}><Divider/></Col></Row>
                                <Row>
                                    <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Account:</Col>
                                    <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                                </Row>
                                <Row><Col xs={6} xsOffset={6} mdOffset={10} md={2} lgOffset={10} lg={2}><Divider/></Col></Row>
                                <Row><Col xs={12} sm={12} mdOffset={6} md={6} lgOffset={6} lg={6}><Divider/></Col></Row>
                                <Row>
                                    <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Earned:</Col>
                                    <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                                </Row>
                                <Row>
                                    <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Kept:</Col>
                                    <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                                </Row>
                                <Row>
                                    <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Spent:</Col>
                                    <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                                </Row>
                            </Grid>
                        </CardText>
                    </Card>
                </GridTile>
                <GridTile>
                    <Card>
                        <CardHeader
                            actAsExpander={false}
                            showExpandableButton={true}>
                            <Grid>
                                <Row>
                                    <Col xs={1}><Checkbox/></Col>
                                    <Col xs={1}>2017-31-05</Col>
                                    <Col xs={3}>Blackjack and hookers</Col>
                                    <Col xs={2}>
                                        <div style={{color: 'red'}}> -100500</div>
                                    </Col>
                                    <Col xs={2}>Asset, Rent</Col>
                                    <Col xs={2}>Black jack, Hookers, Usd</Col>
                                    <Col xs={1}>Actions</Col>
                                </Row>
                            </Grid>
                        </CardHeader>
                        <CardText expandable={true}>
                            <Grid>
                                <Row>
                                    <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Account:</Col>
                                    <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                                </Row>
                                <Row><Col xs={6} xsOffset={6} mdOffset={10} md={2} lgOffset={10} lg={2}><Divider/></Col></Row>
                                <Row>
                                    <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Account:</Col>
                                    <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                                </Row>
                                <Row><Col xs={6} xsOffset={6} mdOffset={10} md={2} lgOffset={10} lg={2}><Divider/></Col></Row>
                                <Row>
                                    <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Account:</Col>
                                    <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                                </Row>
                                <Row><Col xs={6} xsOffset={6} mdOffset={10} md={2} lgOffset={10} lg={2}><Divider/></Col></Row>
                                <Row><Col xs={12} sm={12} mdOffset={6} md={6} lgOffset={6} lg={6}><Divider/></Col></Row>
                                <Row>
                                    <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Earned:</Col>
                                    <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                                </Row>
                                <Row>
                                    <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Kept:</Col>
                                    <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                                </Row>
                                <Row>
                                    <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Spent:</Col>
                                    <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                                </Row>
                            </Grid>
                        </CardText>
                    </Card>
                </GridTile>
                <GridTile>
                    <Card>
                        <CardHeader
                            actAsExpander={false}
                            showExpandableButton={true}>
                            <Grid>
                                <Row>
                                    <Col xs={1}><Checkbox/></Col>
                                    <Col xs={1}>2017-31-05</Col>
                                    <Col xs={3}>Blackjack and hookers</Col>
                                    <Col xs={2}>
                                        <div style={{color: 'red'}}> -100500</div>
                                    </Col>
                                    <Col xs={2}>Asset, Rent</Col>
                                    <Col xs={2}>Black jack, Hookers, Usd</Col>
                                    <Col xs={1}>Actions</Col>
                                </Row>
                            </Grid>
                        </CardHeader>
                        <CardText expandable={true}>
                            <Grid>
                                <Row>
                                    <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Account:</Col>
                                    <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                                </Row>
                                <Row><Col xs={6} xsOffset={6} mdOffset={10} md={2} lgOffset={10} lg={2}><Divider/></Col></Row>
                                <Row>
                                    <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Account:</Col>
                                    <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                                </Row>
                                <Row><Col xs={6} xsOffset={6} mdOffset={10} md={2} lgOffset={10} lg={2}><Divider/></Col></Row>
                                <Row>
                                    <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Account:</Col>
                                    <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                                </Row>
                                <Row><Col xs={6} xsOffset={6} mdOffset={10} md={2} lgOffset={10} lg={2}><Divider/></Col></Row>
                                <Row><Col xs={12} sm={12} mdOffset={6} md={6} lgOffset={6} lg={6}><Divider/></Col></Row>
                                <Row>
                                    <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Earned:</Col>
                                    <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                                </Row>
                                <Row>
                                    <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Kept:</Col>
                                    <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                                </Row>
                                <Row>
                                    <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Spent:</Col>
                                    <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                                </Row>
                            </Grid>
                        </CardText>
                    </Card>
                </GridTile>
                <GridTile>
                    <Card>
                        <CardHeader
                            actAsExpander={false}
                            showExpandableButton={true}>
                            <Grid>
                                <Row>
                                    <Col xs={1}><Checkbox/></Col>
                                    <Col xs={1}>2017-31-05</Col>
                                    <Col xs={3}>Blackjack and hookers</Col>
                                    <Col xs={2}>
                                        <div style={{color: 'red'}}> -100500</div>
                                    </Col>
                                    <Col xs={2}>Asset, Rent</Col>
                                    <Col xs={2}>Black jack, Hookers, Usd</Col>
                                    <Col xs={1}>Actions</Col>
                                </Row>
                            </Grid>
                        </CardHeader>
                        <CardText expandable={true}>
                            <Grid>
                                <Row>
                                    <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Account:</Col>
                                    <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                                </Row>
                                <Row><Col xs={6} xsOffset={6} mdOffset={10} md={2} lgOffset={10} lg={2}><Divider/></Col></Row>
                                <Row>
                                    <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Account:</Col>
                                    <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                                </Row>
                                <Row><Col xs={6} xsOffset={6} mdOffset={10} md={2} lgOffset={10} lg={2}><Divider/></Col></Row>
                                <Row>
                                    <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Account:</Col>
                                    <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                                </Row>
                                <Row><Col xs={6} xsOffset={6} mdOffset={10} md={2} lgOffset={10} lg={2}><Divider/></Col></Row>
                                <Row><Col xs={12} sm={12} mdOffset={6} md={6} lgOffset={6} lg={6}><Divider/></Col></Row>
                                <Row>
                                    <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Earned:</Col>
                                    <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                                </Row>
                                <Row>
                                    <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Kept:</Col>
                                    <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                                </Row>
                                <Row>
                                    <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Spent:</Col>
                                    <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                                </Row>
                            </Grid>
                        </CardText>
                    </Card>
                </GridTile>
                <GridTile>
                    <Card>
                        <CardHeader
                            actAsExpander={false}
                            showExpandableButton={true}>
                            <Grid>
                                <Row>
                                    <Col xs={1}><Checkbox/></Col>
                                    <Col xs={1}>2017-31-05</Col>
                                    <Col xs={3}>Blackjack and hookers</Col>
                                    <Col xs={2}>
                                        <div style={{color: 'red'}}> -100500</div>
                                    </Col>
                                    <Col xs={2}>Asset, Rent</Col>
                                    <Col xs={2}>Black jack, Hookers, Usd</Col>
                                    <Col xs={1}>Actions</Col>
                                </Row>
                            </Grid>
                        </CardHeader>
                        <CardText expandable={true}>
                            <Grid>
                                <Row>
                                    <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Account:</Col>
                                    <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                                </Row>
                                <Row><Col xs={6} xsOffset={6} mdOffset={10} md={2} lgOffset={10} lg={2}><Divider/></Col></Row>
                                <Row>
                                    <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Account:</Col>
                                    <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                                </Row>
                                <Row><Col xs={6} xsOffset={6} mdOffset={10} md={2} lgOffset={10} lg={2}><Divider/></Col></Row>
                                <Row>
                                    <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Account:</Col>
                                    <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                                </Row>
                                <Row><Col xs={6} xsOffset={6} mdOffset={10} md={2} lgOffset={10} lg={2}><Divider/></Col></Row>
                                <Row><Col xs={12} sm={12} mdOffset={6} md={6} lgOffset={6} lg={6}><Divider/></Col></Row>
                                <Row>
                                    <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Earned:</Col>
                                    <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                                </Row>
                                <Row>
                                    <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Kept:</Col>
                                    <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                                </Row>
                                <Row>
                                    <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Spent:</Col>
                                    <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                                </Row>
                            </Grid>
                        </CardText>
                    </Card>
                </GridTile>
            </GridList>
        </div>;
    }
}
