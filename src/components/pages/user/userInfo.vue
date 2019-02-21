<template>
  <div class="container">
    <el-tabs v-model="activeModule" type="border-card">
      <el-tab-pane label="个人信息" name="userInfo">
        <el-form
          :model="userInfo"
          :rules="infoRules"
          ref="infoForm"
          label-width="85px"
          class="demo-ruleForm"
          key="userInfo"
        >
          <el-form-item label="用户名" prop="loginName">
            <el-input v-model="userInfo.loginName" size="small" disabled></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="username">
            <el-input v-model="userInfo.username" size="small"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phoneNo">
            <el-input v-model="userInfo.phoneNo" size="small"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="userInfo.email" size="small"></el-input>
          </el-form-item>
          <!-- <el-form-item label="所在城市" prop="address">
            <el-cascader
              :options="addressOptions"
              size="small"
              v-model="userInfo.address"
              placeholder="省份/城市"
            ></el-cascader>
          </el-form-item>-->
        </el-form>
        <el-button class="submit-btn" type="primary" size="small" @click="submitUserInfo">保 存</el-button>
      </el-tab-pane>
      <el-tab-pane label="修改密码" name="password">
        <el-form
          :model="password"
          :rules="passwordRules"
          ref="passwordForm"
          label-width="100px"
          class="demo-ruleForm"
          key="password"
        >
          <el-form-item label="旧密码" prop="oldPasswd">
            <el-input v-model="password.oldPasswd" size="small" placeholder="请输入旧密码"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="password">
            <el-input v-model="password.password" size="small" placeholder="请输入新密码"></el-input>
          </el-form-item>
          <el-form-item label="确认新密码" prop="passwordAgain">
            <el-input v-model="password.passwordAgain" size="small" placeholder="请再次输入新密码"></el-input>
          </el-form-item>
        </el-form>
        <el-button class="submit-btn" type="primary" size="small" @click="updatePassWord">修 改</el-button>
        <!-- </div> -->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { setTimeout } from "timers";
export default {
  data() {
    var validUserName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("姓名不能为空"));
      } else {
        return callback();
      }
    };
    var validPhoneNo = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("手机号码不能为空"));
      } else if (!/^1[3456789]\d{9}$/.test(value)) {
        return callback(new Error("手机号码格式错误"));
      } else {
        return callback();
      }
    };
    var validEmail = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("邮箱不能为空"));
      } else if (
        !/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(value)
      ) {
        return callback(new Error("邮箱格式出错"));
      } else {
        return callback();
      }
    };
    var validateOld = (rule, value, callback) => {
      if (!value) {
        callback(new Error("旧密码不能为空"));
      } else if (this.password.password === value) {
        callback(new Error("新旧密码不能相同"));
      } else if (this.password.password) {
        this.$refs.passwordForm.validateField("password");
      }
      callback();
    };
    var validatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入新密码"));
      } else {
        if (this.password.oldPasswd && this.password.oldPasswd === value) {
          callback("新旧密码不能相同");
        } else {
          if (this.password.passwordAgain) {
            this.$refs.passwordForm.validateField("passwordAgain");
          }
        }
        callback();
      }
    };
    var validateAgain = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请再次输入新密码"));
      } else if (value !== this.password.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    // var addressValid = (rule, value, callback) => {
    //   if (this.loginInfo.isAdmin != 1) {
    //     return callback();
    //   } else if (!this.userInfo.address) {
    //     return callback(new Error("请选择所属城市"));
    //   } else {
    //     return callback();
    //   }
    // };
    return {
      activeModule: "userInfo",
      // addressOptions: [],
      userInfo: {
        username: "",
        phoneNo: "",
        email: "",
        loginName: ""
      },
      infoRules: {
        username: [
          {
            required: true,
            validator: validUserName,
            trigger: "blur"
          }
        ],
        phoneNo: [
          {
            required: true,
            validator: validPhoneNo,
            trigger: "blur"
          }
        ],
        email: [
          {
            required: true,
            validator: validEmail,
            trigger: "blur"
          }
        ]
        // address: [
        //   {
        //     required: true,
        //     validator: addressValid,
        //     trigger: "change"
        //   }
        // ]
      },
      password: {
        oldPasswd: "",
        password: "",
        passwordAgain: ""
      },
      passwordRules: {
        oldPasswd: [
          { required: true, validator: validateOld, trigger: "blur" }
        ],
        password: [
          { required: true, validator: validatePass, trigger: "blur" }
        ],
        passwordAgain: [
          { required: true, validator: validateAgain, trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    ...mapState({ loginInfo: "loginInfo" })
  },
  created() {
    let { username, phoneNo, email, loginName } = this.loginInfo;
    this.userInfo = { username, phoneNo, email, loginName };
    // this.userInfo.address = [];
    // if (this.loginInfo.company.city && this.loginInfo.company.province) {
    //   this.userInfo.address[1] = this.loginInfo.company.city;
    //   this.userInfo.address[0] = this.loginInfo.company.province;
    // }
    // this.$api
    //   .getOrgTreeTwo()
    //   .then(res => {
    //     this.addressOptions = res.data.items;
    //   })
    //   .catch(e => {});
  },
  mounted() {},
  methods: {
    ...mapActions({ setLoginInfo: "setLoginInfo" }),
    submitUserInfo() {
      this.$refs.infoForm.validate(valid => {
        let { email, phoneNo, username } = this.userInfo;
        if (valid) {
          this.$api
            .updatePersonalInfo({
              province: this.userInfo.address[0],
              city: this.userInfo.address[1],
              email,
              phoneNo,
              username
            })
            .then(res => {
              // if (res.data.success) {
              this.$message.success("更新个人信息成功");
              this.loginInfo.username = this.userInfo.username;
              this.loginInfo.phoneNo = this.userInfo.phoneNo;
              this.loginInfo.email = this.userInfo.email;
              // this.loginInfo.company.province = this.userInfo.address[0];
              // this.loginInfo.company.city = this.userInfo.address[1];
              this.setLoginInfo(this.loginInfo);
              // }
            })
            .catch(e => {});
        }
      });
    },
    updatePassWord() {
      this.$refs.passwordForm.validate(valid => {
        if (valid) {
          this.$api
            .updatePassWord({
              newPassword1: this.password.password,
              newPassword2: this.password.passwordAgain,
              oldPassword: this.password.oldPasswd
            })
            .then(res => {
              console.log("updatePassWord", res);
              if (res.data.success) {
                this.$api
                  .loginOut()
                  .then(res => {
                    // if (res.data.success) {
                    this.setLoginInfo({});
                    this.$message.success("修改密码成功，请重新登陆");
                    let vm = this;
                    setTimeout(function() {
                      vm.$router.push("/login");
                    }, 1000);
                    // }
                  })
                  .catch(e => {});
              }
            })
            .catch(e => {});
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  position: relative;
  font-size: 18px;
  .submit-btn {
    width: 120px;
    margin-left: 100px;
  }
  .el-form {
    width: 300px;
  }
}
</style>

