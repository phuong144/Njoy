import React, { useEffect } from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { getSchedule, setSchedule } from "../../redux/actions/scheduleActions";
import Paper from '@material-ui/core/Paper';
import { ViewState, EditingState, IntegratedEditing } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  DayView,
  Appointments,
  DragDropProvider,
} from '@devexpress/dx-react-scheduler-material-ui';
import Button from '@material-ui/core/Button';

export function Schedule(props) {
  // schedule will be set to a list of objects like inputList
  const [schedule, setServerSchedule] = React.useState(null);
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
    setServerSchedule(props.schedule.schedule);
    setDisplay(schedulerData);

  }, [props])

  const onCommitChanges = React.useCallback(({ added, changed, deleted}) => {
    // Parse for changed data;
    // Send parsed data to 
    if (changed) {
      // changed = {id : {endDate:'', startDate:''}}
      console.log(changed);
      const dataObj = {
        id: props.auth.user.id,
      };
      const changedActivity = {};
      for (let i=0; i<displaySchedule.length; i++) {
        if (changed[i]) {
          const activityName = displaySchedule[i]['title'];
          const endDate = changed[i]['endDate'];
          const startDate = changed[i]['startDate'];
          changedActivity['activity'] = {
            'startDate': startDate,
            'endDate': endDate,
            'title': activityName
          }
          dataObj['changedActivity'] = changedActivity;
          console.log(dataObj);
          break;
        }
      }
     props.setSchedule(dataObj);
    }
  }, [setDisplay, displaySchedule]);

  return (
    <React.Fragment>
      <Button variant="contained"
        style={{ background: '#c9f8f5',
        marginBottom: '10px',
        marginTop: '10px'}}>
        <Link to={{
          pathname: '/dashboard/activityform',
          state: { addMore: true }
        }}
        style={{ color: '#3bb446',
                 fontSize: '15px',
                 fontFamily: 'Arial',
                 fontWeight: 'bold',
        }}> Add More </Link>
      </Button>
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
  setSchedule: PropTypes.func.isRequired,
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
  { getSchedule, setSchedule }
)(withRouter(Schedule));