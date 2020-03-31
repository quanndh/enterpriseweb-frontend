import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import utils from '../services/utils/index';
import Avatar from '@material-ui/core/Avatar';
import moment from 'moment';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';
import { LinearProgress } from '@material-ui/core';
import dataService from '../network/dataService';
import Button from '@material-ui/core/Button';
import apiStore from '../services/apiStore';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import CloseIcon from '@material-ui/icons/Close';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import excelLogo from '../assets/img/excel.png'
import wordLogo from '../assets/img/word.png';
import ppLogo from '../assets/img/ppt.png'
import fileLogo from '../assets/img/file.png'

// const wordLogo = 'https://banner2.cleanpng.com/20180425/zye/kisspng-microsoft-word-microsoft-excel-microsoft-office-20-5ae0816fc0bb38.1165225915246626397894.jpg';
// const excelLogo = 'https://banner2.cleanpng.com/20180418/jde/kisspng-microsoft-excel-training-computer-software-microso-excel-5ad7d9f121bed2.0123007315240954731382.jpg';
// const ppLogo = 'https://mpng.pngfly.com/20180401/aiw/kisspng-microsoft-powerpoint-presentation-slide-slide-show-ppt-5ac0913364f1f5.4931388215225695234135.jpg';
// const fileLogo = "https://cdn3.iconfinder.com/data/icons/files-folders-line/100/copy-512.png";

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

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const BlogDetail = props => {
    let { detail, user } = props;

    const [focus, setFocus] = useState(false)
    const [loading, setLoading] = useState(false)
    const [content, setContent] = useState("")
    const [allComment, setAllComment] = useState(false);
    const [open, setOpen] = useState(false);
    const [deleteType, setDeleteType] = useState("")
    const [deleteId, setDeleteId] = useState(undefined)

    const handleChangeComment = (e) => {
        setContent(e.target.value)
    }

    const handleOpenModal = (type, id) => {
        setDeleteType(type)
        setDeleteId(id)
        setOpen(true);
    };

    const handleCloseModal = () => {
        setOpen(false);
    };

    const handleAddComment = async () => {
        setLoading(true)
        let rs = await dataService.addCommentToPost({ content, blogId: detail.id })
        setLoading(false)
        if (rs.code === 0) {
            rs.data.owner = user;
            apiStore.actAddNewComment(rs.data)
        } else {
            apiStore.showUi(rs.message, rs.code)
        }
        setContent("")
    }

    const toggleShowComment = () => {
        setLoading(true)
        setTimeout(() => {
            setAllComment(!allComment)
            setLoading(false)
        }, 350)
    }

    const handleKeyPress = e => {
        if (e.key === 'Enter') {
            if (content === "" || content.trim() === "") return
            else handleAddComment()
        }
    }

    const handleDeletePost = async (blogId) => {
        setLoading(true)
        await dataService.deletePost({ blogId })
        setLoading(false)
        apiStore.actDeletePost(blogId)
    }

    const handleDeleteComment = async (commentId) => {
        setLoading(true)
        await dataService.deleteComment({ commentId })
        setLoading(false)
        apiStore.actDeleteComment({ blogId: detail.id, commentId })
    }

    const handleDelete = () => {
        if (deleteType === "post") {
            handleDeletePost(deleteId)
        } else {
            handleDeleteComment(deleteId)
        }
        handleCloseModal()
    }

    const handleDownloadFile = async (fullPath, fileName) => {
        setLoading(true)
        setTimeout(() => {
            window.open(fullPath)
            setLoading(false)
        }, 300)
    }

    const image = detail && detail.file && detail.file.length ? detail.file.filter(file => file.fileType.includes('image')) : []
    const displayImage = image.length ? (
        <Carousel swipeable={true} dynamicHeight={true} showThumbs={false}>
            {image.map(img => {
                return (
                    <div key={img.id}>
                        <img style={utils.isMobile() ? {} : { width: 500, height: 500 }} src={img.fullPath} alt="" />
                    </div>
                )
            })}
        </Carousel>
    ) : null
    return (
        <React.Fragment>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleCloseModal}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">{"Confirm your action?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Do you really want to delete this item?
                        </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="secondary">
                        Disagree
                    </Button>
                    <Button onClick={handleDelete} color="primary">
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>
            <Paper
                elevation={3}
                style={{ borderRadius: 12, marginBottom: 40 }}
            >
                <div style={{ padding: utils.isMobile() ? 16 : "16px 40px" }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20, justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            {detail.owner.avatar ? <Avatar alt="avatar" src={detail.owner.avatar} style={{ width: utils.isMobile() ? 50 : 60, marginRight: 20, height: utils.isMobile() ? 50 : 60 }} /> : <Avatar size="large" style={{ width: utils.isMobile() ? 50 : 60, height: utils.isMobile() ? 50 : 60, marginRight: 20 }} >{getShortName(detail.owner.fullName)}</Avatar>}
                            <div>
                                <h4 style={{ marginBottom: 8 }}>{detail.owner.fullName}</h4>
                                <h5 style={{ color: 'grey' }}>{moment(detail.createdAt).format('hh:mm A DD-MM-YYYY')}</h5>
                            </div>
                        </div>
                        {
                            user.id === detail.owner.id && (
                                <React.Fragment>
                                    <IconButton onClick={() => handleOpenModal('post', detail.id)} >
                                        <CloseIcon />
                                    </IconButton>
                                </React.Fragment>

                            )
                        }

                    </div>
                    <div style={{ marginBottom: 20 }}>
                        <p>{detail.content}</p>
                    </div>
                    <div>
                        {
                            detail.file.length ? detail.file.map(file => {
                                return (
                                    !file.fileType.includes('image') ? (
                                        <div
                                            key={`file-${file.id}`}
                                            onClick={() => handleDownloadFile(file.fullPath, file.fileName)}
                                            className="file shadow"
                                            style={{ width: !utils.isMobile() ? '49%' : '100%', borderRadius: 6, height: 100 }}
                                        >
                                            <div style={{ display: 'flex', height: '100%' }}>
                                                <div style={{ height: '100%', width: '25%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                    <img style={{ height: 50, width: 50, background: 'transparent' }} src={getFileLogo(file.fileName)} alt="" />
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', width: '75%' }}>
                                                    <h3>{handleFileName(file.fileName)}</h3>
                                                </div>
                                            </div>
                                        </div>
                                    ) : null
                                )
                            }) : null
                        }
                    </div>
                    {
                        displayImage
                    }
                </div>
                <Divider />
                <div style={{}}>
                    {
                        detail.comments.length ? (
                            <Button onClick={toggleShowComment} style={{ fontWeight: 600, margin: utils.isMobile() ? 16 : "8px 40px" }}>
                                {detail.comments.length} class comments
                            </Button>
                        ) : null
                    }

                    {
                        detail.comments.length && allComment ? detail.comments.map((cmt, index) => {
                            return (
                                <div key={`cmt-${cmt.id}`} style={{ display: 'flex', padding: utils.isMobile() ? 16 : "8px 40px", marginBottom: 8 }}>
                                    {cmt.owner.avatar ? <Avatar alt="avatar" src={cmt.owner.avatar} style={{ width: utils.isMobile() ? 40 : 45, marginRight: utils.isMobile() ? 14 : 28, height: utils.isMobile() ? 40 : 45 }} /> : <Avatar size="large" style={{ width: utils.isMobile() ? 40 : 45, height: utils.isMobile() ? 40 : 45, marginRight: 28 }} >{getShortName(cmt.owner.fullName)}</Avatar>}
                                    <div style={{ display: 'flex', flexDirection: 'column', width: "100%" }}>
                                        <div style={{ display: 'flex', marginBottom: 8, justifyContent: 'space-between', width: "100%" }}>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <div style={{ display: ' flex', alignItems: 'center', flexDirection: 'column', marginBottom: 8 }}>
                                                    <h4 style={{ marginBottom: 4 }}>{cmt.owner.fullName}</h4>
                                                    <h5 style={{ color: 'grey' }}>{moment(cmt.createdAt).format('hh:mm A DD-MM-YYYY')}</h5>
                                                </div>
                                            </div>
                                            {
                                                user.id === cmt.owner.id && (
                                                    <React.Fragment>
                                                        <IconButton onClick={() => handleOpenModal('comment', cmt.id)}>
                                                            <CloseIcon />
                                                        </IconButton>
                                                    </React.Fragment>

                                                )
                                            }
                                        </div>
                                        <p>{cmt.content}</p>
                                    </div>
                                </div>
                            )
                        }) : null
                    }
                    {
                        detail.comments.length && !allComment ? (
                            <div key={`cmt-${detail.comments[detail.comments.length - 1].id}`} style={{ display: 'flex', padding: utils.isMobile() ? 16 : "8px 40px", marginBottom: 8 }}>
                                {detail.comments[detail.comments.length - 1].owner.avatar ? <Avatar alt="avatar" src={detail.comments[detail.comments.length - 1].owner.avatar} style={{ width: utils.isMobile() ? 40 : 45, marginRight: utils.isMobile() ? 14 : 28, height: utils.isMobile() ? 40 : 45 }} /> : <Avatar size="large" style={{ width: utils.isMobile() ? 40 : 45, height: utils.isMobile() ? 40 : 45, marginRight: 28 }} >{getShortName(detail.comments[detail.comments.length - 1].owner.fullName)}</Avatar>}
                                <div style={{ display: 'flex', flexDirection: 'column', width: "100%" }}>
                                    <div style={{ display: 'flex', marginBottom: 8, justifyContent: 'space-between', width: "100%" }}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <div style={{ display: ' flex', alignItems: 'center', flexDirection: 'column', marginBottom: 8 }}>
                                                <h4 style={{ marginBottom: 4 }}>{detail.comments[detail.comments.length - 1].owner.fullName}</h4>
                                                <h5 style={{ color: 'grey' }}>{moment(detail.comments[detail.comments.length - 1].createdAt).format('hh:mm A DD-MM-YYYY')}</h5>
                                            </div>
                                        </div>
                                        {
                                            user.id === detail.comments[detail.comments.length - 1].owner.id && (
                                                <React.Fragment>
                                                    <IconButton onClick={() => handleOpenModal('comment', detail.comments[detail.comments.length - 1].id)}>
                                                        <CloseIcon />
                                                    </IconButton>
                                                </React.Fragment>

                                            )
                                        }
                                    </div>
                                    <p>{detail.comments[detail.comments.length - 1].content}</p>
                                </div>
                            </div>
                        ) : null
                    }
                    {
                        detail.comments.length ? <Divider style={{ marginTop: 8 }} /> : null
                    }
                </div>

                <div style={{ display: 'flex', alignItems: 'center', padding: utils.isMobile() ? 16 : "16px 40px" }}>
                    {user.avatar ? <Avatar alt="avatar" src={user.avatar} style={{ width: utils.isMobile() ? 35 : 40, marginRight: utils.isMobile() ? 14 : 28, height: utils.isMobile() ? 35 : 40 }} /> : <Avatar size="large" style={{ width: utils.isMobile() ? 35 : 40, height: utils.isMobile() ? 35 : 40, marginRight: 28 }} >{getShortName(user.fullName)}</Avatar>}
                    <div className="comment-bar" style={{ height: utils.isMobile() ? 50 : 60, border: focus ? "2px solid #38d39f" : "1px solid #cecece" }}>
                        <input
                            value={content}
                            onKeyPress={handleKeyPress}
                            onFocus={() => setFocus(true)}
                            onBlur={() => setFocus(false)}
                            type="text"
                            onChange={handleChangeComment}
                            style={{ border: 'none', outline: 'none', width: '90%', height: "99%", borderRadius: 44, fontSize: 16 }}
                            placeholder="Share your thought here..."
                        />
                        <IconButton onClick={handleAddComment} disabled={content === "" ? true : false}>
                            <SendIcon color={content !== "" ? 'primary' : 'disabled'} />
                        </IconButton>
                    </div>

                </div>
                {loading && <LinearProgress style={{ width: "99%", margin: '0 auto' }} />}
            </Paper >
        </React.Fragment >

    )
}

export default BlogDetail;