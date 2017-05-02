import React, {Component} from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import {GridList, GridTile} from 'material-ui/GridList';
import FontIcon from 'material-ui/FontIcon';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Divider from 'material-ui/Divider';

export default class AccountsPage extends Component {
    componentDidMount() {
        this.props.currencyActions.loadCurrencyList()
    }
    render() {
        return (
            <Card>
                <CardHeader>
                    <Grid fluid>
                        <Row>
                            <Col xs={12} sm={12} md={4} lg={4}>
                                <p>Total: 100500</p>
                            </Col>
                            <Col xs={6} sm={6} md={4} lg={4}>
                                <p>Favorite: 9000</p>
                            </Col>
                            <Col xs={6} sm={6} md={4} lg={4}>
                                <p>Operational: 3.62</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} sm={12} md={3} lg={3}>
                                <RaisedButton label='Add new account'/>
                            </Col>
                        </Row>
                    </Grid>
                </CardHeader>
                <CardText>
                    <GridList cellHeight={70} cols={1}>
                        <GridTile>
                            <Card>
                                <CardText>
                                    <Grid fluid>
                                        <Row>
                                            <Col xs={12} sm={12} md={4} lg={4}>
                                                <p>Account name</p>
                                            </Col>
                                            <Col xs={12} sm={12} md={4} lg={4}>
                                                <p>14.88 CZK</p>
                                            </Col>
                                            <Col xs={12} sm={12} md={4} lg={4}>
                                                <IconButton><FontIcon
                                                    className='material-icons'>favorite</FontIcon></IconButton>
                                                <IconButton><FontIcon
                                                    className='material-icons'>favorite_border</FontIcon></IconButton>
                                                <IconButton><FontIcon
                                                    className='material-icons'>star</FontIcon></IconButton>
                                                <IconButton><FontIcon
                                                    className='material-icons'>star_border</FontIcon></IconButton>
                                                <IconButton><FontIcon
                                                    className='material-icons'>visibility</FontIcon></IconButton>
                                                <IconButton><FontIcon
                                                    className='material-icons'>visibility_off</FontIcon></IconButton>
                                                <IconButton><FontIcon className='material-icons'>mode_edit</FontIcon></IconButton>
                                            </Col>
                                        </Row>
                                    </Grid>
                                </CardText>
                            </Card>
                        </GridTile>
                        <Divider/>
                        <GridTile>
                            <Card>
                                <CardText>
                                    <Grid fluid>
                                        <Row>
                                            <Col xs={12} sm={12} md={4} lg={4}>
                                                <p>Account name</p>
                                            </Col>
                                            <Col xs={12} sm={12} md={4} lg={4}>
                                                <p>14.88 CZK</p>
                                            </Col>
                                            <Col xs={12} sm={12} md={4} lg={4}>
                                                <IconButton><FontIcon
                                                    className='material-icons'>favorite</FontIcon></IconButton>
                                                <IconButton><FontIcon
                                                    className='material-icons'>favorite_border</FontIcon></IconButton>
                                                <IconButton><FontIcon
                                                    className='material-icons'>star</FontIcon></IconButton>
                                                <IconButton><FontIcon
                                                    className='material-icons'>star_border</FontIcon></IconButton>
                                                <IconButton><FontIcon
                                                    className='material-icons'>visibility</FontIcon></IconButton>
                                                <IconButton><FontIcon
                                                    className='material-icons'>visibility_off</FontIcon></IconButton>
                                                <IconButton><FontIcon className='material-icons'>mode_edit</FontIcon></IconButton>
                                            </Col>
                                        </Row>
                                    </Grid>
                                </CardText>
                            </Card>
                        </GridTile>
                        <Divider/>
                        <GridTile>
                            <Card>
                                <CardText>
                                    <Grid fluid>
                                        <Row>
                                            <Col xs={12} sm={12} md={4} lg={4}>
                                                <p>Account name</p>
                                            </Col>
                                            <Col xs={12} sm={12} md={4} lg={4}>
                                                <p>14.88 CZK</p>
                                            </Col>
                                            <Col xs={12} sm={12} md={4} lg={4}>
                                                <IconButton><FontIcon
                                                    className='material-icons'>favorite</FontIcon></IconButton>
                                                <IconButton><FontIcon
                                                    className='material-icons'>favorite_border</FontIcon></IconButton>
                                                <IconButton><FontIcon
                                                    className='material-icons'>star</FontIcon></IconButton>
                                                <IconButton><FontIcon
                                                    className='material-icons'>star_border</FontIcon></IconButton>
                                                <IconButton><FontIcon
                                                    className='material-icons'>visibility</FontIcon></IconButton>
                                                <IconButton><FontIcon
                                                    className='material-icons'>visibility_off</FontIcon></IconButton>
                                                <IconButton><FontIcon className='material-icons'>mode_edit</FontIcon></IconButton>
                                            </Col>
                                        </Row>
                                    </Grid>
                                </CardText>
                            </Card>
                        </GridTile>
                        <Divider/>
                        <GridTile>
                            <Card>
                                <CardText>
                                    <Grid fluid>
                                        <Row>
                                            <Col xs={12} sm={12} md={4} lg={4}>
                                                <p>Account name</p>
                                            </Col>
                                            <Col xs={12} sm={12} md={4} lg={4}>
                                                <p>14.88 CZK</p>
                                            </Col>
                                            <Col xs={12} sm={12} md={4} lg={4}>
                                                <IconButton><FontIcon
                                                    className='material-icons'>favorite</FontIcon></IconButton>
                                                <IconButton><FontIcon
                                                    className='material-icons'>favorite_border</FontIcon></IconButton>
                                                <IconButton><FontIcon
                                                    className='material-icons'>star</FontIcon></IconButton>
                                                <IconButton><FontIcon
                                                    className='material-icons'>star_border</FontIcon></IconButton>
                                                <IconButton><FontIcon
                                                    className='material-icons'>visibility</FontIcon></IconButton>
                                                <IconButton><FontIcon
                                                    className='material-icons'>visibility_off</FontIcon></IconButton>
                                                <IconButton><FontIcon className='material-icons'>mode_edit</FontIcon></IconButton>
                                            </Col>
                                        </Row>
                                    </Grid>
                                </CardText>
                            </Card>
                        </GridTile>
                        <Divider/>
                        <GridTile>
                            <Card>
                                <CardText>
                                    <Grid fluid>
                                        <Row>
                                            <Col xs={12} sm={12} md={4} lg={4}>
                                                <p>Account name</p>
                                            </Col>
                                            <Col xs={12} sm={12} md={4} lg={4}>
                                                <p>14.88 CZK</p>
                                            </Col>
                                            <Col xs={12} sm={12} md={4} lg={4}>
                                                <IconButton><FontIcon
                                                    className='material-icons'>favorite</FontIcon></IconButton>
                                                <IconButton><FontIcon
                                                    className='material-icons'>favorite_border</FontIcon></IconButton>
                                                <IconButton><FontIcon
                                                    className='material-icons'>star</FontIcon></IconButton>
                                                <IconButton><FontIcon
                                                    className='material-icons'>star_border</FontIcon></IconButton>
                                                <IconButton><FontIcon
                                                    className='material-icons'>visibility</FontIcon></IconButton>
                                                <IconButton><FontIcon
                                                    className='material-icons'>visibility_off</FontIcon></IconButton>
                                                <IconButton><FontIcon className='material-icons'>mode_edit</FontIcon></IconButton>
                                            </Col>
                                        </Row>
                                    </Grid>
                                </CardText>
                            </Card>
                        </GridTile>
                        <Divider/>
                        <GridTile>
                            <Card>
                                <CardText>
                                    <Grid fluid>
                                        <Row>
                                            <Col xs={12} sm={12} md={4} lg={4}>
                                                <p>Account name</p>
                                            </Col>
                                            <Col xs={12} sm={12} md={4} lg={4}>
                                                <p>14.88 CZK</p>
                                            </Col>
                                            <Col xs={12} sm={12} md={4} lg={4}>
                                                <IconButton><FontIcon
                                                    className='material-icons'>favorite</FontIcon></IconButton>
                                                <IconButton><FontIcon
                                                    className='material-icons'>favorite_border</FontIcon></IconButton>
                                                <IconButton><FontIcon
                                                    className='material-icons'>star</FontIcon></IconButton>
                                                <IconButton><FontIcon
                                                    className='material-icons'>star_border</FontIcon></IconButton>
                                                <IconButton><FontIcon
                                                    className='material-icons'>visibility</FontIcon></IconButton>
                                                <IconButton><FontIcon
                                                    className='material-icons'>visibility_off</FontIcon></IconButton>
                                                <IconButton><FontIcon className='material-icons'>mode_edit</FontIcon></IconButton>
                                            </Col>
                                        </Row>
                                    </Grid>
                                </CardText>
                            </Card>
                        </GridTile>
                        <Divider/>
                        <GridTile>
                            <Card>
                                <CardText>
                                    <Grid fluid>
                                        <Row>
                                            <Col xs={12} sm={12} md={4} lg={4}>
                                                <p>Account name</p>
                                            </Col>
                                            <Col xs={12} sm={12} md={4} lg={4}>
                                                <p>14.88 CZK</p>
                                            </Col>
                                            <Col xs={12} sm={12} md={4} lg={4}>
                                                <IconButton><FontIcon
                                                    className='material-icons'>favorite</FontIcon></IconButton>
                                                <IconButton><FontIcon
                                                    className='material-icons'>favorite_border</FontIcon></IconButton>
                                                <IconButton><FontIcon
                                                    className='material-icons'>star</FontIcon></IconButton>
                                                <IconButton><FontIcon
                                                    className='material-icons'>star_border</FontIcon></IconButton>
                                                <IconButton><FontIcon
                                                    className='material-icons'>visibility</FontIcon></IconButton>
                                                <IconButton><FontIcon
                                                    className='material-icons'>visibility_off</FontIcon></IconButton>
                                                <IconButton><FontIcon className='material-icons'>mode_edit</FontIcon></IconButton>
                                            </Col>
                                        </Row>
                                    </Grid>
                                </CardText>
                            </Card>
                        </GridTile>
                        <Divider/>
                    </GridList>
                </CardText>
            </Card>
        )
    }
}
