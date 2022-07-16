import { createSelector } from 'reselect';
import { getCurrencies } from './StateGetters';
import Currency from '../models/Currency';
import { selectPrimaryCurrencyId } from './SettingsSelector';

export const selectActiveCurrencies = createSelector([getCurrencies], (currencies: Currency[]) =>
    currencies.filter(v => v.active)
);

export const selectInactiveCurrencies = createSelector([getCurrencies], (currencies: Currency[]) =>
    currencies.filter(v => !v.active)
);

export const selectPrimaryCurrency = createSelector(
    [getCurrencies, selectPrimaryCurrencyId],
    (currencies: Currency[], primaryId: number): Currency | undefined => currencies.find(c => c.id === primaryId)
);

export const selectPrimaryCurrencyName = createSelector(
    [selectPrimaryCurrency],
    (primaryCurrency: Currency | undefined): string => {
        if (primaryCurrency === undefined) {
            return '';
        }
        return primaryCurrency.name;
    }
);
