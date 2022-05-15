package org.akashihi.mdg.entity;

public enum AccountType {
    INCOME,
    ASSET,
    EXPENSE;

    public String toDbValue() {
        return this.name().toLowerCase();
    }

    public static AccountType from(String status) {
        return AccountType.valueOf(status.toUpperCase());
    }
}
