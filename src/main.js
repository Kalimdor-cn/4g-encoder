// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import elementUi from 'element-ui'
import "element-ui/lib/theme-chalk/index.css"
import Vuex from "vuex"
import store from "./store"
import api from "./api/api"

Vue.use(elementUi)
Vue.use(Vuex)

Vue.prototype.$axios = axios
Vue.prototype.$api = api

Vue.config.productionTip = false

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  next()
})


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
