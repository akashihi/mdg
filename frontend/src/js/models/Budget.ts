export interface BudgetPair {
    actual: number,
    expected: number
}

export interface BudgetState {
    income: BudgetPair,
    expense: BudgetPair,
    allowed: BudgetPair
}

export interface Budget {
    id: number,
    state: BudgetState,
    term_beginning: string,
    term_end: string,
    incoming_amount: number,
    outgoing_amount: BudgetPair
}
