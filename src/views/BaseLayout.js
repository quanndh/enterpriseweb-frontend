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

const useStyles = makeStyles(theme => ({
    root: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },
}));

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

    const [pathName, setPathname] = useState(location.pathname)
    const [bg, setBg] = useState(undefined);

    useEffect(() => {
        setPathname(location.pathname)
        if (6 <= moment().hour() && moment().hour() <= 12) {
            setBg(morning)
        }
        else if (12 < moment().hour() && moment().hour() < 19) {
            setBg(afternoon)
        } else setBg(evening)
    }, [location])

    return (
        <Container maxWidth="xl">
            <NavBar />
            <div
                className="app-body"
                style={{
                    backgroundImage: `url(${bg})`
                }}>
                {pathName === "/" && <Welcome user={user} {...props} />}
            </div>
            <ScrollTop {...props}>
                <Fab color="secondary" size="large" aria-label="scroll back to top">
                    <KeyboardArrowUpIcon />
                </Fab>
            </ScrollTop>
        </Container>
    )
}

export default BaseLayout;