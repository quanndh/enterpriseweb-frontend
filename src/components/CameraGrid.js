import React, { useEffect, useState } from 'react'
import apiStore from '../services/apiStore';
import dataService from '../network/dataService';
import { connect } from 'react-redux';
import Video from 'twilio-video';
import UserVideo from './UserVideo';
import utils from '../services/utils/index';

// const TWILIO_API_KEY_SID = "SK5ea45dffac80dbcda1a4395e84b054b5";
// const TWILIO_API_KEY_SECRET = "LFPczzz16Oyh3Y4PXYwSJmHXDZCRxYxb"
// const TWILIO_ACCOUNT_SID = "AC2f37b1a0f1ddcae0c00948a630c30a5c";

const CameraGrid = (props) => {

    const [room, setRoom] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [token, setToken] = useState("")
    const [hasRemote, setHasRemote] = useState(false)

    useEffect(() => {
        const getVideoToken = async (cb) => {
            let rs = await dataService.getVideoToken({ meetingId: props.meetingId });
            setToken(rs.data)
            cb(rs.data)
        }

        getVideoToken(token => {
            try {
                if (token) {
                    Video.connect(token, {
                        name: props.meetingId
                    }).then(room => {
                        if (room) {
                            setRoom(room);
                            room.on('participantConnected', participantConnected);
                            room.on('participantDisconnected', participantDisconnected);
                            room.participants.forEach(participantConnected);
                        }
                    });
                }
            } catch (error) {
                console.log(123)
            }


        })

        const participantConnected = participant => {
            setHasRemote(true)
            setParticipants(prevParticipants => [...prevParticipants, participant]);
        };
        const participantDisconnected = participant => {
            setParticipants(prevParticipants =>
                prevParticipants.filter(p => p !== participant)
            );
        };

        return () => {
            setRoom(currentRoom => {
                if (currentRoom && currentRoom.localParticipant.state === 'connected') {
                    currentRoom.localParticipant.tracks.forEach(function (trackPublication) {
                        trackPublication.track.stop();
                    });
                    currentRoom.disconnect();
                    return null;
                } else {
                    return currentRoom;
                }
            }, [props.meetingId, token]);
        };
    }, [props.meetingId]);

    const handleRemoteOff = () => {
        setHasRemote(false)
    }

    const remoteParticipants = participants.map(participant => (
        <UserVideo key={participant.sid} handleRemoteOff={handleRemoteOff} participant={participant} />
    ));

    console.log(hasRemote)

    return (
        <div
            id="video-container"
            className="video-container"
            style={{ height: "100%", overflow: utils.isMobile() ? "none" : 'hidden', width: '100%' }}
        >
            <div className="remote">
                {hasRemote ? remoteParticipants : null}
            </div>
            <div className="my-video" style={{ width: utils.isMobile() ? 150 : 400 }}>
                {room ? (
                    <UserVideo
                        key={room.localParticipant.sid}
                        participant={room.localParticipant}
                        user={props.user}
                        handleRemoteOff={handleRemoteOff}
                    />
                ) : (
                        ''
                    )}
            </div>
        </div>
    )
    // }
}

const mapStateToProps = state => {
    return {
        initiatorData: state.meetingReducer.initiatorData
    }
}

export default connect(mapStateToProps)(CameraGrid)