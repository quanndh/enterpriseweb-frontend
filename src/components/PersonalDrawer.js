import React, { useState } from 'react';
import Drawer from '@material-ui/core/Drawer';
import { makeStyles } from '@material-ui/core/styles';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import utils from '../services/utils/index';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import AvatarEdit from 'react-avatar-edit'
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';
import apiStore from '../services/apiStore';
import { post } from 'axios'
import dataService from '../network/dataService';
import { LinearProgress } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import config from '../config'

const getShortName = name => {
    let words = name.split(" ")
    let shortName = words.map(w => {
        return w[0].toUpperCase()
    })
    return shortName.join('')
}
const drawerWidth = utils.isMobile() ? 300 : 350;

const useStyles = makeStyles(theme => ({
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
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
        justifyContent: 'flex-start',
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
}))

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

const PersonalDrawer = props => {
    let { user } = props;

    const classes = useStyles();

    let { open, togglePersonal } = props;

    const [editing, setEditing] = useState(false)
    const [preview, setPreview] = useState(null)
    const [image, setImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false)
    const [openChangePassword, setOpenChangePassword] = useState(false)
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("")

    const handleClose = () => {
        togglePersonal()
    }

    const toggleEditing = () => {
        setEditing(!editing)
    }

    const handleCloseImage = () => {
        setPreview(null)
    }

    const handleCrop = preview => {
        setPreview(preview)
    }

    const handleLoadFile = el => {
        setImage(el)
    }


    const handleUpdateImage = async () => {
        setIsLoading(true)

        const finalData = new FormData();
        finalData.append("images", image);

        let token = apiStore.getToken()
        const host = config.HOST + "/api/file/upload-image";
        const options = {
            headers: {
                Authorization: "Bearer " + token,
                'content-type': 'multipart/form-data',
            }
        }

        let rs = await post(host, finalData, options)

        console.log(rs.data)

        if (rs.data.code !== 0) {
            apiStore.showUi(rs.data.message, rs.data.code)
            setIsLoading(false)
            return
        }

        let avatar = rs.data.data.url;
        rs = await dataService.updateUser({ id: user.id, avatar })
        if (rs.code === 0) {
            apiStore.actUpdateUser(rs.data)
            localStorage.setItem('userInfo', JSON.stringify(rs.data))
        }
        apiStore.showUi(rs.message, rs.code);
        setIsLoading(false)
        setPreview(null)
        toggleEditing()
    }

    const handleClickOpen = () => {
        setOpenChangePassword(true);
    };

    const handleClosePassword = () => {
        setNewPassword("")
        setConfirmPassword("")
        setOpenChangePassword(false);
    };

    const handleChangePassword = async () => {
        setIsLoading(true)
        let rs = await dataService.userChangePassword({ newPassword, confirmPassword })
        setIsLoading(false)
        apiStore.showUi(rs.message, rs.code)
        handleClosePassword()
    }

    return (
        <React.Fragment>
            <Dialog
                open={openChangePassword}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClosePassword}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">{"Fill in to change your password"}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus={true}
                        margin="dense"
                        label="New Password"
                        type="password"
                        fullWidth
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <TextField
                        autoFocus={true}
                        margin="dense"
                        label="Confirm your Password"
                        type="password"
                        fullWidth
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClosePassword} color="secondary">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleChangePassword}
                        color="primary"
                        disabled={newPassword === "" || confirmPassword === "" ? true : false}
                    >
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
            <Drawer className={classes.drawer}
                variant="persistent"
                classes={{
                    paper: classes.drawerPaper,
                }}
                anchor="right"
                open={open}
            >
                <div className={classes.drawerHeader}>
                    <IconButton onClick={handleClose}>
                        <ChevronRightIcon />
                    </IconButton>
                </div>
                <Divider />
                {isLoading && <LinearProgress color="primary" />}
                <div className="personalWrapper">
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-evenly' }}>
                        <div style={{ position: 'relative', marginBottom: 40 }}>
                            {
                                editing && (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <AvatarEdit
                                            width={drawerWidth - 150}
                                            height={drawerWidth - 150}
                                            onCrop={handleCrop}
                                            onClose={handleCloseImage}
                                            src={preview}
                                            onFileLoad={handleLoadFile}
                                        />
                                        <img src={preview} alt="Preview" />
                                        <div>
                                            <Tooltip title="Save">
                                                <IconButton onClick={handleUpdateImage}>
                                                    <DoneIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Cancel">
                                                <IconButton onClick={() => {
                                                    toggleEditing()
                                                    setPreview(null)
                                                }}>
                                                    <CloseIcon />
                                                </IconButton>
                                            </Tooltip>

                                        </div>

                                    </div>
                                )
                            }

                            {
                                !editing ? user.avatar ? <Avatar alt="avatar" src={user.avatar} style={{ width: utils.isMobile() ? 110 : 140, height: utils.isMobile() ? 110 : 140 }} /> : <Avatar size="large" style={{ width: utils.isMobile() ? 110 : 140, height: utils.isMobile() ? 110 : 140 }} >{getShortName(user.fullName)}</Avatar> : null
                            }

                            {
                                !editing && (
                                    <Tooltip title="Change avatar" className="change-avatar-btn" style={{ position: 'absolute', bottom: utils.isMobile() ? '-22px' : '-24px', left: utils.isMobile() ? "56px" : "76px" }}>
                                        <IconButton onClick={toggleEditing}>
                                            <PhotoCameraIcon style={{ fontSize: 36 }} />
                                        </IconButton>
                                    </Tooltip>
                                )
                            }
                        </div>
                        <div style={{ margin: "0 auto" }}>
                            <Typography variant="h5" style={{ color: "grey", fontWeight: 540, marginBottom: 20 }} >
                                {user.fullName}
                            </Typography>
                            <Typography variant="h5" style={{ color: "grey", fontWeight: 540, marginBottom: 20 }} >
                                Birth year: {user.birthYear}
                            </Typography>
                            <Typography variant="h5" style={{ color: "grey", fontWeight: 540, marginBottom: 20 }} >
                                Email: {user.email}
                            </Typography>
                            <Typography variant="h5" style={{ color: "grey", fontWeight: 540, marginBottom: 20 }} >
                                Contact: {user.phone}
                            </Typography>
                            <Button color="primary" variant="contained" onClick={handleClickOpen}>
                                <Typography variant="h6" style={{ color: "white", fontWeight: 540 }} >
                                    Change your password
                                </Typography>
                            </Button>
                        </div>

                    </div>
                </div>
                <Divider />
                <div className={classes.drawerHeader + " logout"}>
                    <Tooltip title="Log out">
                        <IconButton onClick={() => apiStore.logout()}>
                            <ExitToAppIcon />
                        </IconButton>
                    </Tooltip>

                </div>
            </Drawer >
        </React.Fragment >
    )
}

export default PersonalDrawer;