import { createSelector } from 'reselect';
import { getCurrencies } from './StateGetters';
import Currency from '../models/Currency';

export const selectActiveCurrencies = createSelector(
    [getCurrencies], (currencies: Currency[]) => currencies.filter((v) => v.active)
);

export const selectInactiveCurrencies = createSelector(
    [getCurrencies], (currencies: Currency[]) => currencies.filter((v) => !v.active)
);
