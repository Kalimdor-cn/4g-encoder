/**
 * http配置
 */
// 引入axios以及element ui中的loading和message组件
import axios from 'axios'
import { Loading, Message } from 'element-ui'
// 超时时间
axios.defaults.timeout = 300000
// axios.defaults.withCredentials = true
// http请求拦截器
var loadinginstace
axios.interceptors.request.use(config => {
    // element ui Loading方法
    // let sid = localStorage.getItem('sid')
    // if (sid) {
    //     config.headers.sid = sid
    // }
    // loadinginstace = Loading.service({ fullscreen: true })
    return config
}, error => {
    // loadinginstace.close()
    Message.error({
        message: '加载超时'
    })
    return Promise.reject(error)
})
// http响应拦截器
axios.interceptors.response.use(data => {// 响应成功关闭loading
    // loadinginstace.close()
    if (data.data.msg === 'ok' || data.data.result === 'ok') {
        return Promise.resolve(data)
    } else {
        return Promise.reject(data)
    }
}, error => {
    // loadinginstace.close()
    Message.error({
        message: '网络出错'
    })
    return Promise.reject(error)
})

export default axios