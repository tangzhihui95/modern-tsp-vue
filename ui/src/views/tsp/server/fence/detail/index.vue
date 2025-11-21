<template>
  <div class="fence-detail">
    <div v-show="!add_car">
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        label-width="140px"
        class="demo-ruleForm"
      >
        <div class="tit">围栏信息</div>
        <el-form-item label="围栏名称:" prop="fenceName">
          <el-input
            v-model="form.fenceName"
            style="width: 300px"
            :disabled="this.$route.query.title === '详情'"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="围栏区域:" prop="fenceArea">
          <el-input
            v-model="form.fenceArea"
            style="width: 300px"
            :disabled="this.$route.query.title === '详情'"
            clearable
            ><el-button
              @click="searchArea"
              slot="append"
              icon="el-icon-search"
              :disabled="this.$route.query.title === '详情'"
            ></el-button
          ></el-input>
        </el-form-item>
        <el-form-item label="围栏形状:" prop="fenceShape">
          <el-radio-group
            v-model="form.fenceShape"
            :disabled="this.$route.query.title === '详情'"
          >
            <el-radio :label="1">圆形</el-radio>
            <el-radio :label="2">多边形</el-radio>
            <el-radio :label="3">矩形</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态:" prop="fenceStatus">
          <el-switch
            v-model="form.fenceStatus"
            :disabled="this.$route.query.title === '详情'"
          ></el-switch>
        </el-form-item>

        <el-button
          style="margin-left: 50px;margin-bottom: 10px;"
          @click="resetMapFence"
          :disabled="this.$route.query.title === '详情'"
          >重置地图围栏</el-button
        >

        <baidu-map
          class="map"
          :center="center"
          :zoom="zoom"
          :scroll-wheel-zoom="true"
          :style="{
            width: '100%',
            height: '600px',
            paddingLeft: '50px',
            paddingRight: '50px',
          }"
          @ready="init"
        >
        </baidu-map>
        <div class="tit">监控车辆</div>
        <div class="table-box">
          <div class="add-car">
            <el-button
              type="primary"
              size="mini"
              @click="toAddCar"
              :disabled="this.$route.query.title === '详情'"
              >添加车辆</el-button
            >
          </div>
          <el-table :data="vehicleList" border>
            <el-table-column
              label="序号"
              type="index"
              width="50"
              align="center"
            >
              <template slot-scope="scope">
                <span>{{ scope.$index + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column label="VIN" align="center" prop="vin" />
            <el-table-column label="车型" align="center" prop="stdModeName" />
            <el-table-column label="关联账号" align="center" prop="mobile" />
            <el-table-column label="车主姓名" align="center" prop="realName" />
          </el-table>
        </div>
        <div class="tit">电子围栏规则</div>
        <el-form-item label="驶入提醒:" prop="fenceIn">
          <el-switch
            v-model="form.fenceIn"
            :disabled="this.$route.query.title === '详情'"
          ></el-switch>
        </el-form-item>
        <el-form-item label="驶出提醒:" prop="fenceOut">
          <el-switch
            v-model="form.fenceOut"
            :disabled="this.$route.query.title === '详情'"
          ></el-switch>
        </el-form-item>
        <el-form-item label="监控日提醒次数:" prop="fenceNum">
          <el-select
            v-model="form.fenceNum"
            placeholder="请选择"
            style="width: 50%"
            :disabled="this.$route.query.title === '详情'"
            clearable
          >
            <el-option
              v-for="item in num_list"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="监控日:" prop="fenceDay">
          <el-select
            v-model="form.fenceDay"
            multiple
            placeholder="请选择"
            style="width: 50%"
            :disabled="this.$route.query.title === '详情'"
            clearable
          >
            <el-option
              v-for="item in data_list"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="监控时段:" prop="fenceTime">
          <el-select
            v-model="form.fenceTime"
            multiple
            placeholder="请选择"
            :disabled="this.$route.query.title === '详情'"
            style="width: 50%"
            clearable
          >
            <el-option
              v-for="item in time_list"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="推送渠道：" prop="sendChannel">
          <el-checkbox
            v-model="isApp"
            :disabled="this.$route.query.title === '详情'"
            @change="appChange"
            >APP</el-checkbox
          >
          <el-checkbox
            v-model="isMessage"
            :disabled="this.$route.query.title === '详情'"
            @change="messageChange"
            >短信</el-checkbox
          >
        </el-form-item>
        <div class="table-box">
          <el-table :data="vehicleList" border>
            <el-table-column
              label="序号"
              type="index"
              width="50"
              align="center"
            >
              <template slot-scope="scope">
                <span>{{ scope.$index + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column label="推送方式" align="center" prop="mode" />
            <el-table-column
              label="接收消息人电话"
              align="center"
              prop="mobile"
            />
            <el-table-column
              label="接收消息人姓名"
              align="center"
              prop="realName"
            />
          </el-table>
        </div>
        <div class="tit">其他信息</div>
        <el-form-item label="备注:" prop="fenceRemark">
          <textarea
            v-model="form.fenceRemark"
            style="width: 300px; border: 1px solid #dcdfe6"
            :disabled="this.$route.query.title === '详情'"
          ></textarea>
        </el-form-item>
        <el-form-item>
          <el-button @click="cancel">取消</el-button>
          <el-button
            type="primary"
            @click="submitForm"
            :disabled="this.$route.query.title === '详情'"
            >确定</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <addCar v-show="add_car" @add="addEmit" @cancel="cancelEmit" ref="carAddList"></addCar>
  </div>
</template>

<script>
import { add, edit, get } from '@/api/tsp/fence.js'
import { parseTime } from '../../../../../utils/paramsUtil'
import addCar from './addCar.vue'

import { loadJS } from '@/api/tool/wmtools.js'

export default {
  name: "fence-detail",
  components: {
    addCar,
  },
  data() {
    return {
      id: "",
      // 表单参数
      form: {
        pageNum: 1,
        pageSize: 10,
        circles: [],
        polygons: [],
        sendChannel: [],
      },
      isApp: false,
      isMessage: false,
      add_car: false,
      ruleForm: {},
      // 关联车辆
      vehicleList: [
      ],
      push_list: [
        {
          mode: "推送方式1",
          phone: "电话1",
          name: "姓名1",
        },
      ],
      // 监控提醒次数
      num_list: [
        {
          value: 1,
          label: "1次",
        },
        {
          value: 2,
          label: "2次",
        },
        {
          value: 3,
          label: "3次",
        },
        {
          value: 4,
          label: "4次",
        },
        {
          value: 5,
          label: "5次",
        },
        {
          value: 10,
          label: "10次",
        },
      ],
      // 监控日选择数组
      data_list: [
        {
          value: 1,
          label: "星期一",
        },
        {
          value: 2,
          label: "星期二",
        },
        {
          value: 3,
          label: "星期三",
        },
        {
          value: 4,
          label: "星期四",
        },
        {
          value: 5,
          label: "星期五",
        },
        {
          value: 6,
          label: "星期六",
        },
        {
          value: 7,
          label: "星期日",
        },
      ],
      // 监控时段选择数组
      time_list: [
        {
          value: 1,
          label: "00:00~01:59",
        },
        {
          value: 2,
          label: "02:00~03:59",
        },
        {
          value: 3,
          label: "04:00~05:59",
        },
        {
          value: 4,
          label: "06:00~07:59",
        },
        {
          value: 5,
          label: "08:00~09:59",
        },
        {
          value: 6,
          label: "10:00~11:59",
        },
        {
          value: 7,
          label: "12:00~13:59",
        },
        {
          value: 8,
          label: "14:00~15:59",
        },
        {
          value: 9,
          label: "16:00~17:59",
        },
        {
          value: 10,
          label: "18:00~19:59",
        },
        {
          value: 11,
          label: "20:00~21:59",
        },
        {
          value: 12,
          label: "22:00~23:59",
        },
      ],
      //验证
      rules: {
        fenceName: [
          { required: true, message: "请输入围栏名称", trigger: "blur" },
        ],
        fenceShape: [
          { required: true, message: "请选择围栏形状", trigger: "blur" },
        ],
        fenceNum: [
          { required: true, message: "请选择监控日提醒次数", trigger: "blur" },
        ],
        fenceDay: [
          { required: true, message: "请选择监控日", trigger: "blur" },
        ],
        fenceTime: [
          { required: true, message: "请选择监控时段", trigger: "blur" },
        ],
      },

      //BMap类
      BMap: null,
      //地图对象
      map: null,
      center: { lng: 121.480539, lat: 31.235929 },
      zoom: 15,
      drawingManager: null,
      geocoder: null,
      styleOptions: {
        strokeColor: "red", //边线颜色。
        fillColor: "red", //填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 3, //边线的宽度，以像素为单位。
        strokeOpacity: 0.5, //边线透明度，取值范围0 - 1。
        fillOpacity: 0.2, //填充的透明度，取值范围0 - 1。
        strokeStyle: "solid", //边线的样式，solid或dashed。
      },
      type: "",
    };
  },
  methods: {
    initDrawingManager() {
      let enableDrawingTool = true;
      if (this.$route.query.title === "详情") {
        enableDrawingTool = false;
      }
      //实例化鼠标绘制工具
      this.drawingManager = new BMapLib.DrawingManager(this.map, {
        isOpen: true, //是否开启绘制模式
        enableDrawingTool: enableDrawingTool, //是否显示工具栏
        enableCalculate: false, //绘制是否进行测距(画线时候)、测面(画圆、多边形、矩形)
        drawingToolOptions: {
          anchor: BMAP_ANCHOR_TOP_RIGHT,
          offset: new BMap.Size(5, 5),
          drawingModes: [
            // BMAP_DRAWING_MARKER,
            BMAP_DRAWING_CIRCLE,
            // BMAP_DRAWING_POLYLINE,
            BMAP_DRAWING_POLYGON,
            BMAP_DRAWING_RECTANGLE,
          ],
        },
        circleOptions: this.styleOptions, //圆的样式
        polylineOptions: this.styleOptions, //线的样式
        polygonOptions: this.styleOptions, //多边形的样式
        rectangleOptions: this.styleOptions, //矩形的样式
      });

      //不执行下面2句有时会导致围栏不随地图放大缩小对应改变
      this.drawingManager.setDrawingMode(BMAP_DRAWING_CIRCLE);
      this.drawingManager.close();

      /* 鼠标绘制完成后，派发总事件的接口
       * @param {Event Object} e 回调函数会返回event参数，包括以下返回值：
       * {
       *	"drawingMode : {DrawingType} 当前的绘制模式
       *	"overlay：{Marker||Polyline||Polygon||Circle} 对应的绘制模式返回对应的覆盖物
       *	"calculate：{Number} 需要开启计算模式才会返回这个值，
       *	当绘制线的时候返回距离、绘制多边形、圆、矩形时候返回面积，单位为米
       *	"label：{Label} 计算面积时候出现在Map上的Label对象
       * }
       */
      // this.drawingManager.addEventListener('overlaycomplete', this.overlaycomplete);

      /* 绘制圆完成后，派发的事件接口
       * @param {Circle} overlay 回调函数会返回相应的覆盖物:
       */
      this.drawingManager.addEventListener("circlecomplete", (overlay) => {
        //Circle(center: Point, radius: Number, opts: CircleOptions)
        let circle = {
          type: "circle",
          center: overlay.getCenter(),
          radius: overlay.getRadius(),
        };

        if (this.form.circles.length === 0) {
          this.form.circles.push(circle);
        } else {
          this.form.circles[0] = circle;
        }
        this.form.polygons = [];

        this.form.fenceShape = 1;
        // this.$forceUpdate();
        this.drawingManager.close();

        this.showFenceOnMap(this.form.circles, null, false);
      });

      /* 绘制多边形完成后，派发的事件接口
       * @param {Polygon} overlay 回调函数会返回相应的覆盖物:
       */
      this.drawingManager.addEventListener("polygoncomplete", (overlay) => {
        //Polygon(points: Array<Point>, opts: PolygonOptions)
        let polygon = { type: "polygon", path: overlay.getPath() };

        if (this.form.polygons.length === 0) {
          this.form.polygons.push(polygon);
        } else {
          this.form.polygons[0] = polygon;
        }
        this.form.circles = [];

        this.form.fenceShape = 2;
        // this.$forceUpdate();

        this.drawingManager.close();

        this.showFenceOnMap(null, this.form.polygons, false);
      });

      /* 绘制矩形完成后，派发的事件接口
       * @param {Polygon} overlay 回调函数会返回相应的覆盖物:
       */
      this.drawingManager.addEventListener("rectanglecomplete", (overlay) => {
        //Polygon(points: Array<Point>, opts: PolygonOptions)
        let polygon = { type: "rectangle", path: overlay.getPath() };

        if (this.form.polygons.length === 0) {
          this.form.polygons.push(polygon);
        } else {
          this.form.polygons[0] = polygon;
        }
        this.form.circles = [];

        this.form.fenceShape = 3;
        // this.$forceUpdate();

        this.drawingManager.close();

        this.showFenceOnMap(null, this.form.polygons, false);
      });
    },

    init({ BMap, map }) {
      this.BMap = BMap;
      this.map = map;

      this.geocoder = new BMap.Geocoder();

      if (
        typeof BMapLib === "undefined" ||
        typeof BMapLib.DrawingManager === "undefined"
      ) {
        //loadCSS("http://huiyan-fe.github.io/BMap-JavaScript-library/src/DrawingManager/DrawingManager.min.css", () => {
        loadJS(
          "http://huiyan-fe.github.io/BMap-JavaScript-library/src/DrawingManager/DrawingManager.min.js",
          () => {
            this.initDrawingManager();
          }
        );
        //});
      } else {
        this.initDrawingManager();
      }

      if (
        typeof BMapLib === "undefined" ||
        typeof BMapLib.GeoUtils === "undefined"
      ) {
        loadJS(
          "http://huiyan-fe.github.io/BMap-JavaScript-library/src/GeoUtils/GeoUtils.js",
          () => {
            this.initGeoUtils();
          }
        );
      } else {
        this.initGeoUtils();
      }

      if (this.$route.query.title != "新增围栏") {
        this.id = this.$route.query.id;
        this.getDetail(this.id);
      }
    },

    initGeoUtils() {
      /* 计算两点之间的距离,两点坐标必须为经纬度
       * @param {Point} point1 点对象1
       * @param {Point} point2 点对象1
       * @return {Number} 两点之间距离，单位为米
       */
      // BMapLib.GeoUtils.getDistance(point1, point2)

      /* 判断点是否在圆形内
       * @param {Point} point 点对象
       * @param {Circle} circle 圆形对象
       * @return {Boolean} 点在圆形内返回true,否则返回false
       */
      // BMapLib.GeoUtils.isPointInCircle(point, circle)

      /* 判断点是否多边形内
       * @param {Point} point 点对象
       * @param {Polyline} polygon 多边形对象
       * @return {Boolean} 点在多边形内返回true,否则返回false
       */
      // BMapLib.GeoUtils.isPointInPolygon(point, polygon)

      /* 判断点是否在矩形内
       * @param {Point} point 点对象
       * @param {Bounds} bounds 矩形边界对象
       * @return {Boolean} 点在矩形内返回true,否则返回false
       */
      // BMapLib.GeoUtils.isPointInRect(point, bounds)

      this.map.addEventListener("click", (e) => {
        // 点击地点获取经纬度
        console.log(e.point);

        let bmapPoint = new BMap.Point(e.point.lng, e.point.lat);
        let circles = this.form.circles;
        let polygons = this.form.polygons;

        if (circles != null && circles.length > 0) {
          for (const circle of circles) {
            let bmapCircle = new BMap.Circle(
              new BMap.Point(circle.center.lng, circle.center.lat),
              circle.radius
            );
            if (BMapLib.GeoUtils.isPointInCircle(bmapPoint, bmapCircle)) {
              console.log("点在圆形区域内", bmapPoint, bmapCircle);
            }
          }
        }

        if (polygons != null && polygons.length > 0) {
          for (const polygon of polygons) {
            let bmapArrayPoint = [];
            for (const p of polygon.path) {
              bmapArrayPoint.push(new BMap.Point(p.lng, p.lat));
            }
            let bmapPolygon = new BMap.Polygon(bmapArrayPoint);
            if (
              polygon.type == "polygon" &&
              BMapLib.GeoUtils.isPointInPolygon(bmapPoint, bmapPolygon)
            ) {
              console.log("点在多边形区域内", bmapPoint, bmapPolygon);
            } else if (
              polygon.type == "rectangle" &&
              BMapLib.GeoUtils.isPointInPolygon(bmapPoint, bmapPolygon)
            ) {
              console.log("点在矩形区域内", bmapPoint, bmapPolygon);
            }
          }
        }
      });
    },

    showFenceOnMap(circles, polygons, isUpdateMapCenter) {
      this.map.clearOverlays();

      if (circles != null && circles.length > 0) {
        for (const circle of circles) {
          let circleOverlay = new BMap.Circle(
            circle.center,
            circle.radius,
            this.styleOptions
          );
          this.map.addOverlay(circleOverlay);
        }
        if (isUpdateMapCenter) {
          this.center = circles[0].center;
        }
      }

      if (polygons != null && polygons.length > 0) {
        for (const polygon of polygons) {
          let polygonOverlay = new BMap.Polygon(
            polygon.path,
            this.styleOptions
          );
          this.map.addOverlay(polygonOverlay);
        }
        if (isUpdateMapCenter) {
          this.center = polygons[0].path[0];
        }
      }
    },

    resetMapFence() {
      this.drawingManager.close();

      this.form.circles = [];
      this.form.polygons = [];

      this.map.clearOverlays();
    },

    searchArea() {
      this.geocoder.getPoint(
        this.form.fenceArea,
        (point) => {
          if (point) {
            this.center = { lng: point.lng, lat: point.lat };
            // this.$forceUpdate();
          } else {
            this.$message({
              showClose: true,
              message: "您选择的地址没有解析到结果！",
              type: "warning",
            });
          }
        },
        "全国"
      );
    },

    // 点击添加车辆
    toAddCar() {
      this.$refs.carAddList.open(this.vehicleList);
      this.add_car = true;
    },
    // 详情查找
    getDetail(id) {
      get(id).then((res) => {
        this.form = res.result;
        this.form.circles = [];
        this.form.polygons = [];

        if (this.form.fenceShape === 1) {
          this.type = "circle";
          this.form.circles = [
            { type: this.type, center: this.form.lngLatList, radius: 1800 },
          ];
        }
        if (this.form.fenceShape === 2) {
          this.type = "polygon";
          this.form.polygons = [
            { type: this.type, path: this.form.lngLatList },
          ];
        }
        if (this.form.fenceShape === 3) {
          this.type = "rectangle";
          this.form.polygons = [
            { type: this.type, path: this.form.lngLatList },
          ];
        }
        if (this.form.fenceIn === 1) {
          this.form.fenceIn = true;
        } else {
          this.form.fenceIn = false;
        }
        if (this.form.fenceOut === 1) {
          this.form.fenceOut = true;
        } else {
          this.form.fenceOut = false;
        }
        if (this.form.fenceStatus === 1) {
          this.form.fenceStatus = true;
        } else {
          this.form.fenceStatus = false;
        }
        this.vehicleList = res.result.vehicleList;
        if (this.form.sendChannel[0] === 0) {
            this.isApp = false;
        }
        if (this.form.sendChannel[0] === 1) {
            this.isApp = true;
        }
        if (this.form.sendChannel[1] === 0) {
            this.isMessage = false;
        }
        if (this.form.sendChannel[1] === 1) {
            this.isMessage = true;
        }

        this.showFenceOnMap(this.form.circles, this.form.polygons, true);
      });
    },
    cancel() {
      this.$router.go(-1);
      this.$store.dispatch("tagsView/delView", this.$route);
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.fenceShape === 1) {
            if (this.form.circles === null || this.form.circles.length === 0) {
              this.$message.error("请先选择围栏区域");
              return;
            }
            this.form.lngLatList = this.form.circles[0].center;
          }
          if (this.form.fenceShape === 2 || this.form.fenceShape === 3) {
            if (this.form.polygons === null || this.form.polygons.length === 0) {
              this.$message.error("请先选择围栏区域");
              return;
            }
            this.form.lngLatList = this.form.polygons[0].path;
          }

          if ("pageNum" in this.form) {
            (this.form.pageNum = 1), (this.form.pageSize = 10);
          } else {
            (this.form.pageNum = 1), (this.form.pageSize = 10);
          }
          if ("fenceStatus" in this.form) {
            if (this.form.fenceStatus === true) {
              this.form.fenceStatus = 1;
            } else {
              this.form.fenceStatus = 2;
            }
          } else {
            this.form.fenceStatus = 2;
          }
          if ("fenceIn" in this.form) {
            if (this.form.fenceIn === true) {
              this.form.fenceIn = 1;
            } else {
              this.form.fenceIn = 2;
            }
          } else {
            this.form.fenceIn = 2;
          }
          if ("fenceOut" in this.form) {
            if (this.form.fenceOut === true) {
              this.form.fenceOut = 1;
            } else {
              this.form.fenceOut = 2;
            }
          } else {
            this.form.fenceOut = 2;
          }
          if (this.isApp === false) {
            if (this.form.sendChannel.length === 0) {
              this.form.sendChannel.push(0);
            }
            else{
              this.form.sendChannel[0] = 0;
            }
          }
          if (this.isApp === true) {
            if (this.form.sendChannel.length === 0) {
              this.form.sendChannel.push(1);
            }
            else{
              this.form.sendChannel[0] = 1;
            }
          }
          if (this.isMessage === false) {
            if (this.form.sendChannel.length === 1) {
              this.form.sendChannel.push(0);
            }
            else{
              this.form.sendChannel[1] = 0;
            }
          }
          if (this.isMessage === true) {
            if (this.form.sendChannel.length === 1) {
              this.form.sendChannel.push(1);
            }
            else{
              this.form.sendChannel[1] = 1;
            }
          }

          this.form.tspFenceId = this.id;
          this.form.vehicleList = this.vehicleList;
          if (this.$route.query.title === "新增围栏") {
            add(this.form).then((res) => {
              this.$modal.msgSuccess("新增成功");
              this.cancel();
            });
          } else {
            this.form.createTime = null;
            this.form.updateTime = parseTime(new Date());
            edit(this.form).then((res) => {
              this.$modal.msgSuccess("修改成功");
              this.cancel();
            });
          }
        }
      });
      
    },
    appChange(){
      // 短信
      if (this.isApp === false && this.isMessage === true) {
        for (var i=0;i < this.vehicleList.length;i++) {
          this.vehicleList[i].mode = "短信";
        }
      }
      // APP 和 短信
      if (this.isApp === true && this.isMessage === true) {
        for (var i=0;i < this.vehicleList.length;i++) {
          this.vehicleList[i].mode = "APP/短信";
        }
      }
      // APP
      if (this.isApp === true && this.isMessage === false) {
        for (var i=0;i < this.vehicleList.length;i++) {
          this.vehicleList[i].mode = "APP";
        }
      }
      // 两者都未选择
      if (this.isApp === false && this.isMessage === false) {
        for (var i=0;i < this.vehicleList.length;i++) {
          this.vehicleList[i].mode = "";
        }
      }
    },
    messageChange(){
      // 短信
      if (this.isApp === false && this.isMessage === true) {
        for (var i=0;i < this.vehicleList.length;i++) {
          this.vehicleList[i].mode = "短信";
        }
      }
      // APP 和 短信
      if (this.isApp === true && this.isMessage === true) {
        for (var i=0;i < this.vehicleList.length;i++) {
          this.vehicleList[i].mode = "APP/短信";
        }
      }
      // APP
      if (this.isApp === true && this.isMessage === false) {
        for (var i=0;i < this.vehicleList.length;i++) {
          this.vehicleList[i].mode = "APP";
        }
      }
      // 两者都未选择
      if (this.isApp === false && this.isMessage === false) {
        for (var i=0;i < this.vehicleList.length;i++) {
          this.vehicleList[i].mode = "";
        }
      }
    },
    addEmit(selectedCarList) {
      this.vehicleList = selectedCarList;
      this.add_car = false;
    },
    cancelEmit() {
      this.add_car = false;
    }
  },
};
</script>

<style lang="scss">
.fence-detail {
  .tit {
    padding: 20px 0 20px 20px;
    font-size: 14px;
    color: #409eff;
    font-weight: bold;
    box-sizing: border-box;
  }
  .table-box {
    padding: 20px 40px;
    box-sizing: border-box;
    .add-car {
      margin-bottom: 10px;
      text-align: right;
    }
  }
}

.BMapLib_Drawing_panel {
  height: 47px;
  border: 1px solid #666;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
  float: left;
}
.BMapLib_Drawing .BMapLib_box {
  border-right: 1px solid #d2d2d2;
  float: left;
  height: 100%;
  width: 64px;
  height: 100%;
  background-image: url(http://api.map.baidu.com/library/DrawingManager/1.4/src/bg_drawing_tool.png);
  cursor: pointer;
}
.BMapLib_Drawing .BMapLib_last {
  border-right: 0;
}
.BMapLib_Drawing .BMapLib_hander {
  background-position: 0 0;
}
.BMapLib_Drawing .BMapLib_hander_hover {
  background-position: 0 -52px;
}
.BMapLib_Drawing .BMapLib_marker {
  background-position: -65px 0;
}
.BMapLib_Drawing .BMapLib_marker_hover {
  background-position: -65px -52px;
}
.BMapLib_Drawing .BMapLib_circle {
  background-position: -130px 0;
}
.BMapLib_Drawing .BMapLib_circle_hover {
  background-position: -130px -52px;
}
.BMapLib_Drawing .BMapLib_polyline {
  background-position: -195px 0;
}
.BMapLib_Drawing .BMapLib_polyline_hover {
  background-position: -195px -52px;
}
.BMapLib_Drawing .BMapLib_polygon {
  background-position: -260px 0;
}
.BMapLib_Drawing .BMapLib_polygon_hover {
  background-position: -260px -52px;
}
.BMapLib_Drawing .BMapLib_rectangle {
  background-position: -325px 0;
}
.BMapLib_Drawing .BMapLib_rectangle_hover {
  background-position: -325px -52px;
}
</style>
