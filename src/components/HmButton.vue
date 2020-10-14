<template>
  <div class="hm-button" @click="fn">
    <slot></slot>
  </div>
</template>

<script>
export default {
  methods: {
    fn() {
      this.$emit('click')
    },
  },
}
</script>

<style lang="less" scoped>
.hm-button {
  height: 50px;
  line-height: 50px;
  text-align: center;
  margin: 20px;
  font-size: 18px;
  background-color: red;
  border-radius: 25px;
  color: #fff;
}
</style>
