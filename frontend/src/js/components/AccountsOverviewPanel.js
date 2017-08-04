import React, {Component} from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import {GridList, GridTile} from 'material-ui/GridList';
import FontIcon from 'material-ui/FontIcon';

import Account from './Account'

export default class AccountsOverviewPanel extends Component {

    onCreateAccountClick() {
        this.props.actions.createAccount();
    }

    render() {
        var props = this.props;
        var onSwitchFavoriteClick = function (account, value) {
            account.attributes.favorite = value;
            props.actions.updateAccount(account);
        };

        var onSwitchOperationalClick = function (account, value) {
            account.attributes.operational = value;
            props.actions.updateAccount(account);
        };

        var onSwitchHiddenClick = function (account, value) {
            account.attributes.hidden = value;
            props.actions.updateAccount(account);
        };

        var onEditAccountClick = function (account) {
            props.actions.editAccount(account)
        };

        var accounts = props.assetAccounts.filter((item) => item.attributes.favorite).map(function (item) {
            return (
                <GridTile key={item.id}><Account account={item} currencies={props.currencies}
                                            switchFavoriteFunc={onSwitchFavoriteClick}
                                            switchOperationalFunc={onSwitchOperationalClick}
                                            switchHiddenFunc={onSwitchHiddenClick}
                                            editAccountFunc={onEditAccountClick}/></GridTile>
            )
        });

        return (
            <Card>
                <CardHeader title='Accounts'/>
                <CardText>
                    <IconButton onClick={::this.onCreateAccountClick}><FontIcon className='material-icons'>add_circle_outline</FontIcon></IconButton>
                    <GridList cellHeight={70} cols={1}>
                        {accounts}
                    </GridList>
                </CardText>
            </Card>
        )
    }
}
