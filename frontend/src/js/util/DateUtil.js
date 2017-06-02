import {sprintf} from 'sprintf-js';

export function timestampToFormattedDate(ts) {
    var dt = new Date(ts);
    return sprintf('%d-%02d-%02d', dt.getFullYear(), dt.getMonth()+1, dt.getDate());
}
