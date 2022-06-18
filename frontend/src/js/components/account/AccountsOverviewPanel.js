import React, { Component, Fragment } from 'react'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'

import AccountList from './AccountList'

export default class AccountsOverviewPanel extends Component {
  render () {
    const props = this.props

    const accounts = props.assetAccounts.filter((item) => item.get('favorite'))

    return (
      <>
        <CardHeader title='Accounts' />
        <CardContent>
          <AccountList preview hiddenVisible={false} actions={props.actions} currencies={props.currencies} accounts={accounts} />
        </CardContent>
      </>
    )
  }
}
