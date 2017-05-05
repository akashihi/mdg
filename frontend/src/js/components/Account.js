import React, {Component} from 'react';
import {Card, CardText} from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import {GridTile} from 'material-ui/GridList';
import FontIcon from 'material-ui/FontIcon';
import {Grid, Row, Col} from 'react-flexbox-grid';


export default class Account extends Component {
    render() {
        return (
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
        )
    }
}
