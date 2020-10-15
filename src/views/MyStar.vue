<template>
  <div class="mystar">
    <hm-header>我的收藏</hm-header>
    <hm-post v-for="item in postList" :item="item" :key="item.id"></hm-post>
  </div>
</template>

<script>
export default {
  data() {
    return {
      postList: [],
    }
  },
  async created() {
    let res = await this.$axios.get('/user_star')
    console.log('收藏页', res.data)
    this.postList = res.data.data
  },
}
</script>

<style></style>
