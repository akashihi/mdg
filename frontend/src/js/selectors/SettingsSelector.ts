import { createSelector } from 'reselect';
import { getSettings } from './StateGetters';
import { SettingState } from '../reducers/SettingReducer';

export const selectPrimaryCurrencyId = createSelector(
    [getSettings],
    (settings: SettingState): number => settings.primaryCurrency
);

export const selectCloseOnExit = createSelector(
    [getSettings],
    (settings: SettingState): boolean => settings.closeTransactionDialog
);
