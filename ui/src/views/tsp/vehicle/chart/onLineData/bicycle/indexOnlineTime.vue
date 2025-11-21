<template>
  <div>
    <el-row style="margin-top: 10px;">
      <el-form>
        <el-col :span="6">
          <el-form-item label="统计时间" label-width="110px">
            <el-date-picker
              v-model="daterange"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              :picker-options="pickerOptions"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              clearable
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="关键字" label-width="110px" style="margin-left: 130px">
            <el-input
              placeholder="车牌号、VIN、终端SN"
              v-model="queryParams.search"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-button type="primary" style="margin-left: 10px" @click="countSubmit">统 计</el-button>
          <el-button @click="clearAll">清除条件</el-button>
          <el-button
            type="primary"
            icon="el-icon-download"
            @click="handleExport"
            style="margin-left: 25px"
          >导 出</el-button>
        </el-col>
      </el-form>
    </el-row>
    <el-row>
      <el-col>

        <div style="margin-top: 10px;">
          <h3 style="text-align: center">单车在线时长（分钟）</h3>
        </div>

        <ve-line
          v-if="ifShow"
          :data="chartData"
          :settings="chartSettings"
          :data-zoom="dataZoom"
          :extend="chartExtend"
        ></ve-line>

      </el-col>
    </el-row>
  </div>
</template>

<script>
import { exportToExcel } from '@/api/tool/excel.js';

import { getVehicleDailyStatistics } from '@/api/tsp/tspVehicleStatistics.js'
import VeHistogram from 'v-charts/lib/histogram' //柱状
import { pasToVin } from '@/api/tsp/common.js'

export default {
  components: {VeHistogram},
  data() {
    // (this.title = { text: "在线统计(辆)" }),
    (this.chartSettings = {
      labelMap: {
        date: "日期",
        count: "在线时长",
      },
    });
    this.chartExtend = {
      series: {
        smooth: false, // 将曲线变为直线
      },
      color: ["#E4004F", "#64C9FA"],
    };
    return {
      ifShow:false,
      chartData: {
        columns: ["date", "count"],
        rows: [],
      },
      dataZoom: [
        {
          type: "slider",
          show: true,
          start: 0,
          end: 100,
          xAxisIndex: [0],
        },
      ],
      daterange: [],
      queryParams: {},
      mileageVehicleTotal: 0,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
    };
  },

  created() {
    this.daterange = [];
    let endDate = new Date();
    let startDate = new Date();
    this.daterange[1] = endDate.toISOString().slice(0, 10);
    startDate.setDate(startDate.getDate() - 30); // 将当前日期减去30天
    this.daterange[0] = startDate.toISOString().slice(0, 10);

    this.getOnlineData();
  },

  methods: {
    getOnlineData() {
      if (this.daterange&&this.daterange.length > 0) {
        if(Math.ceil((new Date(this.daterange[1]) - new Date(this.daterange[0])) / 86400000) > 31) {
          this.$message.error('时间间隔不能超过30天！')
          loading.close();
          return;
        }
        
        this.queryParams.startDate = this.daterange[0];
        this.queryParams.endDate = this.daterange[1];
      }else{
        this.$message.error('请先选择时间段！')

        loading.close();

        return;
      }
      if (this.queryParams.search != null && this.queryParams.search != "") {
        pasToVin(this.queryParams.search).then((response) => {
          this.queryParams.search = response.result;
          getVehicleDailyStatistics(this.queryParams).then((res) => {
            this.chartData.rows = [];
            let list = res.result;
            if (list.length > 0) {
              this.ifShow=true;
              for (const key in list) {
                let data = {};
                data.date = list[key].statisticsDate;
                data.count = list[key].runningTime;
                this.chartData.rows.push(data);
              }
            }else{
              this.ifShow=false;
            }
          });
        });
      }
    },

    handleExport() {
      if (this.daterange.length > 0) {
        this.queryParams.startDate = this.daterange[0];
        this.queryParams.endDate = this.daterange[1];
      }
      this.$modal
        .confirm("是否确认导出数据？")
        .then(() => {
          this.exportLoading = true;

          let data = [];
          data.push(["日期", "在线时长"]);
          for (const index in this.chartData.rows) {
            data.push([this.chartData.rows[index].date, this.chartData.rows[index].count]);
          }

          exportToExcel(data, "单车在线统计_" + this.queryParams.search + "_" + this.daterange[0] + "-" + this.daterange[1]);

          this.exportLoading = false;
        });
    },
    
    countSubmit() {
      this.getOnlineData();
    },
    clearAll() {
      this.queryParams = {};
      this.daterange = [];
      this.getOnlineData();
    },
  },
};
</script>

<style>
</style>
