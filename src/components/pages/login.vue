<template>
  <div class="wrap login-page">
    <div class="login-box">
      <div class="title">客户登录</div>
      <div class="login-main">
        <el-form :model="userInfo" :rules="rules" ref="loginForm">
          <el-form-item prop="loginName">
            <el-input v-model="userInfo.loginName" placeholder="用户名"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="userInfo.password"
              placeholder="密码"
              type="password"
              @keydown.enter.native="submit"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button @click="submit" type="primary">登 录</el-button>
        <div class="foot">
          <el-checkbox v-model="isRmbLogin">下次自动登录</el-checkbox>
          <span class="service">忘记密码请联系客服</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data() {
    var pwdValid = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("密码不能为空"));
      } else {
        return callback();
      }
    };
    return {
      isRmbLogin: false, //自动登录
      userInfo: {
        loginName: "",
        password: ""
      },
      rules: {
        loginName: [
          {
            required: true,
            message: "用户名不能为空",
            // validator: nameValid,
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            validator: pwdValid,
            trigger: "blur"
          }
        ]
      }
    };
  },

  created() {
    let isLoginout = this.$route.query.isLoginout;
    localStorage.removeItem("sid");
    this.userInfo.loginName = localStorage.getItem("loginName");
    this.userInfo.password = localStorage.getItem("password");
    let rmbLogin = localStorage.getItem("rmbLogin") === "true";
    this.isRmbLogin = rmbLogin;
    if (rmbLogin) {
      if (!isLoginout) {
        this.$message.success("您已选择自动登录，自动登录中");
        let _this = this;
        setTimeout(function() {
          _this.submit();
        }, 2000);
      }
    }
  },
  mounted() {},
  methods: {
    ...mapActions(["setLoginInfo"]),
    submit() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.$api
            .login(this.userInfo)
            .then(res => {
              let data = res.data.data;
              let isSuccess = data.some(
                v =>
                  v.userName === this.userInfo.loginName &&
                  v.password === this.userInfo.password
              );
              if (isSuccess) {
                this.$message.success("登陆成功!");
                this.setLoginInfo({
                  loginName: this.userInfo.loginName,
                  password: this.userInfo.password
                });
                let vm = this;
                setTimeout(function() {
                  vm.$router.push("/4G_encoder"), 1000;
                });
                localStorage.setItem("rmbLogin", this.isRmbLogin);
                localStorage.setItem("loginName", this.userInfo.loginName);
                localStorage.setItem("password", this.userInfo.password);
                this.$refs.loginForm.resetFields();
                localStorage.setItem("sid", res.data.sid);
              } else {
                this.$message.error("账号或者密码出错!");
              }
            })
            .catch(e => {});
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.login-page {
  position: relative;
  height: 100%;
  width: 100%;
  // overflow: hidden;
  background: linear-gradient(to bottom right, blue, white);
  .login-box {
    background-color: #fff;
    width: 400px;
    height: 350px;
    position: absolute;
    left: 50%;
    top: 40%;
    border-radius: 4px;
    box-shadow: 0px 0px 10px 0px rgba(8, 23, 170, 0.11);
    transform: translate(-50%, -50%);
    .title {
      height: 70px;
      line-height: 70px;
      background-color: #3e4ffa;
      font-size: 24px;
      color: #fff;
      text-align: center;
      border-radius: 4px;
    }
    .login-main {
      padding: 20px 5%;
      .el-button {
        width: 100%;
      }
      .el-form-item {
        margin: 25px 0;
      }
      .foot {
        margin-top: 15px;
        span.service {
          float: right;
          color: #999;
        }
      }
    }
  }
}
</style>

