import { TOGGLE_BUDGET_SELECTOR, GET_BUDGETLIST_REQUEST, GET_BUDGETLIST_SUCCESS } from '../constants/Budget'

export function toggleBudgetSelector(visible) {
    return {
        type: TOGGLE_BUDGET_SELECTOR,
        payload: visible
    }
}

var budgetList = [
    {
        'type': 'budget',
        'id': 20170101,
        'attributes': {
            'term_beginning': '2017-01-01',
            'term_end': '2017-01-28',
            'incoming_amount': 9000,
            'outgoing_amount': {
                'expected': 100500,
                'actual': 3.62
            }
        }
    },
    {
        'type': 'budget',
        'id': 20170201,
        'attributes': {
            'term_beginning': '2017-02-01',
            'term_end': '2017-02-28',
            'incoming_amount': 9000,
            'outgoing_amount': {
                'expected': 100500,
                'actual': 3.62
            }
        }
    },
    {
        'type': 'budget',
        'id': 20170301,
        'attributes': {
            'term_beginning': '2017-03-01',
            'term_end': '2017-03-28',
            'incoming_amount': 9000,
            'outgoing_amount': {
                'expected': 100500,
                'actual': 3.62
            }
        }
    },
    {
        'type': 'budget',
        'id': 20170401,
        'attributes': {
            'term_beginning': '2017-04-01',
            'term_end': '2017-04-28',
            'incoming_amount': 9000,
            'outgoing_amount': {
                'expected': 100500,
                'actual': 3.62
            }
        }
    },
    {
        'type': 'budget',
        'id': 20170501,
        'attributes': {
            'term_beginning': '2017-05-01',
            'term_end': '2017-05-28',
            'incoming_amount': 9000,
            'outgoing_amount': {
                'expected': 100500,
                'actual': 3.62
            }
        }
    }
];

export function loadBudgetList() {
    return (dispatch) => {
        dispatch({
            type: GET_BUDGETLIST_REQUEST,
            payload: true
        });

        setTimeout(() => {
            dispatch({
                type: GET_BUDGETLIST_SUCCESS,
                payload: budgetList
            })
        }, 15000)
    }
}
