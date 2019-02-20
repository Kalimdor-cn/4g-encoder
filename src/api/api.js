import axios from "./http"

/**
 * 此文件用于配置接口服务地址
 */
let apiUrl = "/api"
let url = ''
export default {
    login: params => axios.get(url + '/static/mock/login.json'),
    getEncoderList: params => axios.get(url + '/static/mock/encoderList.json'),
    getLeftMenu: params => axios.get(apiUrl + '/json/sys/get_menu.json' + params),
    getFactoryModule: params => axios.get(url + '/static/mock/factoryModule.json'),
    getUserList: params => axios.get(url + '/static/mock/userList.json' + params)
}