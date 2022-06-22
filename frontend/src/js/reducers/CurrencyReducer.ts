import produce from "immer"
import { CurrencyActionType } from '../constants/Currency'
import Currency from "../models/Currency";
import {CurrencyAction} from "../actions/CurrencyActions";

export interface CurrencyState {
    readonly currencies: Array<Currency>;
    readonly available: boolean;
}

const initialState:CurrencyState = {
    currencies: [],
    available: false
}

export default function currencyReducer (state:CurrencyState = initialState, action: CurrencyAction) {
  switch (action.type) {
    case CurrencyActionType.CurrenciesLoad:
        return produce(state, draft => {draft.available = false});
    case CurrencyActionType.StoreCurrencies:
        return produce(state, draft => {draft.available = false; draft.currencies = action.payload});
    case CurrencyActionType.CurrenciesLoadFail:
        return produce(state, draft => {draft.available = false});
      case CurrencyActionType.CurrencyStatusUpdate:
          return produce(state, draft => {
              const pos = draft.currencies.findIndex(c => c.id == action.payload[0].id);
              if (pos !== undefined) {
                  draft.currencies[pos].active = action.payload[0].active;
              }
          })
    default:
      return state
  }
}
