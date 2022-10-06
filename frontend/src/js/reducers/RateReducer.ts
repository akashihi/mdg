import { RateActionsType } from '../constants/Rate';
import {Rate} from "../api/model";
import { produce } from 'immer';
import { RateAction } from '../actions/RateActions';

export interface RateState {
    readonly rateList: Rate[];
    readonly available: boolean;
}

const initialState: RateState = {
    rateList: [],
    available: false,
};

export default function currencyReducer(state: RateState = initialState, action: RateAction) {
    switch (action.type) {
        case RateActionsType.RatesLoad:
            return produce(state, draft => {
                draft.available = false;
            });
        case RateActionsType.RatesStore:
            return produce(state, draft => {
                draft.available = true;
                draft.rateList = action.payload;
            });
        default:
            return state;
    }
}
