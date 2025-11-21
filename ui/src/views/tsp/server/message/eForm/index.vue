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
            <el-form-item label="消息标题" prop="title" label-width="110px">
              <el-input
                :disabled="this.title === '查看详情'"
                v-model="form.title"
                placeholder="请输入消息标题"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item
              label="推送渠道"
              prop="sendChannel"
              label-width="110px"
            >
              <el-select
                v-model="form.sendChannel"
                placeholder="请选择推送渠道"
                :props="props"
                :disabled="this.title === '查看详情'"
                clearable
              >
                <el-option label="短信" :value="1"></el-option>
                <el-option label="APP" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="17">
            <el-form-item
              label="用户标签"
              label-width="110px"
              prop="userLabels"
            >
              <el-select
                v-model="form.userLabels"
                multiple
                placeholder="请选择用户标签"
                :disabled="this.title === '查看详情'"
                style="width: 100%"
                clearable
              >
                <el-option
                  v-for="item in labelList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row
          v-if="
            this.title !== '创建即时消息' &&
            this.title !== '编辑即时消息' &&
            this.form.sendType !== 1 &&
            this.form.sendType !== 2
          "
        >
          <el-col :span="17">
            <el-form-item label="触发方式" label-width="110px" prop="sendType">
              <el-select
                v-model="form.sendType"
                placeholder="请选择触发方式"
                :disabled="this.title === '查看详情'"
                clearable
              >
                <el-option label="事件触发" :value="3">事件触发</el-option>
                <el-option label="定时触发" :value="4">定时触发</el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row
          v-if="
            this.title === '创建即时消息' ||
            this.title === '编辑即时消息' ||
            (this.title === '查看详情' && this.form.sendType === 1)
          "
        >
          <el-col :span="17">
            <el-form-item label="推送时间" label-width="110px">
              <el-checkbox
                v-model="isSendNow"
                :label="isSendNow"
                :disabled="this.title === '查看详情'"
                @change="onCheck"
              >立即发送
              </el-checkbox
              >
            </el-form-item>
          </el-col>
        </el-row>
        <div
          v-if="
            (this.title === '创建即时消息' && !this.isSendNow) ||
            (this.title === '编辑即时消息' && !this.isSendNow) ||
            (this.title === '查看详情' &&
              !this.isSendNow &&
              this.form.sendType !== 3 &&
              this.form.sendType !== 4)
          "
        >
          <el-row>
            <el-col :span="17">
              <!-- 起始时间 -->
              <el-form-item label="推送时间" label-width="110px" style="position: relative">
                <el-date-picker
                  v-for="(item, i) in sendTimeStartList"
                  :key="i"
                  v-model="sendTimeStartList[i].sendTimeStart"
                  style="margin-bottom: 5px"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :disabled="title === '查看详情'"
                  type="datetime"
                  placeholder="请选择推送时间"
                  align="right"
                  :picker-options="pickerOptions"
                  @change="changeTimer"
                >
                </el-date-picker>
                <el-button
                  style="
                    position: absolute;
                    right: 100px;
                    top: -5px;
                    font-size: 20px;
                  "
                  v-if="
                    this.title !== '创建固定消息' &&
                    !this.isSendNow &&
                    this.title !== '编辑固定消息' &&
                    !this.isSendNow &&
                    this.title !== '查看详情'
                  "
                  type="text"
                  @click="addItem(1)"
                  icon="el-icon-circle-plus"
                />
                <el-button
                  style="
                    position: absolute;
                    right: 70px;
                    top: -5px;
                    font-size: 20px;
                    color: red;
                  "
                  v-if="
                    this.title !== '创建固定消息' &&
                    !this.isSendNow &&
                    this.title !== '编辑固定消息' &&
                    !this.isSendNow &&
                    this.sendTimeStartList.length > 1 &&
                    this.title !== '查看详情'
                  "
                  type="text"
                  @click="reduceItem(1)"
                  icon="el-icon-remove"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <el-row
          v-if="
            (this.title === '创建固定消息' && this.form.sendType === 4) ||
            (this.title === '编辑固定消息' && this.form.sendType === 4) ||
            (this.title === '查看详情' &&
              this.form.sendType === 4 &&
              this.form.sendType !== 3)
          "
        >
          <el-col :span="17">
            <el-form-item label="触发周期" label-width="110px" prop="cycle">
              <el-select
                v-model="form.cycle"
                placeholder="请选择触发周期"
                :disabled="this.title === '查看详情'"
                clearable
              >
                <el-option label="每日" :value="0">每日</el-option>
                <el-option label="每周" :value="1">每周</el-option>
                <el-option label="每月" :value="2">每月</el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div
          v-if="
            (this.title === '创建固定消息' && this.form.sendType === 4) ||
            (this.title === '编辑固定消息' && this.form.sendType === 4) ||
            (this.title === '查看详情' &&
              this.form.sendType === 4 &&
              this.form.sendType !== 3)
          "
        >
          <el-row>
            <el-col :span="17">
              <el-form-item
                label="触发时间"
                label-width="110px"
                style="position: relative"
              >
                <el-time-picker
                  v-for="(item, i) in fixTimeStartList"
                  :key="i"
                  v-model="fixTimeStartList[i].fixTimeStart"
                  style="margin-bottom: 5px"
                  value-format="HH:mm:ss"
                  :picker-options="{
                    selectableRange: '00:00:00 - 23:59:59',
                  }"
                  :disabled="title === '查看详情'"
                  placeholder="请选择触发时间"
                  @change="changeFixTimer"
                >
                </el-time-picker>
                <el-button
                  style="
                    position: absolute;
                    right: 100px;
                    top: -5px;
                    font-size: 20px;
                  "
                  type="text"
                  @click="addItem(2)"
                  icon="el-icon-circle-plus"
                  v-if="this.title !== '查看详情'"
                />
                <el-button
                  style="
                    position: absolute;
                    right: 70px;
                    top: -5px;
                    font-size: 20px;
                    color: red;
                  "
                  v-if="this.fixTimeStartList.length > 1
                  && this.title !== '查看详情'"
                  type="text"
                  @click="reduceItem(2)"
                  icon="el-icon-remove"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <el-row
          v-if="
            (this.title === '创建固定消息' && this.form.sendType === 3) ||
            (this.title === '编辑固定消息' && this.form.sendType === 3) ||
            // (this.title === '查看详情' && this.form.sendType === 4) ||
            (this.title === '查看详情' && this.form.sendType === 3)
          "
        >
          <el-col :span="17">
            <el-form-item label="触发事件" label-width="110px" prop="eventType">
              <el-select
                v-model="form.eventType"
                placeholder="请选择触发事件"
                :disabled="this.title === '查看详情'"
                clearable
              >
                <el-option label="系统通知" :value="1">系统通知</el-option>
                <el-option label="生日" :value="2">生日</el-option>
                <el-option label="车辆安防告警" :value="3"
                >车辆安防告警
                </el-option
                >
                <el-option label="车辆故障告警" :value="4"
                >车辆故障告警
                </el-option
                >
                <el-option label="保养" :value="5">保养</el-option>
                <el-option label="推荐消息" :value="6">推荐消息</el-option>
                <el-option label="车辆控制" :value="7">车辆控制</el-option>
                <el-option label="添加一般账户" :value="8"
                >添加一般账户
                </el-option
                >
                <el-option label="重置密码" :value="9">重置密码</el-option>
                <el-option label="重置PIN码" :value="10">重置PIN码</el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row
          v-if="
            this.title !== '创建即时消息' &&
            this.title !== '编辑即时消息' &&
            this.form.sendType !== 1 &&
            this.form.sendType !== 2
          "
        >
          <el-col :span="17">
            <el-form-item
              label="触发条件"
              label-width="110px"
              prop="triggerCondition"
            >
              <el-select
                v-model="form.triggerCondition"
                placeholder="请选择触发条件"
                :disabled="this.title === '查看详情'"
                clearable
              >
                <el-option label="生日提醒" :value="1">生日提醒</el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="this.form.sendChannel === 1">
          <el-col :span="17">
            <el-form-item label="消息模板" label-width="110px" prop="modelData">
              <el-table
                ref="singleTable"
                :data="modelData"
                highlight-current-row
                @current-change="handleNowChange"
                style="width: 100%"
              >
                <el-table-column
                  label="序号"
                  type="index"
                  width="50"
                  align="center"
                >
                  <template slot-scope="scope">
                    <span>{{
                        (queryParams.pageNum - 1) * queryParams.pageSize +
                        scope.$index +
                        1
                      }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="模板标题"
                  align="center"
                  prop="modelTitle"
                />
                <el-table-column
                  label="模板内容"
                  align="center"
                  prop="modelContent"
                />
                <el-table-column
                  label="操作"
                  align="center"
                  width="120"
                  class-name="small-padding fixed-width"
                >
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="text"
                      icon="el-icon-edit"
                      @click="handleCheck(scope.row)"
                    >选中
                    </el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryParams.pageNum"
                :page-sizes="[5, 10, 15, 20]"
                :page-size="queryParams.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
              >
              </el-pagination>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="17">
            <el-form-item label="消息内容" label-width="110px" prop="content">
              <el-input
                type="textarea"
                v-model="form.content"
                :disabled="this.title === '查看详情'"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          v-if="this.title !== '查看详情'"
          type="primary"
          @click="submitForm"
        >确 定
        </el-button
        >
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {parseTime} from "../../../../../utils/paramsUtil";
import {add, edit} from "@/api/tsp/message.js";
import {getLabel} from "@/api/tsp/tag.js";
import {listModel, update} from "@/api/tsp/model.js";

export default {
  name: "eForm",
  data() {
    return {
      // 推送方式
      isSendNow: false,

      // 发送时间选择框起始框
      sendTimeStartList: [{sendTimeStart: ""}],
      fixTimeStartList: [{fixTimeStart: ""}],
      props: {multiple: true},
      labelList: [{}],
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
      queryParams: {
        modelTitle: "",
        pageNum: 1,
        pageSize: 10,
      },
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      currentRow: null,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {
        sendTimes: [],
        content: null,
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
      modelData: [],
      // 表单校验
      rules: {
        title: [{required: true, message: "标题不能为空", trigger: "blur"}],
        sendChannel: [
          {required: true, message: "推送渠道不能为空", trigger: "blur"},
        ],
        userLabels: [
          {required: true, message: "用户标签不能为空", trigger: "blur"},
        ],
        content: [
          {required: true, message: "推送内容不能为空", trigger: "blur"},
        ],
        sendType: [
          {required: true, message: "触发方式不能为空", trigger: "blur"},
        ],
      },
    };
  },
  created() {
    this.getLabel();
    this.getModelList();
  },

  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    /** 提交按钮 */
    submitForm: function () {
      if (this.title === "创建即时消息" || this.title === "编辑即时消息") {
        if (this.isSendNow) {
          this.form.sendType = 1;
        } else {
          this.form.sendType = 2;
        }
      }

      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.title === "创建即时消息" || this.title === "创建固定消息") {

            this.timeConversion();  // 格式化传递给后端的时间

            add(this.form).then((res) => {
              this.$modal.msgSuccess("操作成功");
              this.$parent.getList();
              this.cancel();
            });
          } else {

            this.timeConversion();  // 格式化传递给后端的时间

            edit(this.form).then((res) => {
              this.$modal.msgSuccess("操作成功");
              this.$parent.getList();
              this.cancel();
            });
          }
        }
      });
    },
    changeTimer() {
      if (this.sendTimeStartList.length > 1) {
        for (var i = 0; i < this.sendTimeStartList.length - 1; i++) {
          if (this.sendTimeStartList[i] != "") {
            for (var j = i + 1; j <= this.sendTimeStartList.length - 1; j++) {
              if (
                this.sendTimeStartList[j] != "" &&
                this.sendTimeStartList[j] != null
              ) {
                if (
                  this.sendTimeStartList[i].sendTimeStart ===
                  this.sendTimeStartList[j].sendTimeStart &&
                  this.sendTimeStartList[i].sendTimeStart != "" &&
                  this.sendTimeStartList[j].sendTimeStart != "" &&
                  this.sendTimeStartList[i].sendTimeStart != null &&
                  this.sendTimeStartList[j].sendTimeStart != null
                ) {
                  alert("不可以选择相同的日期时间");
                  this.sendTimeStartList[j].sendTimeStart = "";
                }
              }
            }
          }
        }
      }
    },
    changeFixTimer() {
      if (this.fixTimeStartList.length > 1) {
        for (var i = 0; i < this.fixTimeStartList.length - 1; i++) {
          if (this.fixTimeStartList[i] !== "") {
            for (var j = i + 1; j <= this.fixTimeStartList.length - 1; j++) {
              if (
                this.fixTimeStartList[j] !== "" &&
                this.fixTimeStartList[j] !== null
              ) {
                if (
                  this.fixTimeStartList[i].fixTimeStart ===
                  this.fixTimeStartList[j].fixTimeStart &&
                  this.fixTimeStartList[i].fixTimeStart !== "" &&
                  this.fixTimeStartList[j].fixTimeStart !== "" &&
                  this.fixTimeStartList[i].fixTimeStart !== null &&
                  this.fixTimeStartList[j].fixTimeStart !== null
                ) {
                  alert("不可以选择相同的时间");
                  this.fixTimeStartList[j].fixTimeStart = "";
                }
              }
            }
          }
        }
      }
    },
    handleCheck(row) {
      this.form.content = row.modelContent;
    },
    getLabel() {
      getLabel(0).then((res) => {
        this.labelList = res.result;
      });
    },
    // 点击切换条数
    handleSizeChange(val) {
      this.queryParams.pageSize = val;
      this.getModelList();
    },
    // 点击页数
    handleCurrentChange(val) {
      this.queryParams.pageNum = val;
      this.getModelList();
    },
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row);
    },
    handleNowChange(val) {
      this.currentRow = val;
    },
    getModelList() {
      // this.loading = true;
      listModel(this.queryParams).then((res) => {
        this.modelData = res.result.list;
        this.total = res.result.total;
        // this.loading = false;
      });
    },
    onCheck(val) {
      if (!val) {
        this.form.sendTimes = [];
      }
    },
    // 添加发送时间选择框
    addItem(idx) {
      if (idx === 1) {
        this.sendTimeStartList.push({
          sendTimeStart: "",
        });
      } else {
        this.fixTimeStartList.push({
          fixTimeStart: "",
        });
      }
    },
    reduceItem(idx) {
      if (idx === 1) {
        this.sendTimeStartList.pop();
      } else {
        this.fixTimeStartList.pop();
      }
    },
    // 删除发送时间选择框
    removeItem(i) {
      this.sendTimeStartList.pop();
    },
    // 表单重置
    reset() {
      this.form = {
        sendTimes: [],
        content: null,
      };
      this.sendTimeStartList = [{sendTimeStart: ""}];
      this.fixTimeStartList = [{fixTimeStart: ""}];
      this.isSendNow = false;
      this.resetForm("form");
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 时间转换
    timeConversion() {
      this.form.sendTimes = [];
      if (this.title === "创建即时消息" || this.title === "编辑即时消息") {
        for (var i = 0; i < this.sendTimeStartList.length; i++) {
          if (this.sendTimeStartList[i].sendTimeStart !== null && this.sendTimeStartList[i].sendTimeStart !== "") {
            this.form.sendTimes.push(this.sendTimeStartList[i].sendTimeStart);
          }
        }
      } else if (this.title === "创建固定消息" || this.title === "编辑固定消息") {
        for (var i = 0; i < this.fixTimeStartList.length; i++) {
          if (this.fixTimeStartList[i].fixTimeStart !== null && this.fixTimeStartList[i].fixTimeStart !== "") {
            this.form.sendTimes.push(this.fixTimeStartList[i].fixTimeStart);
          }
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>

::v-deep input:disabled::-webkit-input-placeholder {
  -webkit-text-fill-color: rgba(255,255,255,0);
}

</style>
