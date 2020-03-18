import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import utils from '../services/utils/index';
import Avatar from '@material-ui/core/Avatar';
import moment from 'moment';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';

const getShortName = name => {
    let words = name.split(" ")
    let shortName = words.map(w => {
        return w[0].toUpperCase()
    })
    return shortName.join('')
}

const BlogDetail = props => {
    let { detail, user } = props;

    const [focus, setFocus] = useState(false)

    return (
        <Paper
            elevation={3}
            style={{ borderRadius: 12, marginBottom: 40 }}
        >
            <div style={{ padding: utils.isMobile() ? 28 : "16px 40px" }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                    {detail.owner.avatar ? <Avatar alt="avatar" src={detail.owner.avatar} style={{ width: utils.isMobile() ? 50 : 60, marginRight: 20, height: utils.isMobile() ? 50 : 60 }} /> : <Avatar size="large" style={{ width: utils.isMobile() ? 50 : 60, height: utils.isMobile() ? 50 : 60, marginRight: 20 }} >{getShortName(detail.owner.fullName)}</Avatar>}
                    <div>
                        <h4 style={{ marginBottom: 8 }}>{detail.owner.fullName}</h4>
                        <h5 style={{ color: 'grey' }}>{moment(detail.createdAt).format('hh:mm A DD-MM-YYYY')}</h5>
                    </div>
                </div>
                <div style={{ marginBottom: 20 }}>
                    <p>{detail.content}</p>
                </div>
                <div>
                    {
                        detail.file.length ? detail.file.map(file => {
                            return (
                                <Paper className="file" elevation={3} key={file.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', borderRadius: 12, height: 50, padding: 14 }}>
                                    <h3>{file.fileName}</h3>
                                </Paper>
                            )
                        }) : null
                    }
                </div>
            </div>
            <Divider />
            <div style={{ display: 'flex', alignItems: 'center', padding: utils.isMobile() ? 28 : "16px 40px" }}>
                {user.avatar ? <Avatar alt="avatar" src={user.avatar} style={{ width: utils.isMobile() ? 50 : 60, marginRight: 28, height: utils.isMobile() ? 50 : 60 }} /> : <Avatar size="large" style={{ width: utils.isMobile() ? 50 : 60, height: utils.isMobile() ? 50 : 60, marginRight: 28 }} >{getShortName(user.fullName)}</Avatar>}
                <div className="comment-bar" style={{ height: utils.isMobile() ? 50 : 60, border: focus ? "2px solid #38d39f" : "1px solid #cecece" }}>
                    <input
                        onFocus={() => setFocus(true)}
                        onBlur={() => setFocus(false)}
                        type="text"
                        style={{ border: 'none', outline: 'none', width: '90%', height: "99%", borderRadius: 44, fontSize: 16 }}
                        placeholder="Share your thought here..."
                    />
                    <IconButton>
                        <SendIcon />
                    </IconButton>
                </div>

            </div>
        </Paper>
    )
}

export default BlogDetail;