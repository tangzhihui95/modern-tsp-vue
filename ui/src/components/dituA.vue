<template>
  <div class="dituBox">
    <audio
      :src="warningAudioSrc"
      controls="controls"
      loop="loop"
      ref="audio"
      style="display: none;"
    >Your browser does not support the audio element.
    </audio>

    <el-container>
      <el-aside width="300px"
                style="display: flex;flex-direction: column; background: #f3f3f3; border: 1px solid #ddd; height: calc(100vh - 85px);"
      >
        <el-row style="flex: 1; font-size: 13px; overflow-y: scroll; padding: 10px 0; box-sizing: border-box;">
          <el-tree
            style="display: inline-block"
            :data="vehicleList"
            show-checkbox
            node-key="id"
            default-expand-all
            :expand-on-click-node="false"
            :render-content="renderContent"
            @node-click="vehicleListNodeClick"
          >
          </el-tree>
        </el-row>

        <el-row style="border-top: 1px solid #ddd;">
          <el-col :span="8" class="button-el-col" v-for="item in vehicle_state_filter_list" :key="item.id">
            <div style="border-bottom: 1px solid #ddd; border-left: 1px solid #ddd; padding-top: 10px;"
                 @click="vehicleStateFilterClick(item.id)"
            >
              <img :src="item.url" alt=""/>
              <p>{{ item.name }}</p>
            </div>
          </el-col>
        </el-row>

      </el-aside>

      <el-main>
        <!-- 地图 -->
        <div id="container" class="map-wrap"></div>
      </el-main>
    </el-container>

    <!-- 单击显示的信息框 -->
    <div ref="myref">
      <div class="flexb">
        <ul class="shuom" style="width:320px">
          <div v-if="vehicleBasicData.soc <= 19">
            <svg
              class="con"
              aria-hidden="true"
              style="width: 40px; height: 40px"
              v-if="vehicleBasicData.soc <= 19"
            >
              <use xlink:href="#icon-dianliang">
                {{ vehicleBasicData.soc }}%
              </use>
            </svg>
            <span style="color: red">{{ vehicleBasicData.soc }}%</span>
          </div>
          <div v-if="vehicleBasicData.soc <= 29 && vehicleBasicData.soc > 19">
            <svg
              class="con"
              aria-hidden="true"
              style="width: 40px; height: 40px"
              v-if="vehicleBasicData.soc <= 29"
            >
              <use xlink:href="#icon-dianliang1">
                {{ vehicleBasicData.soc }}%
              </use>
            </svg>
            <span style="color: salmon">{{ vehicleBasicData.soc }}%</span>
          </div>
          <div v-if="vehicleBasicData.soc <= 69 && vehicleBasicData.soc > 29">
            <svg
              class="con"
              aria-hidden="true"
              style="width: 40px; height: 40px"
              v-if="vehicleBasicData.soc <= 69"
            >
              <use xlink:href="#icon-dianliang3">80%</use>
            </svg>
            <span style="color: yellowgreen">{{ vehicleBasicData.soc }}%</span>
          </div>
          <div v-if="vehicleBasicData.soc <= 100 && vehicleBasicData.soc > 69">
            <svg
              class="con"
              aria-hidden="true"
              style="width: 40px; height: 40px"
              v-if="vehicleBasicData.soc <= 100 && vehicleBasicData.soc >= 69"
            >
              <use xlink:href="#icon-dianliang2"></use>
            </svg>
            <span style="color: seagreen">{{ vehicleBasicData.soc }}%</span>
          </div>
          <li>
            <img src="@/assets/dingwei.png" alt="" class="imgtop"/>
            <span>车牌号：{{ vehicleBasicData.plateCode }}</span>
          </li>
          <li>
            <img src="@/assets/dingwei.png" alt="" class="imgtop"/>
            <span>车主：{{ vehicleBasicData.realName }}</span>
            <span>{{ vehicleBasicData.mobile }}</span>
          </li>
          <li>
            <img src="@/assets/dingwei.png" alt="" class="imgtop"/>
            <span>VIN码：{{ vehicleBasicData.vin }}</span>
          </li>
          <li>
            <img src="@/assets/dingwei.png" alt="" class="imgtop"/>
            <span>车型：{{ vehicleBasicData.vehicleModelName }}</span>
          </li>
          <li>
            <img src="@/assets/dingwei.png" alt="" class="imgtop"/>
            <span>车身颜色：{{ vehicleBasicData.color }}</span>
          </li>
          <li>
            <img src="@/assets/dingwei.png" alt="" class="imgtop"/>
            <span>经度：{{ vehicleBasicData.longitude }}</span>
          </li>
          <li>
            <img src="@/assets/dingwei.png" alt="" class="imgtop"/>
            <span>纬度：{{ vehicleBasicData.latitude }}</span>
          </li>
          <li>
            <img src="@/assets/dingwei.png" alt="" class="imgtop"/>
            <span>地址信息：{{ vehicleAddress.address }}</span>
          </li>
        </ul>
        <div class="qiche" v-if="vehicleBasicData.onlineStatus == true">
          <img src="@/assets/lanqiche.png" alt="" class="imgtop"/>
        </div>
        <div class="qiche" v-if="vehicleBasicData.onlineStatus == false">
          <img src="@/assets/cheliang_1.png" alt="" class="imgtop"/>
        </div>

        <div class="jinggao" v-if="vehicleBasicData.alertStatus == false">
          <img src="@/assets/hei1.png" alt="" class="imgtop"/>
        </div>
        <div class="jinggao" v-if="vehicleBasicData.alertStatus == true">
          <img src="@/assets/icon-test.png" alt="" class="imgtop"/>
        </div>
        <div class="dianchi" v-if="vehicleBasicData.chargeStatus == false">
          <img src="@/assets/heidian.png" alt="" class="imgtop"/>
        </div>
        <div class="dianchi" v-if="vehicleBasicData.chargeStatus == true">
          <img src="@/assets/lvdian.png" alt="" class="imgtop"/>
        </div>
        <div class="touxiang">
          <img src="@/assets/tx1.png" alt=""/>
        </div>
        <!-- <div >
              <span><img src="@/assets/lanqiche.png" alt="" /> </span>
              <span> <img src="@/assets/hei1.png" alt="" /></span>
              <span> <img src="@/assets/lvdian.png" alt="" /></span>
        </div> -->
      </div>

      <div class="buttbox">
        <button
          class="dcjk"
          @click="openVehicleRealtimeDataMonitor(vehicleBasicData.vin)"
        >
          单车监控
        </button>
      </div>
      <div class="car-control">
        <div
          :class="['tit', { active: control_active }]"
          @click="changeControlStatus"
        >
          <img
            v-show="!control_active"
            src="../assets/images/control_no.jpeg"
            alt=""
          />
          <img
            v-show="control_active"
            src="../assets/images/control_car.png"
            alt=""
          />
          <span>车控</span>
        </div>
        <div class="hide-control" v-show="control_active">
          <div>
            <ul>
              <li
                :class="{ active: item.id == control_item_active }"
                v-for="item in control_list"
                :key="item.id"
                @click="changeControlItem(item.id)"
              >
                <img :src="item.url" alt=""/>
                <div>{{ item.name }}</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <el-row style="position: absolute; top: 40px; left: 300px; width: 450px">
      <el-col>
        <el-button @click="resetMap()" icon="el-icon-refresh-right" circle></el-button>

        <el-button @click="toggleEnableOrDisableWarningAudio()" :icon="audioButtonIcon" circle
                   style="margin-right: 5px"
        ></el-button>

        <el-select
          style="width: 220px"
          v-model="value"
          filterable
          :remote-method="remoteMethod"
          reserve-keyword
          :loading="loading"
          remote
          clearable
          placeholder="请输入车牌号、VIN码、终端SN"
        >
          <el-option
            @click.native="vehicleOptionClick(value)"
            v-for="item in optList"
            :key="item.type + item.value"
            :label="item.label"
            :value="item.value"
          >
            <div>{{ item.type + item.label }}</div>
            <div class="qichetubiao">
              <img src="@/assets/lanqiche.png" alt=""/>
              <!-- <img v-show="vehicleBasicData.onlineStatus === false" src="@/assets/huiqiche.png" alt="" /> -->
              <!-- <img v-show="vehicleBasicData.alertStatus === true" src="@/assets/icon-test.png" alt="" /> -->
              <img src="@/assets/hei1.png" alt=""/>
              <!-- <img v-show="vehicleBasicData.chargeStatus === true" src="@/assets/lvdian.png" alt="" /> -->
              <img src="@/assets/heidian.png" alt=""/>
            </div>
          </el-option>
        </el-select>

        <el-button @click="enableMapRanging()" icon="el-icon-minus" circle style="margin-left: 10px"></el-button>

        <el-button @click="enableMapMeasureArea()" icon="el-icon-house" circle></el-button>

        <el-button @click="disableMapRangingAndMeasureArea()" icon="el-icon-close" circle></el-button>

      </el-col>
    </el-row>
    <el-row style="position: absolute; top: 40px; right: 100px">
      <el-col>
        <div
          class="box-card"
          style="text-align: center;
            background-color: white;
            border: 1px solid wheat;
            box-shadow: 10px 10px 5px #888888;
            border-radius: 2px;
            padding: 10px;"
        >
          <el-tooltip
            class="item"
            effect="light"
            :content="'全部车辆' + vehicleStatisticsData.totalCount"
            placement="left-start"
          >
            <img
              src="@/assets/quanbucheliang.png"
              style="width: 30px; height: 30px; border: 0px; margin: 0px"
            />
          </el-tooltip>

          <hr/>
          <el-tooltip
            class="item"
            effect="light"
            :content="'在线车辆' + vehicleStatisticsData.onLineCount"
            placement="left-start"
          >
            <img
              src="@/assets/cheliang.png"
              style="width: 30px; height: 30px; border: 0px; margin: 0px"
            />
          </el-tooltip>

          <hr/>
          <el-tooltip
            class="item"
            effect="light"
            :content="'离线车辆' + vehicleStatisticsData.offLineCount"
            placement="left-start"
          >
            <img
              src="@/assets/cheliang_1.png"
              style="width: 30px; height: 30px; border: 0px; margin: 0px"
            />
          </el-tooltip>
          <hr/>
          <el-tooltip
            class="item"
            effect="light"
            :content="'告警车辆' + vehicleStatisticsData.alertCount"
            placement="left-start"
          >
            <img
              src="@/assets/icon-test.png"
              style="width: 30px; height: 30px; border: 0px; margin: 0px"
            />
          </el-tooltip>
          <hr/>
          <el-tooltip
            class="item"
            effect="light"
            :content="'当前行驶总里程' + this.currenteMileage"
            placement="left-start"
          >
            <img
              src="@/assets/car.png"
              style="width: 30px; height: 30px; border: 0px; margin: 0px"
              @click="getNewMileage"
            />
          </el-tooltip>
          <hr/>
          <el-tooltip :disabled="alertDialogVisible" :content="'移动报警：' + alertCar" placement="bottom" effect="light">
            <el-button type="text" @click="openMoveAlert" style="padding-top: 0;padding-bottom: 0;">
              <img src="@/assets/moveAlert.png" style="width: 30px; height: 30px; border: 0px; margin: 0px"
            /></el-button>
          </el-tooltip>

        </div>
      </el-col>
    </el-row>

    <div>
      <el-drawer
        :title="detailPageTitle"
        v-drawerDrag
        :visible.sync="isDrawerVisible"
        size="1200px"
      >
        <el-row>
          <span>n车辆状态:</span>
        </el-row>
        <el-row>
          <el-col :span="5" :offset="1">
            <span>
              充电状态:
              {{
                this.vehicleCanData.chargeState
              }}
            </span>
          </el-col>
          <el-col :span="5">
            <span>
              运行模式:
              {{
                this.vehicleCanData.runMode
              }}
            </span>
          </el-col>
          <el-col :span="5">
            <span
            >总电压: {{ (this.vehicleCanData.totalVoltage) }}
              V
            </span>
          </el-col>
          <el-col :span="6">
            <span
            >总电流:
              {{ (this.vehicleCanData.totalCurrent) }}
              A
            </span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5" :offset="1">
            <span
            >加速踏板行程值:
              {{ this.vehicleCanData.acceleratorPedalPosition }} %</span
            >
          </el-col>
          <el-col :span="5">
            <span
            >SOC: {{ this.vehicleCanData.soc }}
              %
            </span>
          </el-col>
          <el-col :span="5">
            <span
            >档位:
              {{
                this.vehicleCanData.gear
              }}
            </span>
          </el-col>
          <el-col :span="5">
            <span
            >制动踏板行程值:
              {{ this.vehicleCanData.brakePedalPosition }} %</span
            >
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5" :offset="1">
            <span>
              数据采集时间:
              {{
                this.vehicleCanData.collectTime
              }}
            </span>
          </el-col>
        </el-row>
        <img
          src="@/assets/vehicleModel.png"
          alt=""
          style="margin-top: 2%; margin-bottom: 2%"
        />
        <el-row>
          <el-col :span="4" :offset="2"
          >{{ (this.vehicleCanData.speed) }}
            km/h
          </el-col>
          <el-col :span="4" :offset="12"
          >{{ (this.vehicleCanData.mileage) }}
            km
          </el-col>
        </el-row>
        <br/>
        <br/>
        <el-row>
          <el-col :span="7">
            <el-row>
              <el-col :offset="1">
                <span>报警数据</span>
              </el-col>
              <el-col :offset="2">
                <span> 最高报警: {{ this.vehicleCanData.maxAlarmLevel }} </span>
              </el-col>
              <el-col :offset="2">
                <span>
                  报警状态: {{ this.vehicleCanData.generalAlarmSign }}
                </span>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="7" :offset="3" style="margin-bottom: 2%">
            <el-row>
              <el-col :offset="1">
                <span>极值数据</span>
              </el-col>
              <el-col :offset="2">
                <span>
                  最高电压电池单体代号:
                  {{ this.vehicleCanData.maxVoltageBatteryCell }}
                </span>
              </el-col>
              <el-col :offset="2">
                <span>
                  最高电压:
                  {{
                    (this.vehicleCanData.maxVoltageBattery)
                  }}
                  V
                </span>
              </el-col>
              <el-col :offset="2">
                <span>
                  最低电压电池单体代号:
                  {{ this.vehicleCanData.minVoltageBatteryCell }}
                </span>
              </el-col>
              <el-col :offset="2">
                <span>
                  最低电压:
                  {{
                    (this.vehicleCanData.minVoltageBattery)
                  }}
                  V
                </span>
              </el-col>
              <el-col :offset="2">
                <span>
                  最高温度探针序号:
                  {{ this.vehicleCanData.maxTemperatureProbe }}
                </span>
              </el-col>
              <el-col :offset="2">
                <span>
                  最高温度: {{ this.vehicleCanData.maxTemperature }}
                  °C
                </span>
              </el-col>
              <el-col :offset="2">
                <span>
                  最低温度探针序号:
                  {{ this.vehicleCanData.minTemperatureProbe }}
                </span>
              </el-col>
              <el-col :offset="2">
                <span>
                  最低温度: {{ this.vehicleCanData.minTemperature }}
                  °C
                </span>
              </el-col>
              <el-col :offset="2">
                <span>
                  子系统号: {{ this.vehicleCanData.maxVoltageBatterySubsystem }}
                </span>
              </el-col>
              <!-- <el-col :offset="2">
                <span>
                  电压值: {{ this.vehicleCanData.minVoltageBattery * 0.001 }}
                  V
                </span>
              </el-col> -->
            </el-row>
          </el-col>
          <el-col :span="8">
            <el-row>
              <el-col :offset="1">
                <span>驱动电机数据</span>
              </el-col>
              <el-col :offset="2">
                <span>
                  驱动电机状态:
                  {{
                    this.vehicleCanData.state
                  }}
                </span>
              </el-col>
              <el-col :offset="2">
                <span>
                  控制器温度: {{ this.vehicleCanData.temperature }}
                  °C
                </span>
              </el-col>
              <el-col :offset="2">
                <span>
                  驱动电机转速: {{ this.vehicleCanData.rotateSpeed }}
                  r/min
                </span>
              </el-col>
              <el-col :offset="2">
                <span>
                  驱动电机转矩: {{ (this.vehicleCanData.torque) }}
                  N·m
                </span>
              </el-col>
              <el-col :offset="2">
                <span>
                  驱动电机温度: {{ this.vehicleCanData.temperature }}
                  °C
                </span>
              </el-col>
              <el-col :offset="2">
                <span>
                  控制器输入电压:
                  {{ this.vehicleCanData.controllerInputVoltage }}
                  V
                </span>
              </el-col>
              <el-col :offset="2">
                <span>
                  控制器直流母线电流:
                  {{ this.vehicleCanData.controllerDcBusCurrent }}
                  A
                </span>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="4" :offset="2">
            <el-row>
              <el-col :offset="1">
                <span>可充电储能装置电压数据</span>
              </el-col>
              <el-col :offset="2">
                <span>
                  可充电储能装置电流:{{
                    this.vehicleCanData.vehicleEss.current
                      ? 0
                      : this.vehicleCanData.vehicleEss.current * 0.1 - 1000
                  }}
                  A
                </span>
              </el-col>
              <el-col :offset="2">
                <span>
                  单体电池总数:
                  {{ this.vehicleCanData.vehicleEss.batteryNumber }}
                </span>
              </el-col>
              <el-col :offset="2">
                <span>
                  本帧起始电池序号:{{
                    this.vehicleCanData.vehicleEss.thisBatteryStartIndex
                  }}
                </span>
              </el-col>
              <el-col :offset="2">
                <span>
                  本帧单体电池总数:
                  {{ this.vehicleCanData.vehicleEss.thisBatteryNumber }}
                </span>
              </el-col>
              <el-col :offset="2">
                <span>
                  单体电池电压:
                  <el-table
                    :data="voltagesList"
                    :highlight-current-row="true"
                    :row-style="{ height: '10px' }"
                    :cell-style="{ padding: '0px' }"
                  >
                    <el-table-column
                      type="batterryVoltages"
                      align="center"
                      width="20"
                    ></el-table-column>
                    <el-table-column
                      prop="index"
                      label="序号"
                    ></el-table-column>
                    <el-table-column
                      prop="prop"
                      label="电压值/V"
                    ></el-table-column>
                  </el-table>
                  <!-- {{ this.vehicleCanData.vehicleEss.thisBatteryVoltagesInt }} -->
                  <!-- V -->
                </span>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="5" :offset="2">
            <el-row>
              <el-col :offset="1">
                <span>可充电储能装置温度数据</span>
              </el-col>
              <el-col :offset="2">
                <span>
                  可充电储能温度探针个数:
                  {{ this.vehicleCanData.vehicleEssTemperature.probeNumber }}
                </span>
              </el-col>
              <el-col :offset="2">
                <span>
                  可充电储能子系统各温度探针检测到的温度值:
                  <el-table
                    :data="temperaturesList"
                    :highlight-current-row="true"
                    :row-style="{ height: '10px' }"
                    :cell-style="{ padding: '0px' }"
                  >
                    <el-table-column
                      type="essTemperatures"
                      align="center"
                      width="20"
                    ></el-table-column>
                    <el-table-column
                      prop="index"
                      label="序号"
                    ></el-table-column>
                    <el-table-column
                      prop="prop"
                      label="温度/V"
                    ></el-table-column>
                  </el-table>
                  <!-- {{
                    this.vehicleCanData.vehicleEssTemperature.temperaturesInt
                  }} -->
                  <!-- °C -->
                </span>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-divider content-position="left">车辆静态信息</el-divider>
        <el-row>
          <el-col :span="4" :offset="2">
            <img
              src="@/assets/vehicle/staticInfo/sim.png"
              style="width: 80px; height: 80px; border: 0px"
            />
          </el-col>
          <el-col :span="4">
            <img
              src="@/assets/vehicle/staticInfo/lichengbiao.png"
              style="width: 80px; height: 80px; border: 0px"
            />
          </el-col>
          <el-col :span="4">
            <img
              src="@/assets/vehicle/staticInfo/shebeixinghao.png"
              style="width: 80px; height: 80px; border: 0px"
            />
          </el-col>
          <el-col :span="4">
            <img
              src="@/assets/vehicle/staticInfo/dianji.png"
              style="width: 80px; height: 80px; border: 0px"
            />
          </el-col>
          <el-col :span="4">
            <img
              src="@/assets/vehicle/staticInfo/dianji.png"
              style="width: 80px; height: 80px; border: 0px"
            />
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4" :offset="2">SIM卡ICCID号</el-col>
          <el-col :span="4">最高车速</el-col>
          <el-col :span="4">纯电续驶里程</el-col>
          <el-col :span="4">型号</el-col>
          <el-col :span="4">驱动电机布置型式/位置</el-col>
        </el-row>
        <el-row style="margin-top: 2%">
          <el-col :span="4" :offset="2">{{
              this.vehicleCanData.tspEquipment.sim
            }}
          </el-col>
          <el-col :span="4">{{ this.vehicleCanData.speed * 0.1 }}km/h</el-col>
          <el-col :span="4">{{ this.vehicleCanData.mileage * 0.1 }}km</el-col>
          <el-col :span="4">{{
              this.vehicleCanData.tspVehicleStdModel.stdModeName
            }}
          </el-col>
          <el-col :span="4">{{ this.vehicleCanData.sequenceNumber }}</el-col>
        </el-row>
      </el-drawer>
    </div>
    <!--     点击车控单个按键出来的弹框-->
    <el-dialog
      title="车控选项"
      :visible.sync="controlDialog"
      width="30%"
      :before-close="controlDialogCancel"
    >
      <div class="dialog-content">
        <el-cascader
          v-model="control_value"
          :options="control_options"
        ></el-cascader>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="controlDialogCancel">取 消</el-button>
        <el-button type="primary" @click="submitControl"
        >确 定</el-button
        >
      </span>
    </el-dialog>


    <!--    一键控窗页面-->
    <el-dialog
      title="一键控窗"
      :visible.sync="allWindowControlDialogVisble"
      width="50%"
      :before-close="controlDialogCancel"
    >
      <div style="margin-top: -50px">
        <el-divider/>
      </div>

      <div style="margin-top: 35px">

        <span>选择窗户：</span>
        <span style="margin-left: 10px">左前窗：</span>
        <el-radio-group v-model="leftFrontWindowVar" style="margin-left: 10px">
          <el-radio label="00">无操作</el-radio>
          <el-radio label="01">关闭</el-radio>
          <el-radio label="02">开25%</el-radio>
          <el-radio label="03">开50%</el-radio>
          <el-radio label="04">开75%</el-radio>
          <el-radio label="05">全开</el-radio>
        </el-radio-group>

      </div>
      <div style="margin-top: 10px">
        <span style="margin-left: 80px">右前窗：</span>
        <el-radio-group v-model="rightFrontWindowVar" style="margin-left: 10px">
          <el-radio label="00">无操作</el-radio>
          <el-radio label="01">关闭</el-radio>
          <el-radio label="02">开25%</el-radio>
          <el-radio label="03">开50%</el-radio>
          <el-radio label="04">开75%</el-radio>
          <el-radio label="05">全开</el-radio>
        </el-radio-group>

      </div>
      <div style="margin-top: 20px">
        <span style="margin-left: 80px">左后窗：</span>
        <el-radio-group v-model="leftRearWindowVar" style="margin-left: 10px">
          <el-radio label="00">无操作</el-radio>
          <el-radio label="01">关闭</el-radio>
          <el-radio label="02">开25%</el-radio>
          <el-radio label="03">开50%</el-radio>
          <el-radio label="04">开75%</el-radio>
          <el-radio label="05">全开</el-radio>
        </el-radio-group>

      </div>
      <div style="margin-top: 10px">
        <span style="margin-left: 80px">右后窗：</span>
        <el-radio-group v-model="rightRearWindowVar" style="margin-left: 10px">
          <el-radio label="00">无操作</el-radio>
          <el-radio label="01">关闭</el-radio>
          <el-radio label="02">开25%</el-radio>
          <el-radio label="03">开50%</el-radio>
          <el-radio label="04">开75%</el-radio>
          <el-radio label="05">全开</el-radio>
        </el-radio-group>

      </div>


      <div style="margin-top: 20px">
        <span style="margin-left: 90px">天&nbsp;&nbsp;&nbsp;&nbsp;窗：</span>
        <el-radio-group v-model="scuttleVar" style="margin-left: 10px">
          <el-radio label="00">无操作</el-radio>
          <el-radio label="01">关闭</el-radio>
          <el-radio label="02">开25%</el-radio>
          <el-radio label="03">开50%</el-radio>
          <el-radio label="04">开75%</el-radio>
          <el-radio label="05">全开</el-radio>
        </el-radio-group>
      </div>

      <div style="text-align: center">
        <div style="margin-top: 50px">
        <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitControl">执行</el-button>
        <el-button style="margin-left: 30px" @click="allWindowControlDialogVisble = false">关闭</el-button>
      </span>
        </div>
      </div>
    </el-dialog>

    <!--空调设置界面-->
    <el-dialog
      title="空调设置"
      :visible.sync="airConditionerSettingDialogVisble"
      width="50%"
      :before-close="airConditionerSettingDialogCancel">

      <div style="margin-top: 35px">
        <span style="margin-left: 80px">空调开关：</span>
        <el-radio-group v-model="airConditionerSetting.switch" style="margin-left: 35px">
          <el-radio label="00">无操作</el-radio>
          <el-radio label="01">关闭</el-radio>
          <el-radio label="02">开启</el-radio>
        </el-radio-group>

      </div>
      <div style="margin-top: 10px">
        <span style="margin-left: 80px">温度设置：</span>
        <el-input-number v-model="airConditionerSetting.temperature" :min="18" :max="30" :step="0.5" step-strictly style="margin-left: 35px"/>

      </div>
      <div style="margin-top: 10px">
        <span style="margin-left: 80px">空调运行时长：</span>
        <el-radio-group v-model="airConditionerSetting.runTime" style="margin-left: 10px">
          <el-radio label="00">0分</el-radio>
          <el-radio label="03">3分</el-radio>
          <el-radio label="05">5分</el-radio>
          <el-radio label="08">8分</el-radio>
          <el-radio label="0A">10分</el-radio>
          <el-radio label="0D">13分</el-radio>
          <el-radio label="0F">15分</el-radio>
        </el-radio-group>

      </div>
      <div style="margin-top: 10px">
        <span style="margin-left: 80px">主驾座椅加热：</span>
        <el-radio-group v-model="airConditionerSetting.driverSeatHeating" style="margin-left: 10px">
          <el-radio label="00">无操作</el-radio>
          <el-radio label="01">关闭</el-radio>
          <el-radio label="02">一档</el-radio>
          <el-radio label="03">二档</el-radio>
          <el-radio label="04">三档</el-radio>
        </el-radio-group>

      </div>
      <div style="margin-top: 10px">
        <span style="margin-left: 80px">副驾座椅加热：</span>
        <el-radio-group v-model="airConditionerSetting.passengerSeatHeating" style="margin-left: 10px">
          <el-radio label="00">无操作</el-radio>
          <el-radio label="01">关闭</el-radio>
          <el-radio label="02">一档</el-radio>
          <el-radio label="03">二档</el-radio>
          <el-radio label="04">三档</el-radio>
        </el-radio-group>
      </div>

      <div style="text-align: center">
        <div style="margin-top: 50px">
        <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitControl">执行</el-button>
        <el-button style="margin-left: 30px" @click="airConditionerSettingDialogVisble = false">关闭</el-button>
      </span>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      title="移动报警列表"
      :visible.sync="alertDialogVisible"
      width="70%"
      height="500"
      :before-close="closeMoveAlert"
    >
      <el-button style="margin-right: 0; margin-bottom: 5px;" type="primary" size="small" @click="openMoveAlertHistory">查看日志</el-button>
      <el-table
        :data="moveAlertTableData"
        height="250"
        width="100%"
        v-loading="alertTableLoading"
        border
        style="width: 100%">
        <el-table-column
          prop="vin"
          label="VIN"
          width="180">
        </el-table-column>
        <el-table-column
          prop="ICCID"
          label="ICCID"
          width="180">
        </el-table-column>
        <el-table-column
          prop="address"
          label="报警位置">
        </el-table-column>
        <el-table-column
          prop="errorTime"
          label="报警时间">
        </el-table-column>
        <el-table-column
          prop="carNumber"
          label="车牌号">
        </el-table-column>
        <el-table-column
          prop="carMaster"
          label="车主">
        </el-table-column>
        <el-table-column
          prop="carTel"
          label="车主手机">
        </el-table-column>
        <el-table-column
          prop="carColor"
          label="车辆颜色">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button @click="monitorCar(scope.row)" type="text" size="small">监控</el-button>
            <el-button @click="openAlertInfo(scope.row)" type="text" size="small">处理</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="text-align: center;margin-top: 10px;"
        background
        @size-change="changePageSize"
        :page-sizes="[10, 20, 50, 100]"
        @current-change="changePage"
        layout="total, sizes,prev, pager, next"
        :total="alertMoveParams.total">
      </el-pagination>
    </el-dialog>

    <el-dialog
      title="处理移动报警"
      :visible.sync="handleAlertVisible"
      width="50%"
      :before-close="closeAlertInfo"
    >
      <span style="color: red">*</span>处理结果：
      <el-select v-model="alertInfo.dealRemark" clearable  placeholder="请选择">
        <el-option
          v-for="item in handleResult"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
<!--        <el-option
          :key="'车主自己移动'"
          label="车主自己移动">
        </el-option>
        <el-option
          :key="'车辆被动移动'"
          label="车辆被动移动">
        </el-option>-->
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitHandle">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="历史移动报警记录"
      :visible.sync="alertHistoryDialogVisible"
      width="70%"
      :before-close="closeMoveAlertHistory"
    >
      <el-table
        :data="moveAlertHistoryTableData"
        height="250"
        width="100%"
        v-loading="alertHistoryTableLoading"
        border
        style="width: 100%">
        <el-table-column
          prop="vin"
          label="VIN"
          width="180">
        </el-table-column>
        <el-table-column
          prop="errorTime"
          label="报警时间"
          width="180">
        </el-table-column>
        <el-table-column
          prop="isMonitorText"
          label="车辆监控状态"
          width="180">
        </el-table-column>
        <el-table-column
          prop="handlerUserName"
          label="处理人"
          >
        </el-table-column>
        <el-table-column
          prop="handleTime"
          label="处理时间"
          width="180">
        </el-table-column>
        <el-table-column
          prop="dealTypeText"
          label="处理状态"
          width="180">
        </el-table-column>
        <el-table-column
          prop="dealRemark"
          label="处理结果"
          width="180">
        </el-table-column>
      </el-table>
      <el-pagination
        style="text-align: center;margin-top: 10px;"
        background
        @size-change="changeHistoryPageSize"
        :page-sizes="[2, 20, 50, 100]"
        layout="total, sizes,prev, pager, next"
        @current-change="changeHistoryPage"
        :total="alertMoveHistoryParams.total">
      </el-pagination>
    </el-dialog>
  </div>
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader'
import '@/drawer-drag/drawer-drag'
import {
  getVehicleBasicData,
  getVehicleCanData,
  selectList as findSelectList
} from '@/api/tsp/vehicleGps.js'
import { getUserVehiclesLatestData } from '@/api/tsp/vehicleData.js'
import { count, list, updateForHandle, updateForMonitor } from '@/api/move/move'
import { getVehicleControlCommandExecuteResult, sendVehicleControlCommand } from '@/api/tsp/zhiyuan.js'

export default {
  data() {
    return {
      allWindowControlDialogVisble: false,
      airConditionerSettingDialogVisble: false,
      airConditionerSetting: {
        switch: '00',
        temperature: 18,
        runTime: '00',
        driverSeatHeating: '00',
        passengerSeatHeating: '00'
      },
      rightRearWindowVar: '00',
      leftRearWindowVar: '00',
      rightFrontWindowVar: '00',
      leftFrontWindowVar: '00',
      scuttleVar: '00',

      // 车控列表 start
      control_value: '',
      control_options: [
        {
          value: 1,
          label: '关闭'
        },
        {
          value: 2,
          label: '打开'
        }
      ],

      queryParams: {
        vin: '',
        commandId: '',
        command: ''
      },
      controlDialog: false,
      control_active: false,
      control_item_active: 0,
      control_list: [
        {
          id: 1,
          url: require('@/assets/images/zhongkongsuo.png'),
          name: '中控锁'
        },
        {
          id: 2,
          url: require('@/assets/images/zuoqianchuang.png'),
          name: '左前窗'
        },
        {
          id: 3,
          url: require('@/assets/images/yuanchengxunche.png'),
          name: '远程寻车'
        },
        {
          id: 4,
          url: require('@/assets/images/zuohouchuang.png'),
          name: '左后窗'
        },
        {
          id: 5,
          url: require('@/assets/images/youqianshuang.png'),
          name: '右前窗'
        },
        {
          id: 6,
          url: require('@/assets/images/youhouchuang.png'),
          name: '右后窗'
        },
        /*一键控窗*/
        {
          id: 7,
          url: require('@/assets/images/zuohouchuang.png'),
          name: '一键控窗'
        },
        {
          id: 8,
          url: require('@/assets/images/control_car.png'),
          name: '空调设置'
        }
      ],
      // 车控列表 end
      detailPageTitle: '',
      direction: 'btt',
      isDrawerVisible: false,
      value: [],
      search: '',
      optList: [],
      // selectList: [],
      //地图对象
      map: null,
      plateCode: '',
      loading: false,
      vehicleBasicData: {},
      vehicleCanData: {
        tspEquipment: {},
        tspVehicle: {},
        tspVehicleStdModel: {},
        vehicleEss: {},
        vehicleEssTemperature: {}
      },
      vehicleStatisticsData: { totalCount: 0, onLineCount: 0, offLineCount: 0, alertCount: 0 },
      vehicleGpsAndStatusDataMap: new Map(),
      currenteMileage: '0',
      updateDataTimer: null,
      updateDataInterval: 5000,
      mapDistCluster: null,
      mapDistClusterData: null,
      mapOverlayGroup: null,
      mapInfoWindow: null,
      defaultMapZoom: 5,
      defaultMapCenter: [105.602725, 37.076636],
      mapZoom: null,
      mapCenter: null,
      hideMapDistClusterZoom: 12,
      mouseTool: null,

      voltagesList: [],
      temperaturesList: [],
      arr: [],
      arr2: [],

      vehicleList: [
        {
          id: 0,
          label: 'MD11',
          children: []
        }
      ],
      vehicle_state_filter_list: [
        {
          id: 1,
          url: require('@/assets/images/xings_icon.png'),
          name: '行驶'
        },
        {
          id: 2,
          url: require('@/assets/images/tingc_icon.png'),
          name: '停车'
        },
        {
          id: 3,
          url: require('@/assets/images/chongd_icon.png'),
          name: '充电'
        },
        {
          id: 4,
          url: require('@/assets/images/lix_icon.png'),
          name: '离线'
        },
        {
          id: 5,
          url: require('@/assets/images/baoj_icon.png'),
          name: '报警'
        },
        {
          id: 6,
          url: require('@/assets/images/weizc_icon.png'),
          name: '在线'
        }
      ],
      vehicleFilterFlag: 0,
      warningAudioSrc: require('@/assets/audio/warning.mp3'),
      audioButtonIcon: 'el-icon-message-solid',
      geocoder: null,
      vehicleAddress: { lng: 0, lat: 0, address: '' },
      distClusterlastUpdateTime: 0,

      vinOfExecuteCommand: null,
      getCommandExecuteResultTimer: null,
      getCommandExecuteResultTimerInterval: 5000,  //5秒
      getCommandExecuteResultMaxCount: null,


      alertDialogVisible:false,
      moveAlertTableData:[],//移动报警列表
      alertMoveParams:{
        total:0,
        page:1,
        pageSize:10,
        dealType:0,
      },
      alertInfo: {dealRemark:''},
      handleAlertVisible:false,
      alertTableLoading: false,

      alertHistoryDialogVisible:false,
      moveAlertHistoryTableData:[],//历史移动报警列表
      alertMoveHistoryParams:{
        total:0,
        page:1,
        pageSize:10,
        dealType:1,
      },
      alertHistoryTableLoading: false,
      handleResult : [
        {value:"车主自己移动",label:"车主自己移动"},
        {value:"车辆被动移动",label:"车辆被动移动"},

      ],
      alertCar:0,

    }
  },
  mounted() {

    //DOM初始化完成进行地图初始化
    this.initMap()
    this.resetUpdateDataTimer()
  },

  beforeDestroy() {
    this.clearUpdateDataTimer()
    this.clearGetCommandExecuteResultTimer()
  },
  created() {
    this.countAlertCar();
    this.getNowMileage()
    if (this.$route.query.vin) {
      console.log(this.$route.query.vin)
    }
  },

  activated() {
    console.log('activated')

    //切换回首页，重新初始化地图
    this.initMap()

    //切换回首页，开启定时器
    this.resetUpdateDataTimer()
  },

  deactivated() {
    console.log('deactivated')

    //TODO：关闭定时器后，首页车辆报警等功能无法正常运行
    //关闭定时器，否则会造成内存泄漏
    this.clearUpdateDataTimer()

    //切换到其他页面时，记录MAP状态后销毁MAP（不销毁的话，在其他可以滚动滚轮的页面滚动滚轮后，地图会渲染出错卡死）
    this.mapZoom = this.map.getZoom()
    this.mapCenter = this.map.getCenter()
    this.mapDistClusterData = null

    let oldMap = this.map
    this.map = null
    oldMap.destroy()
  },

  watch: {
    $route(newValue, curtValue) {
      if (!newValue.query.value) return
      this.value = newValue.query.value
      this.vehicleOptionClick(this.value)
      console.log('route', newValue, curtValue)

    }
  },
  methods: {
    countAlertCar(){
      count().then(res=>{
        if(res.code === 200){
          this.alertCar = res.result;
        }
      })
    },
    //提交处理结果
    submitHandle(){
      let params = {
        id: this.alertInfo.id,
        dealType: 1,
        dealRemark: this.alertInfo.dealRemark
      }
      let that = this;
      updateForHandle(params).then(res=>{
        if(res.code===200){
          that.closeAlertInfo();
          that.loadMoveAlertList();
        }
      })
    },
    //查询移动报警未处理列表
    loadMoveAlertList(){
      this.alertTableLoading = true;
      list(this.alertMoveParams).then(res=>{
        this.moveAlertTableData = res.result.records
        this.alertMoveParams = {
          total: res.result.total,
          page:res.result.current,
          pageSize: res.result.size
        }
        this.alertTableLoading = false;
      })
    },
    //查询移动报警已处理数据
    loadMoveAlertHistoryList(){
      this.alertHistoryTableLoading = true;
      list(this.alertMoveHistoryParams).then(res=>{
        this.moveAlertHistoryTableData = res.result.records
        this.alertMoveHistoryParams = {
          total: res.result.total,
          page:res.result.current,
          pageSize: res.result.size
        }
        this.alertHistoryTableLoading = false;
      })
    },
    //修改车辆监控状态
    monitorCar(row) {
      this.$confirm('是否实时监控此车辆?长时间监控可能会导致电瓶亏电！是否继续此操作', '提示', {
        confirmButtonText: '继续',
        cancelButtonText: '取消',
        type: 'warning',
        modal: false,
        beforeClose: (action, instance, done) => {
          instance.modal = true;
          done();
        },
      }).then(() => {
        let params = {
          id:row.id,
          isMonitor: 1
        }
        updateForMonitor(params).then(res=>{
          localStorage.setItem("alertInfoId",row.id);
          this.$router.push({path:'/integrate/monitor'});
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消监控'
        });
      });
    },
    closeAlertInfo(){
      this.handleAlertVisible = false;
    },
    openAlertInfo(row){
      this.handleAlertVisible = true;
      this.alertInfo = row;
    },
    changePage(page){
      this.alertMoveParams.page = page;
      this.alertMoveParams.dealType=0;
      this.loadMoveAlertList();
    },
    changePageSize(val){
      this.alertMoveParams.pageSize = val;
      this.alertMoveParams.page = 1;
      this.alertMoveParams.dealType=0;
      this.loadMoveAlertList();
    },
    changeHistoryPage(page){
      this.alertMoveHistoryParams.page = page;
      this.alertMoveHistoryParams.dealType=1;
      this.loadMoveAlertHistoryList();
    },
    changeHistoryPageSize(val){
      this.alertMoveHistoryParams.pageSize = val;
      this.alertMoveHistoryParams.page = 1;
      this.alertMoveHistoryParams.dealType=1;
      this.loadMoveAlertHistoryList();
    },
    openMoveAlert(){
      this.alertDialogVisible = true;
      this.loadMoveAlertList();
    },
    closeMoveAlert(){
      this.alertDialogVisible = false;
    },
    openMoveAlertHistory(){
      this.alertHistoryDialogVisible = true;
      this.loadMoveAlertHistoryList();
    },
    closeMoveAlertHistory(){
      this.alertHistoryDialogVisible = false;
    },
    resetUpdateDataTimer() {
      console.log('resetUpdateDataTimer = ' + this.updateDataInterval)

      this.clearUpdateDataTimer()

      this.updateDataTimer = setInterval(() => {
        this.updateVehicleLocationAndData()
      }, this.updateDataInterval)
    },

    clearUpdateDataTimer() {
      console.log('clearUpdateDataTimer')
      this.updateDataTimer && clearInterval(this.updateDataTimer)
      this.updateDataTimer = null
    },

    resetGetCommandExecuteResultTimer(vin) {
      console.log('resetGetCommandExecuteResultTimer = ' + this.getCommandExecuteResultTimerInterval + ', count = ' + this.getCommandExecuteResultMaxCount)

      this.clearGetCommandExecuteResultTimer()

      this.vinOfExecuteCommand = vin
      this.getCommandExecuteResultMaxCount = 3

      this.getCommandExecuteResultTimer && clearInterval(this.getCommandExecuteResultTimer)
      this.getCommandExecuteResultTimer = setInterval(() => {
        this.getCommandExecuteResultByVin()
      }, this.getCommandExecuteResultTimerInterval)
    },

    clearGetCommandExecuteResultTimer() {
      console.log('clearGetCommandExecuteResultTimer')

      this.getCommandExecuteResultTimer && clearInterval(this.getCommandExecuteResultTimer)
      this.getCommandExecuteResultTimer = null
      this.vinOfExecuteCommand = null
    },

    getCommandExecuteResultByVin() {
      getVehicleControlCommandExecuteResult(this.vinOfExecuteCommand).then((res) => {
        let result = res.result
        if (result != null) {
            if (result == 0x00) {
              this.$modal.msgSuccess('成功执行命令')
            } else if (result == 0xFF) {
              this.$message.error('执行命令失败:命令执行失败！')
            } else if (result == 0x01) {
              this.$message.error('执行命令失败:命令格式错误！')
            } else if (result == 0x02) {
              this.$message.error('执行命令失败:命令不支持！')
            } else if (result == 0x03) {
              this.$message.error('执行命令失败:车辆状态不满足！')
            } else if (result == 0x04) {
              this.$message.error('执行命令失败:鉴权失败！')
            } else {
              this.$message.error('解析失败:result=' + result)
            }
            this.clearGetCommandExecuteResultTimer()
        } else {
          this.getCommandExecuteResultMaxCount--
          if (this.getCommandExecuteResultMaxCount < 0) {
            this.clearGetCommandExecuteResultTimer()
            this.$message.error('执行命令失败:车辆未响应！')
          }
        }
      })
    },

    getNowMileage() {
      let totalMileageOfAllVehicles = 0;
      if (vehicleGpsAndStatusDataList != null && vehicleGpsAndStatusDataList.length > 0) {
        for (let i = 0; i < vehicleGpsAndStatusDataList.length; i++ ) {
            totalMileageOfAllVehicles += vehicleGpsAndStatusDataList[i].mileage != null ? vehicleGpsAndStatusDataList[i].mileage : 0;
        }
      }
      this.currenteMileage = totalMileageOfAllVehicles;
    },

    getNewMileage() {
      this.getNowMileage()
    },

    initMap() {
      this.mapZoom = this.defaultMapZoom
      this.mapCenter = this.defaultMapCenter

      AMapLoader.load({
        key: '98d595bb4a2f2e471bf13e7a7713314c', // 申请好的Web端开发者Key，首次调用 load 时必填
        version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: ['AMap.Geocoder', 'AMap.MouseTool'], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
        AMapUI: {
          // 是否加载 AMapUI，缺省不加载
          version: '1.1', // AMapUI 版本
          plugins: ['geo/DistrictCluster'] // 需要加载的 AMapUI ui插件
        }
      })
        .then((AMap) => {
          this.map = new AMap.Map('container', {
            //设置地图容器id
            viewMode: '2D', //是否为3D地图模式
            zoom: this.mapZoom, //初始化地图级别
            center: this.mapCenter //初始化地图中心点位置
          })

          this.mapDistCluster = new AMapUI.DistrictCluster({
            map: this.map, //所属的地图实例
            zIndex: -1, //-1：不显示区划面
            autoSetFitView: false, //是否在绘制后自动调整地图视野以适合全部点，默认true
            getPosition: function(item) {
              return [item.longitude, item.latitude]
            }
          })
          // this.mapDistCluster.renderLater(5000);

          this.geocoder = new AMap.Geocoder({
            city: '全国', //城市设为“全国”
            radius: 500 //范围，默认：500
          })
          console.log(this.geocoder)

          this.map.on('zoomend', this.mapZoomEnd)

          this.mapOverlayGroup = new AMap.OverlayGroup()
          this.map.add(this.mapOverlayGroup)

          // 创建一个自定义内容的 infowindow 实例
          if (this.mapInfoWindow == null) {  //只创建一次。多次创建会导致地图销毁后再初始化，位置发生漂移
            this.mapInfoWindow = new AMap.InfoWindow({
              // position: lnglat,
              offset: new AMap.Pixel(-33, -120),
              content: this.$refs.myref,
              closeWhenClickMap: true
            })
          }

          this.updateVehicleLocationAndData()

          this.mouseTool = new AMap.MouseTool(this.map)

        })
        .catch((e) => {
          console.log(e)
        })
    },

    draw(type) {
      switch (type) {
        case 'rule': {
          this.mouseTool.rule({
            startMarkerOptions: {//可缺省
              icon: new AMap.Icon({
                size: new AMap.Size(19, 31),//图标大小
                imageSize: new AMap.Size(19, 31),
                image: '//webapi.amap.com/theme/v1.3/markers/b/start.png'
              }),
              offset: new AMap.Pixel(-9, -31)
            },
            endMarkerOptions: {//可缺省
              icon: new AMap.Icon({
                size: new AMap.Size(19, 31),//图标大小
                imageSize: new AMap.Size(19, 31),
                image: '//webapi.amap.com/theme/v1.3/markers/b/end.png'
              }),
              offset: new AMap.Pixel(-9, -31)
            },
            midMarkerOptions: {//可缺省
              icon: new AMap.Icon({
                size: new AMap.Size(19, 31),//图标大小
                imageSize: new AMap.Size(19, 31),
                image: '//webapi.amap.com/theme/v1.3/markers/b/mid.png'
              }),
              offset: new AMap.Pixel(-9, -31)
            },
            lineOptions: {//可缺省
              strokeStyle: 'solid',
              strokeColor: '#FF33FF',
              strokeOpacity: 1,
              strokeWeight: 2
            }
            //同 RangingTool 的 自定义 设置，缺省为默认样式
          })
          break
        }
        case 'measureArea': {
          this.mouseTool.measureArea({
            strokeColor: '#80d8ff',
            fillColor: '#80d8ff',
            fillOpacity: 0.3
            //同 Polygon 的 Option 设置
          })
          break
        }
      }
    },

    enableMapRanging() {
      this.draw('rule')
      this.$message({ message: '已开启距离测量', type: 'success' })
    },

    enableMapMeasureArea() {
      this.draw('measureArea')
      this.$message({ message: '已开启面积测量', type: 'success' })
    },

    disableMapRangingAndMeasureArea() {
      this.mouseTool.close(true)//关闭，并清除覆盖物

      this.$message('已关闭测量')
    },

    regeoCodeCallback(status, result) {
      if (status === 'complete' && result.regeocode) {
        this.vehicleAddress.address = result.regeocode.formattedAddress
      } else {
        this.vehicleAddress = { lng: 0, lat: 0, address: '' }  //坐标转地址失败，重置数据以便下次获取到坐标后再次转换
      }
    },

    regeoCode(lng, lat) {
      this.geocoder.getAddress([lng, lat], this.regeoCodeCallback)
    },

    resetMap() {
      this.map.clearInfoWindow()
      this.map.setZoomAndCenter(this.defaultMapZoom, this.defaultMapCenter, true)
    },

    mapZoomEnd() {
      let newMapZoom = this.map.getZoom()
      console.log('mapZoomEnd: zoom = ' + newMapZoom)

      if (
        (parseInt(newMapZoom) >= parseInt(this.hideMapDistClusterZoom) &&
          parseInt(this.mapZoom) < parseInt(this.hideMapDistClusterZoom)) ||
        (parseInt(newMapZoom) < parseInt(this.hideMapDistClusterZoom) &&
          parseInt(this.mapZoom) >= parseInt(this.hideMapDistClusterZoom))
      ) {
        console.log(
          'mapZoomEnd: zoom = ' +
          newMapZoom +
          '    updateVehicleLocationAndData'
        )

        // setTimeout(() => {
        //   this.updateVehicleLocationAndData();
        // }, 5); //不延时的话有时执行this.mapDistCluster.hide()没有隐藏distCluster
      }

      this.mapZoom = newMapZoom
    },

    isValidGps(gps) {
      if ((gps.longitude != null && gps.latitude != null) && (gps.longitude != 0.0 && gps.latitude != 0.0)
        && (gps.gpsType != 1)) {
        return true
      } else {
        return false
      }
    },

    getVehicleLngLat(vin) {
      let vehicleGpsAndStatusData = this.vehicleGpsAndStatusDataMap.get(vin)
      if (this.isValidGps(vehicleGpsAndStatusData)) {
        let lnglat = new AMap.LngLat(
          vehicleGpsAndStatusData.longitude,
          vehicleGpsAndStatusData.latitude
        )
        return lnglat
      } else {
        return null
      }
    },

    updateVehicleStatisticsData(vehicleGpsAndStatusDataList) {
      let totalCount = vehicleGpsAndStatusDataList.length
      let onLineCount = 0
      let offLineCount = 0
      let alertCount = 0
      if (vehicleGpsAndStatusDataList.length > 0) {
        for (
          let index = 0;
          index <= vehicleGpsAndStatusDataList.length - 1;
          index++
        ) {
          //onLineCount
          if (this.isVehicleXingShi(vehicleGpsAndStatusDataList[index].vin, vehicleGpsAndStatusDataList[index])
            || this.isVehicleTingChe(vehicleGpsAndStatusDataList[index].vin, vehicleGpsAndStatusDataList[index])
            || this.isVehicleZaixian(vehicleGpsAndStatusDataList[index].vin, vehicleGpsAndStatusDataList[index])) {
            onLineCount++
          }

          //offLineCount
          if (this.isVehicleLiXian(vehicleGpsAndStatusDataList[index].vin, vehicleGpsAndStatusDataList[index])) {
            offLineCount++
          }

          //alertCount
          if (this.isVehicleBaoJing(vehicleGpsAndStatusDataList[index].vin, vehicleGpsAndStatusDataList[index])) {
            alertCount++
          }
        }
      }
      this.vehicleStatisticsData.totalCount = totalCount
      this.vehicleStatisticsData.onLineCount = onLineCount
      this.vehicleStatisticsData.offLineCount = offLineCount
      this.vehicleStatisticsData.alertCount = alertCount

      if (this.vehicleStatisticsData.alertCount > 0) {
        this.playWarningAudio()
      } else {
        this.stopWarningAudio()
      }
    },

    showMapOverlayGroup(validVehicleGpsData) {
      if (!this.mapDistCluster.isHidden()) {
        this.mapDistCluster.hide()
        console.log('hide mapDistCluster')
      }
      this.mapOverlayGroup.clearOverlays()

      if (validVehicleGpsData.length > 0) {
        for (
          let index = 0;
          index <= validVehicleGpsData.length - 1;
          index++
        ) {
          let lnglat = new AMap.LngLat(
            validVehicleGpsData[index].longitude,
            validVehicleGpsData[index].latitude
          )
          var icon = new AMap.Icon({
            size: new AMap.Size(50, 50), // 图标尺寸
            // imageOffset: new AMap.Pixel(20, 0),  // 图像相对展示区域的偏移量，适于雪碧图等
            image: require('@/assets/dw_mark1.png'),
            imageSize: new AMap.Size(50, 50) // 根据所设置的大小拉伸或压缩图片
          })
          let marker = new AMap.Marker({ position: lnglat, icon: icon, anchor: 'bottom-center' })
          marker.on('click', this.vehicleMarkerClick)
          marker.on('dblclick', this.vehicleMarkerDblClick)
          marker.setExtData(validVehicleGpsData[index].vin) //save vin to marker extdata

          this.mapOverlayGroup.addOverlay(marker)
        }
      }
    },

    showMapDistCluster(validVehicleGpsData) {
      if (this.isUpdateDistCluster(validVehicleGpsData, this.mapDistClusterData)) {
        this.mapDistClusterData = validVehicleGpsData
        this.mapDistCluster.setData(this.mapDistClusterData)
      }

      if (this.mapDistCluster.isHidden()) {
        this.mapOverlayGroup.clearOverlays()
        this.mapDistCluster.show()
        console.log('show mapDistCluster')
      }
    },

    isUpdateDistCluster(newValidVehicleGpsData, oldValidVehicleGpsData) {
      //1.车辆增加减少时更新显示
      if (oldValidVehicleGpsData === null || (newValidVehicleGpsData.length !== oldValidVehicleGpsData.length)) {
        return true
      }

      //2.车辆位置发生变化且超过10分钟更新显示
      let index = 0
      for (; index < newValidVehicleGpsData.length; index++) {
        if (newValidVehicleGpsData[index].longitude !== oldValidVehicleGpsData[index].longitude
          || newValidVehicleGpsData[index].latitude !== oldValidVehicleGpsData[index].latitude) {
          break
        }
      }
      let now = new Date()
      if (index !== newValidVehicleGpsData.length && ((now.getTime() - this.distClusterlastUpdateTime) > 1000 * 60 * 10)) {
        this.distClusterlastUpdateTime = now.getTime()
        return true
      }

      return false
    },

    updateVehicleLocationAndData() {
      getUserVehiclesLatestData().then((res) => {
        let vehicleGpsAndStatusDataList = res.result
        let validVehicleGpsData = []
        if (vehicleGpsAndStatusDataList.length > 0) {
          for (
            let index = 0;
            index <= vehicleGpsAndStatusDataList.length - 1;
            index++
          ) {
            this.vehicleGpsAndStatusDataMap.set(
              vehicleGpsAndStatusDataList[index].vin,
              vehicleGpsAndStatusDataList[index]
            )
            if (this.isValidGps(vehicleGpsAndStatusDataList[index])) {
              validVehicleGpsData.push(vehicleGpsAndStatusDataList[index])
            }
          }
        }

        this.updateVehicleList(this.vehicleGpsAndStatusDataMap, this.vehicleFilterFlag)

        this.updateVehicleStatisticsData(vehicleGpsAndStatusDataList)

        if (this.map !== null) {
          let zoom = this.map.getZoom() //获取当前地图级别
          if (zoom >= this.hideMapDistClusterZoom) {
            this.showMapOverlayGroup(validVehicleGpsData)
          } else {
            this.showMapDistCluster(validVehicleGpsData)
          }

          if (this.mapInfoWindow.getIsOpen()) {
            this.updateVehicleInfoWindow()
          }

          if (this.isDrawerVisible) {
            this.updateVehicleDetailDrawer()
          }
        }
      })
    },

    updateVehicleAddress(lng, lat) {
      if (Math.abs(this.vehicleAddress.lng - lng) > 0.00001 || Math.abs(this.vehicleAddress.lat - lat) > 0.00001) {
        this.regeoCode(lng, lat)
        this.vehicleAddress.lng = lng
        this.vehicleAddress.lat = lat
      }
    },

    vehicleMarkerClick(e) {
      console.log('click vehicle marker: ' + e.target.getExtData())
      let vin = e.target.getExtData()
      this.openVehicleInfoWindow(vin)
    },

    vehicleMarkerDblClick(e) {
      console.log('dblclick vehicle marker: ' + e.target.getExtData())
      let vin = e.target.getExtData()
      this.openVehicleDetailDrawer(vin)
    },

    openVehicleInfoWindow(vin) {
      console.log('openVehicleInfoWindow: vin=' + vin)
      this.vehicleAddress = { lng: 0, lat: 0, address: '' }

      getVehicleBasicData(vin).then((res) => {
        this.vehicleBasicData = res.result
        let lnglat = this.getVehicleLngLat(vin)
        if (lnglat != null) {
          this.updateVehicleAddress(lnglat.getLng(), lnglat.getLat())

          this.mapInfoWindow.setPosition(lnglat)
          this.mapInfoWindow.open(this.map)
        } else {
          console.log('无效的车辆位置数据（VIN=' + vin + '）')
        }
      })
    },

    updateVehicleInfoWindow() {
      getVehicleBasicData(this.vehicleBasicData.vin).then((res) => {
        this.vehicleBasicData = res.result

        let lnglat = this.getVehicleLngLat(this.vehicleBasicData.vin)
        if (lnglat != null) {
          this.updateVehicleAddress(lnglat.getLng(), lnglat.getLat())

          this.mapInfoWindow.setPosition(lnglat)

        } else {
          console.log('无效的车辆位置数据（VIN=' + vin + '）')
        }
      })
    },

    openVehicleDetailDrawer(vin) {
      getVehicleCanData(vin).then((res) => {
        this.vehicleCanData = res.result
        this.isDrawerVisible = true
        this.detailPageTitle = vin + '整车信息'
      })
    },

    updateVehicleDetailDrawer() {
      getVehicleCanData(this.vehicleCanData.tspVehicle.vin).then((res) => {
        this.vehicleCanData = res.result
        this.arr = this.vehicleCanData.vehicleEss.thisBatteryVoltagesInt
        let i = 0
        this.voltagesList = this.arr.map((e) => {
          i++
          let map = {
            index: i,
            prop: e
          }
          return map
        })
        this.arr2 = this.vehicleCanData.vehicleEssTemperature.temperaturesInt
        let j = 0
        this.temperaturesList = this.arr2.map((e) => {
          j++
          let map = {
            index: j,
            prop: e
          }
          return map
        })
      })
    },

    openVehicleRealtimeDataMonitor(vin) {
      this.$router.push({
        path: 'tsp/monitor/RealtimeDataMonitor',
        query: {
          vin: vin,
          interval: this.updateDataInterval
        }
      })
    },

    vehicleOptionClick(vin) {
      console.log('vehicleOptionClick: vin=' + vin)

      let lnglat = this.getVehicleLngLat(vin)

      if (lnglat != null) {
        if (
          parseInt(this.map.getZoom()) >= parseInt(this.hideMapDistClusterZoom)
        ) {
          this.map.setCenter([lnglat.getLng(), lnglat.getLat() + 0.006], true)
        } else {
          this.mapDistCluster.hide()
          console.log('hide mapDistCluster in vehicleOptionClick')

          this.map.setZoomAndCenter(this.hideMapDistClusterZoom + 2, [lnglat.getLng(), lnglat.getLat() + 0.006], true)
        }

        this.map.clearInfoWindow()

        this.openVehicleInfoWindow(vin)
      } else {
        this.$message({
          showClose: true,
          message: '车辆当前位置数据无效（VIN=' + vin + '）',
          type: 'warning'
        })
      }

    },

    //左侧车辆列表自定义渲染
    renderContent(h, { node, data, store }) {
      if (data.id == 0) {
        return (
          <span style="width:100%">
              <span>{node.label}</span>
            </span>)
      } else {
        let imageSrc = this.vehicle_state_filter_list[3].url  //离线
        if (this.isVehicleXingShi(data.id, this.vehicleGpsAndStatusDataMap.get(data.id))) {
          imageSrc = this.vehicle_state_filter_list[0].url  //行驶
        } else if (this.isVehicleTingChe(data.id, this.vehicleGpsAndStatusDataMap.get(data.id))) {
          imageSrc = this.vehicle_state_filter_list[1].url  //停车
        } else if (this.isVehicleChongDian(data.id, this.vehicleGpsAndStatusDataMap.get(data.id))) {
          imageSrc = this.vehicle_state_filter_list[2].url  //充电
        } else if (this.isVehicleLiXian(data.id, this.vehicleGpsAndStatusDataMap.get(data.id))) {
          imageSrc = this.vehicle_state_filter_list[3].url  //离线
        } else if (this.isVehicleBaoJing(data.id, this.vehicleGpsAndStatusDataMap.get(data.id))) {
          imageSrc = this.vehicle_state_filter_list[4].url  //报警
        } else if (this.isVehicleZaixian(data.id, this.vehicleGpsAndStatusDataMap.get(data.id))) {
          imageSrc = this.vehicle_state_filter_list[5].url  //在线
        }
        return (
          <span style="width:100%; display: flex;">
              <span style="flex: 1;">{node.label}</span>
              <span>
                <el-image style="width: 12px; height: 12px" src={imageSrc} fit="fit"></el-image>
                &nbsp;&nbsp;
                <el-button size="mini" type="text" on-click={() => this.vehicleOptionClick(data.id)}>位置</el-button>
                <el-button size="mini" type="text" on-click={() => this.openVehicleRealtimeDataMonitor(data.id)}
                >监控</el-button>
              </span>
            </span>)
      }
    },

    //左侧车辆列表中车辆被点击
    vehicleListNodeClick(data) {
      if (data.id == 0) {
        this.vehicleFilterFlag = 0
        this.updateVehicleList(this.vehicleGpsAndStatusDataMap, this.vehicleFilterFlag)
      }
    },

    // 点击车辆状态筛选
    vehicleStateFilterClick(id) {
      this.vehicleFilterFlag = id
      this.updateVehicleList(this.vehicleGpsAndStatusDataMap, id)
    },

    updateVehicleList(vehicleGpsAndStatusDataMap, vehicleFilterFlag) {
      let filteredVehicleListChildren = []
      for (const [key, value] of vehicleGpsAndStatusDataMap) {
        switch (vehicleFilterFlag) {
          case 1:  //行驶
            if (!this.isVehicleXingShi(key, vehicleGpsAndStatusDataMap.get(key))) {
              continue
            }
            break
          case 2:  //停车
            if (!this.isVehicleTingChe(key, vehicleGpsAndStatusDataMap.get(key))) {
              continue
            }
            break
          case 3:  //充电
            if (!this.isVehicleChongDian(key, vehicleGpsAndStatusDataMap.get(key))) {
              continue
            }
            break
          case 4:  //离线
            if (!this.isVehicleLiXian(key, vehicleGpsAndStatusDataMap.get(key))) {
              continue
            }
            break
          case 5:  //报警
            if (!this.isVehicleBaoJing(key, vehicleGpsAndStatusDataMap.get(key))) {
              continue
            }
            break
          case 6:  //全部
            if (!this.isVehicleZaixian(key, vehicleGpsAndStatusDataMap.get(key))) {
              continue
            }
            break
          default: //无过滤
            break
        }
        filteredVehicleListChildren.push({ id: key, label: key })
      }
      this.vehicleList[0].children = filteredVehicleListChildren
    },

    /**
     * 数据采集时间在1分钟前或缺失状态判断数据返回true
     */
    isVehicleLiXian(vin, vehicleGpsAndStatusData) {
      return (vehicleGpsAndStatusData.vehicleStateExt == '离线' || vehicleGpsAndStatusData.vehicleStateExt == '未知') ? true : false
    },

    /**
     * 通用报警标志大于0返回true
     */
    isVehicleBaoJing(vin, vehicleGpsAndStatusData) {
      return vehicleGpsAndStatusData.vehicleStateExt == '报警' ? true : false
    },
    /**
     * 车辆停车充电、行使充电、充电完成返回true
     */
    isVehicleChongDian(vin, vehicleGpsAndStatusData) {
      return vehicleGpsAndStatusData.vehicleStateExt == '充电' ? true : false
    },

    /**
     * 车辆启动状态且车速大于0时返回true
     */
    isVehicleXingShi(vin, vehicleGpsAndStatusData) {
      return vehicleGpsAndStatusData.vehicleStateExt == '行驶' ? true : false
    },
    /**
     * 车辆启动状态且车速小于1时返回true
     */
    isVehicleTingChe(vin, vehicleGpsAndStatusData) {
      return vehicleGpsAndStatusData.vehicleStateExt == '停车' ? true : false
    },
    /**
     * 车辆有数据但是不属于其他五种状态
     */
    isVehicleZaixian(vin, vehicleGpsAndStatusData) {
      return vehicleGpsAndStatusData.vehicleStateExt == '在线' ? true : false
    },
    /**
     * 是否开启报警声音
     */
    isEnableWarningAudio() {
      return this.audioButtonIcon === 'el-icon-message-solid'
    },

    /**
     * 切换开启或关闭报警声音
     */
    toggleEnableOrDisableWarningAudio() {
      if (this.isEnableWarningAudio()) {
        this.audioButtonIcon = 'el-icon-close-notification'
        this.stopWarningAudio()
        this.$message('报警声音已关闭')
      } else {
        this.audioButtonIcon = 'el-icon-message-solid'
        this.$message({ message: '已开启报警声音', type: 'success' })
      }
    },

    //报警音频播放
    playWarningAudio() {
      if (this.isEnableWarningAudio()) {
        this.$refs.audio.play()
      }
    },

    //报警音频停止
    stopWarningAudio() {
      this.$refs.audio.pause()
      this.$refs.audio.currentTime = 0
    },

    remoteMethod(query) {
      this.value = query
      this.search = query
      if (this.search !== '' && this.search !== undefined) {
        // let index = this.search.lastIndexOf(":");
        // this.search = this.search.substring(index + 1 ,query.length);
        this.loading = true
        this.getSelectList({ search: this.search })
        this.loading = false
      } else {
        this.optList = []
        this.getSelectList({ search: '' })
      }
    },
    async getSelectList(val) {
      await findSelectList(val).then((res) => {
        this.optList = res.result
      })
    },
    // 点击车控显示控制
    changeControlStatus() {
      this.control_active = !this.control_active
    },
    // 关闭车控选项
    controlDialogCancel() {
      this.allWindowControlDialogVisble = false;
      this.control_value = ''
      this.controlDialog = false
    },
    airConditionerSettingDialogCancel() {
      this.airConditionerSettingDialogVisble = false;
      this.airConditionerSetting = {
        switch: '00',
        temperature: 18,
        runTime: '00',
        driverSeatHeating: '00',
        passengerSeatHeating: '00'
      };
    },

    // 点击车控单个按钮
    changeControlItem(id) {
      this.control_item_active = id;
      switch (id) {
        case 1:
          this.control_options = [{ value: 1, label: '闭锁' }, { value: 2, label: '开锁' }];
          this.controlDialog = true;
          break;
        case 3:
          this.control_options = [{ value: 1, label: '闪灯' }, { value: 2, label: '鸣笛' }, { value: 3, label: '闪灯鸣笛' }];
          this.controlDialog = true;
         break;
        case 7:  //一键车窗
          this.allWindowControlDialogVisble = true;
         break;
        case 8:  //空调设置
          this.airConditionerSettingDialogVisble = true;
         break;
        case 2:
        case 4:
        case 5:
        case 6:
          this.control_options = [{ value: 1, label: '关闭' }, { value: 2, label: '开25%' }, {value: 3,label: '开50%'}, { value: 4, label: '开75%' }, { value: 5, label: '全开' }]
          this.controlDialog = true;
         break;
        default:
          break;
      }
    },

    // 点击弹框确认
    submitControl() {
      this.queryParams.vin = this.vehicleBasicData.vin
      // 车控转发message赋值
      // 中控锁
      if (this.control_item_active === 1) {
        // 闭锁
        if (this.control_value == 1) {
          this.queryParams.commandId = '01'
          this.queryParams.command = '010000000000000000'
        }
        // 开锁
        if (this.control_value == 2) {
          this.queryParams.commandId = '01'
          this.queryParams.command = '020000000000000000'
        }
      }
      // 左前窗
      if (this.control_item_active === 2) {
        // 关闭
        if (this.control_value == 1) {
          this.queryParams.commandId = '02'
          this.queryParams.command = '0100000000'
        }
        // 开25%
        if (this.control_value == 2) {
          this.queryParams.commandId = '02'
          this.queryParams.command = '0200000000'
        }
        // 开50%
        if (this.control_value == 3) {
          this.queryParams.commandId = '02'
          this.queryParams.command = '0300000000'
        }
        // 开75%
        if (this.control_value == 4) {
          this.queryParams.commandId = '02'
          this.queryParams.command = '0400000000'
        }
        // 全开
        if (this.control_value == 5) {
          this.queryParams.commandId = '02'
          this.queryParams.command = '0500000000'
        }
      }
      // 远程寻车
      if (this.control_item_active === 3) {
        // 闪灯
        if (this.control_value == 1) {
          this.queryParams.commandId = '04'
          this.queryParams.command = '01'
        }
        // 鸣笛
        if (this.control_value == 2) {
          this.queryParams.commandId = '04'
          this.queryParams.command = '02'
        }
        //闪灯鸣笛
        if (this.control_value == 3) {
          this.queryParams.commandId = '04'
          this.queryParams.command = '03'
        }
      }
      // 左后窗
      if (this.control_item_active === 4) {
        // 关闭
        if (this.control_value == 1) {
          this.queryParams.commandId = '02'
          this.queryParams.command = '0000010000'
        }
        // 开25%
        if (this.control_value == 2) {
          this.queryParams.commandId = '02'
          this.queryParams.command = '0000020000'
        }
        // 开50%
        if (this.control_value == 3) {
          this.queryParams.commandId = '02'
          this.queryParams.command = '0000030000'
        }
        // 开75%
        if (this.control_value == 4) {
          this.queryParams.commandId = '02'
          this.queryParams.command = '0000040000'
        }
        // 全开
        if (this.control_value == 5) {
          this.queryParams.commandId = '02'
          this.queryParams.command = '0000050000'
        }
      }
      // 右前窗
      if (this.control_item_active === 5) {
        // 关闭
        if (this.control_value == 1) {
          this.queryParams.commandId = '02'
          this.queryParams.command = '0001000000'
        }
        // 开25%
        if (this.control_value == 2) {
          this.queryParams.commandId = '02'
          this.queryParams.command = '0002000000'
        }
        // 开50%
        if (this.control_value == 3) {
          this.queryParams.commandId = '02'
          this.queryParams.command = '0003000000'
        }
        // 开75%
        if (this.control_value == 4) {
          this.queryParams.commandId = '02'
          this.queryParams.command = '0004000000'
        }
        // 全开
        if (this.control_value == 5) {
          this.queryParams.commandId = '02'
          this.queryParams.command = '0005000000'
        }
      }
      // 右后窗
      if (this.control_item_active === 6) {
        // 关闭
        if (this.control_value == 1) {
          this.queryParams.commandId = '02'
          this.queryParams.command = '0000000100'
        }
        // 开25%
        if (this.control_value == 2) {
          this.queryParams.commandId = '02'
          this.queryParams.command = '0000000200'
        }
        // 开50%
        if (this.control_value == 3) {
          this.queryParams.commandId = '02'
          this.queryParams.command = '0000000300'
        }
        // 开75%
        if (this.control_value == 4) {
          this.queryParams.commandId = '02'
          this.queryParams.command = '0000000400'
        }
        // 全开
        if (this.control_value == 5) {
          this.queryParams.commandId = '02'
          this.queryParams.command = '0000000500'
        }
      }

      //一键控窗
      if (this.control_item_active === 7) {
        this.queryParams.commandId = '02'
        this.queryParams.command = this.leftFrontWindowVar + this.rightFrontWindowVar + this.leftRearWindowVar + this.rightRearWindowVar + this.scuttleVar
      }

      //空调设置
      if (this.control_item_active === 8) {
        this.queryParams.commandId = '03'
        this.queryParams.command = this.airConditionerSetting.switch + '00' + (this.airConditionerSetting.temperature * 2).toString(16) + '000000' + this.airConditionerSetting.runTime
          + this.airConditionerSetting.driverSeatHeating + this.airConditionerSetting.passengerSeatHeating + '00000000';
      }

      this.$modal.msgSuccess('正在发送命令...')
      sendVehicleControlCommand(this.queryParams).then((res) => {
        if (res.code === 200) {
          this.resetGetCommandExecuteResultTimer(this.queryParams.vin)
          if (this.control_item_active === 7) {
            this.allWindowControlDialogVisble = false
          } else if(this.control_item_active === 8) {
            this.airConditionerSettingDialogVisble = false
          } else {
            this.controlDialog = false
          }
        } else {
          this.$message.error('发送命令失败:网络或服务器错误！')
        }
      })
    }
  }
}
</script>

<style scoped>
.con {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

/* .el-drawer__body {
  overflow: auto;
}
.el-drawer__container ::-webkit-scrollbar {
  display: none;
} */
.label {
  width: 100px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 1px 1px 10px #dedede;
  margin-top: -64px;
  padding: 10px;
  border-radius: 5px;
}

.label > p {
  margin-bottom: 6px;
  font-size: 12px;
  color: #666666;
}

.ysbox {
  font-size: 14px;
  color: #666;
  margin: 5px;
}

.map-wrap {
  width: 100%;
  height: calc(100vh - 84px - 1px);
}

.dituBox {
  position: relative;
}

.ditusousuo {
  width: 300px;
  position: absolute;
  top: 40px;
  left: 20px;
}

.ditusousuo > .el-select {
  width: 100%;
  font-size: 12px;
}

.qichetubiao {
  width: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.imgtop {
  width: 15px;
  margin-right: 5px;
  object-fit: scale-down;
  vertical-align: middle;
}

.shuom {
  margin-top: 10px;
}

.shuom > li {
  font-size: 14px;
  color: #666;
  margin-bottom: 7px;
}

.flexb {
  display: flex;
}

.touxiang {
  width: 50px;
  height: 50px;
  border: 1px solid #999;
  text-align: center;
  line-height: 50px;
}

.touxiang > img {
  width: 93%;
  vertical-align: middle;
}

.dcjk {
  width: 160px;
  height: 30px;
  background: #8cc4ff;
  margin-top: 15px;
  color: #ffffff;
  border-radius: 5px;
}

.buttbox {
  text-align: center;
}

.qcxiangq {
  display: flex;
  flex-flow: wrap;
  padding: 0 20px;
}

.qcxiangq > li {
  width: 25%;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  color: #666666;
}

.container {
  padding: 0px;
  margin: 0px;
  width: 100%;
  height: 100%;
}

.car-control {
  margin-top: 20px;
}

.car-control .tit {
  height: 46px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f3f4f5;
}

.car-control .tit img {
  width: 18px;
  height: auto;
}

.car-control .tit span {
  margin-left: 10px;
  font-size: 14px;
  color: #5f6579;
}

.car-control .tit.active span {
  color: rgb(255, 98, 112) !important;
}

.car-control .hide-control {
  padding: 10px 15px 5px;
  box-sizing: border-box;
}

.car-control .hide-control ul {
  display: flex;
  justify-content: space-between;
  border: 1px solid #e4e4e4;
  box-shadow: 0 2px 4px 0 hsl(0deg 0% 89% / 50%);
  border-radius: 3px;
  flex-wrap: wrap;
  list-style: none;
  margin: 0;
  padding: 10px 0 0 0;
}

.car-control .hide-control ul li {
  text-align: center;
  flex: 0 0 33%;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.65);
  margin-bottom: 10px;
}

.car-control .hide-control ul li img {
  box-shadow: 0 2px 4px 0 hsl(0deg 0% 89% / 50%);
  border-radius: 3px;
  border: 1px solid #e4e4e4;
  width: 40px;
  height: 40px;
  overflow: hidden;
  margin-bottom: 8px;
}

.car-control .hide-control ul li.active img {
  border: 1px solid rgb(255, 98, 112);
}

.dialog-content {
  width: 100%;
  text-align: center;
}

.el-main {
  padding: 0px;
}

.el-aside {
  margin: 0px;
  padding: 0px;
  background-color: rgb(255, 255, 255);
}

.el-tree {
  background-color: #f3f3f3;
}

.button-el-col {
  text-align: center;
}

.button-el-col :hover {
  background-color: #ddd;
  cursor: pointer;
}

.button-el-col img {
  width: 18px;
  height: auto;
}

.button-el-col p {
  font-size: 12px;
  color: #333;
  margin-top: -10px;
  margin-bottom: 10px;
}

.el-icon-my-xingshi {
  background: url('~@/assets/images/xings_icon.png') center no-repeat
}

</style>
