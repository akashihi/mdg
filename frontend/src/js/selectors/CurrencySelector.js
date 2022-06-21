import { createSelector } from 'reselect';
import { getCurrencies } from './StateGetters';

export const selectActiveCurrencies = createSelector(
    [getCurrencies], (currencies) => currencies.filter((v) => v.active)
);
