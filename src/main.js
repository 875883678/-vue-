import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

// 引入公共样式
import './styles/base.less'
import './styles/iconfont.css'

// lib-flexible是阿里开源的一个库，自动给不同屏幕设置html的fontSize
import 'lib-flexible'

// 引入公共组件
import HmHeader from './components/HmHeader.vue'
import HmLogo from './components/HmLogo.vue'
import HmButton from './components/HmButton.vue'
import HmPost from './components/HmPost.vue'

// 注册全局组件
Vue.component('hm-header', HmHeader)
Vue.component('hm-logo', HmLogo)
Vue.component('hm-button', HmButton)
Vue.component('hm-post', HmPost)

// 按需引入组件
import {
  Field,
  Toast,
  Cell,
  CellGroup,
  Dialog,
  RadioGroup,
  Radio,
  Uploader,
  List,
  Tab,
  Tabs,
  PullRefresh,
  Sticky,
} from 'vant'

// 输入框组件
Vue.use(Field)
// 提示框组件
Vue.use(Toast)
// 单元格列表组件
Vue.use(Cell)
// 列表组件外盒子
Vue.use(CellGroup)
// 弹出框组件
Vue.use(Dialog)
// 单选框组件
Vue.use(RadioGroup)
Vue.use(Radio)
// 上传文件组件
Vue.use(Uploader)
// 列表组件(分页器)
Vue.use(List)
// tab栏组件
Vue.use(Tab)
Vue.use(Tabs)
// 下拉刷新组件
Vue.use(PullRefresh)
// 粘性布局组件
Vue.use(Sticky)

// 注册全局过滤器
// 引入moment模块
import moment from 'moment'
Vue.filter('date', (val, format = 'YYYY-MM-DD') => {
  return moment(val).format(format)
})

// 处理axios
import axios from 'axios'
// 再axios挂载至vue原型之前，修改默认的基地址设置
axios.defaults.baseURL = 'http://localhost:3000'
// 把 axios 挂载到 Vue 原型上，那么每一个vue实例(vue组件)里面就可以直接使用不用再一一引入
Vue.prototype.$axios = axios

// 请求拦截器
// 拦截所有的axios请求 实际上是一种代码优化
// axios.get(url,config)
axios.interceptors.request.use(config => {
  let token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = token
  }
  return config
})

// 响应拦截器
axios.interceptors.response.use(res => {
  // 响应拦截器一般用在token失效的场景
  const { statusCode, message } = res.data
  if (statusCode === 401 && message === '用户信息登录失败') {
    // 删除本地失效的token和id
    localStorage.removeItem('token')
    localStorage.removeItem('user_id')
    // 跳转至登录界面
    router.push('/login')
  }
  return res
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
