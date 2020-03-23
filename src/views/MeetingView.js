import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import ChatBox from '../components/ChatBox';
import utils from '../services/utils/index';
import CameraGrid from '../components/CameraGrid';
import io from '../services/socket/index'
import dataService from '../network/dataService';
import Snackbar from '@material-ui/core/Snackbar';
import Slide from '@material-ui/core/Slide';
import Avatar from '@material-ui/core/Avatar';
import Alert from '@material-ui/lab/Alert';
import apiStore from '../services/apiStore';

const getShortName = name => {
    let words = name.split(" ")
    let shortName = words.map(w => {
        return w[0].toUpperCase()
    })
    return shortName.join('')
}


function SlideTransition(props) {
    return <Slide {...props} direction="down" />;
}

class MeetingView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            online: [],
            newUser: {},
            open: false,
            type: ""
        }
    }

    getOnlineUser = async () => {
        let rs = await dataService.getOnlineUser({ meetingId: this.props.match.params.meetingId })
        this.setState({ online: rs.data })
    }

    componentDidMount() {
        this.getOnlineUser()
        io.socket.on('join-meeting', event => {
            if (Number(event.data.id) === Number(this.props.match.params.meetingId)) {
                console.log(event.data.participants)
                this.setState({ online: event.data.participants, newUser: event.newUser, open: true, type: 'join' })
                setTimeout(() => {
                    this.setState({ open: false, newUser: {} })
                }, 2000)
            }

        })
        io.socket.on('leave-meeting', event => {
            if (Number(event.data.id) === Number(this.props.match.params.meetingId)) {
                console.log(event.data.participants)
                this.setState({ online: event.data.participants, newUser: event.newUser, open: true, type: 'leave' })
                setTimeout(() => {
                    this.setState({ open: false, newUser: {} })
                }, 2000)
            }

        })
        window.addEventListener('beforeunload', async (e) => {
            io.socket.request({
                method: 'patch',
                url: "/api/meeting/leave",
                data: { meetingId: this.props.match.params.meetingId },
                headers: {
                    'Authorization': `Bearer ${apiStore.getToken()}`
                }
            }, (resData, jwres) => {
                if (jwres.statusCode === 200) {
                    this.setState({ online: resData.data, newUser: resData.newUser })
                }
            })
        })
    }

    handleClose = () => {
        this.setState({ open: false, newUser: {} })
    }

    render() {
        let { meetingId } = this.props.match.params;
        let { user } = this.props;
        let { newUser, type } = this.state;
        console.log(this.state.online, 111)
        return (
            <Grid container className="meeting" style={{ height: '100%' }}>
                <Snackbar
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    key={`top, center`}
                    open={this.state.open}
                    onClose={this.handleClose}
                    TransitionComponent={SlideTransition}
                >
                    <Alert variant="filled" severity="info" style={{ display: 'flex', alignItems: 'center', backgroundColor: "white", color: 'black' }}>
                        {
                            Object.keys(newUser).length ? (
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    {newUser.avatar ? <Avatar alt="avatar" src={newUser.avatar} style={{ width: utils.isMobile() ? 36 : 45, marginRight: utils.isMobile() ? 12 : 28, height: utils.isMobile() ? 36 : 45 }} /> : <Avatar size="large" style={{ width: utils.isMobile() ? 36 : 45, height: utils.isMobile() ? 36 : 45, marginRight: utils.isMobile() ? 12 : 28 }} >{getShortName(newUser.fullName)}</Avatar>}
                                    {newUser.fullName} has {type === "join" ? "join" : 'leave'} the meeting
                                </div>
                            ) : null
                        }
                    </Alert>
                </Snackbar>
                <Grid item xs={12} md={6} lg={9} style={{ backgroundColor: 'black', height: utils.isMobile() ? '40vh' : '100vh' }}>
                    <CameraGrid meetingId={meetingId} user={user} />
                </Grid>
                <Grid item xs={12} md={6} lg={3} style={{ height: utils.isMobile() ? '60vh' : '100vh' }}>
                    <ChatBox online={this.state.online} meetingId={meetingId} user={user} style={{ height: '100%' }} />
                </Grid>
            </Grid >
        )
    }

}

export default MeetingView;