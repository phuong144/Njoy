import React from 'react';
import './App.css';
import jwt_decode from "jwt-decode";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./redux/actions/authActions";
import store from "./redux/store";
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import ActivityForm from './components/ActivityForm';
import PrivateRoute from "./components/PrivateRoute";
// import NavBar from './components/NavBar';


// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and get user info and exp
  const decoded = jwt_decode(token);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
  // Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Redirect to login
    window.location.href = "./login";
  }
}

/*
  React Router SetUp
  <Router>
      <div className="App">
        <Navbar />
        <Route exact path="/" component={SignIn} />
        <Route exact path="/register" component={SignUp} />
        <Switch>
          <PrivateRoute path="/ActivityForm" component={ActivityForm} />
        </Switch>
      </div>
    </Router>
*/


function App() {
  return (
    <Router>
      <div className="App">
        <Route exact path="/" component={SignIn} />
        <Route exact path="/register" component={SignUp} />
        <Switch>
          <PrivateRoute path="/ActivityForm" component={ActivityForm} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
