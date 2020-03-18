import React, { useEffect, useState } from 'react';
import ClassCard from '../components/ClassCard';
import dataService from '../network/dataService';
import { connect } from 'react-redux';
import apiStore from '../services/apiStore';
import { LinearProgress } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import utils from '../services/utils/index';
import Grid from '@material-ui/core/Grid';
import { Link } from 'react-router-dom';

const UserClass = props => {

    let { user, classList } = props;

    const [loading, setLoading] = useState(false)



    useEffect(() => {
        const getUserClass = async () => {
            setLoading(true)
            let rs = await dataService.getUserClass({ userId: user.id })
            if (rs.code === 0) { apiStore.actUserGetClassList(rs.data) }
            else apiStore.showUi(rs.message, rs.code)
            setLoading(false)
        }
        getUserClass()
    }, [user.id])

    let displayClassList = classList.length ? classList.map(c => {
        return (
            <Link key={c.id} to={`/users/classes/${c.id}`} >
                <Grid item xs={12} md={6} lg={4} >
                    <ClassCard classDetail={c} />
                </Grid >
            </Link>

        )
    }) : (<div className="no-class-wrap">
        <img alt="" src="https://www.gstatic.com/classroom/empty_states_comments.png" width={utils.isMobile() ? "200px" : "450px"} />
        <Typography variant={utils.isMobile() ? "h5" : "h4"} style={{ color: "grey", fontWeight: 540, marginBottom: 20 }} >
            You dont have any class yet
        </Typography>

    </div >);

    return (
        <React.Fragment>
            {loading && <LinearProgress />}
            <Grid container spacing={3} className="card-list options">
                {displayClassList}
            </Grid>
        </React.Fragment>

    )
}

const mapStateToProps = state => {
    return {
        classList: state.userReducer.classList
    }
}

export default connect(mapStateToProps)(UserClass);