import React, {Component, Fragment} from 'react';

import AccountList from './AccountList'

export default class CategorizedAccountList extends Component {

  filterNonListedCategories(categories_ids, categoryList) {
    var filterCategory = function(category) {
      var kids = []

      if ('attributes' in category) {
        var attr = category.attributes
      } else {
        attr = category
      }

      if (attr.children) {
        for (var item of attr.children) {
          var filtered = filterCategory(item)
          if (filtered != null) {
              kids.push(filtered)
          }
        }
      }

      if ('attributes' in category) {
        category.attributes.children = kids
      } else {
        category.children = kids
      }

      if (categories_ids.includes(attr.id) || kids.length > 0) {
          return category
      }


      return null
    }

    var entries = []
    for (var item of categoryList) {
      var c = filterCategory(item)
      if (c!=null) {
        entries.push(c)
      }
    }
    return entries
  }

  renderCategorizedList(accounts, categoryList) {
    var props = this.props;
    var entries = []

    var mapEntry = function(category, prefix) {
      if ('attributes' in category) {
        var attr = category.attributes
      } else {
        attr = category
      }

      var prepend = '-'.repeat(prefix)
      var entry = <p>{prepend}{attr.name}</p>
      entries.push(entry)

      //If we have related accounts - add them
      var category_accounts = accounts.filter((item) => item.attributes.category_id === attr.id)
      var category_list = <AccountList actions={props.actions} currencies={props.currencies} accounts={category_accounts} hiddenVisible={props.hiddenVisible}/>
      entries.push(category_list)

      if (attr.children) {
        for (var item of attr.children) {
          mapEntry(item, prefix+1)
        }
      }
    }

    for (var item of categoryList) {
      mapEntry(item, 0)
    }
    return entries
  }


    render() {
        var props = this.props;

        var filtered_accounts = props.accounts.filter((item) => item.attributes.hidden === this.props.hiddenVisible)

        //First of all - get list of accounts categories
        var categories_ids = filtered_accounts.map((item) => item.attributes.category_id)

        //Recursively remove categories, that are not in categories_ids
        var categories = this.filterNonListedCategories(categories_ids, props.categoryList)

        //Recursively draw categories and related accounts
        var categorized_accounts = this.renderCategorizedList(filtered_accounts, categories)

        //Draw uncategorized accounts
        var simple_accounts = filtered_accounts.filter((item) => !item.attributes.category_id)

        return (
            <Fragment>
              <AccountList actions={props.actions} currencies={props.currencies} accounts={simple_accounts} hiddenVisible={props.hiddenVisible}/>
              {categorized_accounts}
            </Fragment>
        )
    }
}
