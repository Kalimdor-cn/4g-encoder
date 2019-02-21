<template>
  <div class="container">
    <div class="query-div">
      <span class="fl">
        <el-button @click="batchDelete()" type="danger">批量删除</el-button>
        <el-button @click="queryData()" type="primary" icon="el-icon-refresh"></el-button>
      </span>
      <span class="fr">
        <el-input style="width:150px" placeholder="请输入名称" v-model="name"></el-input>
        <el-button @click="queryData()" type="primary" icon="el-icon-search"></el-button>
      </span>
    </div>
    <el-table
      :data="encoderList"
      border
      :header-cell-style="getHeadStyle"
      center
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column prop="serialNum" label="ID"></el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="ip" label="来源设备名称"></el-table-column>
      <el-table-column prop="mac" label="来源设备序列号"></el-table-column>
      <el-table-column prop="authCode" label="时间"></el-table-column>
      <el-table-column label="厂家-型号">
        <template slot-scope="scpoe">{{fmtManuFactor(scpoe.row)}}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scpoe">
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
      <el-form :model="encoderForm" ref="encoderForm" :rules="rules" label-width="140px">
        <el-form-item prop="serialNum" label="序列号：">
          <el-input v-model="encoderForm.serialNum" size="small" placeholder="请输入序列号"></el-input>
        </el-form-item>
        <el-form-item prop="name" label="名称：">
          <el-input v-model="encoderForm.name" size="small" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item prop="ip" label="IP：">
          <el-input v-model="encoderForm.ip" size="small" placeholder="请输入IP"></el-input>
        </el-form-item>
        <el-form-item prop="mac" label="MAC：">
          <el-input v-model="encoderForm.mac" size="small" placeholder="请输入MAC"></el-input>
        </el-form-item>
        <el-form-item prop="authCode" label="授权码：">
          <el-input
            v-model="encoderForm.authCode"
            size="small"
            disabled
            style="width:205px;"
            placeholder="请输入授权码"
          ></el-input>
          <el-button type="primary" size="small" @click="createAuthCode">生成授权码</el-button>
        </el-form-item>
        <el-form-item prop="factoryModule" label="厂家-型号：">
          <el-select
            v-model="encoderForm.factory"
            size="small"
            @change="factoryChange"
            placeholder="请选择厂家"
            style="width: 145px;margin-right:6px;"
          >
            <el-option
              v-for="item in factoryOptions"
              :key="item.name"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-select
            v-model="encoderForm.module"
            size="small"
            placeholder="请选择型号"
            style="width: 145px;"
          >
            <el-option
              v-for="item in moduleOptions"
              :key="item.name"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
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
export default {
  mixins: [paginationMixin],
  name: "",
  data() {
    var factoryModuleValid = (rule, value, callback) => {
      if (!this.encoderForm.factory) {
        return callback(new Error("请选择厂家"));
      } else if (!this.encoderForm.module) {
        return callback(new Error("请选择型号"));
      } else {
        return callback();
      }
    };
    return {
      name: "",
      encoderList: [],
      multipleSelection: [],
      formTitle: "新增编码器",
      formVisible: false,
      encoderForm: {
        serialNum: "",
        name: "",
        ip: "",
        mac: "",
        authCode: "",
        factory: "",
        module: ""
      },
      factoryOptions: [],
      moduleOptions: [],
      rules: {
        serialNum: [
          { required: true, message: "序列号不能为空", trigger: "blur" }
        ],
        name: [{ required: true, message: "名称不能为空", trigger: "blur" }],
        ip: [{ required: true, message: "IP不能为空", trigger: "blur" }],
        mac: [{ required: true, message: "MAC不能为空", trigger: "blur" }],
        authCode: [
          { required: true, message: "授权码不能为空", trigger: "blur" }
        ],
        factoryModule: [
          {
            required: true,
            validator: factoryModuleValid,
            trigger: "change"
          }
        ]
      }
    };
  },
  components: {},
  created() {
    this.queryData();
    this.getLeftMenu();
    this.getFactoryModule();
  },
  mounted() {},
  methods: {
    getLeftMenu() {
      let queryStr = "?page=1&limit=10";
      this.$api
        .getLeftMenu(queryStr)
        .then(res => {})
        .catch(e => {});
    },
    getFactoryModule() {
      this.$api
        .getFactoryModule()
        .then(res => {
          this.factoryOptions = res.data.data;
        })
        .catch(e => {});
    },
    //厂家变化时 型号改变
    factoryChange() {
      this.factoryOptions.forEach(v => {
        if (v.id === this.encoderForm.factory) {
          this.moduleOptions = v.children;
        }
      });
      this.encoderForm.module = "";
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    getHeadStyle() {
      return "background: #F2F2F2;";
    },
    //查询数据
    queryData(pageNum = 1, pageSize = 10) {
      let paramsObj = { pageNum, pageSize, name: this.name };
      this.$api
        .getEncoderList(paramsObj)
        .then(res => {
          let data = res.data.data;
          let vm = this;
          if (this.name) {
            this.encoderList = data.filter(function(v) {
              return v.name.indexOf(vm.name) > -1;
            });
          } else {
            this.encoderList = data;
          }
          this.paginationInfo.total = this.encoderList.length;
        })
        .catch(e => {});
    },
    batchDelete() {
      if (this.multipleSelection.length == 0) {
        this.$message.warning("请至少选择一项");
        return;
      }
      let ids = [];
      this.multipleSelection.forEach(function(v) {
        ids.push(v.id);
      });
      let vm = this;
      ids.forEach(v => {
        vm.encoderList.forEach(function(val, idx) {
          if (v == val.id) {
            vm.encoderList.splice(idx, 1);
          }
        });
      });
      this.$message.success("批量删除成功");
    },
    openDialog(row) {
      this.formVisible = true;
      if (row) {
        this.formTitle = "编辑解码器";
        this.encoderForm = row;
      } else {
        this.formTitle = "新增解码器";
        this.createHash(10);
      }
    },
    doDelete(row) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let arr = this.encoderList;
          arr.forEach(function(v, i) {
            if (v.id == row.id) {
              arr.splice(i, 1);
            }
          });
          this.encoderList = arr;
        })
        .catch(e => {
          this.$message.info("删除取消");
        });
    },
    handleClose() {
      this.formVisible = false;
      this.encoderForm = {
        serialNum: "",
        name: "",
        ip: "",
        mac: "",
        authCode: "",
        factory: "",
        module: ""
      };
      this.$refs.encoderForm.resetFields();
    },
    submitForm() {
      this.$refs.encoderForm.validate(valid => {
        if (valid) {
          if (this.encoderForm.id) {
            //编辑
            let vm = this;
            vm.encoderList.forEach(function(v, i) {
              if (v.id == vm.encoderForm.id) {
                vm.encoderList[i] = vm.encoderForm;
              }
            });
            vm.$message.success("编辑成功");
            vm.handleClose();
          } else {
            //新增
            this.encoderForm.status = 1;
            this.encoderList.push(this.encoderForm);
            this.$message.success("新增成功");
            this.handleClose();
          }
        }
      });
    },
    fmtManuFactor(row) {
      let fmtStr = "";
      this.factoryOptions.forEach(v => {
        if (v.id === row.factory) {
          fmtStr += v.name;
          v.children.forEach(val => {
            if (val.id === row.module) {
              fmtStr += "-" + val.name;
            }
          });
        }
      });
      return fmtStr;
    },
    createAuthCode() {
      this.$confirm(
        "重新生成后需要配置端同步更新授权码，请谨慎操作！",
        "提示信息",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.createHash(10);
          this.$refs.encoderForm.validateField("authCode");
        })
        .catch(e => {});
    },
    createHash(hashLength) {
      if (!hashLength || typeof Number(hashLength) != "number") {
        return;
      }
      var ar = [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z"
      ];
      var hs = [];
      var hl = Number(hashLength);
      var al = ar.length;
      for (var i = 0; i < hl; i++) {
        hs.push(ar[Math.floor(Math.random() * al)]);
      }
      this.encoderForm.authCode = hs.join("");
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
      margin-top: 20px;
      .el-button {
        width: 100px;
      }
    }
    .el-form .el-form-item {
      margin-bottom: 15px;
    }
  }
  .status-img {
    width: 35px;
    height: 35px;
  }
}
</style>

