import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Slide from '@material-ui/core/Slide';
import { Alert, AlertTitle } from '@material-ui/lab';

function TransitionLeft(props) {
    return <Slide {...props} direction="left" />;
}

const MessageUI = props => {

    let { message, code, open } = props;

    return (
        <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            key="top, right"
            open={open}
            TransitionComponent={TransitionLeft}
        >
            <Alert variant="filled" severity={code === 0 ? 'success' : 'error'}>
                <AlertTitle>{code === 0 ? 'Success' : 'Something went wrong'}</AlertTitle>
                {message}
            </Alert>
        </Snackbar>

    )
}

export default MessageUI;