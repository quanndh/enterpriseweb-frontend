import React from 'react';
// import AccountCircle from '@material-ui/icons/AccountCircle';
import EventSeatIcon from '@material-ui/icons/EventSeat';
import Typography from '@material-ui/core/Typography';
import utils from '../services/utils/index'
// import EditIcon from '@material-ui/icons/Edit';
// import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';

const getShortName = name => {
    let words = name.split(" ")
    let shortName = words.map(w => {
        return w[0].toUpperCase()
    })
    return shortName.join('')
}

const UserDetail = props => {
    let { user } = props

    let role;

    if (user.role === 1) {
        role = "Authorised admin"
    } else if (user.role === 2) {
        role = "Admin"
    } else if (user.role === 3) {
        role = "Tutor"
    } else role = "Student"
    return (
        <div className="user-detail-wrapper">
            {user.avatar ? <Avatar alt="avatar" src={user.avatar} style={{ width: utils.isMobile() ? 70 : 140, marginRight: 24, height: utils.isMobile() ? 70 : 140 }} /> : <Avatar size="large" style={{ width: utils.isMobile() ? 70 : 140, height: utils.isMobile() ? 70 : 140, marginRight: 24 }} >{getShortName(user.fullName)}</Avatar>}
            <div style={{ display: "flex", flexDirection: 'column', justifyContent: 'space-between', width: "100%" }}>
                <div className="df" style={{ marginBottom: utils.isMobile() ? 20 : 80, alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div>
                        <Typography variant="h4" >
                            {user.fullName}
                        </Typography>
                        <div className="df">
                            <EventSeatIcon style={{ marginRight: 12 }} />
                            <Typography variant="h6" >
                                {role}
                            </Typography>
                        </div>
                    </div>
                    {/* <IconButton color="primary" aria-label="add">
                        <EditIcon />
                    </IconButton> */}
                </div>
                <div style={{ display: "flex", flexDirection: utils.isMobile() ? "column" : "row", justifyContent: 'space-between', width: "auto", height: "auto" }}>
                    <div>
                        <Typography variant="h6" style={{ color: "grey", fontWeight: 540, fontStyle: "italic" }} >
                            BIRTHYEAR
                        </Typography>
                        <Typography variant="h6" >
                            {user.birthYear}
                        </Typography>
                    </div>
                    <div>
                        <Typography variant="h6" style={{ color: "grey", fontWeight: 540, fontStyle: "italic" }}>
                            EMAIL
                        </Typography>
                        <Typography variant="h6" >
                            {user.email}
                        </Typography>
                    </div>
                    <div>
                        <Typography variant="h6" style={{ color: "grey", fontWeight: 540, fontStyle: "italic" }}>
                            Phone
                        </Typography>
                        <Typography variant="h6" >
                            {user.phone}
                        </Typography>
                    </div>


                </div>
            </div>


        </div >
    )
}

export default UserDetail