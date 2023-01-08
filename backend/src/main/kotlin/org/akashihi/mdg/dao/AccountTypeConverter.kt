package org.akashihi.mdg.dao

import org.akashihi.mdg.entity.AccountType
import org.akashihi.mdg.entity.AccountType.Companion.from
import javax.persistence.AttributeConverter
import javax.persistence.Converter

@Converter
class AccountTypeConverter : AttributeConverter<AccountType, String> {
    override fun convertToDatabaseColumn(accountType: AccountType): String {
        return accountType.toDbValue()
    }

    override fun convertToEntityAttribute(s: String): AccountType {
        return from(s)
    }
}
