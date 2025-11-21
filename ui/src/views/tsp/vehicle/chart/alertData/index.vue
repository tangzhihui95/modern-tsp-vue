<template>
  <div style="padding-top: 10px;">
    <el-row>
      <el-form v-model="queryParams">

        <div style="display: flex;">
          <div style="width: 45%;">
            <el-form-item label="统计时间" label-width="110px" prop="daterange">
              <el-date-picker
                style="width: 240px"
                value-format="yyyy-MM-dd"
                v-model="daterange"
                type="daterange"
                :picker-options="forbiddenTime"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                clearable
              ></el-date-picker>
            </el-form-item>
          </div>
          <div style="width: 55%;">
            <el-form-item label="上牌地区：" label-width="110px">
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
          <div style="width: 45%;">
            <el-form-item label="关键字" label-width="110px" style="width: 350px">
              <el-input
                placeholder="车牌号、VIN、终端SN"
                v-model="queryParams.search"
                clearable
              />
            </el-form-item>
          </div>


            <div style="width: 55%;">
              <el-form-item label="经销商地区：" label-width="110px">
                <el-col :span="7" class="maxWidth200">
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
                <el-col :span="7" class="maxWidth200">
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
                <el-col :span="7" class="maxWidth200">
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

        </div>
        <div>
          <div style="width: 55%;display: flex;align-items: flex-start;">
            <el-form-item
              label="经销商"
              label-width="110px"
              prop="dealerName"
            >
              <el-select style="width: 240px"
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

            <el-button type="primary" style="margin-left: 10px;" @click="countSubmit">统 计</el-button>
            <el-button @click="clearAll">清除条件</el-button>
          </div>
        </div>

        <el-row>
          <el-col>
            <ve-ring
              :title="title"
              :data="chartData"
              :settings="chartSettings"
              :extend="chartExtend"
              legend-position="left"
            ></ve-ring>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
  </div>

</template>

<script>
import { alertData } from '@/api/tsp/tspVehicleData.js'
import { pasToVin } from '@/api/tsp/common.js'
import { areaTrees, cityTrees, provincesTrees } from '@/api/tsp/provinces.js'
import { saleNameListByLikeAddress } from '@/api/tsp/vehicle.js'

export default {
  data() {
    (this.title = {
      text: '统计时间段内的报警次数及占比',
      x: 'center',
      y: 'top'
    }),
      (this.chartSettings = {
        radius: [60, 100],
        avoidLabelOverlap: false,
        type: 'pie',
        labelMap: {
          alert: '报警',
          sale: '全国'
        },
        offsetY: 200
      })
    this.chartExtend = {
      legend: {
        show: true,
        left: '0'
      },
      list: []
    }
    return {
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
        columns: ['alert', 'sale'],
        rows: []
      },
      listLoading: false,
      daterange: [],
      dealerNames: [],
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
      addressLike: ''
    }
  },
  created() {
    this.daterange = [];
    let endDate = new Date();
    let startDate = new Date();
    this.daterange[1] = endDate.toISOString().slice(0, 10);
    startDate.setDate(startDate.getDate() - 30); // 将当前日期减去30天
    this.daterange[0] = startDate.toISOString().slice(0, 10);

    this.getAlertData()
    provincesTrees().then((res) => {
      this.provincesOpt = res.result
      this.provincesOptDealer = res.result
    })
    this.getDealerNames(this.addressLike)

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
  methods: {

    getAlertData() {

      const loading = this.$loading({
        lock: true,
        text: '疯狂加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      if (this.daterange && this.daterange.length > 0) {
        if(Math.ceil((new Date(this.daterange[1]) - new Date(this.daterange[0])) / 86400000) > 31) {
          this.$message.error('时间间隔不能超过30天！')
          loading.close();
          return;
        }

        this.queryParams.startTime = this.daterange[0]
        this.queryParams.endTime = this.daterange[1]
      }else{
        this.$message.error('请先选择时间段！')

        loading.close();

        return;
      }
      this.queryParams.dataType = 2
      if (this.queryParams.search != null && this.queryParams.search !== '') {
        pasToVin(this.queryParams.search).then((response) => {
          this.queryParams.search = response.result||this.queryParams.search
          alertData(this.queryParams).then((res) => {
            loading.close()
            this.chartData.rows = res.result
            console.log(this.chartData.rows)
          })

        })
      } else {
        alertData(this.queryParams).then((res) => {
          loading.close()
          this.chartData.rows = res.result
        })
      }
    },
    getCity(provinceValue) {
      this.disableCity = false
      this.disableArea = true;

      this.areaValue = null;
      this.queryParams.areaValue = null;
      this.cityValue = null;
      this.queryParams.cityValue = null
      this.queryParams.provinceValue = provinceValue
      if (provinceValue != null && provinceValue != '') {
        cityTrees(provinceValue).then((res) => {
          console.log('开始加载省份下面的地级市----')
          console.log(res.result)
          this.cityTreesOpt = res.result
          console.log('赋值完毕---')
          console.log(this.cityTreesOpt)
        })
      }
    },
    getArea(cityValue) {
      this.disableArea = false
      this.queryParams.areaValue = null;
      this.areaValue = null
      this.queryParams.cityValue = cityValue
      if (cityValue != null && cityValue != '') {
        areaTrees(cityValue).then((res) => {
          console.log('开始加载地级市下面的区/县----')
          console.log(res.result)
          this.areaTreesOpt = res.result
          console.log('赋值完毕---')
          console.log(this.areaTreesOpt)
        })
      }
    },
    // 给区赋值
    chooseArea(areaValue) {
      this.queryParams.areaValue = areaValue
      console.log(this.queryParams)
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
      this.addressLike = ""
      // this.getDealerNames(this.addressLike);
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
      // this.addressLike = this.provinceValueDealer
      // this.getDealerNames(this.addressLike);
      this.areaDealer = {
        label: null,
        value: null
      }
    },

    clearAll() {
      this.addressLike = ''
      // this.getDealerNames(this.addressLike)
      this.disableArea = true
      this.disableCity = true
      this.disableAreaDealer = true
      this.disableCityDealer = true
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
      this.dealerNameDealer = '',
        this.getAlertData()
    },
    countSubmit() {
      this.getAlertData()
    }
    // getSuiteResultStatusPieData() {
    //   this.listLoading = true;
    //   this.reportApi
    //     .getSuiteResultStatusPieData(this.form)
    //     .then((res) => {
    //       this.listLoading = false;
    //       this.$message({
    //         type: "success",
    //         message: res.data.msg,
    //       });
    //     })
    //     .catch((e) => {
    //       console.log(e);
    //     });
    // },
  }
}
</script>

<style>
.maxWidth200 {
  max-width: 200px;
}
</style>
