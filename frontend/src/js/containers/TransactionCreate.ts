import { connect } from 'react-redux';

import TransactionCreateButton from '../components/transaction/TransactionCreateButton';
import {createTransaction} from '../actions/TransactionActions';

const mapStateToProps = () => {
  return { };
};

const mapDispatchToProps = {createTransaction};

export type TransactionCreateButtonProps = {} & typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TransactionCreateButton)
