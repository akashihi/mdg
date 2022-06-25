import { createSelector } from 'reselect';
import {getRates} from './StateGetters';
import Currency from '../models/Currency';
import {selectPrimaryCurrencyId} from "./SettingsSelector";
import Rate from "../models/Rate";
import {selectActiveCurrencies} from "./CurrencySelector";
import {produce} from 'immer';

export const selectActiveRatesWithNames = createSelector(
    [selectActiveCurrencies, getRates, selectPrimaryCurrencyId], (currencies: Currency[], rates: Rate[], primaryCurrency: number):Rate[] => {
        return rates.filter(r => r.to === primaryCurrency)
            .filter(r => currencies.find(c => c.id === r.from))
            .map(r => {
                return produce<Rate>(draft => {
                    draft.currencyCode = currencies.find(c => c.id === r.from).code
                })(r)
            });
    }
);
