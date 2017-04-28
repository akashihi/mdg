import React, {Component} from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import {GridList, GridTile} from 'material-ui/GridList';
import FontIcon from 'material-ui/FontIcon';

export default class AccountsOverview extends Component {
    render() {
        return (
            <Card>
                <CardHeader title='Accounts'/>
                <CardText>
                    <IconButton><FontIcon className="material-icons">add_circle_outline</FontIcon></IconButton>
                    <IconButton><FontIcon className="material-icons">mode_edit</FontIcon></IconButton>
                    <GridList cellHeight={70} cols={1}>
                        <GridTile>
                            <Card>
                                <CardText>
                                    <p>
                                        <FlatButton label='Cash'/> : 14.88 CZK
                                        <IconButton><FontIcon className="material-icons">favorite</FontIcon></IconButton>
                                        <IconButton><FontIcon className="material-icons">attach_money</FontIcon></IconButton>
                                        <IconButton><FontIcon className="material-icons">visibility</FontIcon></IconButton>
                                    </p>
                                </CardText>
                            </Card>
                        </GridTile>
                        <GridTile>
                            <Card>
                                <CardText>
                                    <p>
                                        <FlatButton label='Cash'/> : 14.88 CZK
                                        <IconButton><FontIcon className="material-icons">favorite</FontIcon></IconButton>
                                        <IconButton><FontIcon className="material-icons">attach_money</FontIcon></IconButton>
                                        <IconButton><FontIcon className="material-icons">visibility</FontIcon></IconButton>
                                    </p>
                                </CardText>
                            </Card>
                        </GridTile>
                        <GridTile>
                            <Card>
                                <CardText>
                                    <p>
                                        <FlatButton label='Cash'/> : 14.88 CZK
                                        <IconButton><FontIcon className="material-icons">favorite</FontIcon></IconButton>
                                        <IconButton><FontIcon className="material-icons">attach_money</FontIcon></IconButton>
                                        <IconButton><FontIcon className="material-icons">visibility</FontIcon></IconButton>
                                    </p>
                                </CardText>
                            </Card>
                        </GridTile>
                        <GridTile>
                            <Card>
                                <CardText>
                                    <p>
                                        <FlatButton label="Cash"/> : 14.88 CZK
                                        <IconButton><FontIcon className="material-icons">favorite</FontIcon></IconButton>
                                        <IconButton><FontIcon className="material-icons">attach_money</FontIcon></IconButton>
                                        <IconButton><FontIcon className="material-icons">visibility</FontIcon></IconButton>
                                    </p>
                                </CardText>
                            </Card>
                        </GridTile>
                    </GridList>
                </CardText>
            </Card>
        )
    }
}
