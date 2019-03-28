import React, {Component} from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Divider from '@material-ui/core/Divider';

export default class RateWidget extends Component {

    render() {
        const rates = this.props.rates
            .filter((item) => item.attributes.to_currency == this.props.primaryCurrency)
            .map((item) => {
                var currency = this.props.currencies.find((v, k) => k === item.attributes.from_currency);
                if (currency) {
                    return <ListItem key={'rate' + item.id}><ListItemText primary={currency.get('code')}
                                                                          secondary={item.attributes.rate}/></ListItem>
                }
                return '';
            });

        return (
            <List>
                <ListSubheader>Currency rates</ListSubheader>
                <Divider/>
                {rates}
            </List>
        )
    }
}
