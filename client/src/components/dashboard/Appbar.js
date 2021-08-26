import React from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../redux/actions/authActions";
import { Link, withRouter } from "react-router-dom";
import IconButton from '@material-ui/core/IconButton';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import logo from './njoylogo2.png';
import Grid from '@material-ui/core/Grid';
import useMediaQuery from '@material-ui/core/useMediaQuery';

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
    width:"118.75px",
    height:"62.5px"
  },
  link: {
    color: '#3bb446',
    fontSize: '16px',
    fontFamily: 'Arial',
    fontWeight: 'bold',
    textDecoration: 'none !important',
  },
  info: {
    textAlign: 'right',
  },
  leftToolbar: {
    textAlign: 'left',
  },
}, {index: 1});

export function Appbar (props){
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const classes = useStyles();
  const theme = useTheme();

  const view = (useMediaQuery(theme.breakpoints.down('sm'))) ? "View" : "View Schedule";
  const generate = (useMediaQuery(theme.breakpoints.down('sm'))) ? "Generate" : "Generate Schedule";
  
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
      <Toolbar>
        <Grid item xs = {2} className={classes.leftToolbar}>
          <Link className={classes.link} to="/dashboard/schedule">{view}</Link>
        </Grid>
        <Grid item xs = {3} className={classes.leftToolbar}>
          <Link className={classes.link} to="/dashboard/activityform">{generate}</Link>
        </Grid>
        <Grid item xs = {6}>
          <img src={logo} alt="Logo" className={classes.title} />
        </Grid>
        <Grid item xs = {5} className={classes.info}>
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            className={classes.link}
          >
            <AccountCircle fontSize="large"/>
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
        </Grid>
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