import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/pages/login'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: {
        path: "/login"
      }
    },
    {
      path: '/login',
      name: 'login',
      component: login,
      meta: { title: '登录' },
    },
    {
      path: '/',
      component: resolve => require(['../components/common/Home.vue'], resolve),
      meta: { title: 'home' },
      children: [
        {
          path: '/4G_encoder',
          name: '4G_encoder',
          component: resolve => require(['../components/pages/4G_encoder.vue'], resolve),
          meta: { title: '4g编码器' }
        },
        {
          path: '/userList',
          name: 'userList',
          component: resolve => require(['../components/pages/user/userList.vue'], resolve),
          meta: { title: '用户列表' }
        },
        {
          path: '/userInfo',
          name: 'userInfo',
          component: resolve => require(['../components/pages/user/userInfo.vue'], resolve),
          meta: { title: '用户信息' }
        },

        {
          path: '/firmwareUpdate',
          name: 'firmwareUpdate',
          component: resolve => require(['../components/pages/firmwareUpdate.vue'], resolve),
          meta: { title: '固件升级' }
        },
        {
          path: '/dispatchMana',
          name: 'dispatchMana',
          component: resolve => require(['../components/pages/configMana/dispatchMana.vue'], resolve),
          meta: { title: '配置派发管理' }
        },
        {
          path: '/uploadMana',
          name: 'uploadMana',
          component: resolve => require(['../components/pages/configMana/uploadMana.vue'], resolve),
          meta: { title: '配置上传管理' }
        }
      ]
    }
  ]
})
