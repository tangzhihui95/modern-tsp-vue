<template>
  <div>
    <el-row>
      <el-form v-model="queryParams">
        <el-row>
          <el-col :span="6">
            <el-form-item label="统计时间" label-width="110px" prop="daterange">
              <el-date-picker
                style="width: 240px"
                v-model="daterange"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                clearable
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item>
              <el-radio-group v-model="queryParams.timeState" size="mini">
                <el-radio label="1" border>近七天</el-radio>
                <el-radio label="2" border>近半个月</el-radio>
                <el-radio label="3" border>近一个月</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-button type="primary" @click="countSubmit">统 计</el-button>
            <el-button @click="clearAll">清除条件</el-button>
          </el-col>
        </el-row>
        <!-- <el-row>
          <el-col>
            <el-form-item label="统计维度:" label-width="110px">
              <el-radio-group v-model="value1" size="mini">
                <el-radio label="按省份" border></el-radio>
                <el-radio label="按地市" border></el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="省份:" label-width="110px">
              <el-button plain size="mini" @click="handleOpen"
                >请选择</el-button
              >
            </el-form-item>
          </el-col>
          <el-col v-if="tagList.length > 0" :span="8" :offset="1">
            <el-tag
              :key="tag"
              v-for="tag in tagList"
              type="warning"
              closable
              :disable-transitions="false"
              @close="handleTagClose(tag)"
            >
              {{ tag }}
            </el-tag>
          </el-col>
        </el-row> -->
        <!-- <el-row>
          <el-col v-if="value1 === '按地市'" :span="5">
            <el-form-item label="地市:" label-width="110px">
              <el-button plain size="mini" @click="handleCityOpen"
                >请选择</el-button
              >
            </el-form-item>
          </el-col>
          <el-col v-if="tagCityList.length > 0" :span="8" :offset="1">
            <el-tag
              :key="tag"
              v-for="tag in tagCityList"
              type="info"
              closable
              :disable-transitions="false"
              @close="handleTagCityClose(tag)"
            >
              {{ tag }}
            </el-tag>
          </el-col>
        </el-row> -->
      </el-form>
    </el-row>
    <!-- 省份 -->
    <el-dialog
      :visible.sync="dialogVisible"
      width="900px"
      :before-close="handleClose"
    >
      <el-row>
        <el-col>
          <div>
            <el-row>
              <el-checkbox-group v-model="checkboxList">
                <el-col
                  :span="5"
                  v-for="(item, index) in provincesList"
                  :key="index"
                  style="margin-top: 1%"
                >
                  <el-checkbox
                    :label="item.cityName"
                    border
                    size="mini"
                    @change="handleExceptRisk(item.cityName, index, $event)"
                  >
                    {{ item.cityName }}
                  </el-checkbox>
                </el-col>
              </el-checkbox-group>
            </el-row>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8" :offset="18">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 地市 -->
    <el-dialog
      :visible.sync="cityOpen"
      width="800px"
      :before-close="handleCityClose"
    >
      <el-row>
        <el-col>
          <div>
            <el-row>
              <el-checkbox-group v-model="checkboxCityList">
                <el-col
                  :span="5"
                  v-for="(item, index) in cityList"
                  :key="index"
                  style="margin-top: 1%"
                >
                  <el-checkbox
                    :label="item.cityName"
                    border
                    size="mini"
                    @change="handleCityExceptRisk(item.cityName, index, $event)"
                  >
                    {{ item.cityName }}
                  </el-checkbox>
                </el-col>
              </el-checkbox-group>
            </el-row>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8" :offset="18">
          <el-button @click="cityOpen = false">取 消</el-button>
          <el-button type="primary" @click="handleCitySubmit">确 定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <ve-line
      :title="title"
      :data="chartData"
      :settings="chartSettings"
      :data-zoom="dataZoom"
      :extend="chartExtend"
    ></ve-line>
  </div>
</template>

<script>
import { provincesAll, findCitys } from "@/api/tsp/provinces.js";
import { distributionData } from "@/api/tsp/tspVehicleData.js";
import VeHistogram from "v-charts/lib/histogram"; //柱状
export default {
  components: { VeHistogram },
  data() {
    (this.title = { text: "车辆分布统计" }),
      // this.legend = { bottom: "0px" };
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
      dataZoom: [
        {
          type: "slider",
          show: true,
          start: 0,
          end: 30,
          xAxisIndex: [0],
        },
      ],
      queryParams: {
        timeState: "",
      },
      daterange: [],
      dialogVisible: false,
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
    };
  },
  created() {
    this.getDistributionData();
    // this.chartData = {
    //   columns: this.columnsList,
    //   rows: this.VeLineList,
    // };
  },
  methods: {
    getDistributionData() {
      if (this.daterange.length > 0) {
        this.queryParams.startTime = this.daterange[0];
        this.queryParams.endTime = this.daterange[1];
      }
      distributionData(this.queryParams).then((res) => {
        this.chartData.rows = [];
        let list = res.result;
        for (const key in list) {
          let data = {};
          data.date = list[key].date;
          data.count = list[key].count;
          this.chartData.rows.push(data);
        }
        console.log(res);
      });
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    handleRadio(val) {
      console.log(val);
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
      console.log(this.checkboxList);
      if (this.checkboxList.length >= 4) {
        this.checkboxList.shift();
      }
    },
    handleTagClose(tag) {
      console.log(tag);
      this.tagList.splice(this.tagList.indexOf(tag), 1);
    },
    getProvincesAll() {
      provincesAll().then((res) => {
        this.provincesList = res.result;
        console.log(this.provincesList);
      });
    },
    getCitys() {
      findCitys(this.tagList).then((res) => {
        this.cityList = res.result;
        console.log(this.cityList);
      });
    },
    handleTagCityClose(tag) {
      console.log(tag);
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
      this.getDistributionData();
    },
    clearAll() {
      this.tagList = [];
      this.tagCityList = [];
      this.queryParams = {
        timeState: "",
      };

      this.daterange = [];
      this.getDistributionData();
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
</style>
