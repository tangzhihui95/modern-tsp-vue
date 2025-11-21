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
                    :picker-options="forbiddenTime"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
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
                        :disabled="disableCity"
                        @clear="clearCity"
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
                <el-form-item
                  style="width: 271px"
                  label="经销商"
                  label-width="100px"
                  prop="dealerName"
                >
                  <el-select
                    v-model="queryParams.dealerId"
                    placeholder="请选择经销商"
                    clearable
                  >
                    <el-option
                      v-for="item in dealerNames"
                      :key="item.id"
                      :label="item.dealerName"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-button type="primary" style="margin-left: 25px;" @click="countSubmit">统 计</el-button>
                <el-button @click="clearAll" style="margin-left: 25px">清除条件</el-button>
                <el-button
                  type="primary"
                  icon="el-icon-download"
                  @click="handleExport"
                  style="margin-left: 25px"
                >导 出</el-button>
              </div>
            </div>

            <div style="margin-bottom: 25px;">
              <h3 style="text-align: center">车辆在线统计（辆）</h3>
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

import { areaTrees, cityTrees, findCitys, provincesAll, provincesTrees } from '@/api/tsp/provinces.js'
import { getAllVehicleDailyStatistics } from '@/api/tsp/tspVehicleStatistics.js'
import VeHistogram from 'v-charts/lib/histogram' //柱状
import Bicycle from './bicycle/indexOnlineTime.vue'
import { saleNameListByLikeAddress } from '@/api/tsp/vehicle.js'
import Store from './Store'

export default {
  components: {Store, VeHistogram, Bicycle},
  data() {
    (this.title = {text: "车辆在线统计(辆)"}),
      // this.legend = { bottom: "0px" };
      (this.chartSettings = {
        labelMap: {
          date: "日期",
          count: "全国",
        },
      });
    this.chartExtend = {
      series: {
        smooth: true, // 将曲线变为直线
      },
      minInterval: 1,
      type: 'value',
      color: ["#E4004F", "#64C9FA"],
    };

    return {
      forbiddenTime:{
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      yAxis: [{
        type: "value",
        max:function(value){ return value.max + (value.max/2)},
      }],
      disableCity:true,
      disableArea:true,
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
      dialogVisible: false,
      dealerNames: [],
      activeName: "first",
      value2: "2",
      value1: "按省份",
      provincesList: [],
      checkboxList: [],
      tagList: [],
      // 地市
      cityOpen: false,
      cityList: [],
      checkboxCityList: [],
      tagCityList: [],
      queryParams: {},
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
      dealerName: "",
      // 导出遮罩层
      exportLoading: false,
      isShowChart:false,
      timeRadioValue:3,
    };
  },
  created() {
    this.selectTimeRadio(this.timeRadioValue);

    if (this.activeName === "second") {
      this.queryParams.dataType = 2;
    }
    if (this.activeName === "first") {
      this.queryParams.dataType = 1;
    }

    provincesTrees().then((res) => {
      this.provincesOpt = res.result;
    });

    this.getDealerNames();

    this.getVehicleRunningCount();

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

    getVehicleRunningCount() {
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
        this.chartData.rows = [];
        let list = res.result;
        if(list.length === 0){
          this.isShowChart = false;
        }else{
          for (const key in list) {
            let data = {};
            data.date = list[key].statisticsDate;
            data.count = list[key].allRunningCount;
            this.chartData.rows.unshift(data);
          }
          this.isShowChart = true;
        }

        loading.close();
      });
    },
    getCity(provinceValue) {
      this.disableCity = false;
      this.disableArea = true;
      this.queryParams.provinceValue = provinceValue;
      this.areaValue = null;
      this.queryParams.areaValue = null;
      this.cityValue = null;
      this.queryParams.cityValue = null
      if (provinceValue != null && provinceValue !== "") {
        cityTrees(provinceValue).then((res) => {
          this.cityTreesOpt = res.result;
        });
      }
    },
    getArea(cityValue) {
      this.disableArea = false;
      this.queryParams.cityValue = cityValue;
      this.queryParams.areaValue = null;
      this.areaValue = null
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
    // 经销商下拉列表
    getDealerNames() {
      saleNameListByLikeAddress("").then((res) => {
        this.dealerNames = res.result;
      });
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
          data.push(["日期", "在线数量"]);
          for (const index in this.chartData.rows) {
            data.push([this.chartData.rows[index].date, this.chartData.rows[index].count]);
          }

          exportToExcel(data, "车辆在线统计_" + this.daterange[0] + "-" + this.daterange[1]);

          this.exportLoading = false;
        });
    },
    handleOpen() {
      this.getProvincesAll();
      this.dialogVisible = true;
    },
    handleSubmit() {
      this.dialogVisible = false;
      this.tagList = this.checkboxList;
    },
    handleClose() {
      this.dialogVisible = false;
      this.checkboxList = [];
    },
    handleExceptRisk(val, index, e) {
      if (this.checkboxList.length >= 4) {
        this.checkboxList.shift();
      }
    },
    handleTagClose(tag) {
      this.tagList.splice(this.tagList.indexOf(tag), 1);
    },
    getProvincesAll() {
      provincesAll().then((res) => {
        this.provincesList = res.result;
      });
    },
    getCitys() {
      findCitys(this.tagList).then((res) => {
        this.cityList = res.result;
      });
    },
    handleTagCityClose(tag) {
      this.tagCityList.splice(this.tagCityList.indexOf(tag), 1);
    },
    handleCityOpen() {
      if (this.provincesList.length > 0) {
        this.getCitys();
      }
      this.cityOpen = true;
    },
    handleCityClose() {
      this.cityOpen = false;
      this.tagCityList = [];
    },
    handleCityExceptRisk() {
      if (this.checkboxCityList.length >= 4) {
        this.checkboxCityList.shift();
      }
    },
    handleCitySubmit() {
      this.cityOpen = false;
      this.tagCityList = this.checkboxCityList;
    },
    countSubmit() {
      this.getVehicleRunningCount();
    },
    clearAll() {
      this.getDealerNames();
      this.disableArea = true;
      this.disableCity = true;
      this.tagList = [];
      this.tagCityList = [];
      this.queryParams = {
      };
      if (this.activeName === "second") {
        this.queryParams.dataType = 2;
      }
      if (this.activeName === "first") {
        this.queryParams.dataType = 1;
      }
      if (this.activeName === "three") {
        this.queryParams.dataType = 3;
      }
      this.daterange = [];
      this.provinceValue = "";
      this.cityValue = "";
      this.areaValue = "";
      this.province = {
        label: null,
        value: null,
      };
      this.city = {
        label: null,
        value: null,
      };
      this.area = {
        label: null,
        value: null,
      };
      this.dealerName = "",
        this.getVehicleRunningCount();
    },
  },
};
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.el-radio {
  margin-right: 10px !important;
}
</style>
