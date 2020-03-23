import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import BaseLayout from './views/BaseLayout';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { connect, useSelector } from "react-redux";
import MessageUI from './components/MessageUI';
import apiStore from './services/apiStore';
import MeetingView from './views/MeetingView';

const PrivateRoute = (props) => {
  let userReducer = useSelector(state => state.userReducer);
  let { user } = userReducer;
  if (!Object.keys(user).length) user = JSON.parse(localStorage.getItem('userInfo'));
  if (!user) {
    return <Redirect to="/login" />
  }
  return (
    <Route {...props} />
  )
}

const theme = createMuiTheme({
  palette: {
    primary: { main: "#38d39f" }
  },
});

function App(props) {
  let { user, open, message, code } = props;
  if (!Object.keys(user).length) user = JSON.parse(localStorage.getItem('userInfo'))

  const closeUI = () => {
    if (open) apiStore.hideUi()
  }
  return (
    <Router >
      <div onClick={closeUI} style={{ height: '100%' }}>
        <MessageUI open={open} message={message} code={code} />
        <ThemeProvider theme={theme}>
          <Switch >
            <Route path="/login" exact render={props => {
              return <LoginForm {...props} />
            }} />
            <PrivateRoute exact path="/meeting/:meetingId" render={props => {
              return <MeetingView {...props} user={user} />
            }} />
            <PrivateRoute path="/" render={props => {
              return <BaseLayout {...props} user={user} />
            }} />


          </Switch>
        </ThemeProvider>
      </div>
    </Router>
  );
}

const mapStateToProps = state => {
  return {
    user: state.userReducer.user,
    open: state.uiReducer.open,
    message: state.uiReducer.message,
    code: state.uiReducer.code
  }
}

export default connect(mapStateToProps)(App);
