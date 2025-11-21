<template>
  <div>
    <el-row>
      <el-form>
        <el-col :span="6">
          <el-form-item label="统计时间" label-width="110px">
            <el-date-picker
              v-model="daterange"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              :picker-options="forbiddenTime"
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
        <el-col :span="5" style="margin-left: 10px">
          <el-button type="primary" @click="countSubmit">统 计</el-button>
          <el-button @click="clearAll">清除条件</el-button>
        </el-col>
      </el-form>
    </el-row>

    <el-row>
      <el-col>
        <ve-line
          v-if="ifShow"
          :data="chartData"
          :settings="chartSettings"
          :data-zoom="dataZoom"
          :yAxis="yAxis"
          :extend="chartExtend"
        ></ve-line>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="7" :offset="18">
        总里程:{{ mileageVehicleTotal }}km
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { rangeData } from '@/api/tsp/tspVehicleData.js'
import VeHistogram from 'v-charts/lib/histogram' //柱状
import { pasToVin } from '@/api/tsp/common.js'

export default {
  components: { VeHistogram },
  data() {
    (this.title = { text: "行驶里程(KM)" }),
      (this.chartSettings = {
        labelMap: {
          date: "日期",
          mileageTotal: "",
        },
      });
    this.chartExtend = {
      series: {
        smooth: true, //  false 直线，true 曲线
      },
      color: ["#E4004F", "#64C9FA"],
    };
    return {
      yAxis: [{
        type: "value",
        max:function(value){ return value.max + (value.max/2)},
      }],
      chartData: {
        columns: ["date", "mileageTotal"],
        rows: [
          // { date: "1月1日", sale: 1123 },
          // { date: "1月2日", sale: 1223 },
          // { date: "1月3日", sale: 2123 },
          // { date: "1月4日", sale: 4123 },
          // { date: "1月5日", sale: 3123 },
          // { date: "1月6日", sale: 7123 },
          // { date: "1月7日", sale: 1123 },
          // { date: "1月8日", sale: 1123 },
          // { date: "1月9日", sale: 1123 },
          // { date: "1月10日", sale: 1123 },
          // { date: "1月11日", sale: 1123 },
        ],
      },

      forbiddenTime:{
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
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
      queryParams: {search:""},
      mileageVehicleTotal: 0,
      ifShow:false,
    };
  },
  created() {
    this.getRangeData();
  },
  mounted() {},
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    handleRadio(val) {
      console.log(val);
    },
    getRangeData() {
      if (this.daterange&&this.daterange.length > 0) {
        this.queryParams.startTime = this.daterange[0];
        this.queryParams.endTime = this.daterange[1];
      }else{
        this.queryParams.startTime = null;
        this.queryParams.endTime = null;
      }
      if (this.queryParams.search != null && this.queryParams.search !== "") {

        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        pasToVin(this.queryParams.search).then((response) => {
          this.queryParams.search = response.result;
          this.queryParams.dataType = 2;
          this.chartSettings.labelMap.mileageTotal = this.queryParams.search;
          rangeData(this.queryParams).then((res) => {
            this.chartData.rows = [];
            this.mileageVehicleTotal = res.result.mileageVehicleTotal;
            let list = res.result.list;
            if (list.length > 0) {
              this.ifShow=true;
              for (const key in list) {
                let data = {};
                data.date = list[key].date;
                data.mileageTotal = list[key].mileage ;
                this.chartData.rows.push(data);
              }
            }else{
              this.ifShow=false;
            }
            loading.close();
            console.log(res);
          });
        });
      }
    },
    countSubmit() {
      this.getRangeData();
    },
    clearAll() {
      this.queryParams = {};
      this.queryParams.dataType = 2;
      this.daterange = [];
      this.getRangeData();
    },
  },
};
</script>

<style>
</style>
