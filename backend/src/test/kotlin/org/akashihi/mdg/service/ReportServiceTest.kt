package org.akashihi.mdg.service

import io.kotest.assertions.throwables.shouldThrow
import io.kotest.matchers.collections.shouldContainExactly
import io.kotest.matchers.collections.shouldHaveSize
import io.kotest.matchers.shouldBe
import org.akashihi.mdg.api.v1.MdgException
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

    @Test
    fun testDateExpansionGranularityBeyondRange() {
        val from = LocalDate.parse("2023-01-01")
        val to = LocalDate.parse("2023-01-31")
        val actual = ReportService.expandPeriod(from, to, Int.MAX_VALUE)

        actual shouldHaveSize 2
        actual shouldContainExactly listOf(from, to)
    }

    @Test
    fun testNegativeGranularityIsRejected() {
        val from = LocalDate.parse("2023-01-01")
        val to = LocalDate.parse("2023-01-31")

        val e = shouldThrow<MdgException> { ReportService.effectiveGranularity(from, to, -1) }
        e.code shouldBe "REQUEST_PARAMETER_INVALID"
    }

    @Test
    fun testZeroGranularityCollapsesToWholeRange() {
        val from = LocalDate.parse("2023-01-01")
        val to = LocalDate.parse("2023-01-31")

        ReportService.effectiveGranularity(from, to, 0) shouldBe 30
    }

    @Test
    fun testOversizedGranularityCollapsesToWholeRange() {
        val from = LocalDate.parse("2023-01-01")
        val to = LocalDate.parse("2023-01-31")

        ReportService.effectiveGranularity(from, to, Int.MAX_VALUE) shouldBe 30
    }

    @Test
    fun testGranularityOfDegenerateRangeIsSingleDay() {
        val from = LocalDate.parse("2023-01-01")

        ReportService.effectiveGranularity(from, from, 5) shouldBe 1
    }

    @Test
    fun testFittingGranularityIsKept() {
        val from = LocalDate.parse("2023-01-01")
        val to = LocalDate.parse("2023-01-31")

        ReportService.effectiveGranularity(from, to, 7) shouldBe 7
    }
}
