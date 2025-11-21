<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="700px"
      append-to-body
      :before-close="cancel"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="14">
            <el-form-item label="模板标题" prop="modelTitle" label-width="110px">
              <el-input
                :disabled="this.title === '详情'"
                v-model="form.modelTitle"
                placeholder="请输入模板标题"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="模板内容" prop="modelContent" label-width="110px">
              <el-input
                :disabled="this.title === '详情'"
                v-model="form.modelContent"
                placeholder="请输入模板内容"
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
import { add, update } from "@/api/tsp/model.js";
export default {
  name: "eForm",
  data() {
    return {
      props: { multiple: true },
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {
        pageNum:1,
        pageSize:10,
      },
      dialogVisible: false,
      areas: [],
      // 表单校验
      rules: {
        modelTitle: [
          { required: true, message: "模板标题不能为空", trigger: "blur" }],
        modelContent: [
          { required: true, message: "模板内容不能为空", trigger: "blur" }],
      },
    };
  },
  created() {},
  methods: {
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if ('pageNum' in this.form) {
              this.form.pageNum = 1,
              this.form.pageSize = 10
            }
            else {
              this.form.pageNum = 1,
              this.form.pageSize = 10
            }
          if (this.title === "新建短信模板" ) {
            add(this.form).then((res) => {
              this.$modal.msgSuccess("操作成功");
              this.$parent.getList();
              this.cancel();
            });
          } else {
            update(this.form).then((res) => {
              this.$modal.msgSuccess("操作成功");
              this.$parent.getList();
              this.cancel();
            });
          }
        }
      });
    },
    userLabelChange(val) {
      console.log(val);
      // this.userLabelList.push(val);
      // this.form.userLabels = this.userLabelList;
    },
    onCheck(val) {
      if (!val) {
        this.form.publishTimes = [];
      }
    },
    // 添加发送时间选择框
    addItem() {
      this.publishTimes.push("");
    },
    // 删除发送时间选择框
    removeItem(i) {
      this.publishTimes.splice(i, 1);
      console.log(i);
    },
    // 表单重置
    reset() {
      this.form = {
        publishTimes: [],
      };
      this.publishTimes = [];
      this.sendTimeStart = "";
      this.publish = false;
      this.resetForm("form");
    },
    // change() {
    //   this.informationModel = 
    // },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // // 时间转换
    // timeConversion() {
    //   if (this.title === "创建固定消息" || this.title === "编辑固定消息") {
    //     this.form.publishTimes[0] = parseTime(this.sendTimeStart);
    //   } else {
    //     this.form.publishTimes[0] = this.sendTimeStart;
    //     let arrTime = [];
    //     for (const key in this.publishTimes) {
    //       if (key != "") {
    //         console.log(key);
    //         let time = parseTime(key);
    //         console.log(time);
    //         arrTime.push(key);
    //         this.form.sendTimes = arrTime;
    //       }
    //     }
    //   }
    // },
  },
};
</script>
  
  <style>
</style>