import React, { useState, useEffect, useRef } from 'react';

const UserVideo = ({ participant, handleRemoteOff }) => {
    const [videoTracks, setVideoTracks] = useState([]);
    const [audioTracks, setAudioTracks] = useState([]);

    const videoRef = useRef();
    const audioRef = useRef();

    const trackpubsToTracks = trackMap => Array.from(trackMap.values())
        .map(publication => publication.track)
        .filter(track => track !== null);

    useEffect(() => {
        const trackSubscribed = track => {
            if (track.kind === 'video') {
                setVideoTracks(videoTracks => [...videoTracks, track]);
            } else {
                setAudioTracks(audioTracks => [...audioTracks, track]);
            }
        };

        const trackUnsubscribed = track => {
            if (track.kind === 'video') {
                setVideoTracks(videoTracks => videoTracks.filter(v => v !== track));
            } else {
                setAudioTracks(audioTracks => audioTracks.filter(a => a !== track));
            }
        };

        setVideoTracks(trackpubsToTracks(participant.videoTracks));
        setAudioTracks(trackpubsToTracks(participant.audioTracks));

        participant.on('trackSubscribed', trackSubscribed);
        participant.on('trackUnsubscribed', trackUnsubscribed);

        window.addEventListener('beforeunload', async (e) => {
            setVideoTracks([]);
            setAudioTracks([]);
            participant.removeAllListeners();
        })

        return () => {
            setVideoTracks([]);
            setAudioTracks([]);
            participant.removeAllListeners();
        };
    }, [participant]);



    useEffect(() => {
        const videoTrack = videoTracks[0];
        if (videoTrack) {
            videoTrack.attach(videoRef.current);
            return () => {
                videoTrack.detach();
            };
        }
    }, [videoTracks]);

    return (
        <div >
            <video ref={videoRef} autoPlay={true} style={{ width: '100%', height: "100%" }} />
            <audio ref={audioRef} autoPlay={true} muted={true} />
        </div>
    );
};

export default UserVideo;