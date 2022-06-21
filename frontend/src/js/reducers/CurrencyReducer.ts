import produce from "immer"
import { CurrencyActionType } from '../constants/Currency'
import Currency from "../models/Currency";

export interface CurrencyState {
    readonly currencies: Array<Currency>;
    readonly available: boolean;
}

const initialState:CurrencyState = {
    currencies: [],
    available: false
}

export default function currencyReducer (state:CurrencyState = initialState, action) {
  switch (action.type) {
    case CurrencyActionType.CurrenciesLoad:
        return produce(state, draft => {draft.available = false});
    case CurrencyActionType.StoreCurrencies:
        return produce(state, draft => {draft.available = false; draft.currencies = action.payload});
    case CurrencyActionType.CurrenciesLoadFail:
        return produce(state, draft => {draft.available = false});
    default:
      return state
  }
}
