<template>
  <div class="app-container">
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="600px"
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="cancel"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item
          label="车型名称"
          prop="vehicleModelName"
          label-width="110px"
        >
          <el-input
            v-model="form.vehicleModelName"
            placeholder="请输入车型名称"
            style="width: 230px"
            maxlength="30"
          />
        </el-form-item>
        <!-- <el-form-item
          label="选择车型分类"
          prop="tspVehicleTypeId"
          label-width="110px"
        >
          <el-select
            v-model="form.tspVehicleTypeId"
            placeholder="请选择车型分类"
          >
            <el-option
              v-for="item in selectList"
              :key="item.typeName"
              :label="item.typeName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { add, edit } from "@/api/tsp/vehicleModel.js";
import { selectList } from "@/api/tsp/vehicleType.js";
export default {
  name: "eForm",
  data() {
    return {
      // 弹出层标题
      title: "新增车型",
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {},
      // 下拉列表
      selectList: [],
      // 表单校验
      rules: {
        vehicleModelName: [
          { required: true, message: "车型名称不能为空", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "车型名称长度必须介于 2 和 20 之间",
            trigger: "blur",
          },
        ],
        // tspVehicleTypeId: [
        //   { required: true, message: "请选择车型分类", trigger: "change" },
        // ],
      },
    };
  },
  watch: {},
  created() {},
  methods: {
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.title === "新增车型") {
            console.log(this.form);
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
    // 下拉列表
    getSelectList() {
      if (this.form.tspVehicleTypeId) {
        selectList(this.form.tspVehicleTypeId).then((res) => {
          console.log(res);
          this.selectList = res.result;
        });
      } else {
        selectList().then((res) => {
          console.log(res);
          this.selectList = res.result;
        });
      }
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
