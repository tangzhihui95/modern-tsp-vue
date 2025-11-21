<template>
  <div>
    <el-row>
      <el-form>
        <div style="display: flex; margin-top: 10px;">
          <div style="width: 60%; max-width:800px;">
            <el-form-item
              label="统计时间"
              label-width="110px"
              prop="daterange"
            >
            <el-date-picker
                style="width: 240px"
                v-model="daterange"
                value-format="yyyy-MM-dd"
                :picker-options="forbiddenTime"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                clearable
              ></el-date-picker>

            <el-radio-group size="mini" v-model="timeRadioValue" @input="selectTimeRadio">
                <el-radio :label="1" border style="margin-left: 5px;margin-right: 0px;">近七天</el-radio>
                <el-radio :label="2" border style="margin-left: 5px;margin-right: 0px;">近半个月</el-radio>
                <el-radio :label="3" border style="margin-left: 5px;margin-right: 0px;">近一个月</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <div style="width: 40%;">
            <el-form-item label="上牌地区" label-width="110px">
              <el-col :span="7" class="maxWidth200">
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
              <el-col :span="7" class="maxWidth200">
                <template>
                  <el-select
                    v-model="cityValue"
                    clearable
                    @clear="clearCity"
                    placeholder="请选择市"
                    :disabled="disableCity"
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
              <el-col :span="7" class="maxWidth200">
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
          <div style="width: 60%;display: flex;align-items: flex-start;  max-width:800px;">
            <el-form-item label="经销商地区" label-width="110px">
              <el-col :span="8" class="maxWidth200">
                <template>
                  <el-select
                    v-model="provinceValueDealer"
                    placeholder="请选择省"
                    @clear="clearProvinceDealer"
                    clearable
                    @change="getCityDealer()"
                  >
                    <el-option
                      v-for="province in provincesOptDealer"
                      :key="province.value"
                      :label="province.label"
                      :value="province.value"
                    >
                    </el-option>
                  </el-select>
                </template>
              </el-col>
              <el-col :span="8" class="maxWidth200">
                <template>
                  <el-select
                    v-model="cityValueDealer"
                    clearable
                    :disabled="disableCityDealer"
                    @clear="clearCityDealer"
                    placeholder="请选择市"
                    @change="getAreaDealer"
                  >
                    <el-option
                      v-for="city in cityTreesOptDealer"
                      :key="city.value"
                      :label="city.label"
                      :value="city.value"
                    >
                    </el-option>
                  </el-select>
                </template>
              </el-col>
              <el-col :span="8" class="maxWidth200">
                <template>
                  <el-select
                    :disabled="disableAreaDealer"
                    v-model="areaValueDealer"
                    clearable
                    placeholder="请选择区"
                    @change="chooseAreaDealer"
                  >
                    <el-option
                      v-for="area in areaTreesOptDealer"
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

          <div style="width: 40%;">
            <el-col :span="12" style="max-width: 360px;">
              <el-form-item
                label="经销商"
                label-width="110px"
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
            </el-col>

            <el-col :span="12">
              <el-button type="primary" style="margin-left: 20px;" @click="countSubmit">统 计</el-button>
              <el-button @click="clearAll">清除条件</el-button>
              <el-button
                  type="primary"
                  icon="el-icon-download"
                  @click="handleExport"
                  style="margin-left: 25px"
                >导 出</el-button>
            </el-col>
          </div>
        </div>


        <ve-line
          v-if="isShowChart"
          :data="chartData"
          :settings="chartSettings"
          :data-zoom="dataZoom"
          :yAxis="yAxis"
          :extend="chartExtend"
        ></ve-line>
      </el-form>
    </el-row>
  </div>


</template>

<script>
import { exportToExcel } from '@/api/tool/excel.js';

import VeHistogram from 'v-charts/lib/histogram' //柱状
import { getAllVehicleDailyStatistics } from '@/api/tsp/tspVehicleStatistics.js'
import { getLabelMap } from '@/api/tsp/vehicleStdModel.js'
import { areaTrees, cityTrees, provincesTrees } from '@/api/tsp/provinces.js'
import { saleNameListByLikeAddress } from '../../../../../api/tsp/vehicle'

export default {
  components: { VeHistogram },

  watch: {
    'provinceValueDealer': function (newVal, oldVal) {
      this.cityValueDealer = '';
      this.areaValueDealer = '';

      this.addressLike = newVal;
      this.queryParams.dealerAddressValue = this.addressLike;
      this.getDealerNames(this.addressLike);

      if (this.queryParams.dealerId && this.queryParams.dealerId !== null) {
        this.queryParams.dealerId = null;
      }
    },
    'cityValueDealer': function (newVal, oldVal) {
      if (this.provinceValueDealer === '') {
        return;
      }
      this.areaValueDealer = '';

      this.addressLike = this.provinceValueDealer + newVal;
      this.queryParams.dealerAddressValue = this.addressLike;
      this.getDealerNames(this.addressLike);

      if (this.queryParams.dealerId && this.queryParams.dealerId !== null) {
        this.queryParams.dealerId = null;
      }
    },
    'areaValueDealer': function (newVal, oldVal) {
      if (this.cityValueDealer === '') {
        return;
      }

      this.addressLike = this.provinceValueDealer + this.cityValueDealer + newVal;
      this.queryParams.dealerAddressValue = this.addressLike;
      this.getDealerNames(this.addressLike);

      if (this.queryParams.dealerId && this.queryParams.dealerId !== null) {
        this.queryParams.dealerId = null;
      }
    },
  },

  data() {
    (this.title = { text: '车辆活跃度统计(%)' }),
      (this.chartSettings = {
        labelMap: {
          date: "日期",
          value: '活跃度',
        }
      })
    this.chartExtend = {
      series: {
        smooth: true // 将曲线变为直线
      },
      // x轴字体斜显示
      xAxis: {
        axisLabel: {
          interval: 0,
          rotate: 30
        },
        triggerEvent: true
      },
      center: ['50%', '50%'],
      ///柱状图颜色顺序，需要手动设置顺序
      itemStyle: {
        normal: {
          color: (params) => {
            var colorList = [
              // "#65d186",
              // "#f67287",
              // "#f29e3c",
              // "#c05bdd",
              // "#f29e3c",
              // "#7a65f2",
              // "#65d186",
              // "#f67287",
            ] //每根柱子的颜色
            return colorList[params.dataIndex]
          }
        }
      }
    }
    return {
      yAxis: [{
        type: "value",
        max:function(value){ return value.max + (value.max/2)},
      }],
      forbiddenTime: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      disableArea: true,
      disableCity: true,
      disableAreaDealer: true,
      disableCityDealer: true,
      chartData: {
        columns: ["date", "value"],
        // columns: [],
        rows: []
      },
      dataZoom: [
        {
          type: 'slider',
          show: true,
          start: 0,
          end: 100,
          xAxisIndex: [0]
        }
      ],
      activeName: 'first',
      daterange: [],
      dealerNames: [],
      queryParams: {
      },
      // 省
      provincesOpt: [],
      // 市
      cityTreesOpt: [],
      // 区
      areaTreesOpt: [],
      // 省
      province: {
        label: null,
        value: null
      },
      // 市
      city: {
        label: null,
        value: null
      },
      // 区
      area: {
        label: null,
        value: null
      },
      provinceValue: '',
      cityValue: '',
      areaValue: '',
      dealerName: '',
      datas: [],
      labels: {},

      provinceValueDealer: '',
      cityValueDealer: '',
      areaValueDealer: '',

      // 省
      provincesOptDealer: [],
      // 市
      cityTreesOptDealer: [],
      // 区
      areaTreesOptDealer: [],
      // 省
      provinceDealer: {
        label: null,
        value: null
      },
      // 市
      cityDealer: {
        label: null,
        value: null
      },
      // 区
      areaDealer: {
        label: null,
        value: null
      },
      addressLike: '',
      isShowChart:false,
      timeRadioValue:3,
    }
  },
  created() {
    this.selectTimeRadio(this.timeRadioValue);

    // this.getLabelMap()
    this.getActivityData()
    provincesTrees().then((res) => {
      this.provincesOpt = res.result
      this.provincesOptDealer = res.result
    })
    this.getDealerNames('')
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

    getActivityData() {
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
            data.value = Math.floor(list[key].allRunningTime / 60);
            this.chartData.rows.unshift(data);
          }
          this.isShowChart = true;
        }

        loading.close();
      });
    },
    // getLabelMap() {
    //   getLabelMap().then((res) => {
    //     this.chartData.columns = []
    //     this.chartData.columns.push('date')
    //     this.chartData.columns.push('count')
    //     // this.chartSettings.labelMap = JSON.parse(res.result.modeNames);
    //     this.chartSettings.labelMap.date = res.result.date
    //     this.chartSettings.labelMap.count = res.result.count
    //     for (const key in this.chartSettings.labelMap) {
    //       if (
    //         this.chartSettings.labelMap[key] !== '时间' &&
    //         this.chartSettings.labelMap[key] !== '全国'
    //       ) {
    //         // this.chartData.columns.push(this.chartSettings.labelMap[key]);
    //       }
    //     }
    //   })
    // },
    getCity(provinceValue) {
      this.disableCity = false
      this.disableArea = true;

      this.areaValue = null;
      this.queryParams.areaValue = null;
      this.cityValue = null;
      this.queryParams.cityValue = null
      this.queryParams.provinceValue = provinceValue
      if (provinceValue != null && provinceValue !== '') {
        cityTrees(provinceValue).then((res) => {
          this.cityTreesOpt = res.result
        })
      }
    },
    getArea(cityValue) {
      this.disableArea = false;
      this.queryParams.areaValue = null;
      this.areaValue = null;
      this.queryParams.cityValue = cityValue
      if (cityValue != null && cityValue != '') {
        areaTrees(cityValue).then((res) => {
          this.areaTreesOpt = res.result
        })
      }
    },
    // 给区赋值
    chooseArea(areaValue) {
      this.queryParams.areaValue = areaValue
    },
    clearProvince() {
      this.disableArea = true
      this.disableCity = true
      this.cityValue = ''
      this.areaValue = ''
      this.city = {
        label: null,
        value: null
      }
      this.area = {
        label: null,
        value: null
      }
    },
    clearCity() {
      this.addressLike = this.addressLike.replace(this.areaValue,"")
      this.disableArea = true
      this.areaValue = ''
      this.area = {
        label: null,
        value: null
      }
    },

    // 经销商下拉列表
    getDealerNames(dealerName) {
      saleNameListByLikeAddress(dealerName).then((res) => {
        this.dealerNames = res.result
      })
    },
    clearProvinceDealer() {
      this.disableAreaDealer = true
      this.disableCityDealer = true
      this.addressLike = '';
      // this.getDealerNames(this.addressLike)
      this.cityValueDealer = ''
      this.areaValueDealer = ''
      this.city = {
        label: null,
        value: null
      }
      this.area = {
        label: null,
        value: null
      }
    },
    getCityDealer() {
      this.disableAreaDealer = true
      this.disableCityDealer = false
      // this.addressLike = this.provinceValueDealer
      if (this.provinceValueDealer != null && this.provinceValueDealer !== '') {
        // this.queryParams.dealerAddressValue = this.addressLike
        cityTrees(this.provinceValueDealer).then((res) => {
          this.cityTreesOptDealer = res.result
          // this.cityValueDealer = null
        })
        // this.getDealerNames(this.addressLike)
      }
    },
    getAreaDealer() {
      this.disableAreaDealer = false
      // this.addressLike = this.provinceValueDealer + this.cityValueDealer
      // this.queryParams.dealerAddressValue = this.addressLike
      if (this.cityValueDealer != null && this.cityValueDealer !== '') {
        areaTrees(this.cityValueDealer).then((res) => {
          this.areaTreesOptDealer = res.result
          // this.getDealerNames(this.addressLike)
        })
      }
    },
    // 给区赋值
    chooseAreaDealer() {
      // this.addressLike = this.provinceValueDealer + this.cityValueDealer + this.areaValueDealer
      // this.queryParams.dealerAddressValue = this.addressLike
      // this.getDealerNames(this.addressLike)
    },
    clearCityDealer() {
      this.disableAreaDealer = true
      this.areaValueDealer = ''
      // this.addressLike = this.provinceValueDealer;
      // this.getDealerNames(this.addressLike)
      this.areaDealer = {
        label: null,
        value: null
      }
    },

    countSubmit() {
      this.getActivityData()
    },
    clearAll() {
      this.addressLike = ''
      this.areaValueDealer = ''
      this.cityValueDealer = ''
      this.provinceValueDealer = ''
      this.disableAreaDealer = true
      this.disableCityDealer = true
      this.disableArea = true
      this.disableCity = true
      this.queryParams = {
      }
      this.daterange = []
      this.provinceValue = ''
      this.cityValue = ''
      this.areaValue = ''
      this.province = {
        label: null,
        value: null
      }
      this.city = {
        label: null,
        value: null
      }
      this.area = {
        label: null,
        value: null
      }
      this.dealerName = '',
        this.getActivityData()
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
          data.push(["日期", "车辆活跃度"]);
          for (const index in this.chartData.rows) {
            data.push([this.chartData.rows[index].date, this.chartData.rows[index].value]);
          }

          exportToExcel(data, "车辆活跃度统计_" + this.daterange[0] + "-" + this.daterange[1]);

          this.exportLoading = false;
        });
    },
  }
}
</script>

<style>
.maxWidth200 {
  max-width: 200px;
}
</style>
