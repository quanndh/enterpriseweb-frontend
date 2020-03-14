import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import utils from "../services/utils/index"
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import LinearProgress from '@material-ui/core/LinearProgress';

const getShortName = name => {
    let words = name.split(" ")
    let shortName = words.map(w => {
        return w[0].toUpperCase()
    })
    return shortName.join('')
}

const UserActivity = props => {

    let { activityLoad } = props;

    let displayData = props.data && props.data.length ? props.data.map((e, ind) => {
        return (
            <React.Fragment key={ind} >
                <ListItem style={{ width: "100%" }} >
                    <div className="df" style={{ width: "100%" }}>
                        <ListItemAvatar>
                            {
                                e.owner.avatar ? <Avatar style={{ height: 40, width: 40 }} alt="avatar" src={e.owner.avatar} /> : <Avatar style={{ height: 40, width: 40 }}>{getShortName(e.owner.fullName)}</Avatar>
                            }

                        </ListItemAvatar>
                        <ListItemText>
                            <p>{e.action}</p>
                        </ListItemText>
                    </div>
                    <div style={{ width: utils.isMobile() ? "15%" : "30%" }}>
                        <ListItemText edge="end">
                            <p>{moment(e.createdAt).toNow(true)} ago</p>
                        </ListItemText>
                    </div>
                </ListItem>
                <Divider variant="inset" component="li" style={{ marginBottom: 32 }} />
            </React.Fragment>
        )
    }) : <Typography variant="h6" style={{ fontWeight: 540, fontStyle: "italic" }} >
            NO RECORD FOUND
        </Typography>
    return (
        <React.Fragment>
            {activityLoad && <LinearProgress />}
            <List style={{ width: "100%", padding: -10 }}>
                {displayData}
            </List >
        </React.Fragment>

    )
}

export default UserActivity