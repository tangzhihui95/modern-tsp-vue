<template>
  <div>
    <el-row>
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
                <el-form-item label="经销商地区：" label-width="100px" style="margin-left: 10px">
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
                  <el-radio-group v-model="queryParams.timeState" size="mini">
                    <el-radio :label="0" border>全部</el-radio>
                    <el-radio :label="1" border>近七天</el-radio>
                    <el-radio :label="2" border>近半个月</el-radio>
                    <el-radio :label="3" border>近一个月</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
              <div style="width: 55%;display: flex;align-items: flex-start; ">
                <el-form-item
                  style="width: 276px"
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
                <el-button type="primary" style="margin-left: 23px;" @click="countSubmit">统 计</el-button>
                <el-button @click="clearAll" style="margin-left: 23px">清除条件</el-button>
<!--                <el-button
                  icon="el-icon-download"
                  @click="handleExport"
                  style="margin-left: 23px"
                >导 出</el-button>-->
              </div>
            </div>

      <div style="margin-top: 10px;">
        <h3 style="text-align: center">车辆在线统计（辆）</h3>
      </div>
            <ve-line
              v-if="ifShow"
              :data="chartData"
              :settings="chartSettings"
              :yAxis="yAxis"
              :data-zoom="dataZoom"
              :extend="chartExtend"
            ></ve-line>

    </el-row>
  </div>

</template>

<script>
import { onlineData } from '@/api/tsp/tspVehicleData'
import { areaTrees, cityTrees, provincesTrees } from '@/api/tsp/provinces'
import { saleNameListByLikeAddress } from '@/api/tsp/vehicle'

export default {
  name: "Store",
  data(){
    (this.title = { text: "在线统计(辆)" }),
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
      chartExtend:{},
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
          end: 30,
          xAxisIndex: [0],
        },
      ],
      chartSettings:{
        labelMap: {
          date: "日期",
          count: "全国",
        }
      },
      daterange: [],
      queryParams: {
        dataType : 3,
        dealerId:null,
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
      dealerNames:[],
      addressLike:"",
      ifShow:false,
    }
  },
  created() {
    this.queryParams.dataType = 3;
    this.getOnlineData();
    provincesTrees().then((res) => {
      this.provincesOpt = res.result;
    });
    this.getDealerNames(this.addressLike);
  },
  methods:{
    // 经销商下拉列表
    getDealerNames(dealerName) {
      saleNameListByLikeAddress(dealerName).then((res) => {
        this.dealerNames = res.result;
      });
    },
    clearProvince() {
      this.disableArea = true;
      this.disableCity = true;
      this.cityValue = "";
      this.areaValue = "";
      this.city = {
        label: null,
        value: null,
      };
      this.area = {
        label: null,
        value: null,
      };
      this.getDealerNames("");
    },
    getCity(provinceValue) {
      this.disableCity = false;
      this.disableArea = true;
      this.areaValue="";
      this.addressLike = provinceValue;
      this.queryParams.provinceValueDealer = provinceValue;
      if (provinceValue != null && provinceValue !== "") {
        cityTrees(provinceValue).then((res) => {
          this.cityTreesOpt = res.result;
          this.cityValue = null
        });
        this.getDealerNames(this.addressLike);
      }
    },
    getArea(cityValue) {
      this.disableArea = false;
      this.queryParams.cityValueDealer = cityValue;
      this.addressLike=this.queryParams.provinceValueDealer + cityValue
      if (cityValue != null && cityValue !== "") {
        areaTrees(cityValue).then((res) => {
          this.areaTreesOpt = res.result;
          this.getDealerNames(this.addressLike);
        });
      }
    },
    // 给区赋值
    chooseArea(areaValue) {
      this.queryParams.areaValueDealer = areaValue;
      this.addressLike=this.provinceValue + this.cityValue + areaValue;
      this.getDealerNames(this.addressLike);
    },
    clearCity() {
      this.disableArea = true;
      this.disableCity = false;
      this.areaValue = "";
      this.addressLike = this.queryParams.provinceValueDealer ;
      this.getDealerNames(this.addressLike);
      this.area = {
        label: null,
        value: null,
      };
    },
    clearAll() {
      this.addressLike = "";
      this.getDealerNames(this.addressLike);
      this.disableArea = true;
      this.disableCity = true;
      this.tagList = [];
      this.tagCityList = [];
      this.queryParams = {
        timeState: "",
      };
      this.queryParams.dataType = 3;
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
        this.getOnlineData();
    },
    countSubmit() {
      this.getOnlineData();
    },
    getOnlineData() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      if (this.daterange&&this.daterange.length > 0) {
        this.queryParams.startTime = this.daterange[0];
        this.queryParams.endTime = this.daterange[1];
      }else{
        this.queryParams.startTime = null;
        this.queryParams.endTime = null;
      }

      if(this.queryParams.timeState === 0){
        this.queryParams.timeState = null;
      }
      this.queryParams.dealerAddressValue = this.addressLike;
      onlineData(this.queryParams).then((res) => {
        this.chartData.rows = [];
        let list = res.result;

        if(list.lengthComputable === 0){
          this.ifShow = false;
        }else{
          for (const key in list) {
            let data = {};
            data.date = list[key].date;
            data.count = list[key].count;
            this.chartData.rows.push(data);
          }
          this.ifShow= true;
        }
        loading.close();
        console.log(res);
      });
    },
  }
}
</script>

<style scoped>

</style>
