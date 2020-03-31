import React, { useEffect, useState } from 'react';
import dataService from '../network/dataService';
import { LinearProgress } from '@material-ui/core';
import apiStore from '../services/apiStore';
import Typography from '@material-ui/core/Typography';
import utils from "../services/utils/index";
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ClassMemberList from '../components/ClassMemberList';
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import InsertLinkIcon from '@material-ui/icons/InsertLink';
import { post } from 'axios'
import CloseIcon from '@material-ui/icons/Close';
import Tooltip from '@material-ui/core/Tooltip';
import NearMeIcon from '@material-ui/icons/NearMe';
import BlogDetail from '../components/BlogDetail';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import moment from 'moment';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import io from '../services/socket/index'
import excelLogo from '../assets/img/excel.png'
import wordLogo from '../assets/img/word.png';
import ppLogo from '../assets/img/ppt.png'
import fileLogo from '../assets/img/file.png'

const getFileLogo = (fileName) => {
    if (fileName.includes('docx') || fileName.includes('doc')) {
        return wordLogo;
    } else if (fileName.includes('xlsx')) {
        return excelLogo;
    } else if (fileName.includes('pptx') || fileName.includes('ppt')) {
        return ppLogo;
    } else return fileLogo
}

const handleFileName = (fileName) => {
    if (fileName.length > 18) {
        fileName = fileName.slice(0, 18) + '...'
    }
    return fileName;
}

const getShortName = name => {
    let words = name.split(" ")
    let shortName = words.map(w => {
        return w[0].toUpperCase()
    })
    return shortName.join('')
}

const BlogForm = props => {
    let { handleCloseForm, classId } = props;

    const [loading, setLoading] = useState(false)
    const [content, setContent] = useState("");

    const [uploadedFileServerName, setUploadedFileServerName] = useState([])
    const [uploadedFile, setUploadedFile] = useState([])

    const handleUpFile = async e => {
        setLoading(true)

        const finalData = new FormData();
        finalData.append("files", e.target.files[0]);

        let token = apiStore.getToken()
        const host = "http://localhost:1337/api/file/upload-file";
        const config = {
            headers: {
                Authorization: "Bearer " + token,
                'content-type': 'multipart/form-data',
            }
        }

        let rs = await post(host, finalData, config)

        if (rs.data.code !== 0) {
            apiStore.showUi(rs.data.message, rs.data.code)
            setLoading(false)
            return
        }

        let tempFileServerName = [...uploadedFileServerName];
        let tempFile = [...uploadedFile]
        tempFileServerName.push(rs.data.data[0].serverFileName)
        tempFile.push(rs.data.data[0])
        console.log(rs.data.data, 1111)
        setUploadedFileServerName(tempFileServerName)
        setUploadedFile(tempFile)

        setLoading(false)
    }

    const handleDownloadFile = async (fullPath, fileName) => {
        setLoading(true)
        setTimeout(() => {
            window.open(fullPath)
            setLoading(false)
        }, 300)
    }

    const handleRemoveFile = index => {
        let tempFileServerName = [...uploadedFileServerName];
        let tempFile = [...uploadedFile]
        tempFileServerName.splice(index, 1)
        tempFile.splice(index, 1)
        setUploadedFileServerName(tempFileServerName)
        setUploadedFile(tempFile)
    }

    const handleCreatePost = async () => {
        setLoading(true)
        let rs = await dataService.createPost({ classId, content, file: uploadedFileServerName })
        setLoading(false)
        if (rs.code === 0) {
            apiStore.actAddNewPost(rs.data)
            setUploadedFile([])
            setUploadedFileServerName([])
            setContent("")
            handleCloseForm()
        }
        else apiStore.showUi(rs.message, rs.code)
    }

    return (
        <div style={{ width: '100%' }}>
            {loading && <LinearProgress />}
            <TextField
                onChange={e => setContent(e.target.value)}
                autoFocus={true}
                multiline={true}
                rows="5"
                value={content}
                id="standard-basic"
                label="Share something"
                style={{ width: '100%', marginBottom: 20 }}
                name="content"
            />

            <div style={{ height: '100%', display: 'flex', flexWrap: 'wrap' }}>
                {
                    uploadedFile.length ? uploadedFile.map((file, index) => {
                        return (
                            !file.fileType.includes('image') ? (
                                <div
                                    key={`file-${file.id}`}
                                    className="file shadow"
                                    style={{ width: !utils.isMobile() ? '49%' : '100%', borderRadius: 6, height: 100, position: 'relative' }}
                                >
                                    <div style={{ display: 'flex', height: '100%' }} onClick={() => handleDownloadFile(file.fullPath, file.fileName)}>
                                        <div style={{ height: '100%', width: '25%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <img style={{ height: 50, width: 50 }} src={getFileLogo(file.fileName)} alt="" />
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', width: '75%' }}>
                                            <h3>{handleFileName(file.fileName)}</h3>
                                        </div>
                                    </div>
                                    <Tooltip title="Remove" style={{ position: 'absolute', top: 8, right: 8 }}>
                                        <CloseIcon onClick={() => handleRemoveFile(index)} />
                                    </Tooltip>
                                </div>

                            ) : null
                        )
                    }) : null
                }
            </div>

            <div style={{ height: '100%', display: 'flex', flexWrap: 'wrap' }}>
                {
                    uploadedFile.length ? uploadedFile.map((file, index) => {
                        return (
                            file.fileType.includes('image') ? (
                                <div key={file.id} style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', position: 'relative' }}>
                                    <img onClick={() => { handleDownloadFile(file.fullPath, file.fileName) }} src={file.fullPath} alt="" style={{ width: 100, height: 100, margin: 10 }} />
                                    <Tooltip title="Remove" style={{ position: 'absolute', right: 10, top: 10 }}>
                                        <CloseIcon onClick={() => handleRemoveFile(index)} color="secondary" />
                                    </Tooltip>
                                </div>
                            ) : null
                        )
                    }) : null
                }
            </div>

            <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between' }}>
                <Button
                    style={{ fontWeight: 600 }}
                    variant="outlined"
                    color="primary"
                    startIcon={<InsertLinkIcon />}
                    component="label"
                >
                    Add
                    <input
                        onChange={handleUpFile}
                        type="file"
                        style={{ display: "none" }}
                    />
                </Button>
                <div>
                    <Button onClick={() => handleCloseForm()} style={{ fontWeight: 600 }}>Cancel</Button>
                    <Button
                        style={{ fontWeight: 600, color: "white", marginLeft: 32 }}
                        variant="contained"
                        color="primary"
                        disabled={content === ""}
                        endIcon={<NearMeIcon />}
                        onClick={handleCreatePost}
                    >
                        Post
                </Button>
                </div>
            </div>
        </div >

    )
}

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

const UserClassDetail = props => {

    let { classId } = props.match.params;
    let { user, classInfo, meeting } = props;

    const [loading, setLoading] = useState(false);
    const [openShare, setOpenShare] = useState(false)
    const [openMeetingModal, setOpenMeetingModal] = useState(false);
    const [meetingTitle, setMeetingTitle] = useState("");

    const handleClickOpen = () => {
        setOpenMeetingModal(true);
    };

    const handleClose = () => {
        setMeetingTitle("")
        setOpenMeetingModal(false);
    };

    const getClassDetail = async () => {
        setLoading(true)
        let rs = await dataService.getOneClassDetail({ classId });
        setLoading(false)
        if (rs.code === 0) {
            apiStore.actSetClassDetail(rs.data)
            apiStore.actSetMeeting(rs.data.meeting)
        } else apiStore.showUi(rs.message, rs.code)
    }

    useEffect(() => {
        getClassDetail()
    }, [classId]);

    const handleCloseForm = () => {
        setOpenShare(false)
    }

    const createMeeting = async () => {
        setLoading(true)
        let rs = await dataService.createMeeting({ classId, title: meetingTitle })
        apiStore.actSetMeeting(rs.data)
        handleClose()
        setLoading(false)
    }

    const handleCloseMeeting = async (meetingId) => {
        setLoading(true)
        let rs = await dataService.closeMeeting({ meetingId })
        setLoading(false)
        if (rs.code === 0) apiStore.actCloseMeeting();
        else apiStore.showUi(rs.message, rs.code)
    }

    const handleJoinMeeting = async (meetingId) => {
        setLoading(true);
        io.socket.request({
            method: 'post',
            data: { meetingId },
            url: "/api/user/join-meeting",
            headers: {
                Authorization: `Bearer ${apiStore.getToken()}`
            }
        }, (resData, jwres) => {
            let rs = resData;
            setLoading(false);
            if (rs.code === 0) {
                apiStore.actUpdateMeeting(rs.data)
                window.open(`/meeting/${meetingId}`)
            }
            else apiStore.showUi(rs.message, rs.code)
        })
        // let rs = await dataService.joinMeeting({ meetingId })
        // setLoading(false);
        // if (rs.code === 0) {
        //     apiStore.actUpdateMeeting(rs.data)
        //     window.open(`/meeting/${meetingId}`)
        // }
        // else apiStore.showUi(rs.message, rs.code)
    }

    let inChatAvatar = Object.keys(meeting).length ? meeting.participants.map((user, index) => {
        if (index >= 3) {
            return null;
        } else {
            return (
                <Tooltip key={'ava-' + user.id} title={user.fullName}>
                    {user.avatar ? <Avatar alt="avatar" src={user.avatar} style={{ width: utils.isMobile() ? 40 : 45, height: utils.isMobile() ? 40 : 45 }} /> : <Avatar size="large" style={{ width: utils.isMobile() ? 40 : 45, height: utils.isMobile() ? 40 : 45 }} >{getShortName(user.fullName)}</Avatar>}
                </Tooltip>
            )
        }

    }) : null

    let displayBlogs = Object.keys(classInfo).length && classInfo.blogs.length ? classInfo.blogs.map(blog => {
        return <BlogDetail user={user} key={`blog-${blog.id}`} detail={blog} />
    }) : null

    return (
        <div>
            {loading && <LinearProgress />}
            <Dialog
                open={openMeetingModal}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">{"Open a new meeting for this class"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        In order to make this meeting more detail please enter the Titile or Purpose of this meeting
                    </DialogContentText>
                    <TextField
                        autoFocus={true}
                        margin="dense"
                        label="Meeting titile or purpose"
                        type="text"
                        fullWidth
                        value={meetingTitle}
                        onChange={(e) => setMeetingTitle(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={createMeeting} color="primary">
                        Open
                    </Button>
                </DialogActions>
            </Dialog>
            <div>
                <div className="class-detail-wrapper" key="class-wrapper">
                    <div className="class-detail-name">
                        <Typography variant={utils.isMobile() ? "h5" : "h2"} style={{ fontWeight: 540, color: "white", padding: 28 }} >
                            {classInfo.title}
                        </Typography>
                    </div>
                    <Grid container spacing={3} style={{ marginBottom: 16 }}>
                        <Grid item xs={12}>
                            {
                                Object.keys(meeting).length ? (
                                    <Paper elevation={3} style={{ padding: utils.isMobile() ? 16 : "20px 40px", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ maxWidth: "60%", height: "auto" }}>
                                            <Typography variant={utils.isMobile() ? "h5" : "h4"} style={{ fontWeight: 540, marginBottom: 8 }} >
                                                {meeting.title}
                                            </Typography>
                                            <AvatarGroup>
                                                {inChatAvatar}
                                                {
                                                    meeting.participants && meeting.participants.length > 4 && (
                                                        <Avatar style={{ width: utils.isMobile() ? 40 : 45, height: utils.isMobile() ? 40 : 45 }}>
                                                            +{Number(meeting.participants.length) - 4}
                                                        </Avatar>
                                                    )
                                                }
                                            </AvatarGroup>
                                            <Typography variant={utils.isMobile() ? "subtitle2" : "subtitle1"} style={{ fontWeight: 540, color: 'grey' }} >
                                                {moment(meeting.createdAt).format('hh:mm A DD-MM-YYYY')}
                                            </Typography>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <Button onClick={() => handleJoinMeeting(meeting.id)} style={{ height: 40, color: "white", marginBottom: 12 }} variant="contained" color="primary">
                                                Join
                                            </Button>
                                            {
                                                user.id === meeting.creater ? (
                                                    <Button onClick={() => handleCloseMeeting(meeting.id)} style={{ height: 40, color: "white" }} variant="contained" color="secondary">
                                                        Close
                                                    </Button>
                                                ) : null
                                            }

                                        </div>

                                    </Paper>
                                ) : (
                                        <React.Fragment>

                                            {
                                                utils.isMobile() ? (
                                                    <Button onClick={handleClickOpen} style={{ width: '100%', height: 40, color: "white" }} variant="contained" color="primary">
                                                        Open a meeting
                                                    </Button>
                                                ) : null
                                            }

                                        </React.Fragment>

                                    )
                            }
                        </Grid>
                    </Grid>
                    <Grid container spacing={3} key="grid-container-1">
                        {
                            !utils.isMobile() && (
                                <Grid item md={4} key="grid-item-1">
                                    {
                                        !Object.keys(meeting).length ? (
                                            <Button onClick={handleClickOpen} style={{ width: '100%', height: 40, color: "white", marginBottom: 16 }} variant="contained" color="primary">
                                                Open a meeting
                                            </Button>
                                        ) : null
                                    }

                                    <ClassMemberList tutor={Object.keys(classInfo).length ? classInfo.tutor : {}} students={Object.keys(classInfo).length ? classInfo.students : []} />
                                </Grid>
                            )
                        }

                        <Grid item xs={12} md={8} key="grid-item-2">
                            <Paper elevation={3} style={{ padding: utils.isMobile() ? 16 : "20px 40px", display: 'flex', alignItems: 'center', height: openShare ? "auto" : 85, borderRadius: 12, marginBottom: 40 }}>
                                {
                                    openShare ? (
                                        <BlogForm classId={classId} user={user} handleCloseForm={handleCloseForm} />
                                    ) : (
                                            <div onClick={() => setOpenShare(true)} className="share-text" style={{ display: 'flex', alignItems: 'center' }}>
                                                {user.avatar ? <Avatar alt="avatar" src={user.avatar} style={{ width: utils.isMobile() ? 50 : 60, marginRight: 28, height: utils.isMobile() ? 50 : 60 }} /> : <Avatar size="large" style={{ width: utils.isMobile() ? 50 : 60, height: utils.isMobile() ? 50 : 60, marginRight: 28 }} >{getShortName(user.fullName)}</Avatar>}
                                                <p >Share something with your class...</p>
                                            </div>
                                        )
                                }
                            </Paper>
                            {displayBlogs}
                        </Grid>
                        {
                            utils.isMobile() && (
                                <Grid item xs={12} key="grid-item-4">
                                    <ClassMemberList tutor={Object.keys(classInfo).length ? classInfo.tutor : {}} students={Object.keys(classInfo).length ? classInfo.students : []} />
                                </Grid>
                            )
                        }
                    </Grid>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        classInfo: state.classReducer.classInfo,
        meeting: state.classReducer.meeting
    }
}

export default connect(mapStateToProps)(UserClassDetail);