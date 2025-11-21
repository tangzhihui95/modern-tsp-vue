<template>
  <div class="app-container">
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="16">
            <el-form-item label="设备类型" prop="name">
              <el-select v-model="form.name" placeholder="请选择设备类型" clearable>
                <el-option label="T_BOX" value="T_BOX">T_BOX</el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row>
          <el-col :span="16">
            <el-form-item label="设备型号" prop="model">
              <el-input
                v-model="form.model"
                placeholder="请输入设备型号"
                maxlength="30"
              />
            </el-form-item>
          </el-col>
        </el-row> -->
        <!-- <el-row>
          <el-col :span="16">
            <el-form-item label="供应商" prop="suppliers">
              <el-select
                multiple
                v-model="form.suppliers"
                placeholder="请选择供应商"
                maxlength="30"
              >
                <el-option label="modern" value="modern">modern</el-option>
                <el-option
                  label="杭州智源电子有限公司"
                  value="杭州智源电子有限公司"
                  >杭州智源电子有限公司</el-option
                >
              </el-select>
            </el-form-item>
          </el-col>
        </el-row> -->
        <el-row>
          <el-col :span="17">
            <el-form-item
              label="设备扩展信息"
              prop="extraType"
              label-width="110px"
            >
              <el-select
                v-model="form.extraType"
                placeholder="请输入设备扩展信息"
                maxlength="30"
                clearable
              >
                <el-option label="T-BOX" value="T-BOX">T-BOX</el-option>
                <el-option label="IHU" value="IHU">IHU</el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="14">
            <el-form-item
              label="是否为终端设备"
              prop="isTerminal"
              label-width="110px"
            >
              <el-radio-group v-model="form.isTerminal" @change="handleRadio">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { add, edit } from "@/api/tsp/equipmentType.js";
const default_form = {};
export default {
  name: "eForm",
  data() {
    return {
      // 表单参数
      form: JSON.parse(JSON.stringify(default_form)),
      // 弹出层标题
      title: "新增分类",
      // 是否显示弹出层
      open: false,
      // 表单校验
      rules: {
        name: [
          { required: true, message: "设备类型不能为空", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "设备类型长度必须介于 2 和 20 之间",
            trigger: "blur",
          },
        ],
        // model: [
        //   { required: true, message: "设备型号不能为空", trigger: "blur" },
        //   {
        //     min: 2,
        //     max: 20,
        //     message: "设备类型长度必须介于 2 和 20 之间",
        //     trigger: "blur",
        //   },
        // ],
        // suppliers: [
        //   { required: true, message: "供应商不能为空", trigger: "blur" },
        // ],
        extraType: [
          { required: true, message: "扩展信息类型不能为空", trigger: "blur" },
        ],
      },
    };
  },
  watch: {},
  created() {},
  methods: {
    /** 提交按钮 */
    submitForm: function () {
      console.log(this.form);
      // this.$refs["form"].validate((valid) => {
      // if (valid) {
      if (this.form.isTerminal === null || this.form.isTerminal === undefined) {
        this.form.isTerminal = true;
      }
      if (this.title === "新增分类") {
        add(this.form).then((res) => {
          this.$modal.msgSuccess("操作成功");
          this.$parent.getList();
          this.cancel();
        });
      } else {
        console.log(this.form);
        edit(this.form).then((res) => {
          this.$modal.msgSuccess("操作成功");
          this.$parent.getList();
          this.cancel();
        });
      }
      // }
      // });
    },
    // 表单重置
    reset() {
      this.form = {};
      this.resetForm("form");
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    handleRadio(val) {
      console.log(val);
    },
  },
};
</script>
<style scoped>

</style>
