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
import { connect } from 'react-redux'

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

    componentDidMount() {
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
        let { online } = this.props;
        console.log(online)

        let displayMessage = message.length ? message.map(msg => {
            return (
                <div key={`msg-${msg.id}`} style={{ display: 'flex', padding: utils.isMobile() ? 8 : "8px 10px", marginBottom: 2 }}>
                    {msg.sender.avatar ? <Avatar alt="avatar" src={msg.sender.avatar} style={{ width: utils.isMobile() ? 36 : 45, marginRight: utils.isMobile() ? 12 : 28, height: utils.isMobile() ? 36 : 45 }} /> : <Avatar size="large" style={{ width: utils.isMobile() ? 36 : 45, height: utils.isMobile() ? 36 : 45, marginRight: utils.isMobile() ? 12 : 28 }} >{getShortName(msg.sender.fullName)}</Avatar>}
                    <div style={{ display: 'flex', flexDirection: 'column', width: "100%" }}>
                        <div style={{ display: 'flex', marginBottom: 8, justifyContent: 'space-between', width: "100%" }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{ display: ' flex', alignItems: 'center' }}>
                                    <h4 style={{ marginRight: 8 }}>{msg.sender.fullName}</h4>
                                    <h5 style={{ color: 'grey' }}>{moment(msg.createdAt).format('hh:mm A')}</h5>
                                </div>
                            </div>
                        </div>|
                        <p>{msg.content}</p>
                    </div>
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
                    <Tab label="People" icon={<PeopleAltIcon />} />
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
                            <div >
                                aas
                            </div>
                        )
                }
            </div >
        )
    }
}


const mapStateToProps = state => {
    return {
        online: state.classReducer.meeting.participants
    }
}
export default connect(mapStateToProps)(ChatBox);