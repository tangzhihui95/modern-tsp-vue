<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="1300px"
      append-to-body
      :before-close="cancel"
      v-if="open"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-divider></el-divider>
        <el-row>
          <el-col :span="8">
            <el-form-item label="监控时间" label-width="110px">
              <el-time-picker
                is-range
                v-model="dateRange"
                format="HH:mm:ss"
                value-format="HH:mm:ss"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围"
                @change="onTimes"
              >
              </el-time-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item
              label="告警规则名称"
              prop="eventName"
              label-width="110px"
            >
              <el-input v-model="form.eventName" maxlength="30" placeholder="请输入" clearable/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="left">监控条件配置</el-divider>
        <el-row>
          <el-col :span="8">
            <el-form-item
              label="持续分钟"
              prop="continueMinute"
              label-width="110px"
            >
              <el-input-number v-model.number="form.continueMinute" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="告警级别"
              prop="eventLevel"
              label-width="110px"
            >
              <el-select v-model="form.eventLevel" placeholder="请选择告警级别" clearable>
                <el-option
                  v-for="(item, index) in eventLevelOption"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="left">子条件配置</el-divider>
        <div v-for="(item, index) in form.typeJson" :key="index">
          <el-row v-if="form.typeJson !== undefined">
            <el-col :span="7">
              <el-form-item
                label="规则类型"
                :prop="item[0].value"
                label-width="110px"
              >
                <el-select v-model="item[0].value" clearable>
                  <el-option
                    v-for="i in ruleOptions"
                    :key="i.label"
                    :label="i.label"
                    :value="i.value"
                  >
                  </el-option>
                </el-select>
                <!-- <el-input v-model="item[0].value" /> -->
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item :prop="item[1].value" label-width="110px">
                <el-select v-model="item[1].value" clearable>
                  <el-option label=">" value=">"></el-option>
                  <el-option label="=" value="-"></el-option>
                  <el-option label="<" value="<"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="阈值"
                :prop="item[2].value"
                label-width="110px"
              >
                <el-input v-model="item[2].value" clearable/>
              </el-form-item>
            </el-col>
            <el-col :span="7" v-if="item[2].label === '阈值'">
              <el-button @click="handleRemoveNode(index)">删除子条件</el-button>
            </el-col>
          </el-row>
        </div>
        <el-row>
          <el-col :span="3">
            <el-button @click="handleAddNode">添加子条件</el-button>
          </el-col>
          <el-col :span="3">
            <el-button @click="handleRemoveNodes">删除监控条件</el-button>
          </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row>
          <el-col>
            <el-form-item label="告警方式" prop="eventType" label-width="110px">
              <el-radio-group v-model="form.eventType">
                <el-radio :label="1">平台报警</el-radio>
                <el-radio :label="2">短信报警</el-radio>
                <el-radio :label="3">app端报警</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row>
          <el-form-item label="告警内容" prop="remark" label-width="110px">
            <el-col>
              <el-input
                type="textarea"
                v-model="form.remark"
                :rows="5"
                clearable
              ></el-input>
            </el-col>
          </el-form-item>
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
import { list, get, remove, add, edit } from "@/api/tsp/vehicleAlertEvent.js";
import alertEventOptions from "../alertEventOptions.json";

export default {
  name: "eForm",
  data() {
    return {
      eventLevelOption: [
        { label: "1,warning", value: 1 },
        { label: "2,warning", value: 2 },
        { label: "3,warning", value: 3 },
        { label: "4,warning", value: 4 },
        { label: "5,warning", value: 5 },
        { label: "6,warning", value: 6 },
      ],
      dateRange: "",
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {
        typeJson: [],
      },
      // 规则下拉列表
      ruleOptions: [],
      // 表单校验
      rules: {},
      alertList: [],
    };
  },
  created() {
    this.ruleOptions = alertEventOptions;
  },
  mounted() {},
  methods: {
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          //   console.log(typeof this.dateRange[0] );
          if (this.title === "告警配置") {
            this.form.monitorStartTime = this.dateRange[0];
            this.form.monitorEndTime = this.dateRange[1];
            add(this.form).then((res) => {
              this.$modal.msgSuccess("操作成功");
              this.$parent.getList();
              this.cancel();
            });
          } else {
            let times = [];
            times = this.dateRange;
            console.log(this.dateRange);
            this.form.monitorStartTime = times[0];
            this.form.monitorEndTime = times[1];
            edit(this.form).then((res) => {
              this.$modal.msgSuccess("操作成功");
              this.$parent.getList();
              this.cancel();
            });
          }
        }
      });
    },
    onTimes(v){
      console.log(v);
      this.dateRange = v;
    },
    handleAddNode() {
      if(!this.form.typeJson){
        this.form.typeJson = [];
      }
      this.form.typeJson.push([
        { name: "规则类型", value: "" },
        { name: "运算符", value: "" },
        { name: "阈值", value: "" },
      ]);
    },
    handleRemoveNodes() {
      this.form.typeJson = [];
    },
    handleRemoveNode(index) {
      if (this.form.typeJson.length === 0) {
        this.form.typeJson = [];
      }
      this.form.typeJson.splice(index, 1);
    },
    // 取消按钮
    cancel() {
      this.form = {};
      this.dateRange = "";
      this.form.typeJson = [];

      this.open = false;

      //以下代码临时修复连续多次打开dialog时点击“添加子条件”无显示
      this.$router.go(0);
    },
    handleRadio() {},
    handleChange() {},
  },
};
</script>

<style>
</style>
