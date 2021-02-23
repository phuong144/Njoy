import { GENERATE_SCHEDULE } from "../actions/actionTypes";

const initialState = {
  schedule: [],
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GENERATE_SCHEDULE:
      return {
        ...state,
        schedule: action.payload
      };
    default:
      return state;
  }
}