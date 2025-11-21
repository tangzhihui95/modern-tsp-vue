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
            <el-form-item label="标签名称" prop="tagName" label-width="110px">
              <el-input
                :disabled="this.title === '查看详情'"
                v-model="form.tagName"
                placeholder="请输入标签名称"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item
              label="信息位"
              prop="tagType"
              label-width="110px"
            >
              <el-select
                v-model="form.tagType"
                :props="props"
                :disabled="this.title === '查看详情'"
                clearable
              >
                <el-option label="用户标签" :value="0"></el-option>
                <el-option label="车辆标签" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" :disabled="this.title === '查看详情'">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
  <script>
import { add, edit } from "@/api/tsp/tag.js";
import { parseTime } from "../../../../../utils/paramsUtil";
export default {
  name: "eForm",
  data() {
    return {
      // 推送方式
      publish: false,
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
      // 表单校验
      rules: {
        tagType: [
          { required: true, message: "tagType", trigger: "blur" }],
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
          if (this.title === "新增" ) {
            console.log("开始新增---");
            add(this.form).then((res) => {
              console.log("标签res：" + res);
              this.$modal.msgSuccess("操作成功");
              this.$parent.getList();
              this.cancel();
            });
          } else {
            console.log("开始修改---");
            this.form.createTime = null;
            this.form.updateTime = parseTime(new Date);
            edit(this.form).then((res) => {
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
    // 表单重置
    reset() {
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