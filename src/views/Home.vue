<template>
  <div>
    <div class="head">
      <div class="left">
        <i class="iconfont iconnew"></i>
      </div>
      <div class="center">
        <i class="iconfont iconsearch"></i>
        搜索新闻
      </div>
      <div class="right">
        <i class="iconfont iconwode "></i>
      </div>
    </div>
    <!-- tab栏 -->
    <!-- 下拉刷新组件 -->
    <van-pull-refresh v-model="isRefreshing" @refresh="onRefresh">
      <!-- list列表分页器 -->
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="我也是有底线的"
        @load="onLoad"
        :immediate-check="false"
        offset="50"
      >
        <van-tabs v-model="active" sticky>
          <van-tab :title="item.name" v-for="item in tabsList" :key="item.id">
            <hm-post
              v-for="(post, index) in postList"
              :key="index"
              :post="post"
            ></hm-post>
          </van-tab>
        </van-tabs>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 1, //  tab栏当前显示页面的索引
      tabsList: [], // tab栏列表
      postList: [], // 文章列表
      pageIndex: 1,
      pageSize: 5,
      loading: false, // 加载完成  可以进行下一次加载
      finished: false, // 数据是否加载完毕
      isRefreshing: false, // 是否正在下拉刷新中，为false 说明刷新完成的
    }
  },
  created() {
    this.getTabsList()
  },
  methods: {
    // 获取tab栏目列表
    async getTabsList() {
      let res = await this.$axios.get('/category')
      console.log('tab列表', res.data)
      this.tabsList = res.data.data

      // 请求文章列表
      this.getPostList(this.tabsList[this.active].id)
    },

    // 请求文章列表的函数
    async getPostList(id) {
      let res = await this.$axios.get('/post', {
        params: {
          category: id,
          pageIndex: this.pageIndex,
          pageSize: 5,
        },
      })
      // this.postList = res.data.data
      this.postList = [...this.postList, ...res.data.data]
      this.loading = false
      this.isRefreshing = false
      // 判断 当数据加载完毕
      if (res.data.data.length < this.pageSize) {
        this.finished = true
      }
      console.log('文章列表', this.postList)
    },

    // 触底触发
    onLoad() {
      this.pageIndex++
      this.getPostList(this.tabsList[this.active].id)
      console.log('否极泰来')
    },

    // 下拉刷新事件
    onRefresh() {
      console.log('人定胜天')

      // 处理原列表视图
      this.postList = []
      this.pageIndex = 1

      //  当列表页加载完成时 finished为true 需要在下拉刷新完成时 把finished改为false
      this.finished = false
      // 解决加载完成共下拉刷新自动触底的bug
      this.loading = true

      // 请求列表页
      this.getPostList(this.tabsList[this.active].id)
    },
  },
  watch: {
    // 监听tab栏切换时 active 的变化
    active(newActive) {
      //  切换时需要跳转到第一页
      this.pageIndex = 1
      // 处理之前tab栏的数据
      this.postList = []

      // 处理加载  加载完成后切换tab  finished状态为true  需要改成false
      // 为解决自动触底问题  限制loading
      this.finished = false
      this.loading = true

      this.getPostList(this.tabsList[newActive].id)
    },
  },
}
</script>

<style lang="less" scoped>
/deep/ .van-tabs__nav {
  background-color: #ddd;
}
.head {
  height: 50px;
  background-color: red;
  display: flex;
  align-items: center;
  text-align: center;
  .left {
    width: 60px;
    i {
      font-size: 40px;
      padding-left: 5px;
      color: #fff;
    }
  }
  .center {
    flex: 1;
    height: 30px;
    line-height: 28px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 15px;
    font-size: 12px;
    color: #fff;
    i {
      margin-right: 10px;
    }
  }
  .right {
    width: 55px;
    i {
      font-size: 20px;
      color: #fff;
    }
  }
}
</style>
