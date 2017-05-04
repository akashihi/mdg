package services

import models.{Account, AssetAccount}

import scalaz._
import scalaz.Scalaz._

object AccountService {
  type StringValidation[T] = ValidationNel[String, T]

  def validate(account: Account): StringValidation[Account] = {
    def validateOpsFlag(account: Account): StringValidation[Account] = {
      if (account.operational && account.account_type != AssetAccount) {
        "ACCOUNT_NONASSET_INVALIDFLAG".failureNel
      } else { account.success }
    }

    def validateFavFlag(account: Account): StringValidation[Account] = {
      if (account.favorite && account.account_type != AssetAccount) {
        "ACCOUNT_NONASSET_INVALIDFLAG".failureNel
      } else { account.success }
    }

    (validateOpsFlag(account)
      |@| validateFavFlag(account)) { case _ => account }
  }

}
