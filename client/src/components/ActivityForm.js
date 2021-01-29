import React from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../redux/actions/authActions";
import { Link, withRouter } from "react-router-dom";

export function ActivityForm(props){

  function onLogoutClick(e) {
    e.preventDefault();
    props.logoutUser();
  };

  return(
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