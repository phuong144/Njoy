import React, { useEffect } from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { getSchedule } from "../../redux/actions/scheduleActions";
import Paper from '@material-ui/core/Paper';
import { ViewState, EditingState, IntegratedEditing } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  DayView,
  Appointments,
  DragDropProvider,
} from '@devexpress/dx-react-scheduler-material-ui';


export function Schedule(props) {
  // schedule will be set to a list of objects like inputList
  const [schedule, setSchedule] = React.useState(null);
  const [displaySchedule, setDisplay] = React.useState([]);

  //get todays date
  const today = new Date();
  const day = (today.getDate() < 10) ? "0" + (today.getDate()) : today.getDate();
  const month = (today.getMonth() < 10) ? "0" + (today.getMonth() + 1) : today.getMonth() + 1;
  const year = today.getFullYear();
  const currentDate = year + '-' + month + '-' + day;

  // Acts as componentDidMount, executes on component mount to get any existing schedule
  useEffect(() => {
    if (schedule == null) {
      const uid = props.auth.user.id;
      props.getSchedule(uid);
    }
  })

  // Executes when props changes E.g. schedule is generated
  useEffect(() => {
    // console.log(props.schedule);
    const scheduleProps = props.schedule.schedule;
    const schedulerData = [];
    scheduleProps.forEach(function (item, index) {
      schedulerData[index] = {
        startDate: '',
        endDate: '',
        title: '',
        id: index,
      };
      const startEndDate = item["duration"].split('-');
      schedulerData[index]["startDate"] = currentDate + startEndDate[0];
      schedulerData[index]["endDate"] = currentDate + startEndDate[1];
      schedulerData[index]["title"] = item["activity"];
    })
    setSchedule(props.schedule.schedule);
    setDisplay(schedulerData);

  }, [props])

  const onCommitChanges = React.useCallback(({ added, changed, deleted}) => {
    // Parse for changed data;
    // Send parsed data to 

    if (changed) {
      // changed = {id : {endDate:'', startDate:''}}
      setDisplay(displaySchedule.map(appointment => (
        changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment
      )));
    }
  }, [setDisplay, displaySchedule]);

  return (
    <React.Fragment>
      <Link to={{
        pathname: '/dashboard/activityform',
        state: { addMore: true }
      }}> Add More </Link>
      <Paper>
        <Scheduler
          data={displaySchedule}
        >
          <ViewState
            currentDate={currentDate}
          />
          <EditingState
            onCommitChanges={onCommitChanges}
          />
          <IntegratedEditing />
          <DayView
            startDayHour={8}
            endDayHour={24}
          />
          <Appointments />
          <DragDropProvider />
        </Scheduler>
      </Paper>
      <div style={{ marginTop: 20 }}>{(schedule != null) ? 'Schedule: ' + JSON.stringify(schedule) : "Null"}</div>
      <div style={{ marginTop: 20 }}>{(schedule != null) ? 'Schedule data formatted to display: ' + JSON.stringify(displaySchedule) : "Null"}</div>
    </React.Fragment>
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