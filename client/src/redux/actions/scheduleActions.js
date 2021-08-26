import axios from "axios";
import {
  GET_ERRORS,
  GENERATE_SCHEDULE
} from "./actionTypes";

// Generate Schedule action handler
export const generateSchedule = dataObject => dispatch => {
  axios
    .post("/api/schedule/generate", dataObject)
    .then(res => {
      // Data object sent in from the api, as a list of objects
      // [{ activity: "", duration: "" }]
      
      // schedule is a list of objects
      const schedule = res.data;
        
      // dispatch to reducer
      dispatch(updateSchedule(schedule));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Reset schedule to empty
export const resetSchedule = dataObj => dispatch => {
  axios
    .post("/api/schedule/resetSchedule", dataObj)
    .then(res => {
      // schedule is a list of objects
      const schedule = res.data;
     // dispatch to reducer
      dispatch(updateSchedule(schedule));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Update schedule with changed activity time from DragNDrop
export const setSchedule = dataObject => dispatch => {
  axios
    .post("/api/schedule/setSchedule", dataObject)
    .then(res => {
      // schedule is a list of objects
      const schedule = res.data;
     // dispatch to reducer
      dispatch(updateSchedule(schedule));
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
    .get("/api/schedule/getSchedule", {
      params: {
        uid: uid
      }
    })
    .then(res => {
      if (res.status == '404') {
        dispatch(updateSchedule([]));
      } else {
        const data = res.data;
        dispatch(updateSchedule(data));
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
export const updateSchedule = schedule => {
    return {
        type: GENERATE_SCHEDULE,
        payload: schedule
    };
};