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
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Tooltip from '@material-ui/core/Tooltip';
import NearMeIcon from '@material-ui/icons/NearMe';
import BlogDetail from './BlogDetail';

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
    const [uploadedFileName, setUploadedFileName] = useState([])

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
        let tempFileName = [...uploadedFileName]
        tempFileServerName.push(rs.data.data[0].serverFileName)
        tempFileName.push(rs.data.data[0].fileName)
        setUploadedFileServerName(tempFileServerName)
        setUploadedFileName(tempFileName)

        setLoading(false)
    }

    const handleRemoveFile = index => {
        let tempFileServerName = [...uploadedFileServerName];
        let tempFileName = [...uploadedFileName]
        tempFileServerName.splice(index, 1)
        tempFileName.splice(index, 1)
        setUploadedFileServerName(tempFileServerName)
        setUploadedFileName(tempFileName)
    }

    const handleCreatePost = async () => {
        setLoading(true)
        let rs = await dataService.createPost({ classId, content, file: uploadedFileServerName })
        setLoading(false)
        if (rs.code === 0) {
            apiStore.actAddNewPost(rs.data)
            setUploadedFileName([])
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
                    uploadedFileName.length ? uploadedFileName.map((file, index) => {
                        return (
                            <Paper className="file" elevation={3} key={`uploadFile-${index}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', borderRadius: 12, height: 50, padding: 14 }}>
                                <h3>{file}</h3>
                                <Tooltip title="Remove">
                                    <IconButton onClick={() => handleRemoveFile(index)}>
                                        <CloseIcon />
                                    </IconButton>
                                </Tooltip>
                            </Paper>
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
        </div>

    )
}

const UserClassDetail = props => {

    let { classId } = props.match.params;
    let { user, classInfo } = props;

    const [loading, setLoading] = useState(false);
    const [openShare, setOpenShare] = useState(false)

    const getClassDetail = async () => {
        setLoading(true)
        let rs = await dataService.getOneClassDetail({ classId });
        setLoading(false)
        if (rs.code === 0) apiStore.actSetClassDetail(rs.data)
        else apiStore.showUi(rs.message, rs.code)

    }
    useEffect(() => {
        getClassDetail()
    }, [classId]);

    const handleCloseForm = () => {
        setOpenShare(false)
    }

    let displayBlogs = Object.keys(classInfo).length && classInfo.blogs.length ? classInfo.blogs.map(blog => {
        return <BlogDetail user={user} key={`blog-${blog.id}`} detail={blog} />
    }) : null

    return (
        <div>
            {loading && <LinearProgress />}
            <div>
                <div className="class-detail-wrapper" key="class-wrapper">
                    <div className="class-detail-name">
                        <Typography variant={utils.isMobile() ? "h5" : "h2"} style={{ fontWeight: 540, color: "white", padding: 28 }} >
                            {classInfo.title}
                        </Typography>
                    </div>
                    <Grid container spacing={3} key="grid-container-1">
                        {
                            !utils.isMobile() && (
                                <Grid item md={4} key="grid-item-1">
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
        classInfo: state.classReducer.classInfo
    }
}

export default connect(mapStateToProps)(UserClassDetail);