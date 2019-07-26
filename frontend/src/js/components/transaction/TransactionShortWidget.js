import React from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';

import TransactionBase from './TransactionBase';

export default class TransactionShortWidget extends TransactionBase {
    render() {
        const props = this.props;
        const transaction = props.transaction;

        const totals = ::this.getTotalChange(props.transaction, props.accounts);

        return <Grid>
            <Row>
                <Col xs={3} sm={2} md={1} lg={3}>{transaction.get('timestamp')}</Col>
                <Col xs={6} sm={3} md={3} lg={3}>{transaction.get('comment')}</Col>
                <Col xs={3} sm={1} md={1} lg={2}>
                    <div style={{color: totals.color}}>{totals.total}</div>
                </Col>
                <Col xs={7} sm={3} md={2}
                     lg={2}>{transaction.get('accountNames')}</Col>
                <Col xs={1} sm={3} md={2} lg={2} className='hide-on-small'>{transaction.get('tags').join(', ')}</Col>
            </Row>
        </Grid>
    }
}
