<template>
  <div
    style="margin-top: 20px; margin-left: 5px; margin-right: 5px"
  >
    <el-row type="flex" align="top">
      <el-col :span="16">
        <el-form :rules="rules" ref="queryParams" :model="queryParams">
          <el-col :span="8">
            <el-form-item label="车辆查询" label-width="110px" prop="search">
              <el-input
                maxlength="30"
                placeholder="车牌号、VIN、SN"
                v-model="queryParams.search"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="采集时间" label-width="110px">
              <el-date-picker
                v-model="dateRange"
                style="width: 380px"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetimerange"
                range-separator="-"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                :picker-options="pickerOptions"
                clearable
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form>
      </el-col>
      <el-col :span="6">
        <el-button type="primary" @click="handleSearch">查 询</el-button>
        <el-button @click="clear">重置</el-button>
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          @click="clickExport"
          v-hasPermi="['tsp:integrate:export']"
          >导出</el-button
        >
      </el-col>
    </el-row>
    <el-row>
      <el-col type="border-card">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="整车数据" name="integrate" size="mini">
            <el-table
              :show-overflow-tooltip="true"
              :data="datas"
              size="mini"
            >
              <el-table-column
                label="序号"
                fixed="left"
                type="index"
                width="50px"
                align="center"
              >
                <template slot-scope="scope">
                  <span>{{
                    (queryParams.pageNum - 1) * queryParams.pageSize +
                    scope.$index +
                    1
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="采集时间"
                align="center"
                width="150px"
                prop="collectTime"
              />
              <el-table-column
                label="接收时间"
                align="center"
                width="150px"
                prop="createTime"
              />
              <el-table-column
                label="数据类型"
                align="center"
                width="90px"
                prop="dataType"
              >
              </el-table-column>
              <el-table-column
                label="车辆状态"
                align="center"
                prop="vehicleState"
              >
              </el-table-column>
              <el-table-column
                label="充电状态"
                align="center"
                prop="chargeState"
              >
              </el-table-column>
              <el-table-column label="运行模式" align="center" prop="runMode">
              </el-table-column>
              <el-table-column label="车速(km/h)" align="center" prop="speed">
              </el-table-column>
              <el-table-column
                label="累计里程(km)"
                align="center"
                prop="mileage"
              >
              </el-table-column>
              <el-table-column
                label="总电压(V)"
                align="center"
                prop="totalVoltage"
              >
              </el-table-column>
              <el-table-column
                label="总电流(A)"
                align="center"
                prop="totalCurrent"
              >
              </el-table-column>
              <el-table-column label="SOC(%)" align="center" prop="soc" />
              <el-table-column
                label="DC/DC状态"
                align="center"
                prop="dcDcState"
              >
              </el-table-column>
              <el-table-column label="档位" align="center" prop="gear">
              </el-table-column>
              <el-table-column
                label="绝缘电阻(kΩ)"
                align="center"
                prop="insulationResistance"
              />
              <el-table-column
                label="加速踏板行程值（%）"
                align="center"
                prop="acceleratorPedalPosition"
              />
              <el-table-column
                label="制动踏板行程值（%）"
                align="center"
                prop="brakePedalPosition"
              >
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="驱动电机数据" name="driveMotor">
            <el-table :data="datas" size="mini">
              <el-table-column
                label="序号"
                fixed="left"
                type="index"
                width="50px"
                align="center"
              >
                <template slot-scope="scope">
                  <span>{{
                    (queryParams.pageNum - 1) * queryParams.pageSize +
                    scope.$index +
                    1
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="采集时间"
                align="center"
                width="150px"
                prop="collectTime"
              />
              <el-table-column
                label="接收时间"
                align="center"
                width="150px"
                prop="createTime"
              />
              <el-table-column
                label="数据类型"
                align="center"
                width="90px"
                prop="dataType"
              >
              </el-table-column>
              <el-table-column
                label="驱动电机个数"
                align="center"
                prop="totalNumber"
              />
              <el-table-column
                label="驱动电机序号"
                align="center"
                prop="sequenceNumber"
              />
              <el-table-column label="驱动电机状态" align="center" prop="state">
              </el-table-column>
              <el-table-column
                label="驱动电机控制器温度(°C)"
                align="center"
                prop="controllerTemperature"
              >
              </el-table-column>
              <el-table-column
                label="驱动电机转速(r/min)"
                align="center"
                prop="rotateSpeed"
              >
              </el-table-column>
              <el-table-column
                label="驱动电机转矩(N*m)"
                align="center"
                prop="torque"
              >
              </el-table-column>
              <el-table-column
                label="驱动电机温度(°C)"
                align="center"
                prop="temperature"
              >
              </el-table-column>
              <el-table-column
                label="电机控制器输入电压(V)"
                align="center"
                prop="controllerInputVoltage"
              >
              </el-table-column>
              <el-table-column
                label="电机控制器直流母线电流(A)"
                align="center"
                prop="controllerDcBusCurrent"
              >
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="极值数据" name="extreme">
            <el-table :data="datas" size="mini">
              <el-table-column
                label="序号"
                fixed="left"
                type="index"
                width="50px"
                align="center"
              >
                <template slot-scope="scope">
                  <span>{{
                    (queryParams.pageNum - 1) * queryParams.pageSize +
                    scope.$index +
                    1
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="采集时间"
                align="center"
                width="150px"
                prop="collectTime"
              />
              <el-table-column
                label="接收时间"
                align="center"
                width="150px"
                prop="createTime"
              />
              <el-table-column
                label="数据类型"
                align="center"
                width="90px"
                prop="dataType"
              >
              </el-table-column>
              <el-table-column
                label="最高电压电池子系统号"
                align="center"
                prop="maxVoltageBatterySubsystem"
              />
              <el-table-column
                label="最高电压电池单体代号"
                align="center"
                prop="maxVoltageBatteryCell"
              />
              <el-table-column
                label="电池单体电压最高值(V)"
                align="center"
                prop="maxVoltageBattery"
              >
              </el-table-column>
              <el-table-column
                label="最低电压电池单体代号"
                align="center"
                prop="minVoltageBatteryCell"
              />
              <el-table-column
                label="电池单体电压最低值(V)"
                align="center"
                prop="minVoltageBattery"
              >
              </el-table-column>
              <el-table-column
                label="最高温度子系统号"
                align="center"
                prop="maxTemperatureSubsystem"
              />
              <el-table-column
                label="最高温度探针序号"
                align="center"
                prop="maxTemperatureProbe"
              />
              <el-table-column
                label="最高温度值(°C)"
                align="center"
                prop="maxTemperature"
              >
              </el-table-column>
              <el-table-column
                label="最低温度子系统号"
                align="center"
                prop="minTemperatureSubsystem"
              />
              <el-table-column
                label="最低温度探针序号"
                align="center"
                prop="minTemperatureProbe"
              />
              <el-table-column
                label="最低温度值(°C)"
                align="center"
                prop="minTemperature"
              >
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="报警数据" name="alert">
            <el-table :data="datas" size="mini">
              <el-table-column
                label="序号"
                fixed="left"
                type="index"
                width="50px"
                align="center"
              >
                <template slot-scope="scope">
                  <span>{{
                    (queryParams.pageNum - 1) * queryParams.pageSize +
                    scope.$index +
                    1
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="采集时间"
                align="center"
                width="150px"
                prop="collectTime"
              />
              <el-table-column
                label="接收时间"
                align="center"
                width="150px"
                prop="createTime"
              />
              <el-table-column
                label="数据类型"
                align="center"
                width="90px"
                prop="dataType"
              >
              </el-table-column>
              <el-table-column
                label="最高报警级别"
                align="center"
                width="130px"
                prop="maxAlarmLevel"
              />
              <el-table-column
                label="温度差异报警"
                align="center"
                prop="generalAlarmSign"
              >
                <template slot-scope="scope">
                  {{ scope.row.generalAlarmSign ? scope.row.generalAlarmSign.温度差异报警 : ""}}
                </template>
              </el-table-column>
              <el-table-column label="电池高温报警" align="center">
                <template slot-scope="scope">
                  {{ scope.row.generalAlarmSign ? scope.row.generalAlarmSign.电池高温报警 : "" }}
                </template>
              </el-table-column>
              <el-table-column label="车载储能装置类型过压报警" align="center">
                <template slot-scope="scope">
                  {{ scope.row.generalAlarmSign ? scope.row.generalAlarmSign.车载储能装置类型过压报警 : "" }}
                </template>
              </el-table-column>
              <el-table-column label="车载储能装置类型欠压报警" align="center">
                <template slot-scope="scope">
                  {{ scope.row.generalAlarmSign ? scope.row.generalAlarmSign.车载储能装置类型欠压报警 : "" }}
                </template>
              </el-table-column>
              <el-table-column label="SOC低报警" align="center">
                <template slot-scope="scope">
                  {{ scope.row.generalAlarmSign ? scope.row.generalAlarmSign.SOC低报警 : "" }}
                </template>
              </el-table-column>
              <el-table-column label="单体电池过压报警" align="center">
                <template slot-scope="scope">
                  {{ scope.row.generalAlarmSign ? scope.row.generalAlarmSign.单体电池过压报警 : "" }}
                </template>
              </el-table-column>
              <el-table-column label="单体电池欠压报警" align="center">
                <template slot-scope="scope">
                  {{ scope.row.generalAlarmSign ? scope.row.generalAlarmSign.单体电池欠压报警 : "" }}
                </template>
              </el-table-column>
              <el-table-column label="SOC过高报警" align="center">
                <template slot-scope="scope">
                  {{ scope.row.generalAlarmSign ? scope.row.generalAlarmSign.SOC过高报警 : "" }}
                </template>
              </el-table-column>
              <el-table-column label="SOC跳变报警" align="center">
                <template slot-scope="scope">
                  {{ scope.row.generalAlarmSign ? scope.row.generalAlarmSign.SOC跳变报警 : "" }}
                </template>
              </el-table-column>
              <el-table-column label="可充电储能系统不匹配报警" align="center">
                <template slot-scope="scope">
                  {{ scope.row.generalAlarmSign ? scope.row.generalAlarmSign.可充电储能系统不匹配报警 : "" }}
                </template>
              </el-table-column>
              <el-table-column label="电池单体一致性差报警" align="center">
                <template slot-scope="scope">
                  {{ scope.row.generalAlarmSign ? scope.row.generalAlarmSign.电池单体一致性差报警 : "" }}
                </template>
              </el-table-column>
              <el-table-column label="绝缘报警" align="center">
                <template slot-scope="scope">
                  {{ scope.row.generalAlarmSign ? scope.row.generalAlarmSign.绝缘报警 : "" }}
                </template>
              </el-table-column>
              <el-table-column label="DC-DC温度报警" align="center">
                <template slot-scope="scope">
                  {{ scope.row.generalAlarmSign ? scope.row.generalAlarmSign["DC-DC温度报警"] : "" }}
                </template>
              </el-table-column>
              <el-table-column label="制动系统报警" align="center">
                <template slot-scope="scope">
                  {{ scope.row.generalAlarmSign ? scope.row.generalAlarmSign.制动系统报警 : "" }}
                </template>
              </el-table-column>
              <el-table-column label="DC-DC状态报警" align="center">
                <template slot-scope="scope">
                  {{ scope.row.generalAlarmSign ? scope.row.generalAlarmSign["DC-DC状态报警"] : "" }}
                </template>
              </el-table-column>
              <el-table-column label="驱动电机控制器温度报警" align="center">
                <template slot-scope="scope">
                  {{ scope.row.generalAlarmSign ? scope.row.generalAlarmSign.驱动电机控制器温度报警 : "" }}
                </template>
              </el-table-column>
              <el-table-column label="高压互锁状态报警" align="center">
                <template slot-scope="scope">
                  {{ scope.row.generalAlarmSign ? scope.row.generalAlarmSign.高压互锁状态报警 : "" }}
                </template>
              </el-table-column>
              <el-table-column label="驱动电机温度报警" align="center">
                <template slot-scope="scope">
                  {{ scope.row.generalAlarmSign ? scope.row.generalAlarmSign.驱动电机温度报警 : "" }}
                </template>
              </el-table-column>
              <el-table-column label="车载储能装置类型过充报警" align="center">
                <template slot-scope="scope">
                  {{ scope.row.generalAlarmSign ? scope.row.generalAlarmSign.车载储能装置类型过充报警 : "" }}
                </template>
              </el-table-column>
              <el-table-column label="BMS高压电池错误报警" align="center">
                <template slot-scope="scope">
                  {{ scope.row.generalAlarmSign ? scope.row.generalAlarmSign.BMS高压电池错误报警 : "" }}
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="可充电储能装置电压数据" name="ess">
            <el-table :data="datas" size="mini">
              <el-table-column
                fixed="left"
                label="序号"
                type="index"
                width="50px"
                align="center"
              >
                <template slot-scope="scope">
                  <span>{{
                    (queryParams.pageNum - 1) * queryParams.pageSize +
                    scope.$index +
                    1
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="采集时间"
                align="center"
                width="150px"
                prop="collectTime"
              />
              <el-table-column
                label="接收时间"
                align="center"
                width="150px"
                prop="createTime"
              />
              <el-table-column
                label="数据类型"
                align="center"
                width="90px"
                prop="dataType"
              >
              </el-table-column>
              <el-table-column
                label="可充电储能子系统个数"
                align="center"
                prop="totalNumber"
              />
              <el-table-column
                label="可充电储能子系统号"
                align="center"
                prop="sequenceNumber"
              />
              <el-table-column
                label="可充电储能装置电压(V)"
                align="center"
                prop="voltage"
              >
              </el-table-column>
              <el-table-column
                label="可充电储能装置电流(A)"
                align="center"
                prop="current"
              >
              </el-table-column>
              <el-table-column
                label="单体电池总数"
                align="center"
                prop="batteryNumber"
              />
              <el-table-column
                label="本帧起始电池序号"
                align="center"
                prop="thisBatteryStartIndex"
              />
              <el-table-column
                label="本帧单体电池总数"
                align="center"
                prop="thisBatteryNumber"
              />
              <el-table-column
                label="单体电池电压(V)"
                align="center"
                min-width="450px"
                :show-overflow-tooltip="true"
                prop="thisBatteryVoltages"
              >
                <template slot-scope="scope">
                  {{ scope.row.thisBatteryVoltages }}
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="可充电储能装置温度数据" name="essTemperature">
            <el-table :data="datas" size="mini">
              <el-table-column
                fixed="left"
                label="序号"
                type="index"
                width="50px"
                align="center"
              >
                <template slot-scope="scope">
                  <span>{{
                    (queryParams.pageNum - 1) * queryParams.pageSize +
                    scope.$index +
                    1
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="采集时间"
                align="center"
                width="150px"
                prop="collectTime"
              />
              <el-table-column
                label="接收时间"
                align="center"
                width="150px"
                prop="createTime"
              />
              <el-table-column
                label="数据类型"
                align="center"
                width="90px"
                prop="dataType"
              >
              </el-table-column>
              <el-table-column
                label="可充电储能子系统个数"
                align="center"
                prop="totalNumber"
              />
              <el-table-column
                label="可充电储能子系统号"
                align="center"
                prop="sequenceNumber"
              />
              <el-table-column
                label="可充电储能温度探针个数"
                align="center"
                prop="probeNumber"
              />
              <el-table-column
                label="可充电储能子系统各温度探针检测到的温度值(°C)"
                align="center"
                width="720px"
                prop="temperatures"
              >
                <template slot-scope="scope">
                  {{ scope.row.temperatures }}
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryParams.pageNum"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="queryParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  list as integrateList,
  exportVehicleIntegrate,
} from "@/api/tsp/vehicleIntegrate.js";
import {
  list as driveMotorList,
  exportVehicleDriveMotor,
} from "@/api/tsp/driveMotor.js";
import { list as alertList, exportVehicleAlert } from "@/api/tsp/alert.js";
import { list as essList, exportVehicleEss } from "@/api/tsp/ess.js";
import {
  list as essTemperatureList,
  exportVehicleEssTemperature,
} from "@/api/tsp/essTemperature.js";
import {
  list as extremeList,
  exportVehicleExtreme,
} from "@/api/tsp/extreme.js";
import dayjs from "dayjs";

export default {
  name: "Integrate",
  data() {
    return {
      // Loading加载
      loading: null,

      vehicleOption: [
        { label: "全部", value: 0 },
        { label: "已创建", value: 1 },
        { label: "已销售", value: 2 },
        { label: "已绑定", value: 3 },
        { label: "已解绑", value: 4 },
        { label: "已报废", value: 5 },
        { label: "已注册", value: 6 },
      ],
      activeName: "integrate",
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 15,
      },
      total: 0,
      datas: [{}],
      rules: {
        search: [
          { required: true, message: "请输入查询车辆", trigger: "blur" },
        ],
      },

      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
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
            text: "最近12小时",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 12);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近24小时",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
    };
  },
  created() {
    // this.getIntegrateList();
    this.queryParams = {
      pageNum: 1,
      pageSize: 15,
    };

    const end = new Date();
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 1);
    this.dateRange = [
      dayjs(start).format("YYYY-MM-DD HH:mm:ss"),
      dayjs(end).format("YYYY-MM-DD HH:mm:ss"),
    ];

    this.datas = [];
  },

  methods: {
    loadingStart() {
      this.loading = this.$loading({
        lock: true,
        text: '疯狂加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
    },
    loadingEnd() {
      this.loading && this.loading.close();
    },

    getIntegrateList() {
      this.loadingStart();

      integrateList(this.queryParams)
        .then((res) => {
          this.datas = res.result.list;
          this.total = res.result.total;
        }).finally(this.loadingEnd);
    },
    getDriveMotorList() {
      this.loadingStart();

      driveMotorList(this.queryParams)
        .then((res) => {
          this.datas = res.result.list;
          this.total = res.result.total;
        })
        .finally(this.loadingEnd);
    },
    getAlertList() {
      this.loadingStart();

      alertList(this.queryParams)
        .then((res) => {
          this.datas = res.result.list;
          this.total = res.result.total;
        })
        .finally(this.loadingEnd);
    },
    getEssList() {
      this.loadingStart();

      essList(this.queryParams)
        .then((res) => {
          this.datas = res.result.list;
          this.total = res.result.total;
        })
        .finally(this.loadingEnd);
    },
    getEssTemperatureList() {
      this.loadingStart();

      essTemperatureList(this.queryParams)
        .then((res) => {
          this.datas = res.result.list;
          this.total = res.result.total;
        })
        .finally(this.loadingEnd);
    },
    getExtremeList() {
      this.loadingStart();

      extremeList(this.queryParams)
        .then((res) => {
          this.datas = res.result.list;
          this.total = res.result.total;
        })
        .finally(this.loadingEnd);
    },
    handleClick(tab, event) {
      console.log(tab.name);

      this.handleSearch();
    },
    // 点击切换条数
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.queryParams.pageSize = val;
      this.handleList(this.activeName);
    },
    handleList(activeName) {
      switch (activeName) {
        case "integrate":
          this.getIntegrateList();
          break;
        case "driveMotor":
          this.getDriveMotorList();
          break;
        case "alert":
          this.getAlertList();
          break;
        case "ess":
          this.getEssList();
          break;
        case "extreme":
          this.getExtremeList();
          break;
        case "essTemperature":
          this.getEssTemperatureList();
          break;
        default:
          break;
      }
    },
    // 点击页数
    handleCurrentChange(val) {
      this.queryParams.pageNum = val;
      this.handleList(this.activeName);
    },
    handleSearch() {
      this.datas = [];
      this.total = 0;
      this.queryParams.pageNum = 1;

      this.$refs["queryParams"].validate((valid) => {
        if (valid) {
          if(this.dateRange!==null&&this.dateRange!==undefined&&this.dateRange!==[] && this.dateRange.length > 1){
            this.queryParams.collectStartTime = this.dateRange[0];
            this.queryParams.collectEndTime = this.dateRange[1];
          }else{
            this.queryParams.collectStartTime = null;
            this.queryParams.collectEndTime = null;
          }
          this.handleList(this.activeName);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    clear() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 15,
      };
      this.dateRange = [];
      this.datas = [];
      this.total = 0;
    },

    // 导出
    clickExport() {
      this.$refs["queryParams"].validate((valid) => {
        if (valid) {
          if(this.dateRange!==null&&this.dateRange!==undefined&&this.dateRange!==[] && this.dateRange.length > 1){
            this.queryParams.collectStartTime = this.dateRange[0];
            this.queryParams.collectEndTime = this.dateRange[1];
          }else{
            this.queryParams.collectStartTime = null;
            this.queryParams.collectEndTime = null;
          }
          this.$modal
            .confirm("是否确认导出数据？")
            .then(() => {
              this.loadingStart();
              return this.handleExport(this.activeName, this.queryParams);
            })
            .then((response) => {
              this.$download.name(response.msg);
            })
            .finally(this.loadingEnd);
        } else {
          return false;
        }
      });
    },

    handleExport(activeName, queryParams) {
      switch (activeName) {
        case "integrate":
          return exportVehicleIntegrate(queryParams);
        case "driveMotor":
          return exportVehicleDriveMotor(queryParams);
        case "alert":
          return exportVehicleAlert(queryParams);
        case "ess":
          return exportVehicleEss(queryParams);
        case "extreme":
          return exportVehicleExtreme(queryParams);
        case "essTemperature":
          return exportVehicleEssTemperature(queryParams);
        default:
          alert("不支持");
          break;
      }
      return false;
    },
  },
};
</script>

<style>
.el-tooltip__popper {
  max-width: 50%;
}
</style>
