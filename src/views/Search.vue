<template>
  <div>
    <!-- 头部 -->
    <div class="header">
      <div class="left">
        <i class="iconfont iconjiantou2" @click="$router.back()"></i>
      </div>
      <div class="center">
        <i class="iconfont iconsearch"></i>
        <input
          @input="search_recommend"
          v-model="keyword"
          @keyup.enter="search"
          type="text"
          placeholder="请输入搜索的内容"
        />
      </div>
      <div class="right" @click="search">搜索</div>
    </div>
    <!-- 推荐搜索 -->
    <div class="recommend" v-if="recommendList.length > 0">
      <div class="item" v-for="item in recommendList" :key="item.id">
        {{ item.title }}
      </div>
    </div>
    <!-- 列表 -->
    <div class="content" v-else-if="postList.length > 0">
      <hm-post v-for="post in postList" :key="post.id" :post="post"></hm-post>
    </div>
    <!-- 历史 -->
    <div class="history" v-else>
      <!-- 历史记录 -->
      <div class="title">历史记录</div>
      <div class="list">
        <div
          class="item"
          v-for="h in historyList"
          :key="h"
          @click="historyTo(h)"
        >
          {{ h }}
        </div>
      </div>

      <!-- 热门搜索 -->
      <div class="title">热门搜索</div>
      <div class="list">
        <div class="item" @click="hotTo(hot)" v-for="hot in hotList" :key="hot">
          {{ hot }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data() {
    return {
      // 输入的关键字
      keyword: '',
      // 文章列表
      postList: [],
      // 历史记录
      historyList: [],
      // 热门搜索
      hotList: ['关晓彤', '情火', '7'],
      // 推荐搜索
      recommendList: [],
    }
  },
  created() {
    // 使用防抖动来制约input的请求次数
    this.search_recommend = _.debounce(this.search_recommend, 1000)
    // 先从本地种获取
    let historyList = JSON.parse(localStorage.getItem('history_list'))
    if (historyList) {
      this.historyList = historyList
    }
  },
  watch: {
    // 监听关键词  当关键词为空的时候 清空列表数据
    keyword(newVal) {
      if (!newVal) {
        this.postList = []
        this.recommendList = []
      }
    },
  },
  methods: {
    // 搜索文章
    async search() {
      // 判断 内容为空时的处理
      if (this.keyword.trim() === '') return

      // 把输入内容 添加到历史记录里面
      this.historyList.unshift(this.keyword)

      // 存入本地之前 去重避免搜索数据重复出现
      this.historyList = [...new Set(this.historyList)]
      // 存入本地
      localStorage.setItem('history_list', JSON.stringify(this.historyList))

      let res = await this.$axios.get('/post_search', {
        params: {
          keyword: this.keyword,
        },
      })
      console.log('搜索文章', res.data)
      if (res.data.statusCode === 200) {
        this.postList = res.data.data
      }
    },

    // 点击历史跳转
    historyTo(h) {
      this.keyword = h
      // 搜索关键字
      this.search()
    },
    // 热门搜索
    hotTo(hot) {
      this.keyword = hot
      this.search()
    },

    // 监听input输入框的数据变化
    async search_recommend() {
      console.log('完成了防抖动操作')
      if (this.keyword.trim() === '') return
      // 发送请求获取
      let res = await this.$axios.get('/post_search_recommend', {
        params: {
          keyword: this.keyword,
        },
      })
      // console.log(this.keyword, res.data.data)
      if (res.data.statusCode === 200) {
        this.recommendList = res.data.data
      }
    },
  },
}
</script>

<style lang="less" scoped>
.header {
  height: 40px;
  background-color: #eee;
  display: flex;
  align-items: center;

  .left,
  .right {
    text-align: center;
    font-size: 12px;
  }
  .left {
    margin-left: 10px;
  }

  .center {
    flex: 1;
    position: relative;
    input {
      border: 1px solid #ccc;
      height: 30px;
      width: 85%;
      border-radius: 15px;
      margin-left: 30px;
      text-indent: 3em;
      font-size: 10px;
      // color: #ccc;
    }
    i {
      position: absolute;
      left: 38px;
      top: 8px;
      color: #bbb;
    }
  }
  .right {
    margin-right: 30px;
  }
}

.history {
  padding: 10px 10px;

  .title {
    font-weight: 700;
    font-size: 14px;
    margin: 10px 0;
  }
  .list {
    display: flex;
    flex-wrap: wrap;

    .item {
      padding: 8px;
      background-color: #ddd;
      margin: 5px;
    }
  }
}

.recommend {
  padding: 20px;

  .item {
    border-bottom: 1px solid #ccc;
    height: 40px;
    line-height: 40px;
  }
}
</style>
