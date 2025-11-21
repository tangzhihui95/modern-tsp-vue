<template>
  <div>
    <el-form label-width="80px" v-model="queryParams">
      <el-row  style="padding-top: 12px" type="flex" align="top">
        <el-col :span="5">
          <el-form-item label="关键字" label-width="80px" prop="search">
            <el-input
              type="input"
              placeholder="请输入标题"
              maxlength="30"
              v-model="queryParams.search"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="选择时间" label-width="100px" prop="createTime">
            <el-date-picker
              v-model="dateRange"
              style="width: 240px"
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
          <el-form-item
            label="信息位"
            label-width="100px"
            prop="informationType"
          >
            <el-select v-model="queryParams.informationType" clearable>
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
        <el-col :span="4">
          <el-form-item
            label="信息状态"
            label-width="100px"
            prop="informationStatus"
          >
            <el-select v-model="queryParams.informationStatus" clearable>
              <el-option label="待发布" :value="0"></el-option>
              <el-option label="已发布" :value="1"></el-option>
              <el-option label="已下线" :value="2"></el-option>
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
        <el-col :span="11" style="margin-left: 20px">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
            v-hasPermi="['tsp:information:add']"
            >发布信息</el-button
          >
        </el-col>
      </el-row>
    </el-form>
    <el-table :data="informationList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="序号" type="index" width="50" align="center">
        <template slot-scope="scope">
          <span>{{
            (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="信息位" align="center" prop="type"/>
      <!-- <template slot-scope="scope">
          {{
            scope.row.informationType == 0
            ? "系统消息"
            : scope.row.informationType == 1
            ? "告警通知"
            : scope.row.informationType == 2
            ? "推荐消息"
            : scope.row.informationType == 3
            ? "问卷调查"
            : scope.row.informationType == 4
            ? "轮播广告"
            : scope.row.informationType == 5
            ? "启动页广告"
            : scope.row.informationType == 6
            ? "保养提醒"
            : ""
          }}
        </template> -->
      <el-table-column label="标题" align="center" prop="informationTitle" />
      <el-table-column label="状态" align="center" prop="status"/>
      <!-- <template slot-scope="scope">
          {{
            scope.row.informationStatus == 0
            ? "待发布"
            : scope.row.informationStatus == 1
            ? "发布中"
            : scope.row.informationStatus == 2
            ? "已下线"
            : ""
          }}
        </template> -->
      <el-table-column
        label="信息点击量"
        align="center"
        prop="informationCount"
      />
      <el-table-column
        label="信息有效期"
        align="center"
        prop="term"
        width="160"
      />
      <el-table-column label="创建时间" align="center" prop="createTime" />
      <el-table-column label="下线时间" align="center" prop="unloadTime" />
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
            v-hasPermi="['tsp:information:get']"
            >预览</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['tsp:information:edit']"
            :disabled="scope.row.informationStatus !== 0"
            >修订</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-top"
            v-show="scope.row.informationStatus === 0"
            @click="handleState(scope.row)"
            v-hasPermi="['tsp:information:unload']"
          >
          上线
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-bottom"
            v-show="scope.row.informationStatus === 1"
            @click="handleState(scope.row)"
            v-hasPermi="['tsp:information:unload']"
          >
          下线
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
    <eForm ref="form" />
  </div>
</template>

<script>
import { list, get, offline } from "@/api/tsp/information.js";
import eForm from "../publish/eForm/index.vue";
export default {
  name: "publish",
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
      informationList: [],
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
  beforeDestroy() {
    this.$once('hook:beforeDestroy',() =>{
      clearInterval(this.timer)
    })
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
        this.informationList = res.result.list;
        this.total = res.result.total;
        loading.close();
      });
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
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
    // 发布信息
    handleAdd() {
      this.$refs.form.title = "发布信息";
      this.$refs.form.open = true;
    },
    // 编辑
    handleUpdate(row) {
      get(row.id).then((res) => {
        this.$refs.form.form = res.result;
        this.$refs.form.form.tspInformationId = row.id;
        this.$refs.form.publishDateTime = res.result.termStr;
        this.$refs.form.informationModel = res.result.informationModel === "链接" ? "1" : "0";
      });
      this.$refs.form.title = "编辑信息";
      this.$refs.form.open = true;
    },
    // 查看详情
    handleInfo(row) {
      get(row.id).then((res) => {
        this.$refs.form.title = "查看详情";
        this.$refs.form.form = res.result;
        this.$refs.form.publishDateTime = res.result.termStr;
        this.$refs.form.informationModel = res.result.informationModel === "链接" ? "1" : "0";
      });
      this.$refs.form.open = true;
    },
    // 创建固定消息
    addFixed() {
      this.$refs.form.title = "创建固定消息";
      this.$refs.form.open = true;
    },
    // 下线
    handleState(row) {
      offline(row.id).then((res) => {
        this.getList();
        this.$modal.msgSuccess("操作成功");
      });
    },
  },
};
</script>

<style></style>
