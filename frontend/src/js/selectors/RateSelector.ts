import { createSelector } from 'reselect';
import { getRates } from './StateGetters';
import { selectPrimaryCurrencyId } from './SettingsSelector';
import {Rate, Currency} from "../api/model";
import { selectActiveCurrencies } from './CurrencySelector';
import { produce } from 'immer';

export const selectActiveRatesWithNames = createSelector(
    [selectActiveCurrencies, getRates, selectPrimaryCurrencyId],
    (currencies: Currency[], rates: Rate[], primaryCurrency: number): Rate[] => {
        return rates
            .filter(r => r.to === primaryCurrency)
            .filter(r => currencies.find(c => c.id === r.from))
            .map(r => {
                return produce<Rate>(draft => {
                    // @ts-ignore
                    draft.currencyCode = currencies.find(c => c.id === r.from).code;
                })(r);
            });
    }
);
