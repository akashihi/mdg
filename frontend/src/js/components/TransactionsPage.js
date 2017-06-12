import React, {Component} from 'react';
import {Card, CardHeader, CardActions} from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import {GridList, GridTile} from 'material-ui/GridList';
import {Grid, Row, Col} from 'react-flexbox-grid';
import CircularProgress from 'material-ui/CircularProgress';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

import Transaction from './Transaction';

export default class OperationsPage extends Component {
    makeAccountsList(props) {
        return props.assetAccounts.concat(props.incomeAccounts, props.expenseAccounts)
    }

    pageSizeChange(event, key, value) {
        this.props.actions.setTransactionPageSize(value);
    }

    loadNextPage() {
        this.props.actions.nextTransactionPage();
    }

    render() {
        var props = this.props;

        var accounts = ::this.makeAccountsList(props);

        var nextPageLoader;
        if (props.nextPageAvailable) {
            nextPageLoader = <IconButton style={{display: 'block', margin: '0 auto'}} onClick={::this.loadNextPage}><FontIcon className='material-icons'>file_download</FontIcon></IconButton>
        }

        var transactions;
        if (props.waiting) {
            transactions = <CircularProgress/>;
        } else if (props.error) {
            transactions = <h1>Unable to load transactions list</h1>
        } else {
            transactions = props.transactions.map(function (item) {
                return (
                    <GridTile key={item.id}><Transaction transaction={item} accounts={accounts}/></GridTile>
                )
            });
        }

        return <div>
            <Card>
                <CardHeader
                    title='Showing from 02-05-2017 till 02-06-2017'
                    actAsExpander={true}
                    showExpandableButton={true}
                />
                <CardActions expandable={true}>
                    <Grid>
                        <Row>
                            <Col xsOffset={6} xs={6} smOffset={6} sm={6} md={2} mdOffset={9} lg={2} lgOffset={9}>
                                <SelectField floatingLabelText='Transactions on page:' value={props.pageSize} onChange={::this.pageSizeChange}>
                                    <MenuItem value={10} primaryText='10'/>
                                    <MenuItem value={25} primaryText='20'/>
                                    <MenuItem value={50} primaryText='50'/>
                                    <MenuItem value={100} primaryText='100'/>
                                    <MenuItem value={250} primaryText='250'/>
                                    <MenuItem value={500} primaryText='500'/>
                                </SelectField>
                            </Col>
                        </Row>
                    </Grid>
                </CardActions>
            </Card>
            <Divider/>
            <GridList cols={1} cellHeight='auto'>
                <GridTile>
                    <Card>
                        <CardHeader>
                            <Grid>
                                <Row>
                                    <Col xs={1}/>
                                    <Col xs={1}>Date</Col>
                                    <Col xs={3}>Comment</Col>
                                    <Col xs={2}>Amount</Col>
                                    <Col xs={2}>Accounts</Col>
                                    <Col xs={2}>Tags</Col>
                                    <Col xs={1}/>
                                </Row>
                            </Grid>
                        </CardHeader>
                    </Card>
                </GridTile>
                {transactions}
            </GridList>
            {nextPageLoader}
        </div>;
    }
}
