let state = {
    loginInfo: JSON.parse(localStorage.getItem('loginInfo')) || {},
    unreadMessageNum: localStorage.getItem('unreadMessageNum') || 0
}
export default state