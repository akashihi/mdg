import {sprintf} from 'sprintf-js';

export function timestampToFormattedDate(ts) {
    const dt = new Date(ts);
    return sprintf('%d-%02d-%02d', dt.getFullYear(), dt.getMonth()+1, dt.getDate());
}

export const momentFormatToDate = m => m.format('DD-MM-YYYY');
