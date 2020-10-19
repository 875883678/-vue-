<template>
  <div>
    <hm-header>登录</hm-header>
    <hm-logo></hm-logo>

    <van-field
      v-model="username"
      required
      label="用户名"
      placeholder="请输入用户名"
      clearable
      :error-message="usernameErrMsg"
      @input="checkUsername"
      @clear="clearUsername"
    />
    <van-field
      v-model="password"
      required
      label="密码"
      placeholder="请输入密码"
      clearable
      :error-message="passwordErrMsg"
      @input="checkPassword"
      @clear="clearPassword"
    />
    <!-- 此处注册点击事件是不生效的 需要使用子传父 让子组件传递事件至父组件  然后再注册事件 -->
    <hm-button @click="startLogin">登录</hm-button>

    <div class="link">
      如果没有账号，点击
      <router-link to="/register">注册</router-link>
    </div>
  </div>
</template>

<script>
// 导入axios组件
export default {
  data() {
    return {
      username: '',
      password: '',
      usernameErrMsg: '',
      passwordErrMsg: '',
    }
  },
  created() {
    console.log(this.$route)
    // 方法1接收参数
    // const { username, password } = this.$route.query;
    // if (username && password) {
    //   (this.username = username), (this.password = password);
    // }

    // 方法2接收参数：
    const { username, password } = this.$route.params
    if ((username, password)) {
      ;(this.username = username), (this.password = password)
    }
  },
  methods: {
    // 校验用户名
    checkUsername() {
      const reg = /^1\d{3,5}$/
      if (reg.test(this.username)) {
        this.usernameErrMsg = ''
      } else {
        this.usernameErrMsg = '用户名格式错误'
      }
    },

    // 点击清除按钮时触发  清除用户名
    clearUsername() {
      this.usernameErrMsg = ''
    },

    // 校验密码
    checkPassword() {
      const reg = /^\d{3,12}$/
      if (reg.test(this.password)) {
        this.passwordErrMsg = ''
      } else {
        this.passwordErrMsg = '密码格式错误'
      }
    },

    // 点击清除按钮时触发  清除密码
    clearPassword() {
      this.passwordErrMsg = ''
    },

    // 点击登录按钮时触发
    async startLogin() {
      // 用户名或密码不为空并且通过校验后
      if (
        this.username !== '' &&
        this.password !== '' &&
        this.usernameErrMsg == '' &&
        this.passwordErrMsg == ''
      ) {
        // console.log('登录成功')
        // this.$toast('登录成功')
        let res = await this.$axios.post('/login', {
          username: this.username,
          password: this.password,
        })

        console.log(res)
        let { statusCode, message, data } = res.data

        if (statusCode == 200) {
          // 将token值存入本地存储 和 id
          localStorage.setItem('token', data.token)
          localStorage.setItem('user_id', data.user.id)

          // 提示
          this.$toast.success(message)

          // console.log(this.$route)
          if (this.$route.params.back) {
            this.$router.back()
          } else {
            // 跳转
            this.$router.push('/user')
          }
        } else {
          this.$toast.fail(message)
        }
      } else {
        // console.log('登录失败')
        // this.$toast('登录失败')
        this.$toast.loading('校验失败')
      }
    },
  },
}
</script>

<style lang="less" scoped>
.link {
  font-size: 12px;
  text-align: right;
  margin-right: 20px;
}
</style>
