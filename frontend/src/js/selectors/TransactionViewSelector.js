import {createSelector} from 'reselect';
import {getPeriodBeginning, getPeriodEnd} from './StateGetters';
import {momentFormatToDate} from '../util/DateUtil';

export const selectBeginningDate = createSelector(
    [getPeriodBeginning], momentFormatToDate
);
export const selectEndDate = createSelector(
    [getPeriodEnd], momentFormatToDate
);
