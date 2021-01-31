import React from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../redux/actions/authActions";
import { Link, withRouter } from "react-router-dom";
import {makeStyles} from '@material-ui/core/styles';
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
});

/**
 * 
 * @param {*} props 
 */
export function ActivityForm(props){
  function onLogoutClick(e) {
    e.preventDefault();
    props.logoutUser();
  };

  const classes = useStyles();

  const [inputList, setInputList] = React.useState([{ activity: "", duration: "" }]);

  // handle input change
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
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

  return(
    <div>
      <button
        style={{
          width: "150px",
          borderRadius: "3px",
          letterSpacing: "1.5px",
          marginTop: "1rem",
          marginLeft:"auto",
          marginRight:"auto",
          display:"block"
        }}
        onClick={onLogoutClick}
        className="btn btn-large waves-effect waves-light hoverable blue accent-3"
      >
        Logout
      </button>
      {inputList.map((x, i) => {
        return (
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
              onChange={e => handleInputChange(e, i)}
            />
            <div className={classes.btnbox}>
              {inputList.length !== 1 && <IconButton
                className={classes.mr10}
                onClick={() => handleRemoveClick(i)}><DeleteIcon /></IconButton>}
            </div>
            <div className={classes.add}>
              {inputList.length - 1 === i &&
                <IconButton onClick={handleAddClick}><AddCircleIcon fontSize="large" /></IconButton>}
            </div>
          </div>
        );
      })}
      <div style={{ marginTop: 20 }}>{JSON.stringify(inputList)}</div>
    </div>
  );
}

ActivityForm.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(withRouter(ActivityForm));