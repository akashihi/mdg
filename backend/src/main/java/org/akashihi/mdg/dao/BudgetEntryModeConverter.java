package org.akashihi.mdg.dao;

import org.akashihi.mdg.entity.BudgetEntryMode;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

@Converter
public class BudgetEntryModeConverter implements AttributeConverter<BudgetEntryMode, String> {
    @Override
    public String convertToDatabaseColumn(BudgetEntryMode budgetEntryMode) {
        return budgetEntryMode.toDbValue();
    }

    @Override
    public BudgetEntryMode convertToEntityAttribute(String s) {
        return BudgetEntryMode.from(s);
    }
}
