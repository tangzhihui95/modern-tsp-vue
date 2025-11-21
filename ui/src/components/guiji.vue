<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" :rules="rules">
      <el-row type="flex" align="top">
        <el-col :span="6">
          <el-form-item label="车辆" prop="vehicleLicence">
            <el-input
              v-model="queryParams.vehicleLicence"
              placeholder="请输入VIN/车牌号/SN号"
              clearable
              size="small"
              style="width: 100%"
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="查询时间" prop="dateRange">
            <el-date-picker
              v-model="dateRange"
              size="small"
              type="datetimerange"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="shijian"
              align="right"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-button
              type="cyan"
              icon="el-icon-search"
              size="mini"
              v-on:click="handleQuery"
              >查询</el-button
            >
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
              >重置</el-button
            >
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="轨迹速度">
            <el-slider
              v-model="speed"
              style="width: 100px"
              :step="10"
              :max="1000"
            ></el-slider>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <baidu-map
      class="map"
      :center="center"
      :zoom="11"
      :scroll-wheel-zoom="true"
      @ready="init"
    >
      <bm-polyline
        :path="path"
        stroke-color="blue"
        :stroke-opacity="0.5"
        :stroke-weight="5"
        :editing="false"
      ></bm-polyline>
      <div v-if="start_show">
        <bm-marker
          :position="startMark"
          :icon="{ url: startIcon, size: { width: 40, height: 40 } }"
          :offset="{ width: 0, height: -5 }"
        >
          <bm-label
            :content="labelContent"
            :offset="{ width: -65, height: -20 }"
          />
        </bm-marker>
        <bm-marker
          :position="endMark"
          :icon="{ url: endIcon, size: { width: 40, height: 40 } }"
          :offset="{ width: 0, height: -5 }"
        ></bm-marker>
      </div>
      <bml-lushu
        @stop="reset"
        :path="path"
        :icon="icon"
        :play="play"
        :rotation="true"
        :autoView="true"
        :speed="speed"
        :infoWindow="true"
        :content="content"
      >
      </bml-lushu>
    </baidu-map>
  </div>
</template>

<script>
import dayjs from "dayjs";

//百度地图
import BaiduMap from "vue-baidu-map/components/map/Map.vue";
import { BmlLushu } from "vue-baidu-map";
// 小汽车图片
import drugMarkerIcon from "@/assets/car.png";
// 接口调用
import { findHistory } from "@/api/tsp/vehicleGps.js";
export default {
  components: {
    BaiduMap,
    BmlLushu,
  },
  props: {},
  data() {
    let validateTime = (rule, value, callback) => {
      if (this.dateRange.length == 0) {
        return callback(new Error("查询时间段不能为空"));
      } else {
        return callback();
      }
    };
    return {
      // 查询参数
      startIcon: require("@/assets/images/start_mark.png"),
      endIcon: require("@/assets/images/end_mark.png"),
      queryParams: {
        vehicleLicence: "",
      },
      start_show: false,
      startMark: {}, //轨迹起点经纬度坐标
      endMark: {}, //轨迹终点经纬度坐标
      // 日期范围
      dateRange: [],
      play: false,
      path: [],
      gpsPath: [],
      center: { lng: 116.4054, lat: 39.91 }, //当前省市坐标
      icon: {
        url: drugMarkerIcon,
        size: { width: 52, height: 26 },
        opts: { anchor: { width: 27, height: 13 } },
      },
      startLabel: "",
      endLabel: "",
      content: "",
      speed: 100,
      // pickerOptions: {
      //   disabledDate(time) {
      //     return time.getTime() > Date.now() - 8.64e6;
      //   },
      // },
      //BMap类
      BMap: null,
      //地图对象
      map: null,
      BMapConvertor: null,
      rules: {
        vehicleLicence: [
          {
            required: true,
            message: "请输入搜索VIN、车牌号",
            trigger: "blur",
          },
        ],
        dateRange: [{ required: true, validator: validateTime }],
      },
      coordinate: "",
      timer: null,
      labelContent: "",

      pickerOptions: {
        shortcuts: [
          {
            text: "最近1小时",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 1);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近2小时",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 2);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近3小时",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 3);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近6小时",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 6);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近8小时",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 8);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
    };
  },

  methods: {
    init({ BMap, map }) {
      console.log("init");
      this.BMap = BMap;
      this.map = map;
      this.BMapConvertor = new BMap.Convertor();
      console.log("this.path", this.path);
      // 鼠标缩放
      map.enableScrollWheelZoom(true);
      map.centerAndZoom(new BMap.Point(112.950933, 28.185338), 13);
      map.addEventListener("click", function (e) {
        // 点击地点获取经纬度
        console.log(e.point.lng, e.point.lat);
      });
    },
    shijian(v) {
      console.log(v);
      this.dateRange = v;
      this.$set(this.dateRange, "dateRange", v);
    },
    reset() {
      this.play = false;
    },
    translateCallback(data) {
      if (data.status === 0) {
        console.log(
          "Success translateCallback: data.points.length=" + data.points.length
        );
        for (var i = 0; i < data.points.length; i++) {
          this.path.push(data.points[i]);
        }

        if (this.path.length < this.gpsPath.length) {
          //未转换完，继续转换
          let translatePoints = [];
          for (
            var i = 0;
            i + this.path.length < this.gpsPath.length && i < 10;
            i++
          ) {
            translatePoints.push(this.gpsPath[i + this.path.length]);
          }

          if (this.path.length % 100 == 0) {
            this.map.setViewport(this.path);
          }

          this.timer = setTimeout(() => {
            this.BMapConvertor.translate(
              translatePoints,
              1,
              5,
              this.translateCallback
            );
          }, 10); //延时坐标转换，每秒转换数量不超过100个
        } else {
          // 显示轨迹
          this.startLabel = "1";
          this.endLabel = "2";
          this.startMark = this.path[0];
          this.endMark = this.path[this.path.length - 1];

          // var point = this.map.Point(this.startMark)
          // var myIcon = this.map.Icon(this.startIcon, new BMapGL.Size(28, 34))
          // var marker = this.map.Marker(point, { icon: myIcon }) // 创建标注
          // this.map.addOverlay(marker)

          console.log("startMark", this.startMark);
          this.start_show = true;
          let start = new BMap.Point(this.path[0]);
          let end = new BMap.Point(this.path[this.path.length]);
          //已转换完
          this.map.setViewport(this.path);
          this.play = true;
          // this.content = "车牌/VIN:" + this.queryParams.vehicleLicence;
          this.labelContent = "车牌/VIN:" + this.queryParams.vehicleLicence;
        }
      } else {
        console.log("Error translateCallback");
      }
    },

    findVehicleHistory() {
      this.path = [];
      this.gpsPath = [];

      let startTime = this.dateRange[0];
      console.log(startTime);
      let endTime = this.dateRange[1];
      console.log(endTime);
      this.$refs["queryForm"].validate((valid) => {
        if (valid) {
          let data = {
            collectStartTime: startTime, //数据采集开始时间
            collectEndTime: endTime, //数据采集结束时间
            search: this.queryParams.vehicleLicence, //搜索(车牌号、VIN、终端SN)
          };

          findHistory(data)
            .then((response) => {
              console.log(response);
              this.start_show = false;
              this.map.clearOverlays();

              if (response.result.length <= 0) {
                this.msgError("未查询到该车辆的运行数据");
                return;
              }

              let step = 1;
              for (var j = 0; j < response.result.length; j += step) {
                this.gpsPath.push(
                  new this.BMap.Point(
                    response.result[j].longitude,
                    response.result[j].latitude
                  )
                );
              }

              console.log("step", step, "gpsPath", this.gpsPath);
              // this.content = "车牌/VIN:" + this.queryParams.vehicleLicence;
              // this.content = '车牌/VIN:' + this.queryParams.vehicleLicence  + ','
              // + '<br/>' + '经纬度:' + this.coordinate;
              // this.path = this.gpsPath;
              // this.map.setViewport(this.path);
              // this.play = true;
              let translatePoints = [];
              for (var i = 0; i < this.gpsPath.length && i < 10; i++) {
                translatePoints.push(this.gpsPath[i]);
              }
              this.BMapConvertor.translate(
                translatePoints,
                1,
                5,
                this.translateCallback
              );
            })
            .catch((error) => {});
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleQuery() {
      this.reset();
      this.findVehicleHistory();
    },
    /** 重置按钮操作 */
    resetQuery() {
      // this.resetForm("queryForm");
      this.queryParams = {};
      this.dateRange = [];
    },
  },

  created() {
    const end = new Date();
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 1);
    this.dateRange = [
      dayjs(start).format("YYYY-MM-DD HH:mm:ss"),
      dayjs(end).format("YYYY-MM-DD HH:mm:ss"),
    ];
  },

  beforeDestroy() {
    console.log("clearTimeout");
    this.timer && clearTimeout(this.timer);
  },
};
</script>
<style>
.map {
  width: 100%;
  height: 93vh;
}
</style>
