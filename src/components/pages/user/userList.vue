<template>
  <div class="container">
    <div class="query-div">
      <span class="fl">
        <el-button @click="batchDelete()" type="danger">批量删除</el-button>
        <el-button @click="openDialog()" type="success">添加用户</el-button>
        <el-button @click="queryData()" type="primary" icon="el-icon-refresh"></el-button>
      </span>
    </div>
    <el-table
      :data="userList"
      border
      :header-cell-style="getHeadStyle"
      center
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column prop="user" label="用户" align="center"></el-table-column>
      <el-table-column prop="name" label="昵称" align="center"></el-table-column>
      <el-table-column prop="create_time" label="创建时间" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scpoe">
          <el-button @click="openDialog(scpoe.row)" type="primary" size="small" icon="el-icon-bell"></el-button>
          <el-button @click="openDialog(scpoe.row)" type="primary" size="small" icon="el-icon-edit"></el-button>
          <el-button @click="doDelete(scpoe.row)" type="danger" size="small" icon="el-icon-delete"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="pagination clearfix">
      <el-pagination
        class="fr"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="paginationInfo.currentPage"
        :page-sizes="paginationInfo.pageSizes"
        :page-size="paginationInfo.pageSize"
        layout="total, prev, pager, next, sizes"
        :total="paginationInfo.total"
      ></el-pagination>
    </div>
    <el-dialog
      :title="formTitle"
      :visible.sync="formVisible"
      width="550px"
      :before-close="handleClose"
      center
    >
      <el-form :model="newUserForm" ref="newUserForm" :rules="newUserRules" label-width="120px">
        <el-form-item prop="user" label="用户：">
          <el-input
            v-model="newUserForm.user"
            size="small"
            :disabled="!!newUserForm.create_time"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="name" label="昵称：">
          <el-input v-model="newUserForm.name" size="small" placeholder="请输入昵称"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码：" v-if="!newUserForm.create_time">
          <el-input v-model="newUserForm.password" size="small" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item prop="passwordAgain" label="确认密码：" v-if="!newUserForm.create_time">
          <el-input v-model="newUserForm.passwordAgain" size="small" placeholder="请输入确认密码"></el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button @click="handleClose" type="default" size="small">取 消</el-button>
        <el-button type="primary" @click="submitForm" size="small">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import paginationMixin from "../../../mixins/pagination";
import tools from "@/utils/tools";
export default {
  mixins: [paginationMixin],
  name: "",
  data() {
    var passwordValid = (rule, value, callback) => {
      if (this.newUserForm.create_time) {
        return callback();
      }
      if (!this.newUserForm.password) {
        return callback(new Error("密码不能为空"));
      } else if (this.newUserForm.passwordAgain) {
        this.$refs.newUserForm.validateField("passwordAgain");
        return callback();
      } else {
        return callback();
      }
    };
    var passwordAgainValid = (rule, value, callback) => {
      if (this.newUserForm.create_time) {
        return callback();
      }
      if (!this.newUserForm.passwordAgain) {
        return callback(new Error("密码重复不能为空"));
      } else if (this.newUserForm.passwordAgain !== this.newUserForm.password) {
        return callback(new Error("两次密码不一致"));
      } else {
        return callback();
      }
    };
    return {
      name: "",
      userList: [],
      multipleSelection: [],
      formTitle: "新增编码器",
      formVisible: false,
      newUserForm: {
        user: "",
        name: "",
        password: "",
        passwordAgain: ""
      },
      newUserRules: {
        user: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
        name: [{ required: true, message: "昵称不能为空", trigger: "blur" }],
        password: [
          { required: true, validator: passwordValid, trigger: "blur" }
        ],
        passwordAgain: [
          { required: true, validator: passwordAgainValid, trigger: "blur" }
        ]
      }
    };
  },
  components: {},
  created() {
    this.queryData();
  },
  mounted() {},
  methods: {
    handleSelectionChange(val) {
      console.log(val);
      this.multipleSelection = val;
    },
    getHeadStyle() {
      return "background: #F2F2F2;";
    },
    //查询数据
    queryData(pageNum = 1, pageSize = 10) {
      let queryStr = "?page=" + pageNum + "limit=" + pageSize;
      this.$api
        .getUserList(queryStr)
        .then(res => {
          this.userList = res.data.data;
          this.paginationInfo.total = res.data.count;
        })
        .catch(e => {});
    },
    batchDelete() {
      if (!this.multipleSelection.length) {
        this.$message.warning("请至少选择一项");
        return;
      }
      let userArr = [];
      this.multipleSelection.forEach(function(v) {
        userArr.push(v.user);
      });
      userArr.forEach(v => {
        this.userList.forEach((val, idx) => {
          if (v == val.user) {
            this.userList.splice(idx, 1);
          }
        });
      });
      this.$message.success("批量删除成功");
    },
    openDialog(row) {
      this.formVisible = true;
      this.formTitle = "添加用户";
      if (row) {
        this.formTitle = "编辑";
        this.newUserForm = row;
      }
    },
    doDelete(row) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.userList.forEach((v, i) => {
            if (v.user == row.user) {
              this.userList.splice(i, 1);
            }
          });
        })
        .catch(e => {
          this.$message.info("删除取消");
        });
    },
    handleClose() {
      this.formVisible = false;
      this.newUserForm = {
        user: "",
        name: "",
        password: "",
        passwordAgain: ""
      };
    },
    submitForm() {
      this.$refs.newUserForm.validate(valid => {
        if (valid) {
          if (this.newUserForm.create_time) {
            //编辑
            let vm = this;
            vm.userList.forEach(function(v, i) {
              if (v.create_time == vm.newUserForm.create_time) {
                vm.userList[i] = vm.newUserForm;
              }
            });
            vm.$message.success("编辑成功");
            vm.handleClose();
          } else {
            //新增
            this.newUserForm.create_time = tools.dateFormat(new Date());
            this.userList.push(this.newUserForm);
            this.$message.success("新增成功");
            this.handleClose();
          }
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  .query-div {
    height: 50px;
  }
  .el-dialog {
    .el-input {
      width: 300px;
    }
    .dialog-footer {
      text-align: center;
      margin: 10px 0;
      .el-button {
        width: 100px;
      }
    }
  }
}
</style>

