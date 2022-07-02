package org.akashihi.mdg.service;

import lombok.RequiredArgsConstructor;
import org.akashihi.mdg.dao.AccountRepository;
import org.akashihi.mdg.dao.projections.AmountAndName;
import org.akashihi.mdg.entity.Account;
import org.akashihi.mdg.entity.AccountType;
import org.akashihi.mdg.entity.Category;
import org.akashihi.mdg.entity.Currency;
import org.akashihi.mdg.entity.report.Amount;
import org.akashihi.mdg.entity.report.BudgetReportEntry;
import org.akashihi.mdg.entity.report.SimpleReport;
import org.akashihi.mdg.entity.report.TotalsReport;
import org.akashihi.mdg.entity.report.TotalsReportEntry;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.LongStream;

@Service
@RequiredArgsConstructor
public class ReportService {
    private final AccountService accountService;
    private final SettingService settingService;
    private final AccountRepository accountRepository;
    private final BudgetService budgetService;

    protected static List<LocalDate> expandPeriod(LocalDate from, LocalDate to, Integer granularity) {
        var numberOfDays = ChronoUnit.DAYS.between(from, to) / granularity;
        var days = new ArrayList<>(LongStream.range(0, numberOfDays).mapToObj(d -> from.plusDays(d * granularity)).toList());
        days.add(to);
        return days;
    }

    public TotalsReport totalsReport() {
        var primaryCurrency = settingService.getCurrentCurrencyPrimary();
        Comparator<Amount> primaryCurrencyComparator = (l, r) -> {
            if (l.name().equals(primaryCurrency.map(Currency::getCode).orElse(""))) {
                return -1;
            } else {
                return l.name().compareTo(r.name());
            }
        };

        var accounts = accountService.listByType(AccountType.ASSET)
                .stream().collect(Collectors.groupingBy(Account::getCategory));
        var totals = new ArrayList<TotalsReportEntry>();

        var orderedCategories = accounts.keySet().stream().sorted(Comparator.comparing(Category::getPriority)).toList();
        for (Category totalsCategory : orderedCategories) {
            var currencyGroups = accounts.get(totalsCategory).stream().collect(Collectors.groupingBy(Account::getCurrency));
            var currencyTotals = new ArrayList<Amount>();
            //Only fill detailed totals if there is more than just primary currency
            for (Map.Entry<Currency, List<Account>> currencyGroup : currencyGroups.entrySet()) {
                var totalAmount = currencyGroup.getValue().stream().map(Account::getBalance).reduce(BigDecimal.ZERO, BigDecimal::add);
                if (totalAmount.compareTo(BigDecimal.ZERO) != 0) { //Only add non-zero currencies
                    currencyTotals.add(new Amount(totalAmount, currencyGroup.getKey().getCode(), null));
                }
            }
            currencyTotals.sort(primaryCurrencyComparator);
            if (currencyTotals.size() == 1 && primaryCurrency.map(p -> p.getCode().equals(currencyTotals.get(0).name())).orElse(false)) {
                currencyTotals.clear(); // Drop totals if only primary currency is filled
            }

            var primaryTotal = accounts.get(totalsCategory).stream().map(Account::getPrimaryBalance).reduce(BigDecimal.ZERO, BigDecimal::add);
            totals.add(new TotalsReportEntry(totalsCategory.getName(), primaryTotal, currencyTotals));
        }
        return new TotalsReport(totals);
    }

    public SimpleReport<Amount> simpleAssetReport(LocalDate from, LocalDate to, Integer granularity) {
        var currentPrimary = settingService.getCurrentCurrencyPrimary().map(Currency::getName).orElse("");
        var dates = expandPeriod(from, to, granularity);
        var amounts = dates.stream().map(d -> {
                    var amount = accountRepository.getTotalAssetsForDate(d).orElse(BigDecimal.ZERO);
                    return new Amount(amount, currentPrimary, d);
                })
                .toList();
        return new SimpleReport<>(amounts);
    }

    protected SimpleReport<Amount> typedAssetReportReport(LocalDate from, LocalDate to, Integer granularity, Function<LocalDate, List<AmountAndName>> query) {
        var dates = expandPeriod(from, to, granularity);
        var amounts = dates.stream().flatMap(d -> query.apply(d).stream().map(t -> new Amount(t.getAmount(), t.getName(), d)))
                .toList();
        return new SimpleReport<>(amounts);
    }

    public SimpleReport<Amount> assetByCurrencyReport(LocalDate from, LocalDate to, Integer granularity) {
        return this.typedAssetReportReport(from, to, granularity, accountRepository::getTotalAssetsForDateByCurrency);
    }

    public SimpleReport<Amount> assetByTypeReport(LocalDate from, LocalDate to, Integer granularity) {
        return this.typedAssetReportReport(from, to, granularity, accountRepository::getTotalAssetsForDateByType);
    }

    public SimpleReport<Amount> eventsByAccountReport(LocalDate from, LocalDate to, Integer granularity, AccountType type) {
        var dates = expandPeriod(from, to, granularity);
        var amounts = IntStream.range(0, dates.size() - 2 + 1)
                .mapToObj(start -> dates.subList(start, start + 2))
                .flatMap(d -> {
                    return accountRepository.getTotalByAccountTypeForRange(type.toDbValue(), d.get(0), d.get(1)).stream().map(t -> new Amount(t.getAmount(), t.getName(), d.get(0)));
                }).toList();
        return new SimpleReport<>(amounts);
    }

    public SimpleReport<Amount> structureReport(LocalDate from, LocalDate to, AccountType type) {
        var totals = accountRepository.getTotalByAccountTypeForRange(type.toDbValue(), from, to)
                .stream().map(a -> new Amount(a.getAmount(), a.getName(), from)).toList();
        return new SimpleReport<>(totals);
    }

    public SimpleReport<BudgetReportEntry> budgetExecutionReport(LocalDate from, LocalDate to) {
        var budgets = budgetService.listInRange(from, to).stream().map(b -> new BudgetReportEntry(from, b.getState().income(), b.getState().expense(), b.getOutgoingAmount().actual().subtract(b.getIncomingAmount())))
                .toList();
        return new SimpleReport<>(budgets);
    }
}
