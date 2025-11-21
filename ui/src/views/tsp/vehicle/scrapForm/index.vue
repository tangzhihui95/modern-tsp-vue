<template>
  <div>
    <el-dialog
      title="车辆报废"
      :visible.sync="open"
      :before-close="handleClose"
      width="700px"
    >
      <el-form label-width="80px" ref="scrapForm" v-model="form" :rules="rules">
        <el-row>
          <el-col :span="12">
            <el-form-item label="登录密码" label-width="110px" prop="password">
              <el-input
                v-model="form.password"
                type="password"
                placeholder="请输入登录密码"
                maxlength="30"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row>
          <el-col>
            <el-form-item label="执行时间" label-width="110px" prop="scrapTime">
              <el-date-picker
                v-model="form.scrapTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                placeholder="选择日期时间"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { scrap } from "@/api/tsp/vehicle.js";
export default {
  name: "ScrapForm",
  data() {
    return {
      open: false,
      form: {},
      // 表单校验
      rules: {
        password: [
          { required: true, message: "登录密码不能为空", trigger: "blur" },
        ],
        // scrapTime: [
        //   { required: true, message: "执行时间不能为空", trigger: "blur" },
        // ],
      },
    };
  },
  methods: {
    onSubmit() {
      //   this.$refs.saleForm.validate((valid) => {
      // if (valid) {
      this.$confirm("是否确认报废所选数据项？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          scrap(this.form).then((res) => {
            if (res.code === 200) {
              this.$message({
                type: "success",
                message: "报废成功!",
              });
              this.$parent.getList();
              this.handleClose();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
      // }
      //   });
    },
    handleClose() {
      this.form = {};
      this.open = false;
    },
  },
};
</script>

<style>
</style>