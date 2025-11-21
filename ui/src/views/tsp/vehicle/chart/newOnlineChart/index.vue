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
        </el-col>
      </el-form>
    </el-row>
    <el-row>
      <el-col :offset="2">
<!--        <el-button style="margin-left: 5px " size="mini" icon="el-icon-download" @click="handleExport"
        >导 出
        </el-button
        >-->
      </el-col>
    </el-row>
    <el-row>
      <el-col>

        <div style="margin-top: 10px;">
          <h3 style="text-align: center">单车在线时长（分钟）</h3>
        </div>

        <ve-line
          :title="title"
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
import {onlineChartData, onlineExport} from "@/api/tsp/tspVehicleData.js";
import VeHistogram from "v-charts/lib/histogram"; //柱状
import {pasToVin} from "@/api/tsp/common.js";

export default {
  components: {VeHistogram},
  data() {
    // (this.title = { text: "在线统计(辆)" }),
    (this.chartSettings = {
      labelMap: {
        date: "日期",
        count: "全国",
      },
    });
    this.chartExtend = {
      series: {
        smooth: false, // 将曲线变为直线
      },
      color: ["#E4004F", "#64C9FA"],
    };
    return {
      chartData: {
        columns: ["date", "count"],
        rows: [],
      },
      dataZoom: [
        {
          type: "slider",
          show: true,
          start: 0,
          end: 30,
          xAxisIndex: [0],
        },
      ],
      radio1: "1",
      radio2: "1",
      radio3: "1",
      radio4: "1",
      activeName: "first",
      value2: "2",
      value1: "按省份",
      daterange: [],
      queryParams: {},
      mileageVehicleTotal: 0,
    };
  },
  created() {
    this.queryParams.dataType = 2;
    this.getOnlineData();
    // this.$nextTick(() => {
    //   this.$forceUpdate();
    // });
    // this.chartData = {
    //   columns: this.columnsList,
    //   rows: this.VeLineList,
    // };
  },
  mounted() {
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    handleRadio(val) {
      console.log(val);
    },
    getOnlineData() {
      if (this.daterange&&this.daterange.length > 0) {
        this.queryParams.startTime = this.daterange[0];
        this.queryParams.endTime = this.daterange[1];
      }else{
        this.queryParams.startTime = null;
        this.queryParams.endTime = null;
      }
      if (this.queryParams.search != null && this.queryParams.search != "") {
        pasToVin(this.queryParams.search).then((response) => {
          this.queryParams.search = response.result;
          this.queryParams.dataType = 2;
          this.chartSettings.labelMap.count = response.result
          onlineChartData(this.queryParams).then((res) => {
            this.chartData.rows = [];
            let list = res.result;
            for (const key in list) {
              let data = {};
              data.date = list[key].date;
              data.count = list[key].onlineTime;
              this.chartData.rows.push(data);
            }
            console.log(res);
          });
        });
      }
    },
    handleExport() {
      if (this.daterange.length > 0) {
        this.queryParams.startTime = this.daterange[0];
        this.queryParams.endTime = this.daterange[1];
      }
      this.$modal
        .confirm("是否确认导出所有数据项？")
        .then(() => {
          console.log(111);
          this.exportLoading = true;
          return onlineExport(this.queryParams);
        })
        .then((response) => {
          this.$download.name(response.msg);
          this.exportLoading = false;
        })
        .catch(() => {
        });
    },
    countSubmit() {
      this.getOnlineData();
    },
    clearAll() {
      this.queryParams = {};
      this.queryParams.dataType = 2;
      this.daterange = [];
      this.getOnlineData();
    },
  },
};
</script>

<style>
</style>
