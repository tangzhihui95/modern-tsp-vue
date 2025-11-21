<template>
  <div style="margin-top: 20px;">
    <el-form label-width="80px" v-model="queryParams">
      <el-row>
        <el-col :span="6">
          <el-form-item label="关键字" label-width="110px" prop="search">
            <el-input
              type="input"
              placeholder="VIN"
              maxlength="30"
              v-model="queryParams.search"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-button type="primary" @click="handleVehicleSearch" style="margin-left: 2%"
            >查 询</el-button
          >
          <el-button @click="clear">清除条件</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5" :offset="1">
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

    <el-table
      :data="vehicleList"
    >
      <el-table-column width="50" align="center" />
      <el-table-column label="序号" type="index" width="50" align="center">
        <template slot-scope="scope">
          <span>{{
            (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="车主姓名" align="center" prop="realName" />
      <el-table-column label="车主电话" align="center" prop="mobile" />
      <el-table-column label="车牌号" align="center" prop="plateCode" />
      <el-table-column label="VIN" align="center" prop="vin" />
      <el-table-column label="车型" align="center" prop="stdModeName" />
      <el-table-column label="流量统计" align="center" prop="traffic" />
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
  </div>
</template>

<script>
import { flowData, flowDataExport } from '@/api/tsp/tspVehicleData.js'

export default {
  data() {
    return {
      //车辆数据
      vehicleList: [],
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 日期范围
      dateRange: [],
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
        search: "",
        needAll: 1,
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
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

     flowData(this.queryParams).then((res) => {
        this.vehicleList = res.result.list;

        for (let i=0; i < this.vehicleList.length; i++) {
          if (this.vehicleList[i].traffic) {
            let traffic = this.vehicleList[i].traffic;
            this.vehicleList[i].traffic = traffic.substring(196, 205);
          }
        }

        this.total = res.result.total;
        loading.close();
      });
    },
    // 添加
    handleAdd() {
      this.$refs.form.title = "处理";
      this.$refs.form.open = true;
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
    // 导出
    handleExport() {
      this.$modal
        .confirm("是否确认导出所有车辆信息数据项？")
        .then(() => {
          this.exportLoading = true;
          let exportQueryParams = {
            pageNum: 1,
            pageSize: 9999,
            search: "",
          };
          return flowDataExport(exportQueryParams);
        })
        .then((response) => {
          this.$download.name(response.msg);
          this.exportLoading = false;
        })
        .catch(() => {});
    },
    // 搜索
    handleVehicleSearch() {
      this.queryParams.pageNum = 1;

      this.getList();
    },
    clear() {
      this.queryParams.pageNum = 1;
      this.queryParams.search = "";
      
      this.getList();
    },
  },
};
</script>

<style>
</style>
