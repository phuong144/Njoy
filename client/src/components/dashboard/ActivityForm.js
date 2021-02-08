import React, { useEffect } from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../redux/actions/authActions";
import { Link, withRouter } from "react-router-dom";
import Button from '@material-ui/core/Button';
import BathtubIcon from '@material-ui/icons/Bathtub';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import TextField from '@material-ui/core/TextField';

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
  function onLogoutClick(e) {
    e.preventDefault();
    props.logoutUser();
  };
  const classes = useStyles();
  const [inputList, setInputList] = React.useState([{ activity: "", duration: "" }]);
  const [errors, setError] = React.useState({duration:null});

  // useEffect(() => {
  //   if (props.auth.isAuthenticated) {
  //     props.history.push("/ActivityForm");
  //   }
  //   if (props.errors) {
  //     setError(props.errors);
  //     console.log(props.errors);
  //   }
  // }, [props]);

  function onSubmit(e) {
    e.preventDefault();
    // props.inputActivity(inputList, props.history);
    console.log("Wooooo I Submitted: Activity: " + JSON.stringify(inputList));
  };

  // handle input change
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;

    // Only numeric characters
    if (name === 'duration') {
      let numericRegex = /^\d+$/;
      if (!numericRegex.test(value)) {
        setError({
          ...errors,
          duration: true,
        })
      } else {
        setError({
          ...errors,
          duration: null,
        })
      }
    }
    const list = [...inputList];
    list[index][name] = value;
    setInputList(list);
  };

  // handle click event of the Remove button
  const handleRemoveClick = index => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
  };

  // handle click event of the Add button
  const handleAddClick = () => {
    setInputList([...inputList, { activity: "", duration: "" }]);
  };

  return (
    <div>
      {inputList.map((x, i)=> {
        return (
          <div key={i} className={classes.root}>
            <Paper elevation={3}>
              <div className={classes.box}>
                <TextField
                  name="activity"
                  placeholder="Enter the Activity"
                  value={x.activity}
                  variant="outlined"
                  label="Activity"
                  onChange={e => handleInputChange(e, i)}
                />
                <TextField
                  className={classes.ml10}
                  name="duration"
                  placeholder="Enter the Duration"
                  value={x.duration}
                  label="Duration"
                  helperText="in minute"
                  variant="outlined"
                  error={errors.duration != null}
                  
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
                <IconButton onClick={handleAddClick}><AddCircleIcon fontSize="large" /></IconButton>}
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
    </div>
  );
}

ActivityForm.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  // inputActivity: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { logoutUser/*, inputActivity*/ }
)(withRouter(ActivityForm));