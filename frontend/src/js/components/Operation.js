import React, {Component} from 'react';
import Divider from 'material-ui/Divider';
import {Row, Col} from 'react-flexbox-grid';


export default class Operation extends Component {
    render() {
        var props = this.props;
        var operation = props.operation;
        return <div><Row>
            <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>{operation.account_id}:</Col>
            <Col xs={6} sm={6} md={2} lg={2}>{operation.amount}</Col>
        </Row>
            <Row><Col xs={6} xsOffset={6} mdOffset={10} md={2} lgOffset={10} lg={2}><Divider/></Col></Row></div>;
    }
}
