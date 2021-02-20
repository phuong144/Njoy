import React, { useEffect } from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import Button from '@material-ui/core/Button';
import BathtubIcon from '@material-ui/icons/Bathtub';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import TextField from '@material-ui/core/TextField';
import { generateSchedule } from "../../redux/actions/scheduleActions";
import { getSchedule } from "../../redux/actions/scheduleActions";

const useStyles = makeStyles({
  ml10: {
    marginLeft: '10px',
    width: '15ch',
  },
  mr10: {
    marginRight: '10px',
  },
  box: {
    marginBottom: '10px',
    marginTop: '10px',
  },
  btnbox: {
    marginLeft: '10px',
    width: '50px',
    display: 'inline-block',
  },
  add: {
    marginBottom: '10px',
    marginTop: '10px'
  },
  root: {
    margin: 'auto',
    width: '55ch',
  },
  title: {
    flexGrow: 1,
  },
});

/**
 * 
 * @param {*} props 
 */
export function ActivityForm(props) {
  const classes = useStyles();
  const [inputList, setInputList] = React.useState([{ activity: "", duration: "" }]);
  const [errors, setError] = React.useState([{ error: null }]);
  const [schedule, setSchedule] = React.useState(null);

  // useEffect(() => {
  //   if (props.auth.isAuthenticated) {
  //     props.history.push("/ActivityForm");
  //   }
  //   if (props.errors) {
  //     setError(props.errors);
  //     console.log(props.errors);
  //   }
  // }, [props]);

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
  }, [props])

  // Creates dataObject to send to action for generating a schedule
  function onSubmit(e) {
    e.preventDefault();
    const dataObject = {
      id: props.auth.user.id,
      activities: inputList,
    }
    props.generateSchedule(dataObject);
  };

  // Validate and parse input to save to inputList
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const errorlist = [...errors];
    // Only numeric characters
    if (name.substring(0, 8) === 'duration') {
      let numericRegex = /^\d+$/;
      if (!numericRegex.test(value)) {
        const error = 'error';
        errorlist[index][error] = true;
      } else {
        const error = 'error';
        errorlist[index][error] = null;
      }
    }
    const list = [...inputList];
    list[index][name] = value;
    setInputList(list);
    setError(errorlist)
  };

  // Handle click event for removing a pair of text inputs
  const handleRemoveClick = index => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
    const error = [...errors];
    error.splice(index, 1);
    setError(error);
  };

  // Handle click event for adding a pair of text inputs
  const handleAddClick = (num) => {
    const activity = "activity";
    const duration = "duration";
    const error = "error";
    setInputList([...inputList, { [activity]: "", [duration]: "" }]);
    setError([...errors, { [error]: null }]);
  };

  return (
    <div>
      {inputList.map((x, i) => {
        const error = "error";
        return (
          <div key={i} className={classes.root}>
            <Paper elevation={3}>
              <div className={classes.box}>
                <TextField
                  name={"activity"}
                  placeholder="Enter the Activity"
                  value={x.activity}
                  variant="outlined"
                  label="Activity"
                  onChange={e => handleInputChange(e, i)}
                />
                <TextField
                  className={classes.ml10}
                  name={"duration"}
                  placeholder="Enter the Duration"
                  value={x.duration}
                  label="Duration"
                  helperText="in minute"
                  variant="outlined"
                  error={errors[i][error] != null}

                  onChange={e => handleInputChange(e, i)}
                />
                <div className={classes.btnbox}>
                  {inputList.length !== 1 && <IconButton
                    className={classes.mr10}
                    onClick={() => handleRemoveClick(i)}><DeleteIcon /></IconButton>}
                </div>
              </div>
            </Paper>
            <div className={classes.add}>
              {inputList.length - 1 === i &&
                <IconButton onClick={() => handleAddClick(i + 1)}><AddCircleIcon fontSize="large" /></IconButton>}
            </div>
          </div>
        );
      })}
      <Button
        variant="contained"
        color="primary"
        onClick={onSubmit}
        className={classes.button}
      >
        Generate Schedule
        <BathtubIcon />
      </Button>

      <hr style={{ marginTop: 20 }}></hr>
      <div style={{ marginTop: 20 }}>{JSON.stringify(inputList)}</div>
      <div style={{ marginTop: 20 }}>{JSON.stringify(schedule)}</div>
      <div style={{ marginTop: 20 }}>{JSON.stringify(errors)}</div>
    </div>
  );
}

// generateSchedule is an action needed to generate a schedule
// getSchedule is an action needed to retrieve any existing schedule
// auth is an object in the redux store that stores user authentication info
// schedule is an object in the redux store that stores the schedule data
// errors is an object in the redux store that stores errors
ActivityForm.propTypes = {
  generateSchedule: PropTypes.func.isRequired,
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
  { generateSchedule, getSchedule }
)(withRouter(ActivityForm));