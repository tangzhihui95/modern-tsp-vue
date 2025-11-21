<template>
  <div>
    <el-form>
      <el-row style="padding-top: 12px" type="flex" align="top">
        <el-col :span="6" :offset="1">
          <el-form-item>
            <el-radio-group v-model="radio" size="mini">
              <el-radio label="1" border>日</el-radio>
              <el-radio label="2" border>月</el-radio>
              <el-radio label="3" border>年</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>

        <div style="width: 300px;margin-left: 120px;">

          <el-form-item label="时间" label-width="100px" style="margin-left: 45px">
            <el-date-picker
              v-model="daterange"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              :picker-options="forbiddenTime"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              clearable
            ></el-date-picker>
          </el-form-item>

        </div>

        <div style="margin-left: 132px">
          <el-col>
            <el-form-item label="上牌地区">
              <el-col :span="5">
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
              <el-col :span="5">
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
              <el-col :span="5">
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
          </el-col>
        </div>


      </el-row>
      <el-row>
        <el-col :span="9" :offset="1">
          <el-form-item>
            <el-radio-group
              v-model="queryParams.timeState"
              size="mini"
              v-if="radio === '1'"
            >
              <el-radio :label="0" border>全部</el-radio>
              <el-radio :label="1" border><7天</el-radio>
              <el-radio :label="2" border>14天</el-radio>
              <el-radio :label="3" border>30天</el-radio>
            </el-radio-group>
            <el-radio-group
              v-model="queryParams.timeState"
              size="mini"
              v-if="radio === '2'"
            >
              <el-radio :label="0" border>全部</el-radio>
              <el-radio :label="90" border>3个月</el-radio>
              <el-radio :label="180" border>6个月</el-radio>
              <el-radio :label="365" border>12个月</el-radio>
            </el-radio-group>
            <el-radio-group
              v-model="queryParams.timeState"
              size="mini"
              v-if="radio === '3'"
            >
              <el-radio :label="0" border>全部</el-radio>
              <el-radio :label="1095" border>3年</el-radio>
              <el-radio :label="1825" border>5年</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>

        <el-row type="flex" align="top">
          <el-col :span="15">
            <el-form-item label="经销商地区" label-width="100px">
              <el-col :span="8">
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
              <el-col :span="8">
                <template>
                  <el-select
                    v-model="cityValueDealer"
                    clearable
                    @clear="clearCityDealer"
                    :disabled="disableCityDealer"
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
              <el-col :span="8">
                <template>
                  <el-select
                    v-model="areaValueDealer"
                    clearable
                    :disabled="disableAreaDealer"
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
          </el-col>

          <el-col :span="9">
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
        </el-row>

        <el-col :span="6" :offset="1">
          <el-button type="primary" @click="countSubmit">统 计</el-button>
          <el-button @click="clearAll">清除条件</el-button>
        </el-col>
      </el-row>

      <el-row style="padding-top: 12px" type="flex" align="top">
      </el-row>
    </el-form>
    <div style="margin-bottom: 40px;">
      <h3 style="text-align: center">车辆接入量统计（辆）</h3>
    </div>
    <ve-line
      v-if="ifShow"
      :data="chartData"
      use-data-converter
      :data-zoom="dataZoom"
      :yAxis="yAxis"
      :handler="handler"
      :extend="chartExtend"
    >
    </ve-line>
  </div>
</template>

<script>
import { simpleDataConverter } from 'v-charts-v2/lib/converter'
import { volumeChartData } from '@/api/tsp/tspVehicleData'
import { areaTrees, cityTrees, provincesTrees } from '@/api/tsp/provinces'
import { saleNameListByLikeAddress } from '@/api/tsp/vehicle' //柱状
export default {
  name: 'newVolumeIndex',
  created() {
    this.getVolumeChartData()
    provincesTrees().then((res) => {
      this.provincesOpt = res.result
      this.provincesOptDealer = res.result
    })
    this.getDealerNames('')
  },
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
    this.chartExtend = {
      series: {
        type:"line",
        smooth: true // 将曲线变为直线
      },
      minInterval: 1,
      type: 'value'
      // color: ["#E4004F", "#64C9FA"],
    }
    this.handler = {
      dataConverter: simpleDataConverter
    }

    return {
      forbiddenTime: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e7
        }
      },
      disableArea: true,
      disableCity: true,
      disableAreaDealer: true,
      disableCityDealer: true,
      radio: '1',
      queryParams: {},
      ifShow:true,
      dataZoom: [
        {
          show: true,
          realtime: true,
          start: 0,
          end: 50
        },
        {
          type: 'inside',
          realtime: true,
          start: 0,
          end: 50
        }
      ],
      yAxis: [{
        type: "value",
        max:function(value){ return value.max + (value.max/2)},
      }],
      chartSettings: {
        xAxisType: 'time',
        area: false, // 是否对折线下面进行颜色填充
        axisSite: { left: ['orderCount'] }, // left： 为左边要显示的数据，right：为右边要显示的数据。数据要一致。
        labelMap: { orderCount: '订单数量' } // 订单数量前面的变量要和axisSite 里面的变量相对应，这样鼠标经过时才会显示 ‘订单数量’
      },

      chartData: {
        // columns 里面放的是要展示的数据
        columns: ['date'],
        // 写入数据的地方
        rows: []
      },

      loading: false,
      dataEmpty: false,
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
      daterange: [],
      dealerNames: []

    }
  },
  methods: {
    countSubmit() {
      this.getVolumeChartData()
    },
    getVolumeChartData() {
      const loading = this.$loading({
        lock: true,
        text: '疯狂加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      if (this.daterange && this.daterange.length > 0) {
        this.queryParams.startTime = this.daterange[0]
        this.queryParams.endTime = this.daterange[1]
      } else {
        this.queryParams.startTime = null
        this.queryParams.endTime = null
      }
      if (this.queryParams.timeState === 0) {
        this.queryParams.timeState = null
      }
      volumeChartData(this.queryParams).then(res => {

        this.chartData = {
          // columns 里面放的是要展示的数据
          columns: ['date'],
          // 写入数据的地方
          rows: []
        }
        loading.close()
        if (JSON.stringify(res.result) !== '{}') {
          this.ifShow = true;
          for (let i in res.result) {
            let key = i + ''
            if (this.chartData.rows.length === 0) {
              res.result[key].forEach(item => {
                let arr = { date: item['date'] }
                this.chartData.rows.push(arr)
              })
            }
            for (let j = 0; j < this.chartData.rows.length; j++) {
              this.chartData.rows[j][key] = res.result[key][j].count
            }
            this.chartData.columns.push(key)
          }
        } else {
          this.ifShow = false;
          this.chartData.rows = [[[]]]
          /*this.chartData = {
            // columns 里面放的是要展示的数据
            columns: ['date'],
            // 写入数据的地方
            rows: []
          } */
        }
      })
    },
    getCity(provinceValue) {
      this.disableCity = false;
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
      if (cityValue != null && cityValue !== '') {
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
      this.provinceValue=''
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
      // this.provinceValueDealer = ''
      this.cityValueDealer = ''
      this.queryParams.dealerAddressValue = '';
      this.addressLike = ""
      // this.getDealerNames(this.addressLike);
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
      // this.addressLike = this.provinceValueDealer
      // this.getDealerNames(this.addressLike);
      this.areaValueDealer = ''
      this.areaDealer = {
        label: null,
        value: null
      }
    },

    clearAll() {
      this.addressLike = ''
      // this.getDealerNames('')
      this.disableAreaDealer = true
      this.disableCityDealer = true
      this.disableArea = true
      this.disableCity = true
      this.queryParams = {
        timeState: ''
      }
      this.daterange = []
      this.provinceValue = ''
      this.cityValue = ''
      this.areaValue = ''
      this.provinceValueDealer = ''
      this.cityValueDealer = ''
      this.areaValueDealer = ''
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
      this.provinceDealer = {
        label: null,
        value: null
      }
      this.cityDealer = {
        label: null,
        value: null
      }
      this.areaDealer = {
        label: null,
        value: null
      }

      this.radio = '1'
      this.daterange = []
      this.getVolumeChartData()
    }
  }
}
</script>

<style scoped>

</style>
