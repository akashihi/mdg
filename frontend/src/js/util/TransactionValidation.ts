import { EditedTransaction } from '../api/models/Transaction';

export function validateOperationAmount(amount?: string | number): string | null {
    if (String(amount).endsWith('.')) {
        return 'Amount is invalid';
    }
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

export function validateRate(rate?: string | number): string | null {
    if (rate && !/^-?(0|[1-9]\d*)\.?\d{0,5}?$/.test(String(rate))) {
        return 'Rate is invalid';
    }
    return null;
}

export function validateTransaction(tx: EditedTransaction): string | null {
    const ops = tx.editedOperations.filter(item => item.amount !== 0);
    if (ops.length === 0) {
        return 'Empty transaction';
    }
    const sum = ops.reduce((acc, item) => {
        if (item.rate) {
            return acc + item.amount * item.rate;
        }
        return acc + item.amount;
    }, 0);
    const easeForMultiCurrency = ops.map(o => o.rate).some((r: number) => r && r != 1);
    if (!Number.isNaN(sum)) {
        const fixedSum = sum.toFixed(2);
        if (
            !(parseFloat(fixedSum) > -1 && parseFloat(fixedSum) < 1) ||
            (parseFloat(fixedSum) !== 0 && !easeForMultiCurrency)
        ) {
            return `Transaction not balanced, disbalance is: ${fixedSum}`;
        }
    } else {
        return 'Empty transaction';
    }
    return null;
}
