<template>
  <div class="app-container">
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="600px"
      append-to-body
      :before-close="cancel"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="分类名称" prop="typeNumber" label-width="110px">
          <!-- <el-input
            v-model="form.typeName"
            placeholder="请输入分类名称"
            maxlength="30"
          /> -->
          <el-cascader
            v-model="form.typeNumber"
            :options="options"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { add, edit } from "@/api/tsp/vehicleType.js";
export default {
  name: "eForm",
  data() {
    return {
      // 弹出层标题
      title: "新增车型分类",
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {
        typeName:"",
      },
      // 下拉列表
      selectList: [],
      // 表单校验
      rules: {
        typeName: [
          { required: true, message: "分类名称不能为空", trigger: "blur" },
        ],
      },
        value: [],
        options: [{
          value: '1',
          label: '所有车辆',
          children: [{
            value: '1-1',
            label: '大型车',
            children: [{
              value: '1-1-1',
              label: '油罐车'
            }]
          }, {
            value: '1-2',
            label: '中型车',
            children: [{
              value: '1-2-1',
              label: '货车'
            }]
          },{
            value: '1-3',
            label: '小型车',
            children: [{
              value: '1-3-1',
              label: '家用轿车'
            }]
          }]
        }]
    };
  },
  watch: {},
  created() {},
  methods: {
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.title === "新增车型分类") {
            console.log(this.form);
            if(this.form.typeNumber[2] === "1-1-1") {
              this.form.typeName = "油罐车";
            }
            if(this.form.typeNumber[2] === "1-2-1") {
              this.form.typeName = "货车";
            }
            if(this.form.typeNumber[2] === "1-3-1") {
              this.form.typeName = "家用轿车";
            } 
            add(JSON.parse(JSON.stringify(this.form))).then((res) => {
              this.$modal.msgSuccess("操作成功");
              this.$parent.getList();
              this.cancel();
            });
          } else {
            console.log(this.form);

            edit(JSON.parse(JSON.stringify(this.form))).then((res) => {
              this.$modal.msgSuccess("操作成功");
              this.$parent.getList();
              this.cancel();
            });
          }
        }
      });
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
