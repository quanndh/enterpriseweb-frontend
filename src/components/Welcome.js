import React, { useState, useEffect } from 'react';
import usePosition from '../services/hooks/usePosition';
import axios from 'axios'
import moment from 'moment'

const Welcome = props => {

    const { latitude, longitude } = usePosition();
    const [weather, setWeather] = useState({})

    let { user } = props;
    let time;

    if (6 <= moment().hour() && moment().hour() <= 12) {
        time = "buổi sáng"
    }
    else if (12 < moment().hour() && moment().hour() < 19) {
        time = "buổi chiều"
    } else time = "buổi tối"

    let weatherApiKey = "700b07d550ba955390f2859e03135585"
    let weatherUrl = `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/${weatherApiKey}/${latitude},${longitude}?exclude=daily,hourly&lang=vi&units=si`

    useEffect(() => {
        const getWeather = async () => {
            if (latitude && longitude) {
                let rs = await axios.get(weatherUrl)
                if (rs.data.currently)
                    setWeather(rs.data.currently)
                else {
                    getWeather()
                }
            }
        }
        getWeather()
    }, [latitude, longitude, weatherUrl])

    return (
        <div className="welcome-wrap" style={{}}>
            <main>
                <section className="greeting">
                    <div className="username">Chào {time} {user.fullName}</div>
                    <div className="date">{moment().locale('vi').format("dddd, MMMM Do YYYY, h:mm:ss a")}</div>
                </section>
                <div className="current">
                    <div className="temp">{Math.floor(weather.temperature ? weather.temperature : 20)}<span>°c</span></div>
                    <div className="weather">{weather.summary && weather.summary.toUpperCase()}</div>
                    <div className="hi-low">Độ ẩm: {weather.humidity ? weather.humidity * 100 : 70}%</div>
                </div>
            </main>
        </div>
    )
}

export default Welcome;