<template>
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
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
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
