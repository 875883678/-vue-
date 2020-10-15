<template>
  <div class="hm-header">
    <div class="mg">
      <div class="left">
        <i class="iconfont iconjiantou2" @click="$router.back()"></i>
      </div>
      <div class="center">
        <slot></slot>
      </div>
      <div class="right"></div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
.hm-header {
  height: 40px;
  .mg {
    position: fixed;
    width: 100%;
    z-index: 999;
    height: 40px;
    background-color: #f4f4f4;
    border-bottom: 1px solid #ccc;
    display: flex;
    text-align: center;
    align-items: center;

    .left,
    .right {
      width: 30px;
    }
    .center {
      flex: 1;
      font-size: 16px;
    }
  }
}
</style>
