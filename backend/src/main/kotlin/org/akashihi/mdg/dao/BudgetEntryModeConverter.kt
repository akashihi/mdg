package org.akashihi.mdg.dao

import org.akashihi.mdg.entity.BudgetEntryMode
import javax.persistence.AttributeConverter
import javax.persistence.Converter

@Converter
class BudgetEntryModeConverter : AttributeConverter<BudgetEntryMode, String> {
    override fun convertToDatabaseColumn(budgetEntryMode: BudgetEntryMode): String {
        return budgetEntryMode.toDbValue()
    }

    override fun convertToEntityAttribute(s: String): BudgetEntryMode {
        return BudgetEntryMode.from(s)
    }
}
