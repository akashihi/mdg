import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import AddCirce from '@material-ui/icons/AddCircleOutline';
import Fab from '@material-ui/core/Fab';

const styles = {
  button: {
    marginRight: 40,
    marginBottom: 40,
    position: 'fixed',
    right: 0,
    bottom: 0
  }
};

class TransactionCreateButton extends Component {
    onCreate() {
        this.props.actions.createTransaction();
    }

    render() {
      return (<Fab color='secondary' aria-label='Add transaction' className={this.props.classes.button} onClick={::this.onCreate}><AddCirce/></Fab>)
    }
}

export default withStyles(styles)(TransactionCreateButton)
