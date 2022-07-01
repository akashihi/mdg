import {connect} from 'react-redux';

import AccountWidget from '../components/account/Account';
import {setFavorite, setOperational, hideAccount, revealAccount} from '../actions/AccountActions';
import {Account} from "../models/Account";
import {RootState} from "../reducers/rootReducer";

export interface AccountItemProps {
    account: Account;
    edit: (Account)=>void;
}

export interface AccountItemState {
    account: Account;
    edit: (Account)=>void;
}

const mapStateToProps = (state: RootState, ownProps: AccountItemProps): AccountItemState => {
    return {
        account: ownProps.account,
        edit: ownProps.edit
    }
};

const mapDispatchToProps = {setFavorite, setOperational, hideAccount, revealAccount};

export type AccountWidgetProps = AccountItemState & typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(AccountWidget);
