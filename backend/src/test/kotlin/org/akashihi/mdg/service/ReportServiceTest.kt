package org.akashihi.mdg.service

import io.kotest.matchers.collections.shouldContainExactly
import io.kotest.matchers.collections.shouldHaveSize
import io.kotest.matchers.ints.shouldBeExactly
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.junit.jupiter.MockitoExtension
import java.time.LocalDate


@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@ExtendWith(MockitoExtension::class)
class ReportServiceTest {
    @Test
    fun testDateExpansion() {
        val from = LocalDate.parse("2023-01-01")
        val to = LocalDate.parse("2023-01-31")
        val actual = ReportService.expandPeriod(from, to, 7)

        actual shouldHaveSize 5
        actual shouldContainExactly listOf(from, LocalDate.parse("2023-01-08"), LocalDate.parse("2023-01-15"), LocalDate.parse("2023-01-22"), to)
    }

    @Test
    fun testDateExpansionZeroGranularity() {
        val from = LocalDate.parse("2023-01-01")
        val to = LocalDate.parse("2023-01-31")
        val actual = ReportService.expandPeriod(from, to, 0)

        actual shouldHaveSize 2
        actual shouldContainExactly listOf(from, to)
    }
}