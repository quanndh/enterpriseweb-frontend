import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import BaseLayout from './views/BaseLayout';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { connect } from "react-redux";

const theme = createMuiTheme({
  palette: {
    primary: { main: "#38d39f" }
  },
});

function App(props) {
  let { user } = props;
  if (!Object.keys(user).length) user = JSON.parse(localStorage.getItem('userInfo'))
  return (
    <Router >
      <ThemeProvider theme={theme}>
        <Switch >
          <Route path="/login" exact render={props => {
            return <LoginForm {...props} />
          }} />
          <Route path="/" exact render={props => {
            return <BaseLayout {...props} user={user} />
          }} />
        </Switch>
      </ThemeProvider>

    </Router>
  );
}

const mapStateToProps = state => {
  return {
    user: state.userReducer.user
  }
}

export default connect(mapStateToProps)(App);
