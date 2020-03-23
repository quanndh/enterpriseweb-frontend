import React, { Component } from 'react'

class CameraGrid extends Component {
    constructor(props) {
        super(props)
        this.state = {
            hasMedia: false,
            otherUserId: null,
        }

    }

    componentDidMount() {

    }

    render() {
        return (
            <div className="video-container">
                <video className="my-video" ref={ref => this.myVideo = ref}>

                </video>
                <video className="user-video" ref={ref => this.userVideo = ref}>

                </video>

            </div>
        )
    }
}

export default CameraGrid