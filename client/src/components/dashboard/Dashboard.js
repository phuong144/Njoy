import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../redux/actions/authActions";
import ActivityForm from './ActivityForm';
import Schedule from './Schedule';
import Appbar from './Appbar'; 
import { BrowserRouter as Router, Route, Redirect} from "react-router-dom";

export function Dashboard (props) {
  return (
    <Router>
      <Appbar />
      <Route exact path="/dashboard">
              <Redirect to="/dashboard/activityform" />
      </Route>
      <Route path="/dashboard/activityform" component={ActivityForm} />
      <Route path="/dashboard/register" component={Schedule} />
    </Router>
  );
}

Dashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(
  mapStateToProps,
  { logoutUser }
)(Dashboard);