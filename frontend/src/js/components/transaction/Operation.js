import React, {Component} from 'react';
import Divider from '@material-ui/core/Divider';
import {Row, Col} from 'react-flexbox-grid';


export default class Operation extends Component {
    render() {
        const props = this.props;
        const operation = props.operation;

        const accounts = props.accounts;
        const opAccount = accounts.get(operation.account_id);

        var color = 'black';
        switch(opAccount.get('account_type')) {
            case 'income':
                color = 'lime';
                break;
            case 'asset':
                color = 'orange';
                break;
            case 'expense':
                color = 'red';
                break;

        }

        const style = {
            color: color
        };

        return <div style={style}><Row>
            <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>{opAccount.get('name')}:</Col>
            <Col xs={6} sm={6} md={2} lg={2}>{operation.amount}</Col>
        </Row>
            <Row><Col xs={6} xsOffset={6} mdOffset={10} md={2} lgOffset={10} lg={2}><Divider/></Col></Row></div>;
    }
}
