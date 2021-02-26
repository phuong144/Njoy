import { GENERATE_SCHEDULE } from "../actions/actionTypes";

const initialState = {
  schedule: [],
  activities: [],
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GENERATE_SCHEDULE:
      return {
        ...state,
        schedule: action.payload.schedule,
        activities: action.payload.activities,
      };
    default:
      return state;
  }
}