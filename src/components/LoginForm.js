import React, { useState } from 'react'
import bg from '../assets/img/bg.svg';
import wave from '../assets/img/wave.png';
import avatar from '../assets/img/avatar.svg'
import PersonIcon from '@material-ui/icons/Person';
import LockIcon from '@material-ui/icons/Lock';
import dataService from '../network/dataService';
import apiStore from '../services/apiStore';
import { useHistory } from 'react-router-dom';

const LoginForm = (props) => {
    let history = useHistory()
    const [divOneFocus, setDivOneFocus] = useState(false)
    const [divTwoFocus, setDivTwoFocus] = useState(false)
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

    return (
        <React.Fragment>
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
                    </form>
                </div>
            </div>
        </React.Fragment>
    )
}

export default LoginForm;