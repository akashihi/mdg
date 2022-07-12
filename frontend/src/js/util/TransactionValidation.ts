import {Operation} from "../models/Transaction";

export interface OperationValidity {
    error: boolean;
    amount_error?: string;
    account_error?: string;
    rate_error?: string
}

export function validateOperationAmount(amount?: string): string|null {
    if (!/^-?(0|[1-9]\d*)\.?\d{0,2}?$/.test(String(amount))) {
        return 'Amount is invalid';
    }
    return null;
}

export function validateAccountSelected(account_id?: number) {
    if (!account_id || account_id === -1) {
        return 'Account is not selected';
    }
    return null;
}
export function validateOperation(o: Operation):OperationValidity {
    let validationResult: OperationValidity = {error: false};
    if (!/^-?(0|[1-9]\d*)\.?\d{0,2}?$/.test(String(o.amount))) {
        validationResult.error = true;
        validationResult.amount_error = 'Amount is invalid';
    }

    if (o.rate && !/^-?(0|[1-9]\d*)\.?\d{0,5}?$/.test(String(o.rate))) {
        validationResult.error = true;
        validationResult.rate_error = 'Rate is invalid';
    }

    if (!o.account_id || o.account_id === -1) {
        validationResult.error = true;
        validationResult.account_error = 'Account is not selected';
    }
    return validationResult;
}
