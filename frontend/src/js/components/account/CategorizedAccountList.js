import React, { Component, Fragment } from 'react'

import AccountList from './AccountList'
import { filterNonListedCategories } from '../../util/AccountUtils'

export default class CategorizedAccountList extends Component {
  renderCategorizedList (accounts, categoryList) {
    const props = this.props
    const entries = []

    const mapEntry = function (category, prefix) {
      const prepend = '-'.repeat(prefix)
      const entry = <p key={'category-' + category.get('id')}>{prepend}{category.get('name')}</p>
      entries.push(entry)

      // If we have related accounts - add them
      const categoryAccounts = accounts.filter((item) => item.get('category_id') === category.get('id'))
      const categoryList = <AccountList key={'accountlist-' + category.get('id')} actions={props.actions} currencies={props.currencies} accounts={categoryAccounts} hiddenVisible={props.hiddenVisible} />
      entries.push(categoryList)

      if (category.has('children')) {
        category.get('children').forEach((item) => mapEntry(item, prefix + 1))
      }
    }

    categoryList.forEach((item) => mapEntry(item, 0))

    return entries
  }

  render () {
    const props = this.props

    const filteredAccounts = props.accounts.filter((item) => item.get('hidden') === this.props.hiddenVisible)

    // First of all - get list of accounts categories
    const categoriesIds = filteredAccounts.map((item) => item.get('category_id')).valueSeq()

    // Recursively remove categories, that are not in categories_ids
    const categories = filterNonListedCategories(categoriesIds, props.categoryList)

    // Recursively draw categories and related accounts
    const categorizedAccounts = this.renderCategorizedList(filteredAccounts, categories)

    // Draw uncategorized accounts
    const simpleAccounts = filteredAccounts.filter((item) => !item.get('category_id'))

    return (
      <>
        <AccountList actions={props.actions} currencies={props.currencies} accounts={simpleAccounts} hiddenVisible={props.hiddenVisible} />
        {categorizedAccounts}
      </>
    )
  }
}
