import {Moment} from 'moment';

export const momentFormatToDate = (m:Moment):string => m.format('DD-MM-YYYY')
