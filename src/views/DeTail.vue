<template>
  <h1>否极泰来哦</h1>
</template>

<script>
export default {
  data() {
    return {
      detail: {}, // 详情页的信息
    }
  },
  created() {
    // console.log('动态路由匹配', this.$route.params.id)
    this.getDetail()
  },
  methods: {
    // 获取数据
    async getDetail() {
      let id = this.$route.params.id
      let res = await this.$axios.get(`/post/${id}`)
      console.log(res.data)
      this.detail = res.data.data
    },
  },
}
</script>

<style></style>
