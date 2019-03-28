import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ClipLoader from 'react-spinners/ClipLoader';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';

import CategoryViewer from '../containers/CategoryViewer.js';

const styles = {
  root: {
    position: 'relative',
    overflow: 'auto',
    maxHeight: 160,
  }
};

class SettingsPage extends Component {
  onPrimaryCurrencyChange(value) {
      this.props.actions.setPrimaryCurrency(value);
  }

  onCloseTransactionDialogChange(value) {
    this.props.actions.setCloseTransactionDialog(value);
  }

  onReindexClick() {
    this.props.actions.reindexTransactions();
  }

  render() {
    var props = this.props;
    const { classes } = props;

    var onCurrencyCheck = function(item) {
      item.attributes.active = !item.attributes.active
      props.currencyActions.updateCurrency(item)
    }

    if (props.waiting) {
      return (<ClipLoader sizeUnit={'px'} size={150} loading={true}/>)
    }
    if (props.error) {
      return (<h1>Unable to load settings</h1>)
    }

    var currencies = props.currencies.filter((v) => v.get('active')).map((v,k) => {
        return (
            <MenuItem value={k} key={k}>{v.get('name')}</MenuItem>
        )
    });

    var allCurrencies = props.currencies.map((v,k) => {
        return (
            <ListItem key={k} dense button>
              <ListItemText primary={v.get('name')}/>
              <ListItemSecondaryAction><Checkbox checked={v.get('active')} onChange={() => this::onCurrencyCheck(v)}/></ListItemSecondaryAction>
            </ListItem>
        )
    });

    return (
          <Grid fluid>
            <Row>
              <Col xs={6} sm={6} md={4} lg={4}>
                <p>Primary currency:</p>
              </Col>
              <Col xs={6} sm={6} md={4} lg={4}>
                <Select
                           value={props.primaryCurrency}
                           onChange={(ev) => ::this.onPrimaryCurrencyChange(ev.target.value)}
                           >
                           {currencies}
                  </Select>
              </Col>
            </Row>
            <Row>
              <Col xs={6} sm={6} md={4} lg={4}>
                <p>By default close transaction dialog:</p>
              </Col>
              <Col xs={6} sm={6} md={4} lg={4}>
                <Checkbox checked={this.props.closeTransactionDialog} onChange={(ev, value) => ::this.onCloseTransactionDialogChange(value)}/>
              </Col>
            </Row>
            <Row>
              <Col xs={6} sm={6} md={4} lg={4}>
                <p>Reindex transactions search data:</p>
              </Col>
              <Col xs={6} sm={6} md={4} lg={4}>
                <Button color='primary' onClick={::this.onReindexClick}>Start reindex</Button>
              </Col>
            </Row>
            <Row>
            <Col xs={6} sm={6} md={4} lg={4}>
              <p>Active currencies:</p>
            </Col>
            <Col xs={6} sm={6} md={4} lg={4}>
              <List className={classes.root}>
                {allCurrencies}
              </List>
            </Col>
            </Row>
            <Row>
              <Col xs={12} sm={12} md={12} lg={12}>
                <CategoryViewer/>
              </Col>
            </Row>
        </Grid>
  )
  }
}

export default withStyles(styles)(SettingsPage)
