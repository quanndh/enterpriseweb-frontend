
import axios from 'axios'
import apiStore from '../services/apiStore'
import config from '../config';


const request = async (url, data, method) => {

    url = config.HOST + url
    let headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiStore.getToken()}`,

    }
    console.log("%c-----------" + method + "------------", 'color: green; font-size: 16px')
    console.log(url, data, headers)
    try {
        let response = await axios({
            headers,
            method,
            url,
            data
        });
        console.log("%c-----------RESPONSE-----------", 'color: red; font-size: 16px')
        console.log(response)
        if (!response.data.msg) response.data.msg = response.data.code === 0 ? "Mã hợp lệ" : "Mã không hợp lệ"

        if (response.status === 200) {
            return response.data
        }
        if (response.status === 401) {
            apiStore.logout();
        }

    } catch (error) {
        if (error.response) {
            if (error.response.data.code === 401) {
                apiStore.logout();
            }
            console.log(error.response.data)
        }
        return error.response.data;
    }

}


export default request;