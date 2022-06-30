import React, {Fragment} from 'react';

import Account from './Account';
import {AccountTreeNode} from "../../models/Account";

export interface CategorizedAccountListProps {
    tree: AccountTreeNode;
    indent: number;
    hidden: boolean;
}

function CategorizedAccountList(props: CategorizedAccountListProps) {
    const subCategories = props.tree.categories.map(c => <CategorizedAccountList key={c.id} tree={c} indent={props.indent+1} hidden={props.hidden}/>);
    let filteredAccounts;
    if (props.hidden) {
        filteredAccounts = props.tree.accounts;
    } else {
        filteredAccounts = props.tree.accounts.filter(a => !a.hidden);
    }
    const accounts = filteredAccounts.map(a => <Account key={a.id} account={a}/>);
    return (
        <Fragment>
            <h3 style={{marginLeft: props.indent*15}}>{props.tree.name}</h3>
            <div style={{marginLeft: props.indent*15+10}}> {accounts}</div>
            {subCategories}
        </Fragment>
    )
}

export default CategorizedAccountList;
