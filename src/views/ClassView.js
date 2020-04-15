import React, { useState, useEffect } from 'react'
import Typography from '@material-ui/core/Typography';
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
import MaterialTable from 'material-table';
import dataService from '../network/dataService';
import apiStore from '../services/apiStore';
import { connect } from 'react-redux'
import Paper from '@material-ui/core/Paper';
import ClassDetail from '../components/ClassDetail';

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

const ClassView = props => {
    let { classList, user } = props;

    let columns = [
        { title: 'Pair Title', field: 'title' },
        { title: 'Description', field: 'desc' },
        { title: 'Tutor', field: 'tutor.fullName', readonly: true },
        { title: 'Student', field: 'students[0].fullName', readonly: true },
        { title: 'Status', field: 'isActive', lookup: { 0: 'Inactive', 1: 'Active' } }
    ]
    let options = {
        exportButton: true,
        emptyRowsWhenPaging: true,
        exportFileName: "Class_List",
        headerStyle: { fontSize: 18, fontWeight: 600 },
        searchFieldAlignment: 'left',
        draggable: true,
    }

    let editable;
    if (user.role === 1) {
        editable = {
            onRowAdd: newData =>
                new Promise(async resolve => {
                    await handleAddClass(newData)
                    resolve()
                }),
            onRowUpdate: (newData, oldData) =>
                new Promise(async resolve => {
                    await handleUpdateClass(newData)
                    resolve()
                }),
        }
    }
    if (user.role === 2) {
        editable = {
            onRowAdd: newData =>
                new Promise(async resolve => {
                    await handleAddClass(newData)
                    resolve()
                }),
            onRowUpdate: (newData, oldData) =>
                new Promise(async resolve => {
                    await handleUpdateClass(newData)
                    resolve()
                }),
        }
    }

    const [isLoading, setIsLoading] = useState(false)

    const [selectedClassData, setSelectedClassData] = useState({})

    const getClassList = async () => {
        setIsLoading(true)
        let rs = await dataService.getClassList({})
        if (rs.code === 0) {
            apiStore.actSetListClass(rs.data)
        } else {
            apiStore.showUi(rs.message, rs.code)
        }
        setIsLoading(false)
    }
    useEffect(() => {
        getClassList()
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

    const handleAddClass = async (newClass) => {
        setIsLoading(true)
        let rs = await dataService.createClass(newClass);
        if (rs.code === 0) apiStore.actAddClass(rs.data)
        apiStore.showUi(rs.message, rs.code)
        setIsLoading(false)
    }

    const handleUpdateClass = async newClass => {
        setIsLoading(true)
        let rs = await dataService.changeClassState({ classId: newClass.id, title: newClass.title, isActive: newClass.isActive, desc: newClass.desc })
        if (rs.code === 0) apiStore.actUpdateClass(rs.data)
        apiStore.showUi(rs.message, rs.code)
        setIsLoading(false)

    }

    const handleSelectClass = (event, data) => {
        let tableHeight = event.target.parentNode.parentNode.parentNode.clientHeight
        setSelectedClassData(data)
        setTimeout(() => {
            window.scrollTo({ top: tableHeight + 100, behavior: 'smooth' })
        }, 150)
    }

    return (
        <React.Fragment>
            <div>
                <Typography variant="h6" style={{ fontWeight: 540, fontStyle: "italic" }}>
                    LIST OF PAIRS
                </Typography>
                {
                    classList ? (
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
                            data={classList}
                            selection={true}
                            onChangeRowsPerPage={toggleTableLoad}
                            onSearchChange={toggleTableLoad}
                            onRowClick={handleSelectClass}
                            editable={editable}
                        />
                    ) : ""
                }

            </div>

            {
                Object.keys(selectedClassData).length > 0 && (
                    <div style={{ marginTop: 40 }}>
                        <Typography variant="h6" style={{ fontWeight: 540, fontStyle: "italic", marginBottom: 8 }} >
                            PAIR DETAIL
                         </Typography>

                        <Paper style={{ padding: "24px 32px", width: "100%" }} elevation={6}>
                            <ClassDetail {...props} classDetail={selectedClassData} />
                        </Paper>
                    </div>
                )
            }

        </React.Fragment>


    )
}

const mapStateToProps = state => {
    return {
        classList: state.classReducer.classList
    }
}

export default connect(mapStateToProps)(ClassView);