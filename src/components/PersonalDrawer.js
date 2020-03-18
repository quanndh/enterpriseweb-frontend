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
const PersonalDrawer = props => {
    let { user } = props;

    const classes = useStyles();

    let { open, togglePersonal } = props;

    const [editing, setEditing] = useState(false)
    const [preview, setPreview] = useState(null)
    const [image, setImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false)

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
        const host = "http://localhost:1337/api/file/upload-image";
        const config = {
            headers: {
                Authorization: "Bearer " + token,
                'content-type': 'multipart/form-data',
            }
        }

        let rs = await post(host, finalData, config)

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

    return (
        <React.Fragment>
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
        </React.Fragment>
    )
}

export default PersonalDrawer;