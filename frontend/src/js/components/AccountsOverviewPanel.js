import React, {Component} from 'react';
import {CardHeader, CardText} from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import {GridList} from 'material-ui/GridList';
import FontIcon from 'material-ui/FontIcon';

import AccountList from './AccountList'

export default class AccountsOverviewPanel extends Component {

    onCreateAccountClick() {
        this.props.actions.createAccount();
    }

    render() {
        var props = this.props;

        var accounts = props.assetAccounts.filter((item) => item.attributes.favorite);

        return (
            <div>
                <CardHeader title='Accounts'/>
                <CardText>
                    <IconButton onClick={::this.onCreateAccountClick}><FontIcon className='material-icons'>add_circle_outline</FontIcon></IconButton>
                    <GridList cellHeight={70} cols={1}>
                        <AccountList actions={props.actions} currencies={props.currencies} accounts={accounts}/>
                    </GridList>
                </CardText>
            </div>
        )
    }
}
