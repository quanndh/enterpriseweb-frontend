import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faBook } from '@fortawesome/free-solid-svg-icons'

const getShortName = name => {
    let words = name.split(" ")
    let shortName = words.map(w => {
        return w[0].toUpperCase()
    })
    return shortName.join('')
}

const ClassCard = props => {
    let { classDetail } = props
    return (
        <React.Fragment>
            <div className="card" >
                <div className="additional">
                    <div className="user-card">
                        {
                            classDetail.tutor.avatar ? <Avatar className="center" src={classDetail.tutor.avatar} style={{ width: 110, height: 110 }} />
                                : <Avatar className="center" style={{ width: 110, height: 110 }}>{getShortName(classDetail.tutor.fullName)}</Avatar>

                        }
                    </div>
                    <div className="more-info">
                        <h1>{classDetail.tutor.fullName}</h1>
                        <div className="coords">
                            <span>Email</span>
                            <span>{classDetail.tutor.email}</span>
                        </div>
                        <div className="coords">
                            <span>Contact</span>
                            <span>{classDetail.tutor.phone}</span>
                        </div>
                        <div className="stats">
                            <div>
                                <div className="title">Students</div>
                                <div className="value">{classDetail.students.length}</div>
                                <FontAwesomeIcon icon={faUsers} />
                            </div>
                            <div>
                                <div className="title">Articles</div>
                                <div className="value">{classDetail.articles.length}</div>
                                <FontAwesomeIcon icon={faBook} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="general">
                    <h1>{classDetail.title}</h1>
                    <p>{classDetail.desc}</p>
                    <span className="more">Mouse over the card for more info</span>
                </div>
            </div>
        </React.Fragment >

    )
}

export default ClassCard;