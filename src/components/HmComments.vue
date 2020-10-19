<template>
  <div class="hm-comments">
    <div class="items">
      <!-- 头部 -->
      <div class="head">
        <div class="left">
          <img :src="$axios.defaults.baseURL + comment.user.head_img" alt="" />
        </div>
        <div class="center">
          <div class="nickname">{{ comment.user.nickname }}</div>
          <span>{{ comment.create_date | date }}</span>
        </div>
        <div class="right">回复</div>
      </div>
      <!-- 楼层 -->
      <hm-floor
        :count="getCount(0, comment)"
        v-if="comment.parent"
        :parent="comment.parent"
      ></hm-floor>
      <!-- 内容 -->
      <div class="content">{{ comment.content }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['comment'],
  methods: {
    // 递归函数求parent的数量
    getCount(num, parent) {
      if (parent.parent) {
        return this.getCount(num + 1, parent.parent)
      } else {
        return num
      }
    },
  },
}
</script>

<style lang="less" scoped>
.hm-comments {
  border-top: 3px solid #ccc;
  .items {
    padding: 20px;
    border-bottom: 1px solid #ccc;

    .head {
      display: flex;
      align-items: center;
      .left {
        margin-right: 10px;
        img {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          object-fit: cover;
        }
      }
      .center {
        flex: 1;
        line-height: 25px;
        .nickname {
          font-size: 12px;
          font-weight: 700;
        }
        span {
          font-size: 10px;
          color: #999;
        }
      }
      .right {
        width: 40px;
        font-size: 10px;
        color: #999;
      }
    }
  }
}
</style>
