import React, { useState } from 'react'
import bg from '../assets/img/bg.svg';
import wave from '../assets/img/wave.png';
import avatar from '../assets/img/avatar.svg'
import PersonIcon from '@material-ui/icons/Person';
import LockIcon from '@material-ui/icons/Lock';
import dataService from '../network/dataService';
import apiStore from '../services/apiStore';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import { LinearProgress } from '@material-ui/core';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});


const LoginForm = (props) => {
    let history = useHistory()
    const [divOneFocus, setDivOneFocus] = useState(false)
    const [divTwoFocus, setDivTwoFocus] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const [resetEmail, setResetEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: undefined,
        password: undefined
    })

    const handleOnBlur = () => {
        if (formData.email) {
            setDivOneFocus(true)
        } else setDivOneFocus(false)
        if (formData.password) {
            setDivTwoFocus(true)
        } else setDivTwoFocus(false)
    }

    const handleChange = (e) => {
        let temp = { ...formData };
        temp[e.target.name] = e.target.value
        setFormData(temp)
    }

    const handleSubmit = async () => {
        let rs = await dataService.login(formData)
        if (rs.code === 0) {
            apiStore.login(rs.data, rs.token)
            history.push(rs.data.role <= 2 ? '/' : "/users/classes")
        } else {
            apiStore.showUi(rs.message, rs.code)
        }
    }

    const handleKeyPress = e => {
        if (e.key === 'Enter') {
            handleSubmit()
        }
    }

    const handleCloseModal = () => {
        setOpenModal(false)
    }

    const handleOpenModal = () => {
        setOpenModal(true)
    }

    const sendResetMail = async () => {
        setIsLoading(true)
        let rs = await dataService.sendResetMail({ email: resetEmail })
        setIsLoading(false)
        setResetEmail("")
        setOpenModal(false)
        apiStore.showUi(rs.message, rs.code)
    }

    return (
        <React.Fragment>
            <Dialog
                open={openModal}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleCloseModal}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                {isLoading && <LinearProgress color="primary" />}
                <DialogTitle id="alert-dialog-slide-title">{" Enter your email to reset password"}</DialogTitle>
                <DialogContent>
                    {/* <DialogContentText id="alert-dialog-slide-description">
                        Enter your enter to reset password
                    </DialogContentText> */}
                    <TextField
                        autoFocus={true}
                        margin="dense"
                        label="Email"
                        type="text"
                        fullWidth
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={sendResetMail} color="primary">
                        Open
                    </Button>
                </DialogActions>
            </Dialog>
            <img className="wave" src={wave} alt="" />
            <div className="container">
                <div className="img">
                    <img src={bg} alt="" />
                </div>
                <div className="login-content">
                    <form action="index.html">
                        <img src={avatar} alt="" />
                        <h2 className="title">Welcome</h2>
                        <div className={`input-div one ${divOneFocus && 'focus'}`}>
                            <div className="i">
                                <PersonIcon />
                            </div>
                            <div className="div">
                                <h5>Email</h5>
                                <input
                                    onKeyPress={handleKeyPress}
                                    type="text"
                                    className="input"
                                    name="email"
                                    onFocus={() => setDivOneFocus(true)}
                                    onBlur={handleOnBlur}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className={`input-div pass ${divTwoFocus && 'focus'}`}>
                            <div className="i">
                                <LockIcon />
                            </div>
                            <div className="div">
                                <h5>Password</h5>
                                <input
                                    onKeyPress={handleKeyPress}
                                    type="password"
                                    className="input"
                                    name="password"
                                    onFocus={() => setDivTwoFocus(true)}
                                    onBlur={handleOnBlur}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <input type="button" onClick={handleSubmit} className="btn" value="Login" />
                        <Button color="primary" onClick={handleOpenModal}>Forget your password</Button>
                    </form>
                </div>
            </div>
        </React.Fragment>
    )
}

export default LoginForm;