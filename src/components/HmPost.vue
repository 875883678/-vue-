<template>
  <div class="hm-post">
    <!-- 视频 -->
    <div class="radio" v-if="post.type == 2">
      <div class="title line2">{{ post.title }}</div>
      <div class="picture">
        <div class="img">
          <img :src="fixedUrl(post.cover[0].url)" alt="" />
        </div>
        <div class="play">
          <i class="iconfont iconshipin"></i>
        </div>
      </div>
      <div class="bottom">
        <span class="nickname">{{ post.user.nickname }}</span>
        <span class="num"
          >{{
            post.comments ? post.comments.length : post.comment_length
          }}
          跟帖</span
        >
      </div>
    </div>
    <!-- 单张图片 -->
    <div class="lonely-img" v-else-if="post.cover.length < 3">
      <div class="left">
        <div class="title line2">
          {{ post.title }}
        </div>
        <div class="bottom">
          <span class="nickname">{{ post.user.nickname }}</span>
          <span class="num"
            >{{
              post.comments ? post.comments.length : post.comment_length
            }}
            跟帖</span
          >
        </div>
      </div>
      <div class="right">
        <img :src="fixedUrl(post.cover[0].url)" alt="" />
      </div>
    </div>
    <!-- 三张图片 -->
    <div class="three-img" v-else>
      <div class="title">{{ post.title }}</div>
      <div class="imgs">
        <img :src="fixedUrl(post.cover[0].url)" alt="" />
        <img :src="fixedUrl(post.cover[1].url)" alt="" />
        <img :src="fixedUrl(post.cover[2].url)" alt="" />
      </div>
      <div class="bottom">
        <span class="nickname">娱乐在线</span>
        <span class="num"
          >{{
            post.comments ? post.comments.length : post.comment_length
          }}
          跟帖</span
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['post'],
  methods: {
    // 处理不显示的图片
    fixedUrl(url) {
      if (url.startsWith('http')) {
        return url
      } else {
        return this.$axios.defaults.baseURL + url
      }
    },
  },
}
</script>

<style lang="less" scoped>
.bottom {
  color: #999;
  font-size: 10px;
  .nickname {
    margin-right: 5px;
  }
}

.radio {
  padding: 10px;
  border-bottom: 2px solid #ccc;
  .title {
    font-size: 14px;
  }
  .picture {
    position: relative;
    padding: 10px 0;

    img {
      width: 350px;
      height: 175px;
    }
    .play {
      width: 50px;
      height: 50px;
      background-color: rgba(0, 0, 0, 0.6);
      border-radius: 50%;
      object-fit: cover;
      text-align: center;
      line-height: 50px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);

      i {
        font-size: 30px;
        color: #fff;
      }
    }
  }
}

.lonely-img {
  padding: 10px;
  border-bottom: 2px solid #ccc;
  display: flex;

  .left {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .title {
      font-size: 14px;
    }
  }
  .right {
    img {
      width: 110px;
      height: 75px;
      object-fit: cover;
    }
  }
}

.three-img {
  padding: 10px;
  border-bottom: 2px solid #ccc;
  .title {
    font-size: 14px;
  }
  .imgs {
    display: flex;
    justify-content: space-between;
    padding: 5px 0;
    img {
      width: 110px;
      height: 75px;
      object-fit: cover;
    }
  }
}
</style>
