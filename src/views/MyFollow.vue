<template>
  <div class="myfollow">
    <hm-header>我的关注</hm-header>
    <div class="item" v-for="item in list" :key="item.id">
      <div class="left">
        <!-- 设置图片地址以及服务器基地址 -->
        <img :src="$axios.defaults.baseURL + item.head_img" alt="" />
      </div>
      <div class="center">
        <div class="name">{{ item.nickname }}</div>
        <div class="date">{{ item.create_date | date }}</div>
      </div>
      <div class="right" @click="cancelFollow(item.id)">取消关注</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [], // 关注的用户列表
    }
  },
  created() {
    this.getFollowList()
    // this.followUser() // 关注用户
  },
  methods: {
    // 封装一个获取关注用户列表的函数
    async getFollowList() {
      let res = await this.$axios.get('/user_follows')
      console.log(res.data)
      const { statusCode, data, message } = res.data
      if (statusCode === 200) {
        this.list = data
      } else {
        this.$toast.fail(message)
      }
    },
    // 关注用户
    async followUser() {
      let res = await this.$axios.get('/user_follows/36')
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast.success(message)
        this.getFollowList()
      } else {
        this.$toast.fail(message)
      }
    },

    // 取关用户
    async cancelFollow(id) {
      try {
        await this.$dialog.confirm({
          title: '温馨提示',
          message: '您确定取关该用户？',
        })
        let res = await this.$axios.get(`/user_unfollow/${id}`)
        const { statusCode, message } = res.data
        if (statusCode === 200) {
          this.$toast.success(message)
          this.getFollowList()
        } else {
          this.$toast.fail(message)
        }
      } catch {}
    },
  },
}
</script>

<style lang="less" scoped>
.myfollow {
  .item {
    height: 100px;
    border-bottom: 1px solid #ccc;
    display: flex;
    align-items: center;

    .left {
      img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        object-fit: cover;
        margin: 0 20px;
        margin-right: 10px;
      }
    }
    .center {
      flex: 1;
      margin-top: -10px;
      .name {
        font-size: 12px;
        line-height: 25px;
      }
      .date {
        color: #999;
        font-size: 10px;
      }
    }
    .right {
      margin-right: 20px;
      line-height: 15px;
      background-color: #ddd;
      padding: 10px 20px;
      border-radius: 20px;
      font-size: 12px;
    }
  }
}
</style>
