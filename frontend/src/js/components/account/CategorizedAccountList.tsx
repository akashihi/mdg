import React, {Fragment} from 'react';

import Account from './Account';
import {AccountTreeNode} from "../../models/Account";

export interface CategorizedAccountListProps {
    tree: AccountTreeNode;
    indent: number;
}

function CategorizedAccountList(props: CategorizedAccountListProps) {
    const subCategories = props.tree.categories.map(c => <CategorizedAccountList key={c.id} tree={c} indent={props.indent+1}/>);
    const accounts = props.tree.accounts.map(a => <Account key={a.id} account={a}/>);
    return (
        <Fragment>
            <h3 style={{marginLeft: props.indent*15}}>{props.tree.name}</h3>
            <div style={{marginLeft: props.indent*15+10}}> {accounts}</div>
            {subCategories}
        </Fragment>
    )
}

export default CategorizedAccountList;
