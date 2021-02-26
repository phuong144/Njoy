import axios from "axios";
import {
  GET_ERRORS,
  GENERATE_SCHEDULE
} from "./actionTypes";

// Generate Schedule action handler
export const generateSchedule = dataObject => dispatch => {
  axios
    .post("http://localhost:5000/api/schedule/generate", dataObject)
    .then(res => {
      // Data object sent in from the api, as a list of objects
      // [{ activity: "", duration: "" }]
      
      // schedule is a list of objects
      const schedule = res.data;
        
      // dispatch to reducer
      dispatch(setSchedule(schedule));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Generate Schedule action handler
export const getSchedule = uid => dispatch => {
  axios
    .get("http://localhost:5000/api/schedule/getSchedule", {
      params: {
        uid: uid
      }
    })
    .then(res => {
      if (res.status == '404') {
        console.log("No schedule");
        dispatch(setSchedule([]));
      } else {
        const data = res.data;
        
        console.log(data);
        dispatch(setSchedule(data));
      }
     
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Set schedule
export const setSchedule = schedule => {
    return {
        type: GENERATE_SCHEDULE,
        payload: schedule
    };
};