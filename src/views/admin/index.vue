<template>
  <div class="admin">
    <div class="admin-header">
      <div class="admin-header-left">
        <img src="@/assets/logo.png" alt="" />
        <span>可信模拟测试管理页</span>
      </div>
      <div class="admin-header-title">管理中心</div>
      <div class="admin-header-right">用户信息</div>
    </div>
    <div class="admin-content">
      <el-menu
        :default-active="defaultNav"
        class="admin-content-left"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        :router="true"
      >
        <el-menu-item
          :index="item.path"
          v-for="item in navData"
          :key="item.name"
        >
          <i :class="item.meta.icon"></i>
          <span slot="title">{{ item.meta.title }}</span>
        </el-menu-item>
      </el-menu>
      <div class="admin-content-right">
        <div class="admin-content-right-head common-card">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item
              v-for="item in $route.matched"
              :key="item.name"
              >{{ item.meta.title }}</el-breadcrumb-item
            >
          </el-breadcrumb>
        </div>
        <div class="admin-content-right-content">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      navData: [],
      defaultNav: "",
    };
  },
  watch: {
    $route: {
      handler: function (to) {
        this.defaultNav = to.name;
      },
      immediate: true,
    },
  },
  created() {
    const routes = this.$router.options.routes;
    this.navData = routes.find((v) => v.name === "admin").children;
    console.log(this.navData);
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
  },
};
</script>

<style lang="scss" scoped>
.admin {
  height: 100%;
  display: flex;
  flex-direction: column;
  &-header {
    height: 48px;
    background: #fff;
    box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &-title {
      position: absolute;
      width: fit-content;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      font-weight: bold;
      font-size: 18px;
    }
    &-left {
      color: #5e7ce0;
      margin-left: 10px; /*no*/
      font-weight: 600;
      img {
        width: 30px;
        vertical-align: middle;
      }
    }
    &-right {
      margin-right: 20px;
      font-size: 18px;
      display: flex;
      align-items: center;
      img {
        width: 24px;
        vertical-align: middle;
      }
      &-count {
        font-size: 20px;
        color: #d64a52;
      }
    }
  }
  &-content {
    flex: 1;
    display: flex;
    overflow: hidden;
    &-left {
      width: 200px; /*no*/
    }
    &-right {
      flex: 1;
      overflow: hidden;
      height: 100%;
      display: flex;
      flex-direction: column;
      &-head {
        height: 48px; /*no*/
        border-radius: 0;
        display: flex;
        align-items: center;
        padding-left: 20px;
        position: relative;
        z-index: 1;
        border-top: 1px solid #dfe1e6;
      }
      &-content {
        flex: 1;
        overflow: auto;
        height: 100%;
      }
    }
  }
}
</style>
