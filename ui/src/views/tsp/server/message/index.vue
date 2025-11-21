<template>
  <div>
    <el-form label-width="60px" v-model="queryParams">
      <el-row style="padding-top: 12px" type="flex" align="top">
        <el-col :span="6">
          <el-form-item label="关键字" label-width="80px" prop="search">
            <el-input
              type="input"
              placeholder="标题、消息内容、创建人"
              maxlength="30"
              v-model="queryParams.search"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="创建时间" label-width="100px" prop="createTime">
            <el-date-picker
              v-model="dateRange"
              style="width: 230px"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetimerange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="forbiddenTime"
              clearable
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="消息类型" label-width="100px" prop="messageType">
            <el-select v-model="queryParams.messageType" clearable>
              <el-option label="即时消息" :value="1"></el-option>
              <el-option label="固定消息" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="消息状态" label-width="100px" prop="state">
            <el-select v-model="queryParams.state" clearable>
              <el-option label="启用" :value="1"></el-option>
              <el-option label="禁用" :value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4" style="text-align: right">
          <el-button type="primary" @click="handleSearch" style="margin-left: 2%"
            >查 询</el-button
          >
          <el-button @click="clear">重置</el-button>
        </el-col>
      </el-row>
      <el-row class="mb20" :gutter="10" style="margin-left: 20px">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
            v-hasPermi="['tsp:message:add']"
            >创建即时消息</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="addFixed"
            v-hasPermi="['tsp:message:addFixed']"
            >创建固定消息</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-chat-line-round"
            size="mini"
            @click="toModel"
            >短信模板</el-button
          >
        </el-col>
      </el-row>
    </el-form>
    <el-table :data="messageList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="序号" type="index" width="50" align="center">
        <template slot-scope="scope">
          <span>{{
            (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="消息类型" align="center">
        <template slot-scope="scope">
          {{
            scope.row.sendType ===1 || scope.row.sendType ===2 ? "即时消息" : "固定消息"
          }}
        </template>

      </el-table-column>
      <el-table-column label="推送方式" align="center" prop="sendChannel" />
      <el-table-column label="消息标题" align="center" prop="title" />
      <el-table-column label="消息内容" align="center" prop="content" />
      <el-table-column label="状态" align="center" prop="state">
        <template slot-scope="scope">
          {{ scope.row.state === 1 ? "启用" : "禁用" }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" />
      <el-table-column label="创建人" align="center" prop="createBy" />
      <el-table-column
        label="操作"
        align="center"
        width="160"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleInfo(scope.row)"
            v-hasPermi="['tsp:vehicle:get']"
            >详情</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['tsp:vehicle:edit']"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-sort"
            @click="handleState(scope.row)"
          >
            {{ scope.row.state === 1 ? "禁用" : "启用" }}
          </el-button>
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
<!--创建固定消息和即时消息弹窗-->
    <eForm ref="form" />
  </div>
</template>

<script>
import { list, add, edit, state, get } from "@/api/tsp/message.js";
import eForm from "../message/eForm/index.vue";
import { parseTime } from "../../../../utils/paramsUtil";
export default {
  name: "message",
  components: { eForm },
  data() {
    return {
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      title: "",
      // 遮罩层
      loading: true,
      messageList: [],
      // 日期范围
      dateRange: [],
      forbiddenTime:{
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 列表
    getList() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      list(this.queryParams).then((res) => {
        this.messageList = res.result.list;
        this.total = res.result.total;
        loading.close();
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    // 点击切换条数
    handleSizeChange(val) {
      this.queryParams.pageSize = val;
      this.getList();
    },
    // 点击页数
    handleCurrentChange(val) {
      this.queryParams.pageNum = val;
      this.getList();
    },
    // 搜索
    handleSearch() {
      this.queryParams.pageNum = 1;

      this.queryParams.startTime = this.dateRange[0];
      this.queryParams.endTime = this.dateRange[1];
      this.getList();
    },
    // 清除表单
    clear() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
      };
      this.dateRange = [];
      this.getList();
    },
    // 创建即时消息
    handleAdd() {
      this.$refs.form.title = "创建即时消息";
      this.$refs.form.open = true;
    },
    toModel() {
      // 新增电子围栏
      this.$router.push({
        name: "Tsp/server/model",
      });
    },
    // 编辑
    handleUpdate(row) {
      if (row.sendType === 1 || row.sendType === 2 ) {
        this.$refs.form.title = "编辑即时消息";
      } else {
        this.$refs.form.title = "编辑固定消息";
      }
      get(row.id).then((res) => {
        this.$refs.form.form = res.result;
        this.$refs.form.form.tspMessageId = row.id;

        if (row.sendType === 1 || row.sendType === 2 ) {
          //编辑即时消息
          if (res.result.sendTimes && res.result.sendTimes.length > 0) {
            this.$refs.form.sendTimeStartList = [];
            for (var i = 0; i < res.result.sendTimes.length; i++) {
              this.$refs.form.sendTimeStartList.push({sendTimeStart: res.result.sendTimes[i]});
            }
          }
          this.$refs.form.isSendNow = res.result.sendType === 1 ? true : false;
        } else {
          //编辑固定消息
          if (res.result.sendTimes && res.result.sendTimes.length > 0) {
            this.$refs.form.fixTimeStartList = [];
            for (var i = 0; i < res.result.sendTimes.length; i++) {
              this.$refs.form.fixTimeStartList.push({fixTimeStart: res.result.sendTimes[i]});
            }
          }
        }
      });
      this.$refs.form.open = true;
    },
    // 查看详情
    handleInfo(row) {
      get(row.id).then((res) => {
        this.$refs.form.title = "查看详情";
        this.$refs.form.form = res.result;

        if (row.sendType === 1 || row.sendType === 2 ) {
          //查看即时消息
          if (res.result.sendTimes && res.result.sendTimes.length > 0) {
            this.$refs.form.sendTimeStartList = [];
            for (var i = 0; i < res.result.sendTimes.length; i++) {
              this.$refs.form.sendTimeStartList.push({sendTimeStart: res.result.sendTimes[i]});
            }
          }
          this.$refs.form.isSendNow = res.result.sendType === 1 ? true : false;
        } else {
          //查看固定消息
          if (res.result.sendTimes && res.result.sendTimes.length > 0) {
            this.$refs.form.fixTimeStartList = [];
            for (var i = 0; i < res.result.sendTimes.length; i++) {
              this.$refs.form.fixTimeStartList.push({fixTimeStart: res.result.sendTimes[i]});
            }
          }
        }

      });
      this.$refs.form.open = true;
    },
    // 创建固定消息
    addFixed() {
      this.$refs.form.title = "创建固定消息";
      this.$refs.form.open = true;
    },
    // 修改状态
    handleState(row) {
      state(row.id).then((res) => {
        this.getList();
        this.$modal.msgSuccess("操作成功");
      });
    },
  },
};
</script>

<style></style>
