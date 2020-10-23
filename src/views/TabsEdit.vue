<template>
  <div>
    <hm-header>栏目管理</hm-header>
    <!-- 删除频道 -->

    <div class="title">点击删除一个频道</div>
    <div class="list">
      <div class="item" v-for="tab in activeTabs" :key="tab.id">
        <div @click="del(tab.id)">{{ tab.name }}</div>
      </div>
    </div>

    <!-- 添加频道 -->
    <div class="title">点击添加一个频道</div>
    <div class="list">
      <div class="item" v-for="tab in deactiveTabs" :key="tab.id">
        <div @click="add(tab.id)">{{ tab.name }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeTabs: [], // 请求回来待分配的数据
      deactiveTabs: [], // 删除后数据陈列分组
    }
  },
  created() {
    this.getActiveTabs()
  },
  watch: {
    // 监听 上面的数组
    // 数组(重写7个方法)和对象(deep)
    activeTabs(newVal) {
      console.log(newVal)
      // 保存
      localStorage.setItem('activeTabs', JSON.stringify(newVal))
      localStorage.setItem('deactiveTabs', JSON.stringify(this.deactiveTabs))
    },
  },
  methods: {
    // 获取 栏目列表
    async getActiveTabs() {
      // 从本地存储中获取
      let activeTabs = JSON.parse(localStorage.getItem('activeTabs'))
      let deactiveTabs = JSON.parse(localStorage.getItem('deactiveTabs'))
      // 如果本地存储中有数据
      if (activeTabs && deactiveTabs) {
        this.activeTabs = activeTabs
        this.deactiveTabs = deactiveTabs
        return
      }

      let res = await this.$axios.get('/category')
      console.log(res.data.data)
      if (res.data.statusCode === 200) {
        this.activeTabs = res.data.data
      }
    },

    // 点击删除
    // 思路： 上面删除  底下添加
    del(id) {
      // console.log('师妃暄')
      // 判断 频道不能低于3
      if (this.activeTabs.length < 5) {
        return
      }
      // 找到需要删除的频道的
      let res = this.activeTabs.find(v => v.id === id)
      // 下面添加
      this.deactiveTabs.unshift(res)
      // 上面删除
      this.activeTabs = this.activeTabs.filter(v => v.id !== id)
    },

    // 点击添加
    // 思路： 与删除相反
    add(id) {
      // 寻找
      let res = this.deactiveTabs.find(v => v.id === id)
      // 添加
      this.activeTabs.unshift(res)
      // 删除
      this.deactiveTabs = this.deactiveTabs.filter(v => v.id !== id)
    },
  },
}
</script>

<style lang="less" scoped>
.title {
  font-size: 18px;
  font-weight: 700;
  // margin-bottom: 10px;
  padding: 20px;
}

.list {
  margin-left: 10px;
  display: flex;
  flex-wrap: wrap;
  // align-items: center;

  .item {
    width: 20%;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    // background-color: pink;

    div {
      width: 80%;
      height: 80%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #ddd;
    }
  }
}
</style>
