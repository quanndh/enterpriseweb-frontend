import React from 'react';
import { Link } from 'react-router-dom'

const NotFound = (props) => {
    let { user } = props;
    return (
        <div id="notfound">
            <div className="notfound">
                <div className="notfound-404">
                    <h1>Oops!</h1>
                    <h2>404 - The page you need does not exist</h2>
                </div>
                <Link to={user.role === 3 ? "/users/classes" : "/"} >Home page</Link>
            </div>
        </div >
    )
}

export default NotFound