package validators

import controllers.dto.AccountDTO
import models._
import validators.Validator._
import scalaz.Scalaz._

/**
  * Created by dchaplyg on 10/25/17.
  */
object AccountValidator {
  def validateOpsFlag(account: AccountDTO): AccountValidation = {
    if (account.operational && account.account_type != AssetAccount) {
      "ACCOUNT_NONASSET_INVALIDFLAG".failureNel
    } else { account.success }
  }

  def validateFavFlag(account: AccountDTO): AccountValidation = {
    if (account.favorite && account.account_type != AssetAccount) {
      "ACCOUNT_NONASSET_INVALIDFLAG".failureNel
    } else { account.success }
  }

  def validateAssetType(account: AccountDTO): AccountValidation = {
    if (account.asset_type.isDefined && account.account_type != AssetAccount) {
      "ACCOUNT_NONASSET_INVALIDFLAG".failureNel
    } else { account.success }
  }
}
