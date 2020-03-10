const onGeoSuccess = (position) => {
    return [position.coords.latitude, position.coords.longtitude]
}
const onGeoError = (err) => {
    return [undefined, undefined]
}
const utils = {
    isMobile: () => {
        let check = false;
        if (navigator.userAgent.match(/Android/i)
            || navigator.userAgent.match(/webOS/i)
            || navigator.userAgent.match(/iPhone/i)
            || navigator.userAgent.match(/iPad/i)
            || navigator.userAgent.match(/iPod/i)
            || navigator.userAgent.match(/BlackBerry/i)
            || navigator.userAgent.match(/Windows Phone/i)) check = true;
        return check;
    },
    isTablet: () => {
        const userAgent = navigator.userAgent.toLowerCase();
        const isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(userAgent);
        return isTablet;
    },

    getLatLong: () => {
        let geolocation = navigator.geolocation;
        if (!geolocation) return [undefined, undefined];
        let options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };
        geolocation.getCurrentPosition(onGeoSuccess, onGeoError, options);
    }

}

export default utils;