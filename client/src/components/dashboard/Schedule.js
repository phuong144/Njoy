import React, { useEffect } from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { getSchedule } from "../../redux/actions/scheduleActions";
import Paper from '@material-ui/core/Paper';
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  DayView,
  Appointments,
} from '@devexpress/dx-react-scheduler-material-ui';

const testing = [{ startDate: '2018-11-01T09:45', endDate: '2018-11-01T11:00', activity: 'Yoga' },
{ startDate: '2018-11-01T12:00', endDate: '2018-11-01T13:30', activity: 'Running' }];
const currentDate = '2018-11-01';
const schedulerData = [];

export function Schedule(props) {
  // schedule will be set to a list of objects like inputList
  const [schedule, setSchedule] = React.useState(null);

  // Acts as componentDidMount, executes on component mount to get any existing schedule
  useEffect(() => {
    if (schedule == null) {
      const uid = props.auth.user.id;
      props.getSchedule(uid);
    }
  })

  // Executes when props changes E.g. schedule is generated
  useEffect(() => {
    setSchedule(props.schedule.schedule);

    testing.forEach(function (item, index) {
      schedulerData[index] = {
        startDate: '',
        endDate: '',
        title: ''
      }
      schedulerData[index]["startDate"] = item["startDate"];
      schedulerData[index]["endDate"] = item["endDate"];
      schedulerData[index]["title"] = item["activity"];
    });
    console.log(schedulerData);
  }, [props])

  return (
    <div>
      <Paper>
        <Scheduler
          data={schedulerData}
          {...console.log(schedulerData)}
        >
          <ViewState
            currentDate={currentDate}
          />
          <DayView
            startDayHour={9}
            endDayHour={20}
          />
          <Appointments />
        </Scheduler>
      </Paper>
      <div style={{ marginTop: 20 }}>{(schedule != null) ? JSON.stringify(schedule) : "Null"}</div>
      <div style={{ marginTop: 20 }}>{(schedule != null) ? JSON.stringify(schedulerData) : "Null"}</div>
    </div>
  )
}

// getSchedule is an action needed to retrieve any existing schedule
// auth is an object in the redux store that stores user authentication info
// schedule is an object in the redux store that stores the schedule data
// errors is an object in the redux store that stores errors
Schedule.propTypes = {
  getSchedule: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  schedule: PropTypes.object.isRequired,
};

// Maps redux store state to props
const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  schedule: state.schedule,
});

// Connects required actions and props to this component
export default connect(
  mapStateToProps,
  { getSchedule }
)(withRouter(Schedule));