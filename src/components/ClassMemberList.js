import React from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import utils from "../services/utils/index";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';

const getShortName = name => {
    let words = name.split(" ")
    let shortName = words.map(w => {
        return w[0].toUpperCase()
    })
    return shortName.join('')
}

const ClassMemberList = props => {
    let { tutor, students } = props;
    return (
        <Paper elevation={3} style={{ borderRadius: 12, paddingTop: 8 }}>
            <Typography variant={utils.isMobile() ? "h6" : "h5"} style={{ fontWeight: 540, padding: "0 20px", width: "100%" }} >
                Tutor
            </Typography>
            <List>
                <ListItem>
                    <ListItemAvatar>
                        {Object.keys(tutor).length && tutor.avatar ? <Avatar alt="avatar" src={tutor.avatar} style={{ width: utils.isMobile() ? 50 : 60, marginRight: 28, height: utils.isMobile() ? 50 : 60 }} /> : <Avatar size="large" style={{ width: utils.isMobile() ? 50 : 60, height: utils.isMobile() ? 50 : 60, marginRight: 28 }} >{Object.keys(tutor).length && getShortName(tutor.fullName)}</Avatar>}
                    </ListItemAvatar>
                    <ListItemText primary={tutor.fullName} secondary={tutor.email} />
                </ListItem>
            </List>
            <Typography variant={utils.isMobile() ? "h6" : "h5"} style={{ fontWeight: 540, padding: "0 20px", width: "100%" }} >
                Students
            </Typography>
            <List>
                {
                    students.length ? students.map(s => {
                        return (
                            <ListItem key={s.id}>
                                <ListItemAvatar>
                                    {Object.keys(s).length && s.avatar ? <Avatar alt="avatar" src={s.avatar} style={{ width: utils.isMobile() ? 50 : 60, marginRight: 28, height: utils.isMobile() ? 50 : 60 }} /> : <Avatar size="large" style={{ width: utils.isMobile() ? 50 : 60, height: utils.isMobile() ? 50 : 60, marginRight: 28 }} >{Object.keys(s).length && getShortName(s.fullName)}</Avatar>}
                                </ListItemAvatar>
                                <ListItemText primary={s.fullName} secondary={s.email} />
                            </ListItem>
                        )
                    }) : null
                }
            </List>
        </Paper>
    )
}

export default ClassMemberList;