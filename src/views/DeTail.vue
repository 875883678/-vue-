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
      <div class="title_head" v-if="detail.user">
        <div class="title">{{ detail.title }}</div>
        <span>{{ detail.user.nickname }}</span>
        <span>{{ detail.create_date | date }}</span>
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
    <div class="box" ref="box"></div>
    <!-- 评论 -->
    <div class="comments">
      <hm-comments
        v-for="comment in commentsList"
        :key="comment.id"
        :comment="comment"
      ></hm-comments>
    </div>
    <!-- 底部 -->
    <div class="footer" v-show="!isShow">
      <div class="left">
        <input
          v-model="content"
          type="text"
          placeholder="写跟帖"
          @focus="getFocus"
        />
      </div>
      <div class="center">
        <van-icon name="chat-o" :badge="detail.comment_length" />
      </div>
      <div class="right">
        <van-icon
          name="star-o"
          :class="{ active: detail.has_star }"
          @click="starPost"
        />
      </div>
    </div>
    <!-- textarea -->
    <div class="textarea" v-show="isShow">
      <div class="left">
        <textarea
          v-model="content"
          :placeholder="replyId ? '回复 ： ' + replyName : '请输入内容'"
          @blur="lostBlur"
          ref="textarea"
        ></textarea>
      </div>
      <div class="send" @touchstart="sendComment">
        发送
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      detail: {}, // 详情页的信息
      commentsList: [], // 评论列表
      isShow: false, // 判断显示与否
      replyId: '', // 用户id
      replyName: '', // 用户昵称
      content: '', // 文本域内容
    }
  },
  created() {
    // console.log('动态路由匹配', this.$route)
    this.getDetail()
    this.getCommentsList()
    // 注册事件
    this.$bus.$on('reply', (replyId, replyName) => {
      console.log('等待下一步指示')
      // 接收参数
      this.replyId = replyId
      this.replyName = replyName

      // 唤出textarea
      this.getFocus()
    })
  },
  methods: {
    // 获取数据
    async getDetail() {
      let id = this.$route.params.id
      let res = await this.$axios.get(`/post/${id}`)
      // console.log('文章详情', res.data.data)
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
      // console.log('关注用户', res.data)
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
      // console.log('评论列表', res.data.data)
      this.commentsList = res.data.data
    },
    // input聚焦事件
    getFocus() {
      this.isShow = !this.isShow
      this.$nextTick(() => {
        this.$refs.textarea && this.$refs.textarea.focus()
      })
    },
    // textarea失焦事件
    lostBlur() {
      this.isShow = !this.isShow
      // 判断  如果输入框里没有内容  那么在失去焦点的时候需要清空id和name
      if (!this.content) {
        this.replyId = ''
        this.replyName = ''
      }
    },
    // 发表评论
    async sendComment() {
      // console.log('我是你爸爸')
      let res = await this.$axios.post(
        `/post_comment/${this.$route.params.id}`,
        {
          content: this.content,
          parent_id: this.replyId,
        }
      )
      // console.log('发表评论', res.data)
      if (res.data.statusCode === 200) {
        // 提示
        this.$toast.success(res.data.message)
        // 渲染
        this.getCommentsList()
        // 清空
        this.content = ''
        this.replyId = ''
        this.replyName = ''
        // 滚动至最新评论处
        this.$refs.box.scrollIntoView()
      }
    },
    // 点击收藏
    async starPost() {
      let res = await this.$axios.get(`/post_star/${this.$route.params.id}`)
      if (res.data.statusCode === 200) {
        // 提示
        this.$toast.success(res.data.message)
        // 渲染
        this.getDetail()
      }
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
.comments {
  padding-bottom: 40px;
}
.footer {
  height: 40px;
  background-color: #fff;
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  align-items: center;

  .left {
    flex: 1;
    margin-left: 20px;
    input {
      width: 180px;
      height: 25px;
      border: none;
      border-radius: 13px;
      background-color: #ddd;
      text-indent: 1em;
      font-size: 10px;
    }
  }

  .center,
  .right {
    width: 70px;
    font-size: 18px;
    text-align: center;
    margin-top: 10px;
  }
}
.textarea {
  border-top: 2px solid #000;
  height: 80px;
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: #fff;
  display: flex;
  align-items: center;
  .left {
    flex: 1;
    textarea {
      height: 60px;
      width: 75%;
      margin-left: 10px;
      resize: none;
      border: none;
      background-color: #ddd;
      border-radius: 8px;
      text-indent: 1em;
      padding-top: 5px;
    }
  }
  .send {
    position: absolute;
    right: 27px;
    bottom: 10px;
    color: #fff;
    width: 40px;
    height: 25px;
    background-color: red;
    text-align: center;
    line-height: 25px;
    border-radius: 5px;
  }
}
.active {
  color: #f11;
}
</style>
