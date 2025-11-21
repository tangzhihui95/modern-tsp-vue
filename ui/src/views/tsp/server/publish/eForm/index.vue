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
            <el-form-item
              label="标题"
              prop="informationTitle"
              label-width="110px"
            >
              <el-input
                :disabled="this.title === '查看详情'"
                v-model="form.informationTitle"
                placeholder="请输入标题"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item
              label="信息位"
              prop="informationType"
              label-width="110px"
            >
              <el-select
                v-model="form.informationType"
                :props="props"
                :disabled="this.title === '查看详情'"
                clearable
              >
                <el-option label="系统消息" :value="0"></el-option>
                <el-option label="告警消息" :value="1"></el-option>
                <el-option label="推荐消息" :value="2"></el-option>
                <el-option label="问卷调查" :value="3"></el-option>
                <el-option label="轮播广告" :value="4"></el-option>
                <el-option label="启动页广告" :value="5"></el-option>
                <el-option label="保养提醒" :value="6"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="17">
            <el-form-item
              label="信息格式"
              label-width="110px"
              prop="informationModel"
            >
              <template>
                <el-radio
                  v-model="informationModel"
                  label="0"
                  :disabled="this.title === '查看详情'"
                  >图文</el-radio
                >
                <el-radio
                  v-model="informationModel"
                  label="1"
                  :disabled="this.title === '查看详情'"
                  >链接</el-radio
                >
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="17">
            <el-form-item
              label="发布时间"
              label-width="110px"
              v-if="this.title !== '查看详情'  ||
                (this.title === '查看详情' && form.whetherPublishNow)"
            >
              <el-checkbox
                v-model="form.whetherPublishNow"
                :disabled="this.title === '查看详情'"
                @change="onCheck"
                >立即发布</el-checkbox
              >
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="!form.whetherPublishNow">
          <el-col :span="24">
            <template>
              <div class="block">
                <label style="margin-left: 40px;margin-right: 10px;">发布时间</label>
                <el-date-picker
                  :disabled="this.title === '查看详情'"
                  v-model="publishDateTime"
                  type="datetimerange"
                  :picker-options="pickerOptions"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  align="right"
                >
                </el-date-picker>
              </div>
            </template>
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
import { add, edit } from "@/api/tsp/information.js";
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
      informationModel: "0",
      // 推送方式
      publish: false,
      // 发送时间
      pickerOptions: [],
      // 发送时间选择框起始框
      startTime: "",
      endTime: "",
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
        pageNum: 1,
        pageSize: 10,
      },
      dialogVisible: false,
      areas: [],
      // pickerOptions:{
      //   disabledDate(time){
      //     return time.getTime() < Date.now();
      //   }
      // },
      // pickerOptions: {
      //   shortcuts: [
      //     {
      //       text: "最近一周",
      //       onClick(picker) {
      //         const end = new Date();
      //         const start = new Date();
      //         start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      //         picker.$emit("pick", [start, end]);
      //       },
      //     },
      //     {
      //       text: "最近一个月",
      //       onClick(picker) {
      //         const end = new Date();
      //         const start = new Date();
      //         start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      //         picker.$emit("pick", [start, end]);
      //       },
      //     },
      //     {
      //       text: "最近三个月",
      //       onClick(picker) {
      //         const end = new Date();
      //         const start = new Date();
      //         start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      //         picker.$emit("pick", [start, end]);
      //       },
      //     },
      //   ],
      // },
      publishDateTime: "",

      // 表单校验
      rules: {
        informationTitle: [
          { required: true, message: "标题不能为空", trigger: "blur" },
        ],
        informationType: [
          { required: true, message: "信息位不能为空", trigger: "blur" },
        ],
        informationModel: [
          { required: false, message: "信息格式不能为空", trigger: "blur" },
        ],
        publishTimes: [
          { required: true, message: "信息时间不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {},
  methods: {
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.pageNum = 1;
          this.form.pageSize = 10;
          if (this.title === "发布信息") {
            // 格式化传递给后端的时间
            this.form.createTime = parseTime(new Date());
            this.form.updateTime = parseTime(new Date());
            if (this.form.whetherPublishNow) {
              this.form.informationStatus = 1;
              this.publishDateTime = "";
            } else {
              this.form.informationStatus = 0;
            }
            // this.form.term[0] = this.startTime;
            // this.form.term[1] = this.endTime;
            // 格式化传递给后端的时间
            this.form.informationModel = this.informationModel;
            if (this.publishDateTime != null && this.publishDateTime !== "") {
              this.form.term =
                parseTime(this.publishDateTime[0]) + " - " + parseTime(this.publishDateTime[1]);
            }
            add(this.form).then((res) => {
              if (res.code === 200) {
                this.$modal.msgSuccess("操作成功");
                this.$parent.getList();
                this.cancel();
              }
            });
          } else {
            this.form.updateTime = parseTime(new Date());
            if (this.form.whetherPublishNow) {
              this.form.informationStatus = 0;
            } else {
              this.form.informationStatus = 1;
            }
            this.form.informationModel = this.informationModel;
            // 格式化传递给后端的时间
            if (this.publishDateTime != null && this.publishDateTime !== "") {
              this.form.term =
                parseTime(this.publishDateTime[0]) + " - " + parseTime(this.publishDateTime[1]);
            }
            edit(this.form).then((res) => {
              this.$modal.msgSuccess("操作成功");
              this.$parent.getList();
              this.cancel();
            });
          }
        }
      });
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
    cancel() {
      this.open = false;
      this.publishDateTime = "";
      this.reset();
    },
  },
};
</script>

<style>
</style>
