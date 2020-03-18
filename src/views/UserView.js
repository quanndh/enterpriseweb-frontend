import React, { useState, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import utils from "../services/utils/index";
import UserDetail from '../components/UserDetail';
import UserActivity from '../components/UserActivity';
import MaterialTable from 'material-table';
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
import { forwardRef } from 'react';
import Typography from '@material-ui/core/Typography';
import dataService from '../network/dataService';
import apiStore from '../services/apiStore';
import { connect } from 'react-redux';

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

let options = {
    exportButton: true,
    emptyRowsWhenPaging: true,
    exportFileName: "User_List",
    searchFieldAlignment: 'left',
    headerStyle: { fontSize: 18, fontWeight: 600 },
}

const UserView = props => {
    let { user, userList, activity } = props;

    let columns = [
        { title: 'Full Name', field: 'fullName' },
        { title: 'Role', field: 'role', lookup: { 2: 'Admin', 3: 'Tutor', 4: 'Student' }, },
        { title: 'Email', field: 'email' },
        { title: 'Birth Year', field: 'birthYear' },
        { title: 'Phone', field: 'phone' },
        { title: 'ID', field: 'id' },
    ]


    const [selectedUserData, setSelectedUserData] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [activityLoad, setActivityLoad] = useState(false)

    const getUserList = async () => {
        setIsLoading(true)
        let rs = await dataService.getUserList()
        if (rs.code !== 0) {
            apiStore.showUi(rs.message, rs.code)
        } else {
            apiStore.actSetUserList(rs.data)
        }
        setIsLoading(false)
    }

    const getUserActivity = async (userId) => {
        setActivityLoad(true)
        let rs = await dataService.getUserActivity({ userId })
        if (rs.code !== 0) {
            apiStore.showUi(rs.message, rs.code)
        } else {
            apiStore.actSetActivity(rs.data)
        }
        setActivityLoad(false)
    }

    useEffect(() => {
        getUserList()
        if (Object.keys(selectedUserData).length) {
            getUserActivity(selectedUserData.id)
        }
    }, [selectedUserData])

    const handleSelectUser = (event, data) => {
        setSelectedUserData(data)
    }

    const handleAddUser = async newUser => {
        setIsLoading(true)
        let rs = await dataService.createUser(newUser)
        if (rs.code === 0) apiStore.actInsertUser(rs.data)
        apiStore.showUi(rs.message, rs.code)
        setIsLoading(false)
    }

    const handleUpdateUser = async newUser => {
        setIsLoading(true)
        let rs = await dataService.updateUser(newUser);
        if (rs.code === 0) apiStore.actUpdateUser(newUser)
        apiStore.showUi(rs.message, rs.code)
        setIsLoading(false)
    }

    const handleDeleteUser = async user => {
        setIsLoading(true)
        let rs = await dataService.deleteUser({ userId: user.id });
        if (rs.code === 0) apiStore.actDeleteUser(user)
        apiStore.showUi(rs.message, rs.code)
        setIsLoading(false)
    }

    let editable;
    if (user.role === 1) {
        editable = {
            onRowAdd: newData =>
                new Promise(async resolve => {
                    await handleAddUser(newData)
                    resolve()
                }),
            onRowUpdate: (newData, oldData) =>
                new Promise(async resolve => {
                    await handleUpdateUser(newData)
                    resolve()
                }),
            onRowDelete: oldData =>
                new Promise(async resolve => {
                    await handleDeleteUser(oldData)
                    resolve()
                }),
        }
    }
    if (user.role === 2) {
        editable = {
            onRowAdd: newData =>
                new Promise(async resolve => {
                    await handleAddUser(newData)
                    resolve()
                }),
        }
    }


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
        <div>
            <Grid container spacing={3}>
                <Grid item xs={12} md={12} lg={7}>
                    <Typography variant="h6" style={{ fontWeight: 540, fontStyle: "italic" }} >
                        USER INFORMATION
                    </Typography>
                    <Paper style={utils.isMobile() ? { height: "auto" } : {}} className="paper-wrapper" elevation={6}>
                        <UserDetail {...props} user={Object.keys(selectedUserData).length ? selectedUserData : user} />
                    </Paper>
                </Grid>
                <Grid item xs={12} md={12} lg={5}>
                    <Typography variant="h6" style={{ fontWeight: 540, fontStyle: "italic" }} >
                        USER ACTIVITY
                    </Typography>
                    <Paper style={{ overflowY: 'scroll' }} className="paper-wrapper" elevation={6}>
                        <UserActivity activityLoad={activityLoad} {...props} data={Object.keys(selectedUserData).length ? activity : []} />
                    </Paper>
                </Grid>
            </Grid>

            <div style={{ marginTop: 40 }}>
                <Typography variant="h6" style={{ fontWeight: 540, fontStyle: "italic" }} >
                    USER LIST
                </Typography>
                <MaterialTable
                    style={{
                        boxShadow: "0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)",
                        borderRadius: 4,
                        padding: "8px 24px"
                    }}
                    elevation={6}
                    icons={tableIcons}
                    title=""
                    options={options}
                    exportButton={true}
                    onChangePage={toggleTableLoad}
                    isLoading={isLoading}
                    columns={columns}
                    data={userList}
                    selection={true}
                    onChangeRowsPerPage={toggleTableLoad}
                    onSearchChange={toggleTableLoad}
                    onRowClick={user.role === 1 && handleSelectUser}
                    editable={editable}

                />

            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        userList: state.userReducer.userList,
        activity: state.userReducer.activity
    }
}
export default connect(mapStateToProps)(UserView);