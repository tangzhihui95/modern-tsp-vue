<template>
  <div class="app-container">
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form
        ref="equipmentModelForm"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-row>
          <el-col :span="16">
            <el-form-item label="设备型号" prop="modelName">
              <el-input
                v-model="form.modelName"
                placeholder="请输入设备型号"
                maxlength="30"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="供应商" prop="suppliers">
              <el-select
                v-model="form.suppliers"
                placeholder="请选择供应商"
                maxlength="30"
                clearable
              >
                <el-option label="modern" value="modern">modern</el-option>
                <el-option
                  label="杭州智源电子有限公司"
                  value="杭州智源电子有限公司"
                >杭州智源电子有限公司
                </el-option
                >
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="生产批次" prop="batchNumber">
              <el-input
                v-model="form.batchNumber"
                placeholder="请输入生产批次"
                maxlength="30"
                clearable
              />
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
import {add, edit} from "@/api/tsp/equipmentModel.js";

const default_form = {
  equipmentTypeId: ""
};
export default {
  name: "equipmentModelForm",
  data() {
    return {
      // 表单参数
      form: JSON.parse(JSON.stringify(default_form)),
      // 弹出层标题
      title: "添加型号",
      // 是否显示弹出层
      open: false,
      // 表单校验
      rules: {
        model: [
          {required: true, message: "设备型号不能为空", trigger: "blur"},
          {
            min: 2,
            max: 20,
            message: "设备类型长度必须介于 2 和 20 之间",
            trigger: "blur",
          },
        ],
        suppliers: [
          {required: true, message: "供应商不能为空", trigger: "blur"},
        ],
        batchNumber: [
          {required: true, message: "生产批次号不能为空", trigger: "blur"},
          {
            max: 24,
            message: "生产批次号不得超过24位、区分大小写",
            trigger: "blur",
          },
        ],
      },
    };
  },
  watch: {},
  created() {
  },
  methods: {
    /** 提交按钮 */
    submitForm: function () {
      console.log(this.form);
      if (this.title === "添加型号") {
        add(this.form).then((res) => {
          if (res.code === 200) {
            this.$modal.msgSuccess("操作成功");
            this.$parent.getList();
            this.cancel();
          }
        });
      } else {
        console.log(this.form);
        edit(this.form).then((res) => {
          if (res.code === 200) {
            this.$modal.msgSuccess("操作成功");
            this.$parent.getList();
            this.cancel();
          }
        });
      }
      // }
      // });
    },
    // 表单重置
    reset() {
      this.form = {};
      this.resetForm("equipmentModelForm");
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
