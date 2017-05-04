package services

import models.{Account, AssetAccount}

import scalaz._
import scalaz.Scalaz._

object AccountService {
  type StringValidation[T] = Validation[String, T]

  def validate(account: Account): StringValidation[Account] = {
    def validateOpsFlag(account: Account): StringValidation[Account] = {
      if (account.operational & account.account_type == AssetAccount) {
        account.success
      } else { "ACCOUNT_NONASSET_INVALIDFLAG".failure }
    }

    def validateFavFlag(account: Account): StringValidation[Account] = {
      if (account.favorite & account.account_type == AssetAccount) {
        account.success
      } else { "ACCOUNT_NONASSET_INVALIDFLAG".failure }
    }

    (validateOpsFlag(account)
      |@| validateFavFlag(account)) { case _ => account }
  }

}
