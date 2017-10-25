package validators

import models._
import validators.Validator._

import scalaz.Scalaz._

/**
  * Created by dchaplyg on 10/25/17.
  */
object AccountValidator {
  def validateOpsFlag(account: Account): AccountValidation = {
    if (account.operational && account.account_type != AssetAccount) {
      "ACCOUNT_NONASSET_INVALIDFLAG".failureNel
    } else { account.success }
  }

  def validateFavFlag(account: Account): AccountValidation = {
    if (account.favorite && account.account_type != AssetAccount) {
      "ACCOUNT_NONASSET_INVALIDFLAG".failureNel
    } else { account.success }
  }

}
