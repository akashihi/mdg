package org.akashihi.mdg.dao;

import org.akashihi.mdg.entity.AccountType;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

@Converter
public class AccountTypeConverter implements AttributeConverter<AccountType, String> {
    @Override
    public String convertToDatabaseColumn(AccountType accountType) {
        return accountType.toDbValue();
    }

    @Override
    public AccountType convertToEntityAttribute(String s) {
        return AccountType.from(s);
    }
}
