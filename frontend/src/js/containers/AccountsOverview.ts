import { connect } from 'react-redux'

import AccountsOverviewPanel from '../components/account/AccountsOverviewPanel'
import {RootState} from '../reducers/rootReducer';
import {Account} from '../models/Account';
import {selectFavoriteAccounts} from '../selectors/AccountSelector';

export interface AccountsOverviewProps {
    accounts: Account[]
}

const mapStateToProps = (state: RootState):AccountsOverviewProps => {
  return {
    accounts: selectFavoriteAccounts(state)
  }
}

export default connect(mapStateToProps)(AccountsOverviewPanel)
