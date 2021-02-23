import React from "react";
import ActivityForm from './ActivityForm';
import Schedule from './Schedule';
import Appbar from './Appbar'; 
import { BrowserRouter as Router, Route, Redirect} from "react-router-dom";

export default function Dashboard (props) {
  return (
    <Router>
      <Appbar />
      <Route exact path="/dashboard">
              <Redirect to="/dashboard/activityform" />
      </Route>
      <Route path="/dashboard/activityform" component={ActivityForm} />
      <Route path="/dashboard/schedule" component={Schedule} />
    </Router>
  );
}