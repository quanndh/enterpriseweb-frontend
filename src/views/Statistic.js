import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import MessageChart from '../components/MessageChart';
import dataService from '../network/dataService'
import apiStore from '../services/apiStore';
import BlogChart from '../components/BlogChart';
import NewUserChart from '../components/NewUserChart';
import MeetingTimeChart from '../components/MeetingTimeChart';
import Paper from '@material-ui/core/Paper';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import ClassIcon from '@material-ui/icons/Class';
import BallotOutlinedIcon from '@material-ui/icons/BallotOutlined';
import MaterialTable from 'material-table';
import { forwardRef } from 'react';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const Statistic = props => {

    const [messageData, setMessageData] = useState(undefined)
    const [blogData, setBlogData] = useState(undefined)
    const [newUserData, setNewUserData] = useState(undefined)
    const [meetingTimeData, setMeetingTimeData] = useState(undefined)
    const [overall, setOverall] = useState(undefined)
    const [unactiveStudent, setUnactiveStudent] = useState(undefined)
    const [isLoading, setIsLoading] = useState(false)

    let columns = [
        { title: 'Full Name', field: 'fullName' },
        { title: 'Email', field: 'email' },
        { title: 'Birth Year', field: 'birthYear' },
    ]

    let options = {
        title: "Unactive students",
        exportButton: true,
        emptyRowsWhenPaging: true,
        exportFileName: "Unactive-Student",
        headerStyle: { fontSize: 18, fontWeight: 600 },
        searchFieldAlignment: 'right',
        draggable: true,
    }

    let editable = {}

    useEffect(() => {
        const getMessageCount = async () => {
            let rs = await dataService.getMessageCount()
            if (rs.code === 0) setMessageData(rs.data)
            else apiStore.showUi(rs.message, rs.code)
        }
        const getBlogCount = async () => {
            let rs = await dataService.getBlogCount()
            if (rs.code === 0) setBlogData(rs.data)
            else apiStore.showUi(rs.message, rs.code)
        }
        const getNewUserCount = async () => {
            let rs = await dataService.getNewUserCount()
            if (rs.code === 0) setNewUserData(rs.data)
            else apiStore.showUi(rs.message, rs.code)
        }
        const getMeetingTime = async () => {
            let rs = await dataService.getMeetingTime()
            if (rs.code === 0) setMeetingTimeData(rs.data)
            else apiStore.showUi(rs.message, rs.code)
        }
        const getOverallStat = async () => {
            let rs = await dataService.getOverallStat()
            if (rs.code === 0) setOverall(rs.data)
            else apiStore.showUi(rs.message, rs.code)
        }
        const getUnactiveStudent = async () => {
            let rs = await dataService.getUnactiveStudent();
            if (rs.code === 0) setUnactiveStudent(rs.data)
            else apiStore.showUi(rs.message, rs.code)
        }
        getMessageCount()
        getBlogCount()
        getNewUserCount()
        getMeetingTime()
        getOverallStat()
        getUnactiveStudent()
    }, [])


    const toggleTableLoad = () => {
        let level = Math.ceil(Math.random() * 3)
        let speed;
        if (level === 1) {
            speed = 400
        } else if (level === 2) {
            speed = 550
        } else {
            speed = 700
        }
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false)
        }, speed)
    }




    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
                {
                    newUserData ? (
                        <NewUserChart data={newUserData} />
                    ) : null
                }
            </Grid>
            <Grid item xs={12} md={6}>
                {
                    messageData ? (
                        <MessageChart data={messageData} />
                    ) : null
                }
            </Grid>
            <Grid item xs={12} md={6}>
                {
                    blogData ? (
                        <BlogChart data={blogData} />
                    ) : null
                }
            </Grid>
            <Grid item xs={12} md={6}>
                {
                    meetingTimeData ? (
                        <MeetingTimeChart data={meetingTimeData} />
                    ) : null
                }
            </Grid>

            <Grid item xs={12} md={4}>
                <Paper elevation={3} className="statistic-card">
                    <div className="statistic-logo" style={{ backgroundColor: '#D76D77' }}>
                        <PeopleAltIcon style={{ fontSize: 60 }} />
                    </div>
                    <div className="statistic-content">
                        <p style={{ color: '#D76D77' }}>{overall ? overall.users : 0}</p>
                        <p>Users</p>
                    </div>
                </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
                <Paper elevation={3} className="statistic-card">
                    <div className="statistic-logo" style={{ backgroundColor: '#11998e' }}>
                        <ClassIcon style={{ fontSize: 60 }} />
                    </div>
                    <div className="statistic-content">
                        <p style={{ color: '#11998e' }}>{overall ? overall.classes : 0}</p>
                        <p>Classes</p>
                    </div>
                </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
                <Paper elevation={3} className="statistic-card">
                    <div className="statistic-logo" style={{ backgroundColor: '#b91d73' }}>
                        <BallotOutlinedIcon style={{ fontSize: 60 }} />
                    </div>
                    <div className="statistic-content">
                        <p style={{ color: '#b91d73' }}>{overall ? overall.meeting : 0}</p>
                        <p>Meetings</p>
                    </div>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <MaterialTable
                    style={{
                        boxShadow: "0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)",
                        borderRadius: 4,
                        padding: "8px 24px"
                    }}
                    elevation={6}
                    icons={tableIcons}
                    title="UNACTIVE STUDENTS"
                    options={options}
                    exportButton={true}
                    onChangePage={toggleTableLoad}
                    isLoading={isLoading}
                    columns={columns}
                    data={unactiveStudent}
                    selection={true}
                    onChangeRowsPerPage={toggleTableLoad}
                    onSearchChange={toggleTableLoad}
                    editable={editable}
                />
            </Grid>
        </Grid>
    )
}

export default Statistic;