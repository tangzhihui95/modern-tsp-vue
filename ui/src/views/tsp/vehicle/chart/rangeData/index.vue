<template>
  <div>
    <el-row>
      <el-form>
        <el-tabs v-model="activeName" type="card">
          <el-tab-pane label="按上牌地区" name="first">
            <div style="display: flex;">
              <div style="width: 45%;">
                <el-form-item
                  label="统计时间"
                  label-width="110px"
                  prop="daterange"
                >
                  <el-date-picker
                    style="width: 240px"
                    v-model="daterange"
                    value-format="yyyy-MM-dd"
                    type="daterange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="forbiddenTime"
                    clearable
                  ></el-date-picker>
                </el-form-item>
              </div>
              <div style="width: 55%;">
                <el-form-item label="上牌地区：" label-width="100px">
                  <el-col :span="7">
                    <template>
                      <el-select
                        v-model="provinceValue"
                        placeholder="请选择省"
                        @clear="clearProvince"
                        clearable
                        @change="getCity(provinceValue)"
                      >
                        <el-option
                          v-for="province in provincesOpt"
                          :key="province.value"
                          :label="province.label"
                          :value="province.value"
                        >
                        </el-option>
                      </el-select>
                    </template>
                  </el-col>
                  <el-col :span="7">
                    <template>
                      <el-select
                        v-model="cityValue"
                        clearable
                        @clear="clearCity"
                        :disabled="disableCity"
                        placeholder="请选择市"
                        @change="getArea(cityValue)"
                      >
                        <el-option
                          v-for="city in cityTreesOpt"
                          :key="city.value"
                          :label="city.label"
                          :value="city.value"
                        >
                        </el-option>
                      </el-select>
                    </template>
                  </el-col>
                  <el-col :span="7">
                    <template>
                      <el-select
                        v-model="areaValue"
                        clearable
                        :disabled="disableArea"
                        placeholder="请选择区"
                        @change="chooseArea(areaValue)"
                      >
                        <el-option
                          v-for="area in areaTreesOpt"
                          :key="area.value"
                          :label="area.label"
                          :value="area.value"
                        >
                        </el-option>
                      </el-select>
                    </template>
                  </el-col>
                </el-form-item>
              </div>
            </div>
            <div style="display: flex;">
              <div style="width: 45%;">
                <el-form-item style="margin-left: 110px;">
                  <el-radio-group size="mini" v-model="timeRadioValue" @input="selectTimeRadio">
                    <el-radio :label="1" border>近七天</el-radio>
                    <el-radio :label="2" border>近半个月</el-radio>
                    <el-radio :label="3" border>近一个月</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
              <div style="width: 55%;display: flex;align-items: flex-start; ">
                <el-button type="primary" style="margin-left: 100px;" @click="countSubmit">统 计</el-button>
                <el-button @click="clearAll">清除条件</el-button>
                <el-button
                  type="primary"
                  icon="el-icon-download"
                  @click="handleExport"
                  style="margin-left: 25px"
                >导 出</el-button>
              </div>
            </div>
            <div style="margin-top: 10px;">
              <h3 style="text-align: center">行驶里程统计(公里)</h3>
              <h5 style="text-align: center">总里程:{{ mileageVehicleTotal / 10 }}km</h5>
              </div>

            <ve-line
              v-if="isShowChart"
              :data="chartData"
              :settings="chartSettings"
              :data-zoom="dataZoom"
              :extend="chartExtend"
              :yAxis="yAxis"
            ></ve-line>
          </el-tab-pane>

          <el-tab-pane label="按单车" name="second">
            <Bicycle v-if="activeName === 'second'" ref="form" />
          </el-tab-pane>
          <el-tab-pane label="按经销商地区" name="three">
            <Store v-if="activeName === 'three'" ref="form" />
          </el-tab-pane>

        </el-tabs>
      </el-form>

    </el-row>
  </div>

</template>

<script>
import { exportToExcel } from '@/api/tool/excel.js';

import { areaTrees, cityTrees, provincesTrees } from '@/api/tsp/provinces.js'
import { getAllVehicleDailyStatistics } from '@/api/tsp/tspVehicleStatistics.js'
import VeHistogram from 'v-charts/lib/histogram' //柱状
import Bicycle from './bicycle/index.vue'
import Store from '@/views/tsp/vehicle/chart/rangeData/Store'

export default {
  components: {Store, VeHistogram, Bicycle },
  data() {
    this.chartSettings = {
      labelMap: {
        date: "日期",
        mileageTotal: '里程',
      },
    };
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
      isShowChart: false,
      forbiddenTime:{
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      disableCity:true,
      disableArea:true,
      chartData: {
        columns: ["date", "mileageTotal"],
        rows: [
        ],
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
      activeName: "first",
      queryParams: {
      },
      mileageVehicleTotal: 0,
      // 省
      provincesOpt: [],
      // 市
      cityTreesOpt: [],
      // 区
      areaTreesOpt: [],
      // 省
      province: {
        label: null,
        value: null,
      },
      // 市
      city: {
        label: null,
        value: null,
      },
      // 区
      area: {
        label: null,
        value: null,
      },
      provinceValue: "",
      cityValue: "",
      areaValue: "",
      timeRadioValue:3,
    };
  },
  created() {
    this.selectTimeRadio(this.timeRadioValue);

    this.getRangeData();

    provincesTrees().then((res) => {
      this.provincesOpt = res.result;
    });
  },
  methods: {
    selectTimeRadio(label) {
      this.daterange = [];

      let endDate = new Date();
      let startDate = new Date();
      this.daterange[1] = endDate.toISOString().slice(0, 10);
      if (label === 3) {
        startDate.setDate(startDate.getDate() - 30); // 将当前日期减去30天
      } else if (label === 2) {
        startDate.setDate(startDate.getDate() - 15);
      } else if (label === 1) {
        startDate.setDate(startDate.getDate() - 7);
      }
      this.daterange[0] = startDate.toISOString().slice(0, 10);
    },

    getCity(provinceValue) {
      this.disableCity = false;
      this.disableArea = true;

      this.areaValue = null;
      this.queryParams.areaValue = null;
      this.cityValue = null;
      this.queryParams.cityValue = null
      this.queryParams.provinceValue = provinceValue;
      if (provinceValue != null && provinceValue !== "") {
        cityTrees(provinceValue).then((res) => {
          this.cityTreesOpt = res.result;
        });
      }
    },
    getArea(cityValue) {

      this.disableArea = false;
      this.queryParams.areaValue = null;
      this.areaValue = null
      this.queryParams.cityValue = cityValue;
      if (cityValue != null && cityValue !== "") {
        areaTrees(cityValue).then((res) => {
          this.areaTreesOpt = res.result;
        });
      }
    },
    // 给区赋值
    chooseArea(areaValue) {
      this.queryParams.areaValue = areaValue;
    },
    clearProvince() {
      this.cityValue = "";
      this.areaValue = "";
      this.disableArea = true;
      this.disableCity = true;
      this.city = {
        label: null,
        value: null,
      };
      this.area = {
        label: null,
        value: null,
      };
    },
    clearCity() {
      this.areaValue = "";
      this.disableArea = true;
      this.area = {
        label: null,
        value: null,
      };
    },
    getRangeData() {
      const loading = this.$loading({
        lock: true,
        text: '疯狂加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
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

      getAllVehicleDailyStatistics(this.queryParams).then((res) => {
        this.mileageVehicleTotal = 0;
        
        this.chartData.rows = [];
        let list = res.result;
        if(list.length === 0){
          this.isShowChart = false;
        }else{
          for (const key in list) {
            let data = {};
            data.date = list[key].statisticsDate;
            data.mileageTotal = list[key].allMileage;
            this.mileageVehicleTotal += data.mileageTotal;
            this.chartData.rows.unshift(data);
          }
          this.isShowChart = true;
        }

        loading.close();
      });
    },
    countSubmit() {
      this.getRangeData();
    },
    clearAll() {
      this.disableArea = true;
      this.disableCity = true;
      this.areaValue = "";
      this.cityValue = "";
      this.provinceValue = "";
      this.daterange = [];
      this.getRangeData();
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
          data.push(["日期", "行驶里程"]);
          for (const index in this.chartData.rows) {
            data.push([this.chartData.rows[index].date, this.chartData.rows[index].mileageTotal]);
          }

          exportToExcel(data, "行驶里程统计_" + this.daterange[0] + "-" + this.daterange[1]);

          this.exportLoading = false;
        });
    },
  },

};
</script>

<style>
</style>
