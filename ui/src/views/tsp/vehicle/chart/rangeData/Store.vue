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
                  :disabled="disableArea"
                  v-model="areaValue"
                  clearable
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
            style="width: 277px"
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
          <el-button style="margin-left: 23px" @click="clearAll">清除条件</el-button>
          <el-button
            type="warning"
            style="margin-left: 23px"
            icon="el-icon-download"
            @click="handleExport"
          >导 出</el-button>
        </div>
      </div>
      <ve-line
        v-if="ifShow"
        :data="chartData"
        :settings="chartSettings"
        :data-zoom="dataZoom"
        :yAxis="yAxis"
        :extend="chartExtend"
      ></ve-line>

    </el-row>

    <el-row>
      <el-col :span="7" :offset="18">
        总里程:{{ mileageVehicleTotal }}km
      </el-col>
    </el-row>
  </div>


</template>

<script>
import { rangeData, rangeDataExport } from '@/api/tsp/tspVehicleData'
import { areaTrees, cityTrees, provincesTrees } from '@/api/tsp/provinces'
import { saleNameListByLikeAddress } from '@/api/tsp/vehicle'

export default {
  name: "Store",
  data(){
    (this.title = { text: "行驶里程" }),
      this.chartSettings = {
        labelMap: {
          date: "日期",
          mileageTotal: '',
        },
      };
    this.chartExtend = {
      series: {
        smooth: true, // false 直线，true 曲线
      },
      color: ["#E4004F", "#64C9FA"],
    };
    return {
      yAxis: [{
        type: "value",
        max:function(value){ return value.max + (value.max/2)},
      }],
      forbiddenTime:{
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      disableCity:true,
      disableArea:true,
      chartData: {
        columns: ["date", "mileageTotal"],
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
      mileageVehicleTotal: 0,
      ifShow: false,
    }
  },
  created() {
    this.queryParams.dataType = 3;
    this.getRangeData();
    provincesTrees().then((res) => {
      this.provincesOpt = res.result;
    });
    this.getDealerNames(this.addressLike);
  },
  methods:{
    handleExport(){
      return rangeDataExport(this.queryParams).then(res=>{
        this.$download.name(res.msg);
        this.exportLoading = false;
      });
    },
    selectDealer(value){
      console.log(value)
      this.dealerNames.forEach(item=>{
        if(item.id === value){
          this.chartSettings.labelMap.mileageTotal = item.dealerName
        }
      })
    },
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
      this.addressLike=""
      this.getDealerNames(this.addressLike);
      this.city = {
        label: null,
        value: null,
      };
      this.area = {
        label: null,
        value: null,
      };
    },
    getCity(provinceValue) {
      this.disableArea = true;
      this.disableCity = false;
      this.addressLike = provinceValue;
      this.chartSettings.labelMap.mileageTotal = provinceValue
      this.queryParams.provinceValue = provinceValue;
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
      this.queryParams.cityValue = cityValue;
      this.queryParams.areaValue = null;
      this.areaValue = null;
      this.addressLike=this.queryParams.provinceValue + cityValue
      console.log(this.addressLike)

      this.chartSettings.labelMap.mileageTotal = this.addressLike
      if (cityValue != null && cityValue !== "") {
        areaTrees(cityValue).then((res) => {
          this.areaTreesOpt = res.result;
          this.getDealerNames(this.addressLike);
        });
      }
    },
    // 给区赋值
    chooseArea(areaValue) {
      this.queryParams.areaValue = areaValue;
      console.log(this.queryParams)

      this.addressLike=this.queryParams.provinceValue + this.queryParams.cityValue + areaValue;

      this.chartSettings.labelMap.mileageTotal = this.addressLike
      this.getDealerNames(this.addressLike);
    },
    clearCity() {
      this.disableArea = true;
      this.addressLike=this.queryParams.provinceValue
      this.getDealerNames(this.queryParams.provinceValue);
      this.areaValue = "";
      this.area = {
        label: null,
        value: null,
      };
    },
    clearAll() {
      this.addressLike=""
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
        this.getRangeData();
    },
    countSubmit() {
      this.getRangeData();
    },
    getRangeData() {
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
      if(this.queryParams.dealerId===undefined||this.queryParams.dealerId===null){
        this.queryParams.dealerAddressValue = this.addressLike
      }
      if(this.queryParams.timeState === 0){
        this.queryParams.timeState = null;
      }
      rangeData(this.queryParams).then((res) => {
        this.chartData.rows = [];
        this.mileageVehicleTotal = res.result.mileageVehicleTotal;
        let list = res.result.list;
        console.log(list);
        if(list.lengthComputable === 0){
          this.ifShow = false;
        }else{
          for (const key in list) {
            let data = {};
            data.date = list[key].date;
            data.mileageTotal = list[key].mileage;
            this.chartData.rows.push(data);
            console.log(this.chartData.rows)
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
