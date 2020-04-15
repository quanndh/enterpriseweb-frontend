import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import utils from '../services/utils/index';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import dataService from '../network/dataService';
import apiStore from '../services/apiStore';
import MultiInput from './MultiInput';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import Tooltip from '@material-ui/core/Tooltip';
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import LinearProgress from '@material-ui/core/LinearProgress';

const getShortName = name => {
    let words = name.split(" ")
    let shortName = words.map(w => {
        return w[0].toUpperCase()
    })
    return shortName.join('')
}

const PerStudent = props => {
    let { student, removeStudent } = props;

    const handleRemoveStudent = id => {
        removeStudent(id)
    }

    return (
        <div style={{ display: 'flex', margin: 10, alignItems: 'center', width: utils.isMobile() ? '100%' : "30%", justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {student && student.avatar ? <Avatar alt="avatar" src={student.avatar} style={{ fontSize: utils.isMobile() ? 44 : 50, marginRight: 10 }} /> : <Avatar size="large" style={{ width: utils.isMobile() ? 44 : 50, height: utils.isMobile() ? 44 : 50, marginRight: 10 }} >{student ? getShortName(student.fullName) : ""}</Avatar>}
                {student && student.fullName}
            </div>
            <DeleteOutlineIcon onClick={() => { handleRemoveStudent(student.id) }} />
        </div>
    )
}

const ClassDetail = props => {
    let { classDetail } = props;

    const [selectedStudents, setSelectedStudents] = useState([]);
    const [triggerAdd, setTriggerAdd] = useState(false);
    const [isLoading, setIsLoading] = useState(false)

    const handleRemoveStudentFromClass = async (id) => {
        setIsLoading(true)
        let rs = await dataService.removeStudentFromClass({ tutorId: classDetail.id, studentId: id })
        setIsLoading(false)
        apiStore.showUi(rs.message, rs.code)
        if (rs.code === 0) {
            apiStore.actRemoveStudentFromClass({ classId: classDetail.id, studentId: id })
        }
    }

    let studentList = (classDetail && classDetail.students) ? classDetail.students.map(s => {
        return <PerStudent key={s.id} removeStudent={handleRemoveStudentFromClass} student={s} />
    }) : ""

    const handleSelectStudent = value => {
        setSelectedStudents(value)
    }

    const handleAddStudent = async () => {
        setIsLoading(true)
        let students = selectedStudents.map(s => { return s.id })
        let rs = await dataService.assignToClass({ tutorId: classDetail.id, students })
        setTriggerAdd(true)
        setSelectedStudents([])
        setIsLoading(false)
        apiStore.showUi(rs.message, rs.code)
        apiStore.actAddStudentToClass({ classId: classDetail.id, students: selectedStudents })
    }

    return (
        <React.Fragment>
            {isLoading && <LinearProgress color="primary" />}

            <Grid container spacing={utils.isMobile() ? 1 : 8}>
                <Grid item md={6} style={utils.isMobile() ? { width: "100%" } : { display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                    <div>
                        <div style={{ marginBottom: 20 }}>
                            <Typography variant={utils.isMobile() ? 'subtitle1' : 'h6'} style={{ color: "grey", fontWeight: 540, fontStyle: "italic" }} >
                                TUTOR
                        </Typography>
                            <Typography variant={utils.isMobile() ? 'subtitle1' : 'h6'} >
                                {classDetail.fullName}
                            </Typography>
                        </div>
                        <div style={{ marginBottom: 20 }}>
                            <Typography variant={utils.isMobile() ? 'subtitle1' : 'h6'} style={{ color: "grey", fontWeight: 540, fontStyle: "italic" }} >
                                EMAIL
                        </Typography>
                            <Typography variant={utils.isMobile() ? 'subtitle1' : 'h6'} >
                                {classDetail.email}
                            </Typography>
                        </div>
                    </div>
                    <div>
                        <div style={{ marginBottom: 20 }}>
                            <Typography variant={utils.isMobile() ? 'subtitle1' : 'h6'} style={{ color: "grey", fontWeight: 540, fontStyle: "italic" }} >
                                PHONE
                        </Typography>
                            <Typography variant={utils.isMobile() ? 'subtitle1' : 'h6'} >
                                {classDetail.phone}
                            </Typography>
                        </div>
                        <div style={{ marginBottom: 20 }}>
                            <Typography variant={utils.isMobile() ? 'subtitle1' : 'h6'} style={{ color: "grey", fontWeight: 540, fontStyle: "italic" }} >
                                TOTAL MESSAGE
                        </Typography>
                            <Typography variant={utils.isMobile() ? 'subtitle1' : 'h6'} >
                                {classDetail.messages}
                            </Typography>
                        </div>
                    </div>
                    <div>
                        <div style={{ marginBottom: 20 }}>
                            <Typography variant={utils.isMobile() ? 'subtitle1' : 'h6'} style={{ color: "grey", fontWeight: 540, fontStyle: "italic" }} >
                                TOTAL MEETING
                        </Typography>
                            <Typography variant={utils.isMobile() ? 'subtitle1' : 'h6'} >
                                {classDetail.meetings}
                            </Typography>
                        </div>
                    </div>

                </Grid>
                <Grid item md={6} style={utils.isMobile() ? { marginTop: 20, width: '100%' } : {}}>
                    {
                        classDetail && classDetail.students.length < 10 ? (
                            <div style={{ width: '100%', marginBottom: 20 }}>
                                <Typography variant={utils.isMobile() ? 'subtitle1' : 'h6'} style={{ color: "grey", fontWeight: 540, fontStyle: "italic" }} >
                                    ASSIGN STUDENT
                                </Typography>
                                <MultiInput triggerAdd={triggerAdd} onSelectStudent={handleSelectStudent} style={{ width: '100%' }} />
                                <Button onClick={handleAddStudent} variant="contained" color="primary" style={{ marginTop: 8, color: 'white' }}>
                                    Assign
                                </Button>
                            </div>
                        ) : null
                    }

                    <div style={{ marginBottom: 20 }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                            {studentList}
                        </div>
                    </div>
                </Grid>
            </Grid >
        </React.Fragment>

    )
}

export default ClassDetail;