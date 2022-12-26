package org.akashihi.mdg.entity;

import java.util.Locale;

public enum AccountType {
    INCOME,
    ASSET,
    EXPENSE;

    public String toDbValue() {
        return this.name().toLowerCase(Locale.US);
    }

    public static AccountType from(String status) {
        return AccountType.valueOf(status.toUpperCase(Locale.US));
    }
}
