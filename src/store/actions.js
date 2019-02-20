export default {
    setLoginInfo({ dispatch, commit }, data) {
        localStorage.setItem('loginInfo', JSON.stringify(data))
        commit('loginInfo', data)
    },
    changeUnreadMessageNum({ dispatch, commit }, data) {
        console.log(data)
        localStorage.setItem('setUnreadMessageNum', data)
        commit('setUnreadMessageNum', data)
    }
}