class MediaHandler {
    getPermissions() {
        return new Promise((resolve, reject) => {
            navigator.mediaDevices.getUserMedia({ audio: true, video: true })
                .then(stream => resolve(stream))
                .catch(err => {
                    throw new Error('Unable to fetch string ' + err)
                })
        })
    }
}

export default MediaHandler