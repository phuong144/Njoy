import React, { useEffect } from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../redux/actions/authActions";
import { Link, withRouter } from "react-router-dom";
import IconButton from '@material-ui/core/IconButton';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { makeStyles } from '@material-ui/core/styles';
import logo from './njoylogo2.png';
import Container from '@material-ui/core/Container';

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
    justifyContent: 'center',
    alignItems: 'center',
  },
  link: {
    margin: '15px',
    color: '#3bb446',
    fontSize: '20px',
    fontFamily: 'Open Sans',
    fontWeight: 'bold',
    textDecoration: 'none !important',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export function Appbar (props){
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const classes = useStyles();
  
  function onLogoutClick(e) {
    e.preventDefault();
    props.logoutUser();
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return(
    <AppBar position="static" style={{ background: '#c9f8f5' }} elevation={1}>
      <Container className={classes.container}>
        <img src={logo} alt="Logo" className={classes.title} width="118.75px" height="62.5px"/>
      </Container>
      <Toolbar>
        <div>
          <Link className={classes.link} to="/dashboard/schedule">View Schedule</Link>
          <Link className={classes.link} to="/dashboard/activityform">Generate Schedule</Link>
        </div>
        <div>
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            className={classes.link}
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={open}
            onClose={handleClose}
          >
            <MenuItem onClick={onLogoutClick}>Logout</MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
}
Appbar.propTypes = {
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
)(withRouter(Appbar));