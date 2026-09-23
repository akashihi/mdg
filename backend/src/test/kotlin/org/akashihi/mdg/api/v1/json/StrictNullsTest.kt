package org.akashihi.mdg.api.v1.json

import com.fasterxml.jackson.databind.JsonMappingException
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import io.kotest.matchers.shouldBe
import org.akashihi.mdg.entity.Account
import org.akashihi.mdg.entity.Budget
import org.akashihi.mdg.entity.BudgetEntry
import org.akashihi.mdg.entity.Category
import org.akashihi.mdg.entity.Currency
import org.akashihi.mdg.entity.Transaction
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import org.junit.jupiter.api.assertThrows

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class StrictNullsTest {
    private val objectMapper = jacksonObjectMapper().findAndRegisterModules().also { applyStrictCoercions(it) }

    @Test
    fun absentOptionalPropertyIsAccepted() {
        val category = objectMapper.readValue<Category>("""{"account_type":"EXPENSE","name":"Bonuses","priority":1}""")
        category.parentId shouldBe null
        category.id shouldBe null
    }

    @Test
    fun budgetEntryUpdateWithoutAccountIsAccepted() {
        objectMapper.readValue<BudgetEntry>("""{"distribution":"EVEN","expected_amount":100}""").expectedAmount shouldBe 100.toBigDecimal()
        assertThrows<JsonMappingException> {
            objectMapper.readValue<BudgetEntry>("""{"account_id":null,"distribution":"EVEN","expected_amount":100}""")
        }
    }

    @Test
    fun explicitNullOnNonNullableIdIsRejected() {
        assertThrows<JsonMappingException> {
            objectMapper.readValue<Category>("""{"account_type":"EXPENSE","name":"Bonuses","priority":1,"parent_id":null}""")
        }
        assertThrows<JsonMappingException> {
            objectMapper.readValue<Budget>("""{"id":null,"term_beginning":"2017-02-04","term_end":"2017-02-26"}""")
        }
    }

    @Test
    fun explicitNullOnPrimitiveIsRejected() {
        assertThrows<JsonMappingException> {
            objectMapper.readValue<Category>("""{"account_type":"EXPENSE","name":"Pet expenses","priority":null}""")
        }
        assertThrows<JsonMappingException> {
            objectMapper.readValue<Currency>("""{"active":null,"code":"EUR","id":978,"name":"x"}""")
        }
    }

    @Test
    fun explicitNullIsAcceptedWhereSpecificationAllowsIt() {
        val account = objectMapper.readValue<Account>(
            """{"account_type":"ASSET","name":null,"currency_id":978,"category_id":null,"hidden":null,"operational":null,"favorite":null}"""
        )
        account.name shouldBe null
        account.categoryId shouldBe null
        account.favorite shouldBe null

        val transaction = objectMapper.readValue<Transaction>(
            """{"comment":null,"timestamp":"2017-02-05T16:45:36","operations":[{"account_id":1,"amount":1,"rate":null}]}"""
        )
        transaction.comment shouldBe null
        transaction.operations.first().rate shouldBe null

        // The frontend sends a budget entry back as it read it, and the server writes both of these as null
        val entry = objectMapper.readValue<BudgetEntry>(
            """{"id":1,"account_id":2,"distribution":"PRORATED","expected_amount":9000,"actual_amount":150,"allowed_spendings":null,"spending_percent":null}"""
        )
        entry.allowedSpendings shouldBe null
        entry.spendingPercent shouldBe null
    }
}
