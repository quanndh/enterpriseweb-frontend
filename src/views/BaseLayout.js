import React, { useState, useEffect } from 'react';
import Container from '@material-ui/core/Container';
import NavBar from '../components/NavBar';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Zoom from '@material-ui/core/Zoom';
import Fab from '@material-ui/core/Fab';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { makeStyles } from '@material-ui/core/styles';
import { useLocation } from 'react-router-dom';
import Welcome from '../components/Welcome';
import evening from '../assets/img/evening.jpg'
import afternoon from '../assets/img/afternoon.jpg';
import morning from '../assets/img/morning.jpg'
import moment from 'moment'
import UserView from './UserView';
import { Switch, Route, Redirect } from 'react-router-dom'
import ClassView from './ClassView';
import { useSelector } from 'react-redux';
import utils from '../services/utils';
import UserClass from './UserClass';
import UserClassDetail from './UserClassDetail';
import NotFound from './NotFound';
import Statistic from './Statistic';

const useStyles = makeStyles(theme => ({
    root: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },
}));

const PrivateRoute = (props) => {
    let userReducer = useSelector(state => state.userReducer);
    let { user } = userReducer;
    if (!Object.keys(user).length) user = JSON.parse(localStorage.getItem('userInfo'));
    if (!Object.keys(user).length) {
        return <Redirect to="/login" />
    }
    return (
        <Route {...props} />
    )
}

function ScrollTop(props) {
    const { children, window } = props;
    const classes = useStyles();

    const trigger = useScrollTrigger({
        target: window ? window() : undefined,
        disableHysteresis: true,
        threshold: 100,
    });

    const handleClick = event => {
        const anchor = (event.target.ownerDocument || document).querySelector('#back-to-top-anchor');

        if (anchor) {
            anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };
    return (
        <Zoom in={trigger}>
            <div onClick={handleClick} role="presentation" className={classes.root}>
                {children}
            </div>
        </Zoom>
    );
}

const BaseLayout = props => {
    let { user } = props;
    let location = useLocation();

    const [bg, setBg] = useState(undefined);

    useEffect(() => {
        if (6 <= moment().hour() && moment().hour() <= 12) {
            setBg(morning)
        }
        else if (12 < moment().hour() && moment().hour() < 19) {
            setBg(afternoon)
        } else setBg(evening)
    }, [])
    return (
        <Container maxWidth="xl" style={{ height: "100%" }}>
            <NavBar user={user} />
            <div
                className="app-body"
                style={{
                    backgroundImage: `${location.pathname === "/" ? `url(${bg})` : "none"}`
                }}>
                <Switch>
                    <PrivateRoute exact path="/" render={props => {
                        return <Welcome {...props} user={user} />;
                    }} />

                    <PrivateRoute exact path="/users" render={props => {
                        return <UserView {...props} user={user} />;
                    }} />
                    <PrivateRoute exact path="/classes" render={props => {
                        return <ClassView {...props} user={user} />
                    }} />
                    <PrivateRoute exact path="/users/classes" render={props => {
                        return <UserClass {...props} user={user} />
                    }} />
                    <PrivateRoute exact path="/users/classes/:classId" render={props => {
                        return <UserClassDetail {...props} user={user} />
                    }} />
                    <PrivateRoute exact path="/statistic" render={props => {
                        return <Statistic {...props} user={user} />
                    }} />
                    <Route render={props => {
                        return <NotFound user={user} {...props} />
                    }} />
                </Switch>

            </div>
            <ScrollTop {...props} >
                <Fab style={utils.isMobile() ? { bottom: -5, right: -1 } : { bottom: 40, right: 10 }} color="primary" size="large" aria-label="scroll back to top">
                    <KeyboardArrowUpIcon style={{ color: "white" }} />
                </Fab>
            </ScrollTop>
        </Container>
    )
}

export default BaseLayout;