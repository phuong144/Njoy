import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import scheduleReducer from "./scheduleReducer";

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  schedule: scheduleReducer
});