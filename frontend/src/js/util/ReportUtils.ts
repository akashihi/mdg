import jQuery from 'jquery';
import { ReportProps } from '../components/report/ReportsPage';

export function reportDatesToParams(dates: ReportProps): string {
    const params = {
        startDate: dates.startDate.format('YYYY-MM-DD'),
        endDate: dates.endDate.format('YYYY-MM-DD'),
        granularity: dates.granularity,
    };
    return '?' + jQuery.param(params);
}
