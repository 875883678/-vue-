import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import User from '../views/User.vue'
import Edit from '../views/Edit.vue'
import MyFollow from '../views/MyFollow.vue'
import MyComments from '../views/MyComments.vue'
import MyStar from '../views/MyStar.vue'
import Home from '../views/Home.vue'
import TabsEdit from '../views/TabsEdit.vue'
import DeTail from '../views/DeTail.vue'
import Search from '../views/Search.vue'
import { Toast } from 'vant'

Vue.use(VueRouter)

// 注册的全局路由实例
const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/home' },
    // 不暴露参数的处理情况 给route添加name
    { path: '/login', name: 'login', component: Login },
    { path: '/register', component: Register },
    { path: '/user', component: User },
    { path: '/edit', component: Edit },
    { path: '/myfollow', component: MyFollow },
    { path: '/mycomments', component: MyComments },
    { path: '/mystar', component: MyStar },
    { path: '/home', component: Home },
    { path: '/tabsedit', component: TabsEdit },
    { path: '/detail/:id', component: DeTail },
    { path: '/search', component: Search },
  ],
})

// 全局前置守卫
// 1.to : 你要去哪里  路由对象
// 2.from ： 你从哪里来 路由对象
// 3.next ： 是否允许进入
//   next() 允许进入
//   next(false) 不允许进入
//   next('/login') 允许进入login

router.beforeEach((to, from, next) => {
  // console.log('碰到打野了', from.path, to.path)
  // 前置守卫功能 如果想去到user页面  已登录 =》 放行  未登录 =》 去登陆
  // if (to.path === '/user') {
  //   // 获取token 如果有token 就放行
  //   let token = localStorage.getItem('token')
  //   if (token) {
  //     next()
  //   } else {
  //     Toast('请先进行登录')
  //     next('/login')
  //   }
  // } else {
  //   // 放行
  //   next()
  // }

  // 随着项目的进行  许多页面都需要验证token才能放行
  const authPath = ['/user', '/edit', '/myfollow', 'mycomments', '/mystar']
  // 如果想去往这些页面  需要验证token
  if (authPath.includes(to.path)) {
    let token = localStorage.getItem('token')
    if (token) {
      next()
    } else {
      Toast('请先进行登录')
      next('/login')
    }
  } else {
    next()
  }
})

// 跳转报错的问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default router
