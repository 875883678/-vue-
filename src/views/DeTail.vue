<template>
  <div>
    <!-- 头部 -->
    <div class="header">
      <div class="left">
        <i class="iconfont iconjiantou2" @click="$router.back()"></i>
      </div>
      <div class="center">
        <i class="iconfont iconnew"></i>
      </div>
      <div class="right">
        <div v-if="detail.has_follow" class="follow" @click="unFollow">
          已关注
        </div>
        <div v-else class="follow" @click="follow">关注</div>
      </div>
    </div>
    <div class="container">
      <!-- 标题和日期 -->
      <div class="title_head">
        <div class="title">{{ detail.title }}</div>
        <span>{{ detail.user.nickname }}</span>
        <span>{{ detail.user.create_date | date }}</span>
      </div>
      <!-- 内容、文本 -->
      <div v-if="detail.type === 1" v-html="detail.content"></div>
      <video v-else :src="detail.content" controls></video>
      <!-- 点赞 -->
      <div class="bottom">
        <div class="like" :class="{ active: detail.has_like }" @click="like">
          <i class="iconfont icondianzan"></i>
          <span> {{ detail.like_length }}</span>
        </div>
      </div>
    </div>
    <!-- 评论 -->
    <div class="comments">
      <hm-comments
        v-for="comment in commentsList"
        :key="comment.id"
        :comment="comment"
      ></hm-comments>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      detail: {
        user: {},
      }, // 详情页的信息
      commentsList: [], // 评论列表
    }
  },
  created() {
    // console.log('动态路由匹配', this.$route)
    this.getDetail()
    this.getCommentsList()
  },
  methods: {
    // 获取数据
    async getDetail() {
      let id = this.$route.params.id
      let res = await this.$axios.get(`/post/${id}`)
      console.log('文章详情', res.data.data)
      this.detail = res.data.data
    },
    // 关注
    async follow() {
      // 判断
      let token = localStorage.getItem('token')
      if (!token) {
        this.$toast.fail('请先登录')
        this.$router.push({
          name: 'login',
          params: {
            back: true,
          },
        })
        return // 结束 什么也不做
      }
      let res = await this.$axios.get(`/user_follows/${this.detail.user.id}`)
      console.log('关注用户', res.data)
      // 提示
      this.$toast.success(res.data.message)
      // 渲染
      this.getDetail()
    },
    // 取关
    async unFollow() {
      let res = await this.$axios.get(`/user_unfollow/${this.detail.user.id}`)
      // 提示
      this.$toast.success(res.data.message)
      // 渲染
      this.getDetail()
    },
    // 点赞
    async like() {
      //判断
      let token = localStorage.getItem('token')
      if (!token) {
        // 提示
        this.$toast.fail('请先登录')
        // 跳转
        this.$router.push({
          name: 'login',
          params: {
            back: true,
          },
        })
        return // 结束
      }
      let res = await this.$axios.get(`/post_like/${this.detail.id}`)
      // console.log(res.data)
      // 提示
      this.$toast.success(res.data.message)
      // 渲染
      this.getDetail()
    },
    // 发送请求获取评论列表
    async getCommentsList() {
      let res = await this.$axios.get(`/post_comment/${this.$route.params.id}`)
      console.log('评论列表', res.data.data)
      this.commentsList = res.data.data
    },
  },
}
</script>

<style lang="less" scoped>
.header {
  height: 50px;
  border-bottom: 2px solid #ccc;
  display: flex;
  align-items: center;
  .left {
    width: 40px;
    text-align: center;
    i {
      font-size: 20px;
    }
  }
  .center {
    flex: 1;
    i {
      font-size: 50px;
    }
  }
  .right {
    text-align: center;
    margin-right: 30px;
    .follow {
      border: 2px solid #ccc;
      width: 60px;
      border-radius: 30px;
      font-size: 12px;
    }
  }
}

.container {
  margin: 20px;

  .title_head {
    margin-bottom: 10px;
    .title {
      font-size: 14px;
      font-weight: 700;
      margin-bottom: 40px;
    }
    span {
      margin-right: 20px;
      color: #999;
    }
  }
  /deep/ img {
    width: 100%;
  }
  video {
    width: 100%;
  }
  .bottom {
    display: flex;
    justify-content: flex-end;
    margin: 20px 0;
    .like {
      border: 1px solid #000;
      width: 80px;
      height: 30px;
      border-radius: 15px;
      text-align: center;
      line-height: 30px;
      span {
        margin-left: 5px;
      }
    }
    .active {
      border: 1px solid #f00;
      color: red;
    }
  }
}
</style>
