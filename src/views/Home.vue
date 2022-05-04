<template>
  <div class="home">
    <div class="home-left">
      <img class="home-left-logo" src="../assets/logo_g.png" alt="" />
      <div class="home-left-navs">
        <div
          v-for="item in navData"
          :key="item.id"
          class="home-left-nav"
          :class="{ 'home-left-active': item.id === currentNavId }"
          @click="jumpPage(item)"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
    <div class="home-right">
      <div class="home-header">
        <div class="home-header-left">可信考试模拟练习</div>
        <el-popover
          placement="bottom"
          width="80"
          trigger="manual"
          v-model="visible"
        >
          <div class="home-header-logout" @click="handleLogout">退出登录</div>
          <div slot="reference" class="home-header-right" @click="handleAvatar">
            <el-avatar
              v-if="userLogin"
              size="medium"
              :src="userLoginData.avatar"
              @error="errorHandler"
            >
            </el-avatar>
            <el-avatar v-if="!userLogin" size="medium"> 未登录 </el-avatar>
          </div>
        </el-popover>
      </div>
      <div class="home-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapState } from "vuex";
import { postLogout } from "@/api/user";
export default {
  name: "Home",
  components: {},
  watch: {
    $route: {
      handler: function (to) {
        this.currentNavId = to.name;
      },
      immediate: true,
    },
  },
  data() {
    return {
      navData: [
        { id: "index", name: "首页", path: "/index" },
        { id: "myTest", name: "我的模拟", path: "/myTest" },
        { id: "ranking", name: "刷题排行", path: "/ranking" },
        { id: "about", name: "关于", path: "/about" },
      ],
      currentNavId: "index",
      visible: false,
    };
  },
  computed: {
    ...mapState({
      userLogin(state) {
        return state.userLogin; //是否登录
      },
      userLoginData(state) {
        return state.userLoginData; //登录后的数据
      },
    }),
  },
  methods: {
    jumpPage(nav) {
      if (nav.path === this.$route.path) return;
      this.$router.push(nav.path);
      this.currentNavId = nav.id;
    },
    errorHandler() {
      return true;
    },
    handleAvatar() {
      this.visible = true;
    },

    handleLogout() {
      postLogout()
        .then(() => {
          this.$store.commit("deleteUser");
          this.visible = false;
        })
        .catch((err) => {
          this.$message.error(err.msg || "系统繁忙");
        });
    },
  },
};
</script>

<style lang="scss">
.title {
  font-size: 18px;
  color: #526ecc;
  font-weight: bold;
}
.home {
  display: flex;
  height: 100%;
  &-left {
    width: 250px;
    background: #fff;
    border-radius: 6px;
    box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);
    margin: 10px;
    margin-right: 0px;
    padding: 10px 0;
    &-logo {
      width: 180px;
      display: block;
      margin: 0 auto;
    }
    &-nav {
      height: 48px;
      display: flex;
      align-items: center;
      cursor: pointer;
      padding-left: 40px;
      font-size: 16px;
      border-bottom: 1px solid #dfe1e6;
      &:hover {
        background: #526ecc;
        color: #fff;
        font-weight: bold;
      }
      &:last-child {
        border: none;
      }
    }
    &-active {
      background: #526ecc;
      color: #fff;
      font-weight: bold;
    }
  }
  &-right {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  &-header {
    height: 64px;
    border-radius: 6px;
    background: #fff;
    box-shadow: 0 0px 12px rgba(0, 0, 0, 0.2);
    margin: 10px;
    font-size: 18px;
    display: flex;
    padding: 0 20px;
    align-items: center;
    justify-content: space-between;
    &-right {
      width: fit-content;
    }
    .el-avatar {
      cursor: pointer;
    }
    &-logout {
      cursor: pointer;
      text-align: center;
    }
  }
  &-content {
    flex: 1;
    margin: 10px;
    overflow: auto;
  }
}
</style>
