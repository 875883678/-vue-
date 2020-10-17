<template>
  <div class="mycomments">
    <hm-header>我的跟帖</hm-header>
    <van-list
      finished-text="我是有底线的"
      :finished="finished"
      v-model="loading"
      @load="onLoad"
      :immediate-check="false"
    >
      <div class="item" v-for="item in list" :key="item.id">
        <div class="date">
          {{ item.create_date | date('YYYY-MM-DD hh:mm:ss') }}
        </div>
        <div class="parent" v-if="item.parent">
          <div class="parent-nickname">
            回复：{{ item.parent.user.nickname }}
          </div>
          <div class="parent-comment">{{ item.parent.content }}</div>
        </div>
        <div class="comment line2">{{ item.content }}</div>
        <div class="content">
          <div class="title line1">{{ item.post.title }}</div>
          <i class="iconfont iconjiantou1"></i>
        </div>
      </div>
    </van-list>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [], // 评论列表
      loading: false, // 上一次的加载
      pageIndex: 1, // 页码
      pageSize: 5, // 每页的条数
      finished: false, // 是否完成
    }
  },
  created() {
    this.getComments() // 获取评论列表
  },
  methods: {
    // 封装一个获取跟帖列表的函数
    async getComments() {
      let res = await this.$axios.get('/user_comments', {
        params: {
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
        },
      })
      console.log(res.data)
      if (res.data.statusCode === 200) {
        // this.$toast.success(message)
        // this.list = res.data.data
        // 加载页面的同时也需要保留之前的数据一同展示在页面中  故
        this.list = [...this.list, ...res.data.data]
        this.loading = false
        // 此时配合onload函数 页码一直自增 出现了死循环 判断
        if (res.data.data.length < this.pageSize) {
          this.finished = true
        }
      } else {
        this.$toast.fail('网络故障')
      }
    },
    // 滚动条与底部距离小于offset时触发
    onLoad() {
      console.log('触底反弹')
      this.pageIndex++
      this.getComments()
    },
  },
}
</script>

<style lang="less" scoped>
.item {
  border-bottom: 2px solid #ccc;
  padding: 0 20px 0 10px;
  .date {
    padding-top: 10px;
    font-size: 10px;
    color: #999;
  }
  .parent {
    height: 60px;
    background-color: #ddd;
    padding-left: 5px;
    margin-top: 5px;
    line-height: 20px;
    color: #999;
    &-nickname {
      padding-top: 5px;
      font-size: 10px;
    }
    &-comment {
      font-size: 12px;
      padding-top: 5px;
    }
  }
  .comment {
    line-height: 40px;
    font-size: 13px;
  }
  .content {
    display: flex;
    align-items: center;
    color: #999;
    margin-bottom: 5px;
    .title {
      flex: 1;
      font-size: 12px;
    }
  }
}
</style>
