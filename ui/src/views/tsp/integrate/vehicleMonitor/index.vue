<template>
  <div class="app-container">
    <el-form label-width="80px" v-model="queryParams">
      <el-row type="flex" align="top">
        <el-col :span="6">
          <el-form-item label="关键字" label-width="110px" prop="search">
            <el-input
              type="input"
              placeholder="SN、VIN、车牌号"
              maxlength="30"
              v-model="queryParams.search"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="关联账号" label-width="110px" prop="mobile">
            <el-select
              v-model="queryParams.mobile"
              placeholder="请选择关联账号"
              clearable
            >
              <el-option
                v-for="item in relationMobileOption"
                :key="item.mobile"
                :label="item.mobile"
                :value="item.mobile"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="6">
            <el-form-item label="车辆状态" label-width="110px" prop="state">
              <el-select v-model="queryParams.state" placeholder="请选择车辆状态">
                <el-option
                  v-for="item in vehicleOption"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
        <el-col :span="5">
          <el-button type="primary" @click="handleVehicleSearch" style="margin-left: 2%"
            >查 询</el-button
          >
          <el-button @click="clear">重置</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-table :data="vehicleList">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="序号" type="index" width="50" align="center">
        <template slot-scope="scope">
          <span>{{
            (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="VIN" align="center" prop="vin" />
      <el-table-column label="车牌号" align="center" prop="plateCode" />
      <el-table-column label="车型" align="center" prop="stdModeName" />
      <el-table-column label="关联账号" align="center" prop="mobile" />
      <el-table-column label="状态" align="center" prop="isOnline" v-if="false">
        <template slot-scope="scope">
          {{ scope.row.isOnline ? "在线" : "离线" }}
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
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleInfo(scope.row)"
            v-hasPermi="['tsp:vehicle:get']"
            >监控</el-button
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
  </div>
</template>

  <script>
import { listVehicle,relationMobileOption } from "@/api/tsp/vehicle.js";
export default {
  name: "vehicleMonitor",
  components: {},
  data() {
    return {
      // 遮罩层
      loading: true,
      vehicleList: [],
      // 导出遮罩层
      exportLoading: false,
      // 总条数
      total: 0,
      updateDataInterval: 1000,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      // 查询参数
      userQueryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      // 表单校验
      rules: {},
      open: false,
      title: "",
      relationMobileOption: [],
      vehicleOption: [],
      times:null,
    };
  },
  created() {
    this.getList();
    this.getMobileList();
  },

  beforeDestroy() {
    this.$once('hook:beforeDestroy',() =>{
      clearInterval(this.timer)
    })
  },
  activated() {},
  methods: {
    /** 查询列表 */
    getList() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      listVehicle(this.queryParams).then((res) => {
        console.log(res);
        this.vehicleList = res.result.list;
        this.total = res.result.total;
        loading.close();
      });
    },
    getMobileList() {
      relationMobileOption().then((res) => {
        console.log(res);
        this.relationMobileOption = res.result;
      })
    },
    handleInfo(row) {
      this.$router.push({
        name: "RealtimeDataMonitor",
        query: {
          vin: row.vin,
          interval: this.updateDataInterval,
        },
      });
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
    // 搜索
    handleVehicleSearch() {
      this.queryParams.pageNum = 1;
      console.log(this.queryParams);
      this.getList();
    },
    clear() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
      };
      this.getList();
    },
  },
};
</script>
