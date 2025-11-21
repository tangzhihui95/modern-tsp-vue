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
        <span color="red">反馈信息</span>
        <el-row>
          <el-col :span="14">
            <el-form-item label="反馈账号" prop="createBy" label-width="110px">
              <el-input
                :disabled="this.title === '处理'"
                v-model="form.createBy"
                placeholder="请输入标题"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="反馈时间" prop="feedbackTime" label-width="110px">
              <el-date-picker
                style="width: 275px"
                v-model="form.feedbackTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="forbiddenTime"
                clearable
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="14">
            <el-form-item label="反馈内容" prop="feedbackContent" label-width="110px">
              <el-input
                :disabled="this.title === '处理'"
                v-model="form.feedbackContent"
                placeholder="请输入反馈内容"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        <span >处理信息</span>
        <el-row>
          <el-col :span="14">
            <el-form-item label="反馈状态" prop="feedbackStatus" label-width="110px">
              <el-input
                :disabled="this.title === '处理'"
                v-model="form.feedbackStatus"
                placeholder="反馈状态"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="处理反馈" prop="dealFeedback" label-width="110px">
              <el-input
                v-model="form.dealFeedback"
                placeholder="处理反馈"
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
import { parseTime } from "../../../../../utils/paramsUtil";
import { add, deal } from "@/api/tsp/feedback.js";
export default {
  name: "eForm",
  data() {
    return {
      // 用户选项
      userLabelOpt: [
        {
          label: "APP",
          value: "APP",
        },
      ],
      informationModel:"0",
      // 发送时间选择框起始框
      startTime: "",
      endTime:"",
      props: { multiple: true },
      sendChannelOpt: [
        {
          value: 2,
          label: "所有用户",
          children: [{}],
        },
        {
          value: 2,
          label: "APP用户",
          children: [{}],
        },
      ],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {
        pageNum:1,
        pageSize:10,
        // dealTime:null,
      },
      forbiddenTime:{
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      dialogVisible: false,
      areas: [],
      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            },
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            },
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            },
          },
        ],
      },
      // 表单校验
      rules: {
        feedbackContent: [
          { required: true, message: "反馈内容不能为空", trigger: "blur" }],
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
            // 格式化传递给后端的时间
            // this.form.sendTimes[0] = this.sendTimeStart;
            // let arrTime = [];
            // for (const key in this.sendTimes) {
            //   if (key != "") {
            //     console.log(key);
            //     let time = parseTime(key);
            //     console.log(time);
            //     arrTime.push(key);
            //     this.form.sendTimes = arrTime;
            //   }
            // }
            console.log(this.form);
            add(this.form).then((res) => {
              this.$modal.msgSuccess("操作成功");
              this.$parent.getList();
              this.cancel();
            });
          } else {
            this.form.createTime = null;
            this.form.updateTime = parseTime(new Date);
            // this.form.dealTime = parseTime(new Date);
            // 格式化传递给后端的时间
            console.log(this.form);
            deal(this.form).then((res) => {
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
    // 时间转换
    timeConversion() {
      if (this.title === "创建固定消息" || this.title === "编辑固定消息") {
        this.form.publishTimes[0] = parseTime(this.sendTimeStart);
      } else {
        this.form.publishTimes[0] = this.sendTimeStart;
        let arrTime = [];
        for (const key in this.publishTimes) {
          if (key != "") {
            console.log(key);
            let time = parseTime(key);
            console.log(time);
            arrTime.push(key);
            this.form.sendTimes = arrTime;
          }
        }
      }
    },
  },
};
</script>

  <style>
</style>
