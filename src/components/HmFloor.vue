<template>
  <div>
    <hm-floor
      :count="count - 1"
      v-if="parent.parent"
      :parent="parent.parent"
    ></hm-floor>
    <div class="hm-floor" :class="{ topborder: count === 1 }">
      <div class="top">
        <div class="left">{{ count }}楼 {{ parent.user.nickname }}</div>
        <div class="center">
          {{ parent.create_date | date('YYYY-MM-DD hh:mm:ss') }}
        </div>
        <div class="right">回复</div>
      </div>
      <div class="content">
        {{ parent.content }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['parent', 'count'],
  name: 'hm-floor',
}
</script>

<style lang="less" scoped>
.hm-floor {
  border: 2px solid #000;
  border-top: none;
  padding: 8px;
  background-color: #ddd;
  .top {
    display: flex;
    margin-bottom: 10px;
    align-items: center;

    .center {
      flex: 1;
      color: #999;
      margin-left: 10px;
    }
    .right {
      margin-right: 20px;
    }
  }
}
.topborder {
  border-top: 2px solid #000;
}
</style>
