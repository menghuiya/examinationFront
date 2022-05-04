<template>
  <div id="app" class="app">
    <router-view v-if="isRouterAlive" />
    <el-dialog
      :title="loginPage ? '登录账户' : '注册账户'"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="showLogin"
      width="350px"
    >
      <el-form
        ref="ruleForm"
        :rules="rules"
        :model="form"
        label-width="80px"
        v-if="loginPage"
      >
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
          <el-input v-model="form.password" show-password></el-input>
        </el-form-item>
      </el-form>
      <el-form
        ref="ruleForm"
        :rules="rules"
        :model="form"
        label-width="80px"
        v-if="!loginPage"
      >
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
          <el-input v-model="form.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="用户头像">
          <el-upload
            class="avatar-uploader"
            action="/api/upload"
            :file-list="fileList"
            list-type="picture"
            :on-success="handleSuccess"
            :show-file-list="false"
            accept=".jpeg,.png,.jpg,.bmp,.gif"
            :before-upload="beforeAvatarUpload"
            :on-remove="handleRemove"
          >
            <img
              v-if="form.avatar"
              fit="fill"
              :src="form.avatar"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <el-checkbox v-model="remember">记住密码</el-checkbox>
      <div class="app-login">
        {{ loginPage ? "没有" : "已有" }}账号？我要
        <span @click="changeLogin">{{ loginPage ? "注册" : "登录" }}</span>
      </div>
      <el-button
        type="primary"
        style="width: 100%; margin-top: 20px"
        size="small"
        @click="handleLogin"
      >
        {{ loginPage ? "登 录" : "注 册" }}
      </el-button>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { postLogin, postUser } from "@/api/user";
export default {
  data() {
    return {
      isRouterAlive: true,
      form: {},
      showLogin: false,
      remember: false,
      loginPage: true,
      fileList: [],
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
    };
  },
  watch: {
    needLogin: {
      handler(newVal) {
        this.showLogin = newVal;
      },
      immediate: true,
    },
  },
  computed: {
    ...mapState({
      needLogin(state) {
        return !state.userLogin; //是否登录
      },
    }),
  },
  methods: {
    handleSuccess(response, file) {
      this.fileList = [file];
      this.form.avatar = response.url;
    },
    handleRemove() {
      this.fileList = [];
      this.form.avatar = "";
    },
    handleLogin() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.loginPage) {
            postLogin(this.form)
              .then((res) => {
                console.log(res);
                this.$message.success("登录成功！");
                this.showLogin = false;
                this.$store.commit("setUser", res.data);
                this.reload();
              })
              .catch((err) => {
                this.$message.error(err.msg);
              });
          } else {
            postUser(this.form)
              .then((res) => {
                this.$message.success("注册并登录成功！");
                this.showLogin = false;
                this.$store.commit("setUser", res.data);
                this.reload();
              })
              .catch((err) => {
                this.$message.error(err.msg);
              });
          }
        } else {
          return false;
        }
      });
    },
    changeLogin() {
      if (!this.loginPage) {
        delete this.form.avatar;
      }
      this.loginPage = !this.loginPage;
    },
    beforeAvatarUpload(file) {
      console.log(file.type);
      const imgsTypes = ["image/jpeg", "image/png"];
      const isJPG = imgsTypes.includes(file.type);
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function () {
        this.isRouterAlive = true;
      });
    },
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
}
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

*::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 8px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 8px;
}
*::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  background-color: #5e7ce0;
  background-image: -webkit-linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.2) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0.2) 75%,
    transparent 75%,
    transparent
  );
}
*::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #beccfa;
  border-radius: 10px;
}

.common-card {
  background: #fff;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);
  border-radius: 6px;
}

html,
body {
  height: 100%;
  background: #f3f6f8;
}
.app-login {
  margin: 10px 0;
  font-size: 14px;
  span {
    color: #5e7ce0;
    font-weight: 600;
    cursor: pointer;
    font-size: 16px;
  }
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 80px;
  height: 80px;
  line-height: 80px;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
}
.avatar {
  width: 80px;
  height: 80px;
}
</style>
