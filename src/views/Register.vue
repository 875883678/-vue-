<template>
  <div>
    <hm-header>注册</hm-header>
    <hm-logo></hm-logo>

    <van-field
      v-model="username"
      required
      label="用户名"
      placeholder="请输入用户名"
      :error-message="usernameErrMsg"
      clearable
      @input="checkUsername"
      @clear="clearUsername"
    />
    <van-field
      v-model="nickname"
      required
      label="昵称"
      placeholder="请输入昵称"
      :error-message="nicknameErrMsg"
      clearable
      @input="checkNickname"
      @clear="clearNickname"
    />
    <van-field
      v-model="password"
      required
      label="密码"
      placeholder="请输入密码"
      :error-message="passwordErrMsg"
      clearable
      @input="checkPassword"
      @clear="clearPassword"
    />
    <hm-button @click="startRegister">注册</hm-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      nickname: '',
      password: '',
      usernameErrMsg: '',
      passwordErrMsg: '',
      nicknameErrMsg: '',
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

    // 点击清除按钮时触发 清除用户名错误信息
    clearUsername() {
      this.usernameErrMsg = ''
    },

    // 校验昵称
    checkNickname() {
      const reg = /^[\u4e00-\u9fa5]{3,7}$/
      if (reg.test(this.nickname)) {
        this.nicknameErrMsg = ''
      } else {
        this.nicknameErrMsg = '昵称格式错误'
      }
    },
    // 清除昵称错误信息
    clearNickname() {
      this.nicknameErrMsg = ''
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
    clearPassword() {
      this.passwordErrMsg = ''
    },

    async startRegister() {
      // 用户密码昵称不为空并且通过校验后
      if (
        this.username !== '' &&
        this.nickname !== '' &&
        this.password !== '' &&
        this.usernameErrMsg == '' &&
        this.nicknameErrMsg == '' &&
        this.passwordErrMsg == ''
      ) {
        // console.log('注册成功')
        let res = await this.$axios.post('/register', {
          username: this.username,
          nickname: this.nickname,
          password: this.password,
        })

        // console.log(res)
        const { statusCode, message } = res.data
        if (statusCode == 200) {
          // 提示
          this.$toast.success(message)
          // 跳转
          // 方法1： 跳转并传值 pq组合 缺点： 暴露参数
          // this.$router.push({
          //   path: '/login',
          //   query: {
          //     username: this.username,
          //     password: this.password,
          //   },
          //  })
          // 方法2： np组合
          this.$router.push({
            name: 'login',
            params: {
              // 需要传递的参数
              username: this.username,
              password: this.password,
            },
          })
        } else {
          this.$toast.fail(message)
        }
      } else {
        // console.log('注册失败')
        this.$toast.fail('校验失败')
      }
    },
  },
}
</script>

<style></style>
