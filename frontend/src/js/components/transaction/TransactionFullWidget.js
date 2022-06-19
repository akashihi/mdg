import React, {Fragment} from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ClipLoader from 'react-spinners/ClipLoader';

import Operation from './Operation';

export default class TransactionFullWidget extends React.Component {
    state = { expanded: false };

    handleExpandClick = () => {
        this.setState(state => ({ expanded: !state.expanded }));
      };

    markTransaction = value => {
        const props = this.props;
        props.selectTxAction(props.transaction.get('id'), value)
    };

    renderOperations(tx) {
        return tx.get('operations').map(function (item) {
            return (
                <Fragment key={tx.get('id') + '-' + item.account_id}><Operation operation={item}/></Fragment>
            )
        });
    }

    render() {
        const props = this.props;
        const transaction = props.transaction;

        if (transaction.get('loading')) {
            // Fast processing
            return <ClipLoader sizeUnit={'px'} size={15} loading={true}/>
        }
        const operations = ::this.renderOperations(transaction);

        return <Card>
            <CardContent>
                <Grid container spacing={2}>
                        <Grid item xs={1} className='hide-on-small'><Checkbox color='default' onChange={(ev, value) => ::this.markTransaction(value)}/></Grid>
                        <Grid item xs={3} sm={2} md={1} lg={1}>{transaction.get('dt')}</Grid>
                        <Grid item xs={6} sm={3} md={3} lg={3}>{transaction.get('comment')}</Grid>
                        <Grid item xs={3} sm={1} md={1} lg={1}>
                            <div style={{color: transaction.get('totals').get('color')}}>{transaction.get('totals').get('total')}</div>
                        </Grid>
                        <Grid item xs={7} sm={3} md={2} lg={2}>{transaction.get('accountNames')}</Grid>
                        <Grid item xs={1} sm={3} md={2} lg={2} className='hide-on-small'>{transaction.get('tags').join(', ')}</Grid>
                        <Grid item xs={5} sm={3} md={2} lg={2}>
                          <Button aria-label='Edit' onClick={() => props.editAction(props.id, props.transaction)}><Edit/></Button>
                          <Button aria-label='Delete' onClick={() => props.deleteAction(props.id)}><Delete/></Button>
                          <IconButton onClick={this.handleExpandClick} aria-expanded={this.state.expanded} aria-label='Show operations'>
                            <ExpandMoreIcon />
                          </IconButton>
                        </Grid>
                </Grid>
            </CardContent>
            <CardContent>
              <Collapse in={this.state.expanded} timeout='auto' unmountOnExit>
                <Grid>
                    {operations}
                </Grid>
              </Collapse>
            </CardContent>
        </Card>;
    }
}
