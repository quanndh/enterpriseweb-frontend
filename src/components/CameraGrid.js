import React, { Component } from 'react'
import MediaHandler from './MediaHandler'
import apiStore from '../services/apiStore';
import Peer from 'simple-peer';
import io from '../services/socket/index';
import isEqual from 'lodash/isEqual';
import dataService from '../network/dataService';
import { connect } from 'react-redux';

class CameraGrid extends Component {
    constructor(props) {
        super(props)
        this.state = {
            peers: []
        }
        this.initiator = false;
        this.peer = undefined;
        this.mediaHandler = new MediaHandler();
        this.peers = []
    }

    async componentDidMount() {
        let rs = await dataService.getPeers({ meetingId: this.props.meetingId })
        this.peers = rs.data
        io.socket.on('calling', event => {
            console.log(event, 222)
            console.log(this.initiator)
            if (Number(event.data.meetingId) === Number(this.props.meetingId)) {
                this.peers = event.data.peers;
                for (let i = 0; i < this.peers.length; i++) {
                    if (!isEqual(this.peer, this.peers[i].data) && this.initiator) {
                        this.peer.signal(this.peers[i].data)
                    }
                }
                this.peer.signal(this.peers[0].data)
            }
        })
        this.mediaHandler.getPermissions()
            .then(stream => {
                let myVideo = document.createElement('video')
                document.getElementById('video-container').appendChild(myVideo)
                myVideo.srcObject = stream;
                myVideo.play()
                this.initiator = this.peers.length === 0 ? true : false;
                console.log(this.initiator)
                this.peer = new Peer({
                    initiator: this.initiator,
                    trickle: false,
                    stream
                })

                let initiatorData = JSON.parse(localStorage.getItem('initiatorData'))
                if (!this.initiator && initiatorData) {
                    this.peer.signal(initiatorData)
                }

                this.peer.on('signal', data => {
                    if (this.initiator) {
                        localStorage.setItem('initiatorData', JSON.stringify(data))
                        // apiStore.actSetInitiator(data)
                    }
                    io.socket.request({
                        url: '/api/calling/join',
                        data: {
                            data,
                            meetingId: this.props.meetingId
                        },
                        headers: {
                            'Authorization': `Bearer ${apiStore.getToken()}`
                        }
                    }, (resData, jwres) => {
                        if (Number(resData.data.meetingId) === Number(this.props.meetingId)) {
                            console.log(222)
                            this.peers = resData.data.peers;
                        }
                    })
                })

                this.peer.on('stream', stream => {
                    console.log(111)
                    let video = document.createElement('video')
                    document.getElementById('video-container').appendChild(video)
                    video.srcObject = stream;
                    video.play()
                })
            })
    }

    render() {
        return (
            <div id="video-container" className="video-container">

            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        initiatorData: state.meetingReducer.initiatorData
    }
}

export default connect(mapStateToProps)(CameraGrid)