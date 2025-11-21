<template>
  <div class="app-container">
    <el-form label-width="80px" v-model="queryParams">
      <el-row type="flex" align="top">
        <el-col :span="6">
          <el-form-item label="车辆查询" label-width="110px" prop="search">
            <el-input
              type="input"
              placeholder="车牌号、VIN、SN"
              maxlength="30"
              v-model="queryParams.search"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="上报时间" label-width="90px">
            <el-date-picker
              v-model="dateRange"
              style="width: 370px"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetimerange"
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              :picker-options="forbiddenTime"
              clearable
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="handleVehicleSearch" style="margin-left: 2%"
            >查 询</el-button
          >
          <el-button @click="clear">重置</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleExport"
          >导出</el-button
        >
      </el-col>
    </el-row>

    <el-table :data="datas">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="序号" type="index" width="50" align="center">
        <template slot-scope="scope">
          <span>{{
            (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1
          }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="VIN" align="center" prop="vin" />
      <el-table-column label="车牌号" align="center" prop="plateCode" />
      <el-table-column label="上报时间" align="center" prop="escalationTime" />
      <el-table-column label="解除时间" align="center" prop="relieveTime" />
      <el-table-column label="报警等级" align="center" prop="level" /> -->
      <el-table-column label="VIN" align="center" prop="vin" />
      <el-table-column label="车牌号" align="center" prop="plateCode" />
      <el-table-column label="上报时间" align="center" prop="collectTime" />
      <el-table-column label="解除时间" align="center" prop="dealTime" />
      <el-table-column label="报警等级" align="center" prop="maxAlarmLevel" />
      <el-table-column label="处理状态" align="center" prop="dealTime" >
        <template slot-scope="scope">
          {{scope.row.dealTime === null ? '未处理' : '已处理'}}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="160"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.dealTime === null"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['tsp:alert:deal']"
            >处理</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleInfo(scope.row)"
            v-hasPermi="['tsp:alert:get']"
            >详情</el-button
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
    <eForm ref="form" />
  </div>
</template>

<script>
import { getAlert, historyAlertExport, historyList } from '@/api/tsp/vehicleHistoryAlert.js'
import eForm from './eForm/index.vue'

export default {
  components: { eForm },
  data() {
    return {
      // 遮罩层
      // loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 日期范围
      dateRange: [],

      //获取的时间大于现在的时间为不可选
      forbiddenTime:{
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      // 总条数
      total: 0,
      // 用户表格数据
      datas: [],
      // formdata
      formDatas: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      open: false,
      title: "",
    };
  },
  created() {
    this.getList();
  },
  activated() {
    this.getList();
  },
  methods: {
    /** 查询列表 */
    getList() {
      const loading = this.$loading({
        lock: true,
        text: '数据疯狂加载中~',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      // this.loading = true;
      // list(this.queryParams).then((res) => {
      //   this.datas = res.result.list;
      //   this.total = res.result.total;
      //   this.loading = false;
      // });
      historyList(this.queryParams).then((res) => {
        console.log("查询结果----");
        console.log(res);
        this.datas = res.result.list;
        this.total = res.result.total;
        loading.close();
        // this.loading = false;
      });
    },
    // 添加
    handleAdd() {
      console.log(this.$refs.form.title);
      this.$refs.form.title = "处理";
      this.$refs.form.open = true;
    },
    handleInfo(row) {
      // get(row.id).then((res) => {
      //   console.log(res);
      //   this.$refs.form.form = res.result;
      //   this.$refs.form.alertList = res.result.alertDTO;
      // });
      getAlert(row.id).then((res) => {
        console.log(res);
        this.$refs.form.form = res.result;
        this.$refs.form.alertList = res.result.generalAlarmSigns;
        console.log("alertList：");
        console.log(this.$refs.form.alertList);
      });
      this.$refs.form.title = "详情";
      this.$refs.form.open = true;
    },
    // 编辑
    handleUpdate(row) {
      // get(row.id).then((res) => {
      //   console.log(res);
      //   this.$refs.form.form = res.result;
      //   this.$refs.form.form.tspVehicleAlertId = res.result.id;
      //   this.$refs.form.alertList = res.result.alertDTO;
      // });
      getAlert(row.id).then((res) => {
        console.log(res);
        this.$refs.form.form = res.result;
        this.$refs.form.alertList = res.result.generalAlarmSigns;
      });
      this.$refs.form.title = "处理";
      this.$refs.form.open = true;
    },

    // 点击切换条数
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.queryParams.pageSize = val;
      this.getList();
    },
    // 点击页数
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      //
      this.queryParams.pageNum = val;
      this.getList();
    },
    // 导出
    handleExport() {
      this.$modal
        .confirm("是否确认导出所有车辆信息数据项？")
        .then(() => {
          this.exportLoading = true;
          return historyAlertExport(this.queryParams);
        })
        .then((response) => {
          this.$download.name(response.msg);
          this.exportLoading = false;
        })
        .catch(() => {});
    },
    // 搜索
    handleVehicleSearch() {
      this.queryParams.collectStartTime = this.dateRange[0];
      this.queryParams.collectEndTime = this.dateRange[1];
      console.log(this.queryParams);
      this.getList();
    },
    clear() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
      };
      this.dateRange = [];
      this.getList();
    },
  },
};
</script>

<style>
</style>
