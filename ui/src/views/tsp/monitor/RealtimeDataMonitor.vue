<template>
  <div class="look-data">
    <div class="data-item data-item-first">
      <div class="item-tit">
        <el-row>
          <el-col :span="8">
            <div class="tit-area">国标数据</div>
          </el-col>
        </el-row>
      </div>
      <div class="item-table">
        <el-row>
          <el-col :span="6">
            <div>车辆VIN: {{this.vehicleIntegrate.vin}}</div>
          </el-col>
          <el-col :span="6">
            <div>最后数据时间: {{this.vehicleIntegrate.collectTime}}</div>
          </el-col>
          <el-col :span="6">
            <div>IMEI: {{this.imei}}</div>
          </el-col>
          <el-col :span="6">
            <div>SN: {{this.sn}}</div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="data-item">
      <div class="item-tit">
        <el-row>
          <el-col :span="8">
            <div class="tit-area" @click="changeStatus(0)">
              <span :class="list_status[0].show ? 'deg90' : 'deg270'">«</span
              >整车数据
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="item-table" v-show="list_status[0].show">
        <el-row>
          <el-col :span="6">
            <div>车辆状态: {{
              this.vehicleIntegrate.vehicleState
              }}</div>
          </el-col>
          <el-col :span="6">
            <div>充电状态: {{
              this.vehicleIntegrate.chargeState
              }}</div>
          </el-col>
          <el-col :span="6">
            <div>运行模式: {{
              this.vehicleIntegrate.runMode
              }}</div>
          </el-col>
          <el-col :span="6">
            <div>车速: {{
              this.vehicleIntegrate.speed + "km/h"
              }}
            </div>
          </el-col>
          <el-col :span="6">
            <div>累计里程: {{
              this.vehicleIntegrate.mileage + "km"
              }}</div>
          </el-col>
          <el-col :span="6">
            <div>总电压: {{
              this.vehicleIntegrate.totalVoltage + "V"
              }}</div>
          </el-col>
          <el-col :span="6">
            <div>总电流: {{
              this.vehicleIntegrate.totalCurrent + "A"
              }}</div>
          </el-col>
          <el-col :span="6">
            <div>SOC: {{
              this.vehicleIntegrate.soc + "%"
              }}</div>
          </el-col>
          <el-col :span="6">
            <div>DC状态: {{
              this.vehicleIntegrate.dcDcState
              }}</div>
          </el-col>
          <el-col :span="6">
            <div>挡位: {{
              this.vehicleIntegrate.gear
              }}</div>
          </el-col>
          <el-col :span="6">
            <div>绝缘电阻: {{
              this.vehicleIntegrate.insulationResistance + "KΩ"
              }}</div>
          </el-col>
          <el-col :span="6">
            <div>加速踏板行程: {{
              this.vehicleIntegrate.acceleratorPedalPosition + "%"
              }}</div>
          </el-col>
          <el-col :span="6">
            <div>制动踏板状态: {{
              this.vehicleIntegrate.brakePedalPosition + "%"
              }}</div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="data-item">
      <div class="item-tit">
        <el-row>
          <el-col :span="8">
            <div class="tit-area" @click="changeStatus(1)">
              <span :class="list_status[1].show ? 'deg90' : 'deg270'">«</span
              >驱动电机数据
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="item-table" v-show="list_status[1].show">
        <div class="child-tit">
          <span class="tit"> 驱动电机01 </span>
        </div>
        <el-row>
          <el-col :span="6">
            <div>驱动电机状态:{{
              this.vehicleDriveMotor.state
                  }}</div>
          </el-col>
          <el-col :span="6">
            <div>驱动电机控制温度:{{
              this.vehicleDriveMotor.controllerTemperature + "°C"
              }}</div>
          </el-col>
          <el-col :span="6">
            <div>驱动电机转速:{{
              this.vehicleDriveMotor.rotateSpeed + "r/min"
              }}</div>
          </el-col>
          <el-col :span="6">
            <div>驱动电机转矩:{{
              this.vehicleDriveMotor.torque + "N·m"
              }}</div>
          </el-col>
          <el-col :span="6">
            <div>驱动电机温度:{{
              this.vehicleDriveMotor.temperature + "°C"
              }}</div>
          </el-col>
          <el-col :span="6">
            <div>电机控制器输入电压:{{
              this.vehicleDriveMotor.controllerInputVoltage + "V"
              }}</div>
          </el-col>
          <el-col :span="6">
            <div>电机控制器直流母线电流:{{
              this.vehicleDriveMotor.controllerDcBusCurrent + "A"
              }}</div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="data-item">
      <div class="item-tit">
        <el-row>
          <el-col :span="8">
            <div class="tit-area" @click="changeStatus(2)">
              <span :class="list_status[2].show ? 'deg90' : 'deg270'">«</span
              >车辆位置
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="item-table" v-show="list_status[2].show">
        <el-row>
          <el-col :span="6">
            <div>定位状态: {{
              this.vehicleGps.gpsType
              }}</div>
          </el-col>
          <el-col :span="6">
            <div>经度: {{
              this.vehicleGps.longitude
              }}</div>
          </el-col>
          <el-col :span="6">
            <div>纬度: {{
              this.vehicleGps.latitude
              }}</div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="data-item">
      <div class="item-tit">
        <el-row>
          <el-col :span="8">
            <div class="tit-area" @click="changeStatus(3)">
              <span :class="list_status[3].show ? 'deg90' : 'deg270'">«</span
              >极值数据
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="item-table" v-show="list_status[3].show">
        <el-row>
          <el-col :span="8">
            <div>最高电压电池子系统号: {{
              this.vehicleExtreme.maxVoltageBatterySubsystem
              }}</div>
          </el-col>
          <el-col :span="8">
            <div>最高电压电池单体代号:{{
              this.vehicleExtreme.maxVoltageBatteryCell
              }}</div>
          </el-col>
          <el-col :span="8">
            <div>电池单体电压最高值:{{
              this.vehicleExtreme.maxVoltageBattery + "V"
              }}</div>
          </el-col>
          <el-col :span="8">
            <div>最低电压电池子系统号: {{
              this.vehicleExtreme.minVoltageBatterySubsystem
              }}</div>
          </el-col>
          <el-col :span="8">
            <div>最低电压电池单体代号:{{
              this.vehicleExtreme.minVoltageBatteryCell
              }}</div>
          </el-col>
          <el-col :span="8">
            <div>电池单体电压最低值:{{
              this.vehicleExtreme.minVoltageBattery + "V"
              }}</div>
          </el-col>
          <el-col :span="8">
            <div>最高温度子系统号:{{
              this.vehicleExtreme.maxTemperatureSubsystem
              }}</div>
          </el-col>
          <el-col :span="8">
            <div>最高温度探针序号:{{
              this.vehicleExtreme.maxTemperatureProbe
              }}</div>
          </el-col>
          <el-col :span="8">
            <div>最高温度值:{{
              this.vehicleExtreme.maxTemperature + "°C"
              }}</div>
          </el-col>
          <el-col :span="8">
            <div>最低温度子系统号:{{
              this.vehicleExtreme.minTemperatureSubsystem
              }}</div>
          </el-col>
          <el-col :span="8">
            <div>最低温度探针序号:{{
              this.vehicleExtreme.minTemperatureProbe
              }}</div>
          </el-col>
          <el-col :span="8">
            <div>最低温度值:{{
              this.vehicleExtreme.minTemperature + "°C"
              }}</div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="data-item">
      <div class="item-tit">
        <el-row>
          <el-col :span="8">
            <div class="tit-area" @click="changeStatus(4)">
              <span :class="list_status[4].show ? 'deg90' : 'deg270'">«</span
              >报警数据
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="item-table" v-show="list_status[4].show">
        <el-row>
          <el-col :span="24">
            <div>最高报警等级: {{
              this.vehicleAlert.maxAlarmLevel
              }}</div>
          </el-col>
          <el-col :span="6">
            <div>温度差异报警: {{
              this.vehicleAlert.generalAlarmSign ? this.vehicleAlert.generalAlarmSign.温度差异报警 : ""
              }}
              </div>
          </el-col>
          <el-col :span="6">
            <div>电池高温报警: {{
              this.vehicleAlert.generalAlarmSign ? this.vehicleAlert.generalAlarmSign.电池高温报警 : ""
              }}</div>
          </el-col>
          <el-col :span="6">
            <div>车载储能装置类型过压报警: {{
              this.vehicleAlert.generalAlarmSign ? this.vehicleAlert.generalAlarmSign.车载储能装置类型过压报警 : ""
              }}</div>
          </el-col>
          <el-col :span="6">
            <div>车载储能装置类型欠压报警: {{
              this.vehicleAlert.generalAlarmSign ? this.vehicleAlert.generalAlarmSign.车载储能装置类型欠压报警 : ""
              }}</div>
          </el-col>
          <el-col :span="6">
            <div>SOC低报警: {{
              this.vehicleAlert.generalAlarmSign ? this.vehicleAlert.generalAlarmSign.SOC低报警 : ""
              }}</div>
          </el-col>
          <el-col :span="6">
            <div>单体电池过压报警: {{
              this.vehicleAlert.generalAlarmSign ? this.vehicleAlert.generalAlarmSign.单体电池过压报警 : ""
              }}</div>
          </el-col>
          <el-col :span="6">
            <div>单体电池欠压报警: {{
              this.vehicleAlert.generalAlarmSign ? this.vehicleAlert.generalAlarmSign.单体电池欠压报警 : ""
              }}</div>
          </el-col>
          <el-col :span="6">
            <div>SOC过高报警: {{
              this.vehicleAlert.generalAlarmSign ? this.vehicleAlert.generalAlarmSign.SOC过高报警 : ""
              }}</div>
          </el-col>
          <el-col :span="6">
            <div>SOC跳变报警: {{
              this.vehicleAlert.generalAlarmSign ? this.vehicleAlert.generalAlarmSign.SOC跳变报警 : ""
              }}</div>
          </el-col>
          <el-col :span="6">
            <div>可充电储能系统不匹配报警: {{
              this.vehicleAlert.generalAlarmSign ? this.vehicleAlert.generalAlarmSign.可充电储能系统不匹配报警 : ""
              }}</div>
          </el-col>
          <el-col :span="6">
            <div>电池单体一致性差报警: {{
              this.vehicleAlert.generalAlarmSign ? this.vehicleAlert.generalAlarmSign.电池单体一致性差报警 : ""
              }}</div>
          </el-col>
          <el-col :span="6">
            <div>绝缘报警: {{
              this.vehicleAlert.generalAlarmSign ? this.vehicleAlert.generalAlarmSign.绝缘报警 : ""
              }}</div>
          </el-col>
          <el-col :span="6">
            <div>DC-DC温度报警: {{
              this.vehicleAlert.generalAlarmSign ? this.vehicleAlert.generalAlarmSign['DC-DC温度报警'] : ""
              }}</div>
          </el-col>
          <el-col :span="6">
            <div>制动系统报警: {{
              this.vehicleAlert.generalAlarmSign ? this.vehicleAlert.generalAlarmSign.制动系统报警 : ""
              }}</div>
          </el-col>
          <el-col :span="6">
            <div>DC-DC状态报警: {{
              this.vehicleAlert.generalAlarmSign ? this.vehicleAlert.generalAlarmSign['DC-DC状态报警'] : ""
              }}</div>
          </el-col>
          <el-col :span="6">
            <div>驱动电机控制器温度报警: {{
              this.vehicleAlert.generalAlarmSign ? this.vehicleAlert.generalAlarmSign.驱动电机控制器温度报警 : ""
              }}</div>
          </el-col>
          <el-col :span="6">
            <div>高压互锁状态报警: {{
              this.vehicleAlert.generalAlarmSign ? this.vehicleAlert.generalAlarmSign.高压互锁状态报警 : ""
              }}</div>
          </el-col>
          <el-col :span="6">
            <div>驱动电机温度报警: {{
              this.vehicleAlert.generalAlarmSign ? this.vehicleAlert.generalAlarmSign.驱动电机温度报警 : ""
              }}</div>
          </el-col>
          <el-col :span="6">
            <div>车载储能装置类型过充报警: {{
              this.vehicleAlert.generalAlarmSign ? this.vehicleAlert.generalAlarmSign.车载储能装置类型过充报警 : ""
              }}</div>
          </el-col>
          <el-col :span="6">
            <div>BMS高压电池错误报警: {{
              this.vehicleAlert.generalAlarmSign ? this.vehicleAlert.generalAlarmSign.BMS高压电池错误报警 : ""
              }}</div>
          </el-col>
          <el-col :span="6">
            <div>防盗报警: {{
              this.vehicleAlert.generalAlarmSign ? this.vehicleAlert.generalAlarmSign.防盗报警 : ""
              }}</div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="data-item">
      <div class="item-tit">
        <el-row>
          <el-col :span="8">
            <div class="tit-area" @click="changeStatus(5)">
              <span :class="list_status[5].show ? 'deg90' : 'deg270'">«</span
              >可充电储能装置电压数据
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="item-table" v-show="list_status[5].show">
        <div class="child-tit">
          <span class="tit"> 储能子系统01 </span>
        </div>
        <div>
          <ve-histogram
            :data="chart1Data"
            :legend="legend"
            :toolbox="toolbox"
            :extend="chartExtend"
            :settings="chartSettings"
            height="280px"
          ></ve-histogram>
        </div>
      </div>
    </div>
    <div class="data-item">
      <div class="item-tit">
        <el-row>
          <el-col :span="8">
            <div class="tit-area" @click="changeStatus(6)">
              <span :class="list_status[6].show ? 'deg90' : 'deg270'">«</span
              >可充电储能装置温度数据
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="item-table" v-show="list_status[6].show">
        <div class="child-tit">
          <span class="tit"> 储能子系统01 </span>
        </div>
        <div>
          <ve-histogram
            :data="chart2Data"
            :legend="legend"
            :toolbox="toolbox"
            :extend="chartExtend"
            height="280px"
          ></ve-histogram>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VeHistogram from "v-charts/lib/histogram"; //柱状
import {
  getVehicleBasicAttributes,
  getVehicleLatestData,
} from "@/api/tsp/vehicleData.js";

export default {
  components: { VeHistogram },
  name: "RealtimeDataMonitor",
  data() {
    return {
      title: {
        text: "",
      },
      list_status: [
        {
          show: true,
        },
        {
          show: true,
        },
        {
          show: true,
        },
        {
          show: true,
        },
        {
          show: true,
        },
        {
          show: true,
        },
        {
          show: true,
        },
      ],
      legend: {
        show: false,
      },
      toolbox: {
        feature: {
          saveAsImage: {pixelRatio: 18},
          // magicType: {type: ['line']},
          dataView: { show: true, readOnly: false,
            //自定义样式
            optionToContent:  (opt) => {
              let axisData = opt.xAxis[0].data; //坐标数据
              let series = opt.series; //折线图数据
              let tdHeads = '<td  style="padding: 2px 10px;background-color: #eeeeee;font-weight: 700;color: #333333"">时间</td>'; //表头
              let tdBodys = ''; //数据
              console.log(series)
              series.forEach(function (item) {
                //组装表头
                tdHeads += `<td style="padding: 2px 10px;background-color: #eeeeee;font-weight: 700;color: #333333">${item.name}</td>`;
              });
              let table = `<table   border="1" style=" width: 96%;margin-left:20px;border-collapse:collapse;font-size:14px;text-align:center" class="dataViewTable"><tbody><tr>${tdHeads} </tr>`;

              for (let i = 0, l = axisData.length; i < l; i++) {
                for (let j = 0; j < series.length; j++) {
                  //组装表数据
                  tdBodys += `<td><input class="${j}x" type="text" value="${series[j].data[i]}" style="border: none;text-align: center;color: #444444;color: #444444"></td>`;
                }
                table += `<tr><td style="padding: 2px 10px;text-align: center"><input type="text" value="${axisData[i]}" style="border: none;text-align: center;color: #444444"> </td>${tdBodys}</tr>`;
                tdBodys = '';
              }
              table += '</tbody></table>';
              return table;
            },
            //编辑功能
            contentToOption: (HTMLDomElement, opt) => {
              if(document.getElementsByClassName('dataViewTable').length>1){
                this.$message.error('有其他未关闭的数据视图，请关闭后重试');
              }else{
              for(let i = 0;i < opt.series.length;i++){
                var name = 'dataX' + i;
                window[name] = []
                for (let j of document.getElementsByClassName(`${i}x`) ){
                  window[name].push(j.value)
                }
                opt.series[i].data = window[name]
              }
              return opt;}
            },
          },

        },
      },
      chartSettings: {
        digit: 3,
      },
      chartExtend: {
        series: {
          color: "rgb(86, 149, 174)", //柱子背景颜色
        },
      },
      chart1Data: {
        columns: ["x", "value"],
        rows: [],
      },
      chart2Data: {
        columns: ["x", "value"],
        rows: [],
      },

      vehicleIntegrate: {},
      vehicleDriveMotor: {},
      vehicleExtreme: {},
      vehicleGps: {},
      vehicleAlert: {},
      vehicleEss: {},
      vehicleEssTemperature: {},
      timer: null,
      imei: "",
      sn: "",
    };
  },
  methods: {
    // 显示隐藏
    changeStatus(index) {
      this.list_status[index].show = !this.list_status[index].show;
      console.log(this.list_status);
    },

    updateRealtimeData(vin) {
      getVehicleLatestData(vin).then((res) => {
        this.vehicleIntegrate = res.result.vehicleIntegrate;
        this.vehicleDriveMotor = res.result.vehicleDriveMotor;
        this.vehicleExtreme = res.result.vehicleExtreme;
        this.vehicleGps = res.result.vehicleGps;
        this.vehicleAlert = res.result.vehicleAlert;
        this.vehicleEss = res.result.vehicleEss;
        this.vehicleEssTemperature = res.result.vehicleEssTemperature;

        let chart1DataRows = [];
        for (let i=0; i < this.vehicleEss.thisBatteryVoltages.length; i++) {
          chart1DataRows[i] = {x: "电压" + (i+1), value: this.vehicleEss.thisBatteryVoltages[i]};
        }
        this.chart1Data.rows = chart1DataRows;

        let chart2DataRows = [];
        for (let i=0; i < this.vehicleEssTemperature.temperatures.length; i++) {
          chart2DataRows[i] = {x: "温度" + (i+1), value: this.vehicleEssTemperature.temperatures[i]};
        }
        this.chart2Data.rows = chart2DataRows;
      });
    },

    updateAttributes(vin) {
      getVehicleBasicAttributes(vin).then((res) => {
        this.imei = res.result.tspEquipment.imei;
        this.sn = res.result.tspEquipment.sn;
      });
    },
  },

  created() {
    console.log(this.$route);
    console.log("vin=", this.$route.query.vin, "  interval=", this.$route.query.interval);

    let vin = this.$route.query.vin;
    let interval = this.$route.query.interval;

    if (interval < 1000) {
      interval = 1000;

      this.$message({
        showClose: true,
        message: '数据更新间隔需大于等于1000ms',
        type: 'warning'
      });
    }

    this.updateAttributes(vin);

    this.updateRealtimeData(vin);

    this.timer && clearInterval(this.timer);
    this.timer = setInterval(this.updateRealtimeData, interval, vin);

  },

  beforeDestroy(){
    console.log('clearInterval');
    clearInterval(this.timer);
  },

};
</script>

<style lang="scss" scoped>
.look-data {
  min-height: calc(100vh - 84px);
  background: rgb(239, 240, 242);
  padding-bottom: 30px;
  .data-item {
    font-size: 12px;
    color: #333;
    text-align: left;
    line-height: 30px;
    margin-top: 20px;
    .item-tit {
      text-align: left;
      line-height: 20px;
      border-top: 2px solid rgb(219, 219, 219);
      .tit-area {
        background: rgb(219, 219, 219);
        padding: 0 20px;
        border-bottom-right-radius: 50%;
        cursor: pointer;
        span {
          font-size: 20px;
          display: inline-block;
          vertical-align: middle;
        }
        .deg90 {
          transform: rotate(90deg);
        }
        .deg270 {
          transform: rotate(270deg);
          padding-bottom: 6px;
        }
      }
    }
    .item-table {
      padding-left: 12px;
      box-sizing: border-box;
      .child-tit {
        .tit {
          display: inline-block;
          background: rgb(204, 204, 204);
          padding: 0 10px;
          line-height: 20px;
        }
      }
    }
  }
  .data-item-first {
    margin-top: 0 !important;
  }
}
</style>
