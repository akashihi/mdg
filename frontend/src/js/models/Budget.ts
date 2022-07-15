export interface BudgetPair {
    actual: number,
    expected: number
}

export interface BudgetState {
    income: BudgetPair,
    expense: BudgetPair,
    allowed: BudgetPair
}

export interface ShortBudget {
    id: string,
    term_beginning: string,
    term_end: string,
}

export interface Budget extends ShortBudget {
    state: BudgetState,
    incoming_amount: number,
    outgoing_amount: BudgetPair
}
