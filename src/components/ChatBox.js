import React, { Component } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ChatIcon from '@material-ui/icons/Chat';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';
import utils from '../services/utils/index';
import io from '../services/socket/index'
import apiStore from '../services/apiStore';
import moment from 'moment';
import Avatar from '@material-ui/core/Avatar';
import UIfx from 'uifx';
import msgSound from '../assets/sound/fbsound.mp3';
import dataService from '../network/dataService';

const msgNoti = new UIfx(msgSound);

const getShortName = name => {
    let words = name.split(" ")
    let shortName = words.map(w => {
        return w[0].toUpperCase()
    })
    return shortName.join('')
}


function scrollToBottom(chatBox) {
    chatBox.scrollTop = chatBox.scrollHeight;
}

class ChatBox extends Component {

    constructor(props) {
        super(props);
        this.state = {
            message: [],
            content: "",
            value: 0,
        }
    }

    async componentDidMount() {
        let rs = await dataService.getMeetingMessage({ meetingId: this.props.meetingId, skip: 0, limit: 20 })
        if (rs.code !== 0) {
            rs.data = []
            apiStore.showUi('Unable to load old message', rs.code)
        } else {
            rs.data.sort((a, b) => (a.createdAt > b.createdAt) ? 1 : -1)
            this.setState({ message: rs.data })
        }
        io.socket.on('message', (event) => {
            if (Number(event.data.meeting) === Number(this.props.meetingId)) {
                msgNoti.play()
                this.setState({ message: [...this.state.message, event.data] })
                let chatBox = document.getElementById('chatBox');
                let shouldScroll = chatBox.scrollTop + chatBox.clientHeight === chatBox.scrollHeight;
                if (!shouldScroll) {
                    scrollToBottom(chatBox);
                }
            }
        })
    }

    handleSend = () => {
        let data = {
            content: this.state.content,
            sender: this.props.user.id,
            meeting: this.props.meetingId
        }
        io.socket.request({
            method: 'post',
            url: `/api/chatmessage/send`,
            data,
            headers: {
                'Authorization': `Bearer ${apiStore.getToken()}`
            }
        }, (resData, jwres) => {
            if (jwres.statusCode === 200) {
                this.setState({ message: [...this.state.message, resData.data], content: "" })
                let chatBox = document.getElementById('chatBox');
                let shouldScroll = chatBox.scrollTop + chatBox.clientHeight === chatBox.scrollHeight;
                if (!shouldScroll) {
                    scrollToBottom(chatBox);
                }
            }
        })
    }

    handleChange = (event, newValue) => {
        this.setState({ value: newValue });
    };

    handleKeyPress = e => {
        if (e.key === 'Enter') {
            this.handleSend()
        }
    }

    render() {
        let { message, value, content } = this.state;
        let { online, user } = this.props;

        let chatBox = document.getElementById('chatBox');
        if (chatBox) {
            let shouldScroll = chatBox.scrollTop + chatBox.clientHeight === chatBox.scrollHeight;
            if (!shouldScroll) {
                scrollToBottom(chatBox);
            }
        }

        let displayMessage = message.length ? message.map(msg => {
            return (
                <div key={`msg-${msg.id}`} style={{ display: 'flex', flexDirection: 'row', padding: utils.isMobile() ? 8 : "8px 10px", marginTop: 14 }}>
                    {msg.sender.avatar ? <Avatar alt="avatar" src={msg.sender.avatar} style={{ width: utils.isMobile() ? 36 : 45, marginRight: user.id !== msg.sender.id ? utils.isMobile() ? 12 : 28 : 0, height: utils.isMobile() ? 36 : 45 }} /> : <Avatar size="large" style={{ width: utils.isMobile() ? 36 : 45, height: utils.isMobile() ? 36 : 45, marginRight: utils.isMobile() ? 12 : 28 }} >{getShortName(msg.sender.fullName)}</Avatar>}
                    <div style={{ display: 'flex', flexDirection: 'column', width: "100%", alignItems: 'flex-start', marginRight: utils.isMobile() ? 12 : 28 }}>
                        <div style={{ display: 'flex', marginBottom: 8, justifyContent: 'space-between', width: "100%" }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{ display: ' flex', alignItems: 'center' }}>
                                    <h4 style={{ marginRight: 8 }}>{msg.sender.fullName}</h4>
                                    <h5 style={{ color: 'grey' }}>{moment(msg.createdAt).format('hh:mm A')}</h5>
                                </div>
                            </div>
                        </div>
                        <p>{msg.content}</p>
                    </div>
                </div>
            )
        }) : null
        let displayOnline = online && online.length ? online.map(user => {
            return (
                <div key={user.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                    {user.avatar ? <Avatar alt="avatar" src={user.avatar} style={{ width: utils.isMobile() ? 36 : 45, marginRight: utils.isMobile() ? 12 : 28, height: utils.isMobile() ? 36 : 45 }} /> : <Avatar size="large" style={{ width: utils.isMobile() ? 36 : 45, height: utils.isMobile() ? 36 : 45, marginRight: utils.isMobile() ? 12 : 28 }} >{getShortName(user.fullName)}</Avatar>}
                    <h4>{user.fullName}</h4>
                </div>
            )
        }) : null

        return (
            <div style={{
                height: utils.isMobile() ? "77%" : "100%", overflow: utils.isMobile() ? "none" : 'hidden', width: '100%'
            }}>
                <Tabs
                    value={value}
                    onChange={this.handleChange}
                    variant="fullWidth"
                    indicatorColor="primary"
                    textColor="primary"
                >
                    <Tab label="Chat" icon={<ChatIcon />} />
                    <Tab label={`People (${online.length})`} icon={<PeopleAltIcon />} />
                </Tabs >
                {
                    value === 0 ? (
                        <div className="tab-panel" style={{ display: 'block', flex: 1, height: "100%", width: "100", padding: 10 }}>
                            <div style={{ overflowY: 'auto', flex: 1, height: '83%' }} id="chatBox">
                                {displayMessage}
                            </div>
                            <div className="chatBar">
                                <TextField
                                    onChange={e => this.setState({ content: e.target.value })}
                                    value={content}
                                    id="standard-basic"
                                    style={{ width: "100%" }}
                                    label="Send message to everyone..."
                                    name="content"
                                    onKeyPress={this.handleKeyPress}
                                />
                                <IconButton style={{ padding: 0, alignSelf: 'flex-end', paddingLeft: 10 }} onClick={this.handleSend} disabled={content === "" ? true : false}>
                                    <SendIcon color={content !== "" ? 'primary' : 'disabled'} />
                                </IconButton>
                            </div>

                        </div>
                    ) : (
                            <div style={{ padding: 20 }}>
                                {displayOnline}
                            </div>
                        )
                }
            </div >
        )
    }
}

export default ChatBox;