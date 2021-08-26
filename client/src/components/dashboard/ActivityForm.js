import React, { useEffect } from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, useLocation } from "react-router-dom";
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
    marginTop: '25px',
    color: '#ffa500',
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
  button: {
    color: '#3bb446',
    fontSize: '15px',
    fontFamily: 'Arial',
    fontWeight: 'bold',
    textDecoration: 'none !important',
  },
  addbutton: {
    color: '#ffa500',
  },
  text: {
    marginBottom: '10px',
    marginTop: '10px',
  }
}, {index: 1});

/**
 * 
 * @param {*} props 
 */
export function ActivityForm(props) {
  const classes = useStyles();
  const [inputList, setInputList] = React.useState([{ activity: "", duration: "" }]);
  const [errors, setError] = React.useState([{ error: null }]);
  const [disabled, setDisable] = React.useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.state != null && location.state.addMore) {
      const activities = props.schedule.activities;
      activities.forEach(object => delete object._id);
      let initErrorList = [];
      for (let i=0; i<activities.length; i++) {
        initErrorList.push({ 'error': null });
      }
      setInputList(activities);
      setError(initErrorList);
    }
  }, [location]);

  // Creates dataObject to send to action for generating a schedule
  function onSubmit(e) {
    e.preventDefault();
    const dataObject = {
      id: props.auth.user.id,
      activities: inputList,
    }
    props.generateSchedule(dataObject);
    props.history.push("/dashboard/schedule");
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
        // setDisable(true);
      } else {
        const error = 'error';
        errorlist[index][error] = null;
      }
    }
    checkErrors(errorlist);
    const list = [...inputList];
    list[index][name] = value;
    setInputList(list);
    setError(errorlist)
    checkErrors(errorlist);
  };

  function checkErrors(errorlist) {
    let check = false;
    for(let i=0; i<errorlist.length; i++) {
      if (errorlist[i]['error'] === true) {
        check = true;
        break;
      }
    }
    if (!check) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  }
  

  // Handle click event for removing a pair of text inputs
  const handleRemoveClick = index => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
    const error = [...errors];
    error.splice(index, 1);
    setError(error);
    checkErrors(error);
  };

  // Handle click event for adding a pair of text inputs
  const handleAddClick = (num) => {
    const activity = "activity";
    const duration = "duration";
    const error = "error";
    setInputList([...inputList, { [activity]: "", [duration]: "" }]);
    setError([...errors, { [error]: null }]);
    checkErrors(errors);
  };

  return (
    <div>
      {inputList.map((x, i) => {
        const error = "error";
        return (
          <div key={i} className={classes.root}>
            <Paper elevation={3} className={classes.text}>
                <TextField
                  name={"activity"}
                  placeholder="Enter the Activity"
                  value={x.activity}
                  variant="outlined"
                  label="Activity"
                  style={{ marginTop: '20px' }}
                  onChange={e => handleInputChange(e, i)}
                  onEnded={checkErrors}
                />
                <TextField
                  className={classes.ml10}
                  name={"duration"}
                  placeholder="Enter the Duration"
                  value={x.duration}
                  label="Duration"
                  helperText="in minute"
                  variant="outlined"
                  style={{ marginTop: '20px' }}
                  error={errors[i][error] != null}
                  onChange={e => handleInputChange(e, i)}
                  onEnded={checkErrors}
                />
                <div className={classes.btnbox}>
                  {inputList.length !== 1 && <IconButton
                    className={classes.mr10}
                    onClick={() => handleRemoveClick(i)}><DeleteIcon /></IconButton>}
                </div>
            </Paper>
            <div className={classes.add}>
              {inputList.length - 1 === i &&
                <IconButton className={classes.addbutton} onClick={() => handleAddClick(i + 1)}>
                  <AddCircleIcon fontSize="large" />
                </IconButton>}
            </div>
          </div>
        );
      })}
      <Button
        variant="contained"
        style={{ background: '#c9f8f5' }}
        onClick={onSubmit}
        className={classes.button}
        disabled={disabled}
      >
        Generate Schedule
        <BathtubIcon />
      </Button>

      <hr style={{ marginTop: 20 }}></hr>
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
  addMore: PropTypes.bool
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