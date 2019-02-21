<template>
  <div class="wrapper">
    <v-head></v-head>
    <v-sidebar></v-sidebar>
    <div class="content-box" :class="{'content-collapse':collapse}">
      <!-- <v-tags></v-tags> -->
      <div class="content">
        <transition name="fade" mode="out-in">
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import vHead from "./Header.vue";
import vSidebar from "./Sidebar.vue";
export default {
  data() {
    return {
      tagsList: [],
      collapse: false
    };
  },
  components: {
    vHead,
    vSidebar
  },
  created() {
    // bus.$on('collapse', msg => {
    //     this.collapse = msg;
    // })
    // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
    // bus.$on('tags', msg => {
    //     let arr = [];
    //     for(let i = 0, len = msg.length; i < len; i ++){
    //         msg[i].name && arr.push(msg[i].name);
    //     }
    //     this.tagsList = arr;
    // })
  }
};
</script>
<style lang="scss" scoped>
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.fade-leave,
.fade-enter-to {
  opacity: 1;
}
.fade-enter-active {
  transition: opacity 0.8s;
}
.fade-leave-active {
  transition: opacity 0.2s;
}
</style>
