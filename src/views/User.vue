<template>
  <div class="user">
    <hm-header>个人中心</hm-header>
    <!-- 个人信息  -->
    <div class="info">
      <div class="left">
        <!-- 图片使用动态的axios基地址 -->
        <img :src="$axios.defaults.baseURL + info.head_img" alt />
      </div>
      <div class="center">
        <i v-if="info.gender === 1" class="iconfont iconxingbienan"></i>
        <i v-else class="iconfont iconxingbienv"></i>
        {{ info.nickname }}
        <div class="date">
          {{ info.create_date | date }}
        </div>
      </div>
    </div>
    <!-- 列表部分 -->
    <van-cell-group>
      <!-- is-link vant组件提供的方法  是否展示右侧箭头并开启点击反馈 -->
      <van-cell
        title="我的关注"
        is-link
        value="关注的用户"
        @click="$router.push('/myfollow')"
      />
      <van-cell
        title="我的跟帖"
        is-link
        value="跟帖/回复"
        @click="$router.push('/mycomments')"
      />
      <van-cell title="我的收藏" is-link value="文档/视频" />
      <van-cell title="设置" is-link @click="$router.push('/edit')" />
      <van-cell title="退出" is-link @click="logout" />
    </van-cell-group>
  </div>
</template>

<script>
export default {
  data() {
    return {
      info: {},
    }
  },

  // 获取用户详情
  async created() {
    // 获取本地存储中的token和id值
    let token = localStorage.getItem('token')
    let user_id = localStorage.getItem('user_id')

    let res = await this.$axios.get(`/user/${user_id}`)
    console.log('用户详情', res.data)
    const { statusCode, data, message } = res.data

    if (statusCode == 200) {
      this.info = data
    } else {
      this.$toast.fail(message)
    }
  },
  methods: {
    // 退出功能
    async logout() {
      // async await 中处理catch的方式  try catch
      try {
        await this.$dialog.confirm({
          title: '温馨提示',
          message: '您确认要退出账号吗？',
        })
        // 1.删除token
        localStorage.removeItem('token')
        // 2.提示
        this.$toast.success('退出成功')
        // 3.跳转
        this.$router.push('/login')
      } catch {}
    },
  },
}
</script>

<style lang="less" scoped>
.info {
  height: 100px;
  border-bottom: 2px solid #ccc;

  display: flex;
  padding: 0 20px;
  align-items: center;

  .left {
    img {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      object-fit: cover;
      // cover 等比例缩放 保证短边能够显示完整
      // contain 等比例缩放  保证长边能够显示完整
    }
  }
  .center {
    flex: 1;
    padding-left: 20px;
    font-size: 14px;
    line-height: 25px;
    .iconxingbienan {
      color: yellowgreen;
    }
    .iconxingbienv {
      color: pink;
    }
  }
}
</style>
