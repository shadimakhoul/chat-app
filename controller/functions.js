const moment = require("moment");
const axios = require('axios');
// const BASE_URL = "http://localhost:8000"
const BASE_URL = "https://new.instafluencer.com"

// Functions Section
module.exports.getAuth = async (token) => {
    const res = await axios.get(`${BASE_URL}/api/v1/users/profile`, {
        headers:{
            "Authorization": `Bearer ${token}`
        }
    })
    return res;
}

module.exports.getCurrenUtcTime = (...date) => {
    if ( date.length ){
        let time = new Date(date);
        var timeUtc = moment(time).utc().format('YYYY-MM-DD HH:mm:ss')
    }else{
        var  timeUtc = moment().utc().format('YYYY-MM-DD HH:mm:ss')
    }
    return timeUtc;
}

module.exports.checkString = (str) => {
    // Email regex
    var emailRegex = /\S*\b[\w.%-]+@[-.\w]+\.[A-Za-z]{2,4}\b\S*/g
    // Phone number regex
    let phoneNumberRegex = /(?:\+?\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/

    if (phoneNumberRegex.test(str) || emailRegex.test(str)) {
        return false
    } else {
        return true
    }
}