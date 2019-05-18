import React, {Component, Fragment} from 'react';

import AccountList from './AccountList'
import {filterNonListedCategories} from '../../util/AccountUtils'

export default class CategorizedAccountList extends Component {

  renderCategorizedList(accounts, categoryList) {
    const props = this.props;
    const entries = [];

    const mapEntry = function(category, prefix) {
      const prepend = '-'.repeat(prefix);
      const entry = <p key={'category-'+category.get('id')}>{prepend}{category.get('name')}</p>;
      entries.push(entry);

      //If we have related accounts - add them
      const category_accounts = accounts.filter((item) => item.get('category_id') === category.get('id'));
      const category_list = <AccountList key={'accountlist-'+category.get('id')} actions={props.actions} currencies={props.currencies} accounts={category_accounts} hiddenVisible={props.hiddenVisible}/>;
      entries.push(category_list);

      if (category.has('children')) {
        category.get('children').forEach((item) => mapEntry(item, prefix+1))
      }
    };

    categoryList.forEach((item) => mapEntry(item, 0));

    return entries
  }


    render() {
        const props = this.props;

        const filtered_accounts = props.accounts.filter((item) => item.get('hidden') === this.props.hiddenVisible);

        //First of all - get list of accounts categories
        const categories_ids = filtered_accounts.map((item) => item.get('category_id')).valueSeq();

        //Recursively remove categories, that are not in categories_ids
        const categories = filterNonListedCategories(categories_ids, props.categoryList);

        //Recursively draw categories and related accounts
        const categorized_accounts = this.renderCategorizedList(filtered_accounts, categories);

        //Draw uncategorized accounts
        const simple_accounts = filtered_accounts.filter((item) => !item.get('category_id'));

        return (
            <Fragment>
              <AccountList actions={props.actions} currencies={props.currencies} accounts={simple_accounts} hiddenVisible={props.hiddenVisible}/>
              {categorized_accounts}
            </Fragment>
        )
    }
}
