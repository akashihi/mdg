import React, {Component} from 'react';
import Divider from 'material-ui/Divider';
import {Row, Col} from 'react-flexbox-grid';


export default class Operation extends Component {
    render() {
        var props = this.props;
        var operation = props.operation;

        var accounts = props.accounts;
        var opAccount = accounts.filter((item) => item.id == operation.account_id)[0];

        var color = 'black';
        switch(opAccount.attributes.account_type) {
            case 'income':
                color = 'green';
                break;
            case 'asset':
                color = 'yellow';
                break;
            case 'expense':
                color = 'red';
                break;

        }

        var style = {
            color: color
        };

        return <div style={style}><Row>
            <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>{opAccount.attributes.name}:</Col>
            <Col xs={6} sm={6} md={2} lg={2}>{operation.amount}</Col>
        </Row>
            <Row><Col xs={6} xsOffset={6} mdOffset={10} md={2} lgOffset={10} lg={2}><Divider/></Col></Row></div>;
    }
}
