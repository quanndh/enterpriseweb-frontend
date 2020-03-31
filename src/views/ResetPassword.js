import React, { useState, useEffect } from 'react';
import apiStore from '../services/apiStore';
import dataService from '../network/dataService';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import utils from '../services/utils/index';
import { LinearProgress } from '@material-ui/core';
import { useHistory } from 'react-router-dom'

const ResetPassword = props => {
    const history = useHistory()
    const [isLoading, setIsLoading] = useState(false)
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("")

    useEffect(() => {
        let { token } = props.match.params;
        localStorage.setItem('TOKEN', token)
    })

    const handleChangePassword = async () => {
        setIsLoading(true)
        let rs = await dataService.userChangePassword({ newPassword, confirmPassword })
        localStorage.removeItem('TOKEN')
        setIsLoading(false)
        apiStore.showUi(rs.message, rs.code)
        if (rs.code === 0) {
            history.push('/')
        }

    }

    return (
        <Paper elevation={3} style={{ padding: 40, width: utils.isMobile() ? '80%' : '40%', margin: '0 auto', marginTop: 200 }}>
            {isLoading && <LinearProgress color="primary" />}
            <h3 style={{ marginBottom: 20 }}>Reset password</h3>
            <TextField
                autoFocus={false}
                margin="dense"
                label="New Password"
                type="password"
                fullWidth
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{ marginBottom: 16 }}
            />
            <TextField
                autoFocus={false}
                margin="dense"
                label="Confirm your Password"
                type="password"
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button
                style={{ marginTop: 16, width: '30%', color: 'white' }}
                onClick={handleChangePassword}
                color="primary"
                variant="contained"
                disabled={newPassword === "" || confirmPassword === "" ? true : false}
            >
                OK
            </Button>
        </Paper >
    )
}

export default ResetPassword;