import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import GroupIcon from '@material-ui/icons/Group';
import ClassIcon from '@material-ui/icons/Class';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import { Link } from 'react-router-dom'
import AccountCircle from '@material-ui/icons/AccountCircle';
import logo from '../assets/img/logo.png'
import utils from '../services/utils/index.js'
import HomeIcon from '@material-ui/icons/Home';
import PersonalDrawer from './PersonalDrawer';

const drawerWidth = 250;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        backgroundColor: "#38d39f",
        marginBottom: utils.isMobile() ? 90 : 150

    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        color: "white",
        maxHeight: utils.isMobile() ? 80 : 110,
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
    link: {
        display: 'flex',
    }
}));

const NavBar = props => {
    let { user } = props;
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [openPersonal, setOpenPersonal] = React.useState(false)

    const handleDrawerOpen = () => {
        setOpen(true);
        // toggleDrawer(true)
    };

    const handleDrawerClose = () => {
        setOpen(false);
        // toggleDrawer(false)
    };

    const handleTogglePersonal = () => {
        setOpenPersonal(!openPersonal)
    }

    return (
        <div className={classes.root} id="back-to-top-anchor">
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar style={{ justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            className={clsx(classes.menuButton, open && classes.hide)}
                        >
                            <MenuIcon style={{ fontSize: 36 }} />
                        </IconButton>

                        <img src={logo} alt="" style={{ height: utils.isMobile() ? 80 : 110, width: 110 }} />

                    </div>

                    <div>
                        <IconButton
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleTogglePersonal}
                            color="inherit"
                        >
                            <AccountCircle style={{ fontSize: 36 }} />
                        </IconButton>
                    </div>
                </Toolbar>
            </AppBar>
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={open}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.drawerHeader}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </div>
                <Divider />
                <List>
                    {
                        user.role <= 2 ? (
                            <React.Fragment>
                                <ListItem button key={'Homepage'} onClick={handleDrawerClose}>
                                    <Link to="/" className={classes.link}>
                                        <ListItemIcon>
                                            <HomeIcon />
                                        </ListItemIcon>
                                        <ListItemText primary={`Homepage`} />
                                    </Link>

                                </ListItem>
                                <ListItem button key={'User Management'} onClick={handleDrawerClose}>
                                    <Link to="/users" className={classes.link}>
                                        <ListItemIcon><GroupIcon /></ListItemIcon>
                                        <ListItemText primary={`User Management`} />
                                    </Link>
                                </ListItem>
                                <ListItem button key={'Class Management'} onClick={handleDrawerClose}>
                                    <Link to="/classes" className={classes.link}>
                                        <ListItemIcon><ClassIcon /></ListItemIcon>
                                        <ListItemText primary={`Class Management`} />
                                    </Link>
                                </ListItem>
                                {
                                    user.role === 1 ? (<ListItem button key={'Statistic'} onClick={handleDrawerClose}>
                                        <Link to="/statistic" className={classes.link}>
                                            <ListItemIcon><EqualizerIcon /></ListItemIcon>
                                            <ListItemText primary={`Statistic`} />
                                        </Link>
                                    </ListItem>) : null
                                }

                            </React.Fragment>
                        ) : (
                                <React.Fragment>
                                    <ListItem button key={'User Management'} onClick={handleDrawerClose}>
                                        <Link to="/users/classes" className={classes.link}>
                                            <ListItemIcon><ClassIcon /></ListItemIcon>
                                            <ListItemText primary={`My classes`} />
                                        </Link>
                                    </ListItem>
                                    {/* <ListItem button key={'Messenger'} onClick={handleDrawerClose}>
                                        <Link to="/classes" className={classes.link}>
                                            <ListItemIcon><ClassIcon /></ListItemIcon>
                                            <ListItemText primary={`Class Management`} />
                                        </Link>
                                    </ListItem> */}
                                </React.Fragment>
                            )
                    }

                </List>
            </Drawer>
            <PersonalDrawer user={user} open={openPersonal} togglePersonal={handleTogglePersonal} />
        </div>
    )
}

export default NavBar;