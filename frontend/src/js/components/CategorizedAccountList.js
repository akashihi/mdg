import React, {Component, Fragment} from 'react';
import {OrderedMap} from 'immutable';

import AccountList from './AccountList'

export default class CategorizedAccountList extends Component {

  filterNonListedCategories(categories_ids, categoryList) {
    var filterCategory = function(category) {
      var kids = OrderedMap()

      if (category.has('children')) {
        category.get('children').forEach((item, k) => {
          var filtered = filterCategory(item)
          if (filtered != null) {
              kids = kids.set(k, filtered)
          }
        })
      }

      category = category.set('children', kids)

      if (categories_ids.includes(category.get('id')) || !kids.isEmpty()) {
          return category
      }


      return null
    }

    var entries = []
    categoryList.forEach(item => {
      const c = filterCategory(item)
      if (c != null) {
        entries.push(c)
      }
    })
    return entries
  }

  renderCategorizedList(accounts, categoryList) {
    var props = this.props;
    var entries = []

    var mapEntry = function(category, prefix) {
      var prepend = '-'.repeat(prefix)
      var entry = <p>{prepend}{category.get('name')}</p>
      entries.push(entry)

      //If we have related accounts - add them
      var category_accounts = accounts.filter((item) => item.get('category_id') === category.get('id'))
      var category_list = <AccountList actions={props.actions} currencies={props.currencies} accounts={category_accounts} hiddenVisible={props.hiddenVisible}/>
      entries.push(category_list)

      if (category.has('children')) {
        category.get('children').forEach((item) => mapEntry(item, prefix+1))
      }
    }

    categoryList.forEach((item) => mapEntry(item, 0))

    return entries
  }


    render() {
        var props = this.props;

        var filtered_accounts = props.accounts.filter((item) => item.get('hidden') === this.props.hiddenVisible)

        //First of all - get list of accounts categories
        var categories_ids = filtered_accounts.map((item) => item.get('category_id')).valueSeq()

        //Recursively remove categories, that are not in categories_ids
        var categories = this.filterNonListedCategories(categories_ids, props.categoryList)

        //Recursively draw categories and related accounts
        var categorized_accounts = this.renderCategorizedList(filtered_accounts, categories)

        //Draw uncategorized accounts
        var simple_accounts = filtered_accounts.filter((item) => !item.get('category_id'))

        return (
            <Fragment>
              <AccountList actions={props.actions} currencies={props.currencies} accounts={simple_accounts} hiddenVisible={props.hiddenVisible}/>
              {categorized_accounts}
            </Fragment>
        )
    }
}
