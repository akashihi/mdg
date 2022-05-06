package org.akashihi.mdg.api.v1;

import org.akashihi.mdg.entity.BudgetEntry;
import org.akashihi.mdg.entity.Category;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

class BudgetControllerTest {

    @Test
    void convertTopCategory() {
    }

    @Test
    void convertCategory_emptyInput() {
        Category category = new Category();
        category.setChildren(Collections.emptyList());
        var actualEntry = BudgetController.convertCategory(category, Collections.emptyList(), Optional.empty(), LocalDate.now(), LocalDate.now(), LocalDate.now());
        assertTrue(actualEntry.isEmpty());
    }
}