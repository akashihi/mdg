package org.akashihi.mdg.service;

import lombok.RequiredArgsConstructor;
import org.akashihi.mdg.entity.Account;
import org.akashihi.mdg.entity.AccountType;
import org.akashihi.mdg.entity.Category;
import org.akashihi.mdg.entity.Currency;
import org.akashihi.mdg.entity.report.Amount;
import org.akashihi.mdg.entity.report.TotalsReport;
import org.akashihi.mdg.entity.report.TotalsReportEntry;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {
    private final AccountService accountService;
    private final SettingService settingService;

    public TotalsReport totalsReport() {
        var primaryCurrency = settingService.getCurrentCurrencyPrimary();
        Comparator<Amount> primaryCurrencyComparator =(l, r) -> { if (l.currencyCode().equals(primaryCurrency.map(Currency::getCode).orElse(""))) { return -1;} else { return l.currencyCode().compareTo(r.currencyCode());}};

        var accounts = accountService.listByType(AccountType.ASSET)
                .stream().collect(Collectors.groupingBy(Account::getCategory));
        var totals = new ArrayList<TotalsReportEntry>();
        for (Category totalsCategory : accounts.keySet()) {
            var currencyGroups = accounts.get(totalsCategory).stream().collect(Collectors.groupingBy(Account::getCurrency));
            var currencyTotals = new ArrayList<Amount>();
            if (!(currencyGroups.size() == 1 && primaryCurrency.map(currencyGroups::containsKey).orElse(false))) {
                //Only fill detailed totals if there is more than just primary currency
                for (Currency currencyGroup: currencyGroups.keySet()) {
                    var totalAmount = currencyGroups.get(currencyGroup).stream().map(Account::getBalance).reduce(BigDecimal.ZERO, BigDecimal::add);
                    currencyTotals.add(new Amount(totalAmount, currencyGroup.getCode()));
                }
                currencyTotals.sort(primaryCurrencyComparator);
            }

            var primaryTotal = accounts.get(totalsCategory).stream().map(Account::getPrimaryBalance).reduce(BigDecimal.ZERO, BigDecimal::add);
            totals.add(new TotalsReportEntry(totalsCategory.getName(), primaryTotal, currencyTotals));
        }
        totals.sort(Comparator.comparing(TotalsReportEntry::categoryName));
        return new TotalsReport(totals);
    }
}
