import React, { useState, useEffect } from 'react';
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Avatar from '@material-ui/core/Avatar';
import dataService from '../network/dataService';
import apiStore from '../services/apiStore';

const getShortName = name => {
    let words = name.split(" ")
    let shortName = words.map(w => {
        return w[0].toUpperCase()
    })
    return shortName.join('')
}

const MultiInput = props => {
    let { onSelectStudent, triggerAdd } = props;

    const [isLoading, setIsLoading] = useState(false)
    const [searchString, setSearchString] = useState("")
    const [data, setData] = useState([])
    const [tempList, setTempList] = useState([])
    const [studentList, setStudentList] = useState([])

    useEffect(() => {
        if (triggerAdd) {
            setStudentList([])
            setData([])
        }
    }, [triggerAdd])

    const handleSearchStudent = async (e) => {
        await setSearchString(e.target.value)
        setTimeout(async () => {
            setIsLoading(true)
            let rs = await dataService.getListStudent({ searchString: searchString })
            if (rs.code !== 0) apiStore.showUi(rs.message, rs.code)
            else {
                rs.data = rs.data.filter(u => !tempList.includes(u.id))
                setData(rs.data)
            }

            setIsLoading(false)
        }, 300)
    }

    const handleChangeInput = (e, value) => {
        setSearchString("")
        onSelectStudent(value)
        setStudentList(value)
        value = value.map(v => { return v.id })
        setTempList(value)
    }


    return (
        <Autocomplete
            multiple
            value={studentList}
            onChange={handleChangeInput}
            inputValue={searchString}
            loading={isLoading}
            id="Student"
            options={data}
            getOptionLabel={option => option.fullName}
            renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                    <Chip
                        avatar={option.avatar ? <Avatar alt="avatar" src={option.avatar} /> : <Avatar size="large" >{option ? getShortName(option.fullName) : ""}</Avatar>}
                        label={option.fullName}
                        {...getTagProps({ index })}
                    />
                ))
            }
            style={{ width: '95%' }}
            renderInput={params => (
                <TextField {...params} onChange={handleSearchStudent} label="Student name" variant="outlined" placeholder="Student name" />
            )}
        />
    )
}

export default MultiInput;