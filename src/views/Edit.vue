<template>
  <div class="edit">
    <hm-header>编辑资料</hm-header>
    <div class="head">
      <img :src="$axios.defaults.baseURL + info.head_img" alt="" />
      <van-uploader
        class="uploader"
        :before-read="beforeRead"
        :after-read="afterRead"
      />
    </div>
    <van-cell-group>
      <van-cell
        title="昵称"
        :value="info.nickname"
        is-link
        @click="showNickname"
      />
      <van-cell title="密码" value="********" is-link />
      <van-cell
        title="性别"
        :value="info.gender == 1 ? '男' : '女'"
        is-link
        @click="showGender"
      />
    </van-cell-group>
    <!-- 修改昵称的弹窗 -->
    <!-- dialog里的事件  confirm  点击确认按钮时触发 -->
    <van-dialog
      @confirm="confirmNickname"
      v-model="isShowNickname"
      title="修改昵称"
      show-cancel-button
    >
      <van-field v-model="nickname" placeholder="" />
    </van-dialog>

    <!-- 修改性别的弹窗 -->
    <van-dialog
      v-model="isShowGender"
      title="修改性别"
      show-cancel-button
      @confirm="confirmGender"
    >
      <van-radio-group v-model="radio">
        <van-cell-group>
          <van-cell title="男" clickable @click="radio = 1">
            <template #right-icon>
              <van-radio :name="1" />
            </template>
          </van-cell>
          <van-cell title="女" clickable @click="radio = 0">
            <template #right-icon>
              <van-radio :name="0" />
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </van-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      info: {}, // 请求的后台数据对象
      isShowNickname: false, // 修改昵称的弹窗
      nickname: '', // field输入框
      isShowGender: false, // 是否展示修改性别的弹窗
      radio: 1,
    }
  },
  created() {
    this.getInfo()
  },
  methods: {
    // 封装一个渲染页面的函数
    async getInfo() {
      let user_id = localStorage.getItem('user_id')
      let res = await this.$axios.get(`/user/${user_id}`)
      // console.log(res)
      const { statusCode, data, message } = res.data
      if (statusCode === 200) {
        this.info = data
      } else {
        this.$toast.fail(message)
      }
    },
    // 点击cell显示修改昵称的弹窗1
    showNickname() {
      // 显示弹窗
      this.isShowNickname = true
      // 回显数据
      this.nickname = this.info.nickname
    },
    // 点击确认按钮时触发
    confirmNickname() {
      // 判断数据是否修改
      if (this.nickname === this.info.nickname) {
        // console.log(111)
        return
      }
      this.fz_editUser({ nickname: this.nickname })
      // 昵称修改了 发送请求
      // let user_id = localStorage.getItem('user_id')
      // this.$axios
      //   .post(`/user_update/${user_id}`, { nickname: this.nickname })
      //   .then(res => {
      //     // console.log(res)
      //     // 展示新数据
      //     this.getInfo()
      //     // 提示
      //     this.$toast.success('修改成功')
      //   })
    },
    // 点击弹出修改性别弹窗
    showGender() {
      // 弹出
      this.isShowGender = true
      // 回显数据
      this.radio = this.info.gender
    },
    // 修改性别
    confirmGender() {
      //判断数据是否发生改变
      if (this.radio === this.info.gender) {
        return
      }
      this.fz_editUser({ gender: this.radio })
      // let user_id = localStorage.getItem('user_id')
      // this.$axios
      //   .post(`/user_update/${user_id}`, { gender: this.radio })
      //   .then(res => {
      //     // 渲染
      //     this.getInfo()
      //     // 提示
      //     this.$toast.success('修改成功')
      //   })
    },
    // 修改昵称和性别的代码有重复 建议封装
    async fz_editUser(data) {
      let user_id = localStorage.getItem('user_id')
      let res = await this.$axios.post(`/user_update/${user_id}`, data)

      // 渲染
      this.getInfo()
      // 提示
      this.$toast.success('修改成功')
    },
    // 图片读取前的回调函数 对上传图片进行限制
    beforeRead(data) {
      // console.log(data)
      // 判断 大于5kb的图片禁止上传
      // if (data.size / 1024 > 500) {
      //   this.$toast.fail('图片过大')
      //   return false
      // }
      // if (data.type !== 'image/png') {
      //   this.$toast.fail('文件格式不支持')
      //   return false
      // }
      return true
    },
    // 图片上传完成后触发的回调函数
    async afterRead(data) {
      // console.log(data.file)
      // 通过formData上传图片 返回图片的url值
      let formData = new FormData()
      formData.append('file', data.file)

      // 发送请求上传图片 渲染页面
      let res = await this.$axios.post('/upload', formData)
      // 渲染页面
      this.fz_editUser({
        head_img: res.data.data.url,
      })
    },
  },
}
</script>

<style lang="less" scoped>
.edit {
  .head {
    height: 100px;
    margin-top: 20px;
    text-align: center;
    position: relative;

    img {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      object-fit: cover;
    }
    .uploader {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      opacity: 0;
    }
  }
}
</style>
