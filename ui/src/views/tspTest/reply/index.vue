<template>
  <div>
    <el-row>
      <el-form :model="queryParams">
        <el-col>
          <el-form-item label="QMTT订阅主题" label-width="110px">
            <el-input
              type="input"
              v-model="queryParams.topic"
              placeholder="topic"
            />
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="QMTT订阅主题" label-width="180px">
            <el-radio-group v-model="queryParams.topic">
              <!-- <span style="font-weight: bold">HJGAACBH9N1005001:</span>
              <el-radio
                @change="onTopicChange"
                label="MD12/HJGAACBH9N1005001/UpstreamData"
                >上行发送:MD12/HJGAACBH9N1005001/UpstreamData</el-radio
              >
              <el-radio
                @change="onTopicChange"
                label="MD12/HJGAACBH9N1005001/DownstreamData"
                >下行订阅:MD12/HJGAACBH9N1005001/DownstreamData</el-radio
              >
              <br /> -->
              <span style="font-weight: bold">HJGAACBH1N1005008:</span>
              <!-- <el-radio
                @change="onTopicChange"
                label="MD12/HJGAACBH0N1005002/UpstreamData"
                >上行发送:MD12/HJGAACBH0N1005002/UpstreamData</el-radio
              > -->
              <el-radio
                @change="onTopicChange"
                label="MD12/HJGAACBH1N1005008/DownstreamData"
                >下行订阅:MD12/HJGAACBH1N1005008/DownstreamData</el-radio
              >
              <br />
              <!-- <span style="font-weight: bold">HJGAACBH9N1005003:</span>
              <el-radio
                @change="onTopicChange"
                label="MD12/HJGAACBH2N1005003/UpstreamData"
                >上行发送:MD12/HJGAACBH2N1005003/UpstreamData</el-radio
              >
              <el-radio
                @change="onTopicChange"
                label="MD12/HJGAACBH2N1005003/DownstreamData"
                >下行订阅:MD12/HJGAACBH2N1005003/DownstreamData</el-radio
              > -->
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-button @click="clearTopic">清空选项</el-button>
        <!-- <el-col>
          <el-form-item label="发送指令" label-width="110px">
            <el-select v-model="queryParams.message">
              <el-option
                v-for="item in options"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col> -->
        <!-- <el-col>
          <el-form-item label="选择设备IMEI" label-width="110px">
            <el-select v-model="queryParams.imei">
              <el-option
                v-for="item in imeis"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col> -->
      </el-form>
      <!-- <el-col :span="6" :offset="1">
        <el-button @click="onSend">发送消息</el-button>
        <el-button type="primary" @click="clear">清 空</el-button>
      </el-col> -->
    </el-row>
    <el-divider content-position="left"></el-divider>
    <el-row ref="find">
      <el-col :span="2">
        <el-button @click="onMemory" :disabled="capacityDisb"
          >查询存储容量</el-button
        >
      </el-col>
      <el-col :span="9" :offset="3">
        <span
          >总容量:
          {{ dataVersion === "1.1" ? "7GB" : form.capacity }}</span
        >
      </el-col>
      <el-col :span="9" :offset="3">
        <span
          >使用容量:
          {{ dataVersion === "1.1" ? "" : form.usedCapacity }}</span
        >
      </el-col>
      <el-col :span="9" :offset="5">
        <span
          >剩余容量:
          {{ dataVersion === "1.1" ? "" : form.surplusCapacity }}</span
        >
      </el-col>
      <!-- <el-col :span="9" :offset="3">
        <span>总容量: {{  form.capacity }}</span>
      </el-col>
      <el-col :span="9" :offset="3">
        <span>使用容量: {{  form.usedCapacity }}</span>
      </el-col>
      <el-col :span="9" :offset="5">
        <span>剩余容量: {{ form.surplusCapacity }}</span>
      </el-col> -->
    </el-row>
    <el-divider content-position="left"></el-divider>
    <el-row>
      <el-col :span="2">
        <el-button @click="onRemoteUpgrade">远程升级</el-button>
      </el-col>
      <!-- <el-col :span="9" :offset="3">
        <span>总容量: {{form.capacity}}</span>
      </el-col>
      <el-col :span="9" :offset="3">
        <span>使用容量: {{form.usedCapacity}}</span>
      </el-col>
      <el-col :span="9" :offset="5">
        <span>剩余容量: {{form.surplusCapacity}}</span>
      </el-col> -->
      <el-col>
        <el-progress
          :text-inside="true"
          :stroke-width="24"
          :percentage="dlProgress"
          :show-text="true"
          :format="progressText"
          status="success"
        >
        </el-progress>
      </el-col>
      <el-col>
        <el-button @click="onVersion">查询MCU版本号</el-button>
      </el-col>
      <el-col>
        当前设备:{{ tboxForm.vin }}
        <br />
        版本:{{ tboxForm.version }}
      </el-col>
    </el-row>
    <el-divider content-position="left"></el-divider>

    <el-row>
      <el-col :span="2" :offset="1">
        <p>1.平台登入登出</p>
      </el-col>
      <el-col :span="2" :offset="1">
        <el-button @click="onPlatformLogin">平台登入</el-button>
      </el-col>
      <el-col :span="2" :offset="1">
        <el-button @click="onVehicleLogin">车辆登入</el-button>
      </el-col>
      <el-col :span="2" :offset="1">
        <el-button @click="onVehicleLogout">车辆登出</el-button>
      </el-col>
      <el-col :span="2" :offset="1">
        <el-button @click="onPlatformLogout">平台登出</el-button>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="2" :offset="1">
        <p>2.车辆登入登出</p>
      </el-col>
      <el-col :span="2" :offset="1">
        <el-button @click="onPlatformLogin">平台登入</el-button>
      </el-col>
      <el-col :span="2" :offset="1">
        <el-button @click="onVehicleLogin">车辆登入</el-button>
      </el-col>
      <el-col :span="2" :offset="1">
        <el-button @click="onVehicleLogout">车辆登出</el-button>
      </el-col>
      <el-col :span="2" :offset="1">
        <el-button @click="onPlatformLogout">平台登出</el-button>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="2" :offset="1">
        <p>3.行驶数据</p>
      </el-col>
      <el-col :span="2" :offset="1">
        <el-button @click="onPlatformLogin">平台登入</el-button>
      </el-col>
      <el-col :span="2" :offset="1">
        <p>启动车辆，行驶16分钟（车辆登入->实时数据->车辆登出）</p>
      </el-col>
      <el-col :span="2" :offset="1">
        <el-button @click="onPlatformLogout">平台登出</el-button>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="2" :offset="1">
        <p>4:充电数据</p>
      </el-col>
      <el-col :span="2" :offset="1">
        <el-button @click="onPlatformLogin">平台登入</el-button>
      </el-col>
      <el-col :span="2" :offset="1">
        <p>车辆充电状态数据维持发送 15 分钟以上</p>
      </el-col>
      <el-col :span="2" :offset="1">
        <el-button @click="onPlatformLogout">平台登出</el-button>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="2" :offset="1">
        <p>5.SOC为100%时车辆充电数据</p>
      </el-col>
      <el-col :span="2" :offset="1">
        <el-button @click="onVehicleSOC100">调整车辆SOC100%</el-button>
      </el-col>
      <el-col :span="2" :offset="1">
        <el-button @click="onPlatformLogin">平台登入</el-button>
      </el-col>
      <el-col :span="2" :offset="1">
        <el-button @click="onVehicleLogin">车辆登入</el-button>
      </el-col>
      <el-col :span="2" :offset="1">
        <el-button @click="onVehicleLogout">车辆登出</el-button>
      </el-col>
      <el-col :span="2" :offset="1">
        <el-button @click="onPlatformLogout">平台登出</el-button>
      </el-col>
      <el-col :span="2" :offset="1">
        <el-button @click="onVehicleSOC">调整车辆SOC正常</el-button>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="2" :offset="1">
        <p>6.报警数据</p>
      </el-col>
      <el-col :span="2" :offset="1">
        <el-button @click="onPlatformLogin">平台登入</el-button>
      </el-col>
      <el-col :span="2" :offset="1">
        <el-button @click="onVehicleLogin">车辆登入</el-button>
      </el-col>
      <el-col :span="2" :offset="1">
        <el-button @click="onVehicleGuZhang">车辆故障</el-button>
      </el-col>
      <el-col :span="2" :offset="1">
        <p>
          上报故障发生时间点前后30s的数据且信息采样周期不大于1S，其中故障发生前数据以补发的形式进行传输
          -> 维持该报警并持续发送 5 分钟以上
        </p>
      </el-col>
      <el-col :span="2" :offset="1">
        <el-button @click="onVehicleLogout">车辆登出</el-button>
      </el-col>
      <el-col :span="2" :offset="1">
        <el-button @click="onPlatformLogout">平台登出</el-button>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="2" :offset="1">
        <p>7.车辆补发</p>
      </el-col>
      <el-col :span="2" :offset="1">
        <el-button @click="onPlatformLogin">平台登入</el-button>
      </el-col>
      <el-col :span="2" :offset="1">
        <el-button @click="onVehicleLogin">车辆登入</el-button>
      </el-col>
      <el-col :span="2" :offset="1">
        <el-button @click="onVehicleDuanWang">车辆断网</el-button>
      </el-col>
      <el-col :span="2" :offset="1">
        <p>保持断网状态 10 分钟以上</p>
      </el-col>
      <el-col :span="2" :offset="1">
        <el-button @click="onVehicleLianWang">车辆连网</el-button>
      </el-col>
      <el-col :span="2" :offset="1">
        <el-button @click="onVehicleLogout">车辆登出</el-button>
      </el-col>
      <el-col :span="2" :offset="1">
        <el-button @click="onPlatformLogout">平台登出</el-button>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="2" :offset="1">
        <p>8.平台补发</p>
      </el-col>
      <el-col :span="2" :offset="1">
        <el-button @click="onPlatformLogin">平台登入</el-button>
      </el-col>
      <el-col :span="2" :offset="1">
        <el-button @click="onVehicleLogin">车辆登入</el-button>
      </el-col>
      <el-col :span="2" :offset="1">
        <el-button @click="onPlatformDuanWang">平台断网</el-button>
      </el-col>
      <el-col :span="2" :offset="1">
        <p>保持断网状态 10 分钟以上</p>
      </el-col>
      <el-col :span="2" :offset="1">
        <el-button @click="onPlatformLogin">平台登入</el-button>
      </el-col>
      <el-col :span="2" :offset="1">
        <p>等待5分钟以上</p>
      </el-col>
      <el-col :span="2" :offset="1">
        <el-button @click="onVehicleLogout">车辆登出</el-button>
      </el-col>
      <el-col :span="2" :offset="1">
        <el-button @click="onPlatformLogout">平台登出</el-button>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="2" :offset="1">
        <p>9.多车单链路</p>
      </el-col>

      <el-col :span="2" :offset="1">
        <el-button @click="onPlatformLogin">平台登入</el-button>
      </el-col>
      <el-col :span="2" :offset="1">
        <el-button @click="onVehicleLogin">车辆登入</el-button>
      </el-col>

      <el-col :span="2" :offset="1">
        <el-button @click="onVehicleLogout">车辆登出</el-button>
      </el-col>
      <el-col :span="2" :offset="1">
        <el-button @click="onPlatformLogout">平台登出</el-button>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="2" :offset="1">
        <p>10.多车多链路</p>
      </el-col>
      <el-col :span="2" :offset="1">
        <el-button @click="onMonyToMonyVehicleLogin"
          >车辆登入(包含链路1跟链路2)</el-button
        >
      </el-col>
      <el-col :span="2" :offset="3">
        <el-button @click="onMonyToMonyPlatformLogin"
          >平台登入(包含链路1跟链路2)</el-button
        >
      </el-col>

      <el-col :span="2" :offset="3">
        <el-button @click="onMonyToMonyVehicleLogout"
          >车辆登出(包含链路1跟链路2)</el-button
        >
      </el-col>
      <el-col :span="2" :offset="3">
        <el-button @click="onMonyToMonyPlatformLogout"
          >平台登出(包含链路1跟链路2)</el-button
        >
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="2" :offset="1">
        <p>车辆符合性测试</p>
      </el-col>
      <el-col :span="2" :offset="3">
        <el-button @click="onCarTestPlatformLogin"
          >平台登入</el-button
        >
      </el-col>

      <el-col :span="2" :offset="3">
        <el-button @click="onCarTestPlatformLogout"
          >平台登出</el-button
        >
      </el-col>
    </el-row>

    <!-- <el-row style="margin-top: 5%">
      <el-col :offset="10"><el-button @click="onSend">点击按钮发送消息</el-button></el-col>
    </el-row> -->
  </div>
</template>

<script>
import { getEmmc } from "@/api/tsp/tspEmmc.js";
import { downloadPackage } from "@/api/tsp/reply.js";
import { updateVersion, get } from "@/api/tsp/tspTboxVersion.js";
export default {
  data() {
    return {
      queryParams: {},
      form: {},
      dlProgress: 0,
      tboxForm: {
        version: "",
        vin: "",
      },
      capacityDisb: false,
      dataVersion:''
      // imeis: [
      //   {
      //     label: "00862547051500798",
      //     value: "38 36 32 35 34 37 30 35 31 35 30 30 37 39 38",
      //   },
      //   {
      //     label: "00862547051493036",
      //     value: "38 36 32 35 34 37 30 35 31 34 39 33 30 33 36",
      //   },
      //           {
      //     label: "00862547051493424",
      //     value: "38 36 32 35 34 37 30 35 31 34 39 33 34 32 34",
      //   },
      //           {
      //     label: "00862547051493333",
      //     value: "38 36 32 35 34 37 30 35 31 34 39 33 33 33 33",
      //   },
      // ],
      // options: [
      //   {
      //     label: "车辆登入",
      //     value:
      //       " 75",
      //   },
      //   {
      //     label: "车辆登出",
      //     value:
      //       " 76",
      //   },
      //   {
      //     label: "掉线",
      //     value:
      //       " 71",
      //   },
      //   {
      //     label: "退出掉线",
      //     value:
      //       " 72",
      //   },
      //   {
      //     label: "三级报警",
      //     value:
      //       " 73",
      //   },
      //   {
      //     label: "退出三级报警",
      //     value:
      //       " 74",
      //   },
      //   {
      //     label: "查询剩余容量",
      //     value:
      //       " 79",
      //   },
      // ],
    };
  },
  methods: {
    onSend() {
      downloadPackage(this.queryParams).then((res) => {
        if (res.code === 200) {
          // this.queryParams.message = this.queryParams.imei + this.queryParams.message
          this.$modal.msgSuccess("发送成功");
        } else {
          this.$message.error("发送失败");
        }
      });
    },
    // 多车多链路平台登入
    onMonyToMonyPlatformLogin() {
      this.onPlatformLogin();
      this.onPlatformLogin2();
    },
    // 多车多链路车辆登入
    onMonyToMonyVehicleLogin() {
      this.onVehicleLogin();
      this.onVehicleLogin2();
    },
    // 多车多链路平台登出
    onMonyToMonyPlatformLogout() {
      this.onPlatformLogout();
      this.onPlatformLogout2();
    },
    // 多车多链路车辆登出
    onMonyToMonyVehicleLogout() {
      this.onVehicleLogout();
      this.onVehicleLogout2();
    },
    onPlatformLogin() {
      this.queryParams.topic = "DataForwardService/modernlink01/Command";
      this.queryParams.message = "30 31";
      this.queryParams.qos = 1;

      this.onSend();
    },
    onPlatformLogout() {
      this.queryParams.topic = "DataForwardService/modernlink01/Command";
      this.queryParams.message = "30 32";
      this.queryParams.qos = 1;

      this.onSend();
    },
    onPlatformLogin2() {
      this.queryParams.topic = "DataForwardService/modernlink02/Command";
      this.queryParams.message = "30 31";
      this.queryParams.qos = 1;

      this.onSend();
    },
    onPlatformLogout2() {
      this.queryParams.topic = "DataForwardService/modernlink02/Command";
      this.queryParams.message = "30 32";
      this.queryParams.qos = 1;

      this.onSend();
    },
    onCarTestPlatformLogin() {
      this.queryParams.topic = "DataForwardService/GX100005d30i/Command";
      this.queryParams.message = "30 31";
      this.queryParams.qos = 1;

      this.onSend();
    },
    onCarTestPlatformLogout() {
      this.queryParams.topic = "DataForwardService/GX100005d30i/Command";
      this.queryParams.message = "30 32";
      this.queryParams.qos = 1;

      this.onSend();
    },

    onPlatformDuanWang() {
      this.queryParams.topic = "DataForwardService/modernlink01/Command";
      this.queryParams.message = "30 33";
      this.queryParams.qos = 1;

      this.onSend();
    },

    onVehicleLogin() {
      this.queryParams.topic = this.queryParams.topic;
      this.queryParams.message = "75";
      this.queryParams.qos = 1;

      this.onSend();
    },

    onVehicleLogout() {
      this.queryParams.topic = this.queryParams.topic;
      this.queryParams.message = "76";
      this.queryParams.qos = 1;

      this.onSend();
    },

    onVehicleSOC100() {
      this.queryParams.topic = this.queryParams.topic;
      this.queryParams.message = "77";
      this.queryParams.qos = 1;

      this.onSend();
    },
    onVehicleSOC() {
      this.queryParams.topic = this.queryParams.topic;
      this.queryParams.message = "78";
      this.queryParams.qos = 1;

      this.onSend();
    },
    onVehicleGuZhang() {
      this.queryParams.topic = this.queryParams.topic;
      this.queryParams.message = "73";
      this.queryParams.qos = 1;

      this.onSend();
    },
    onVehicleDuanWang() {
      this.queryParams.topic = this.queryParams.topic;
      this.queryParams.message = "71";
      this.queryParams.qos = 1;

      this.onSend();
    },
    onVehicleLianWang() {
      this.queryParams.topic = this.queryParams.topic;
      this.queryParams.message = "72";
      this.queryParams.qos = 1;

      this.onSend();
    },
    // 查询容量
    onMemory() {
      let vin = this.queryParams.topic.substring(5, 22);
      get(vin).then((res) => {
        this.dataVersion = res.result.version;
        if (this.dataVersion === "1.1") {
          this.form.capacity = "7GB";
          this.form.usedCapacity = "";
          this.form.surplusCapacity = "";
          this.$modal.msgSuccess("发送成功");
          return;
        } else {
          if (!this.queryParams.topic) {
            this.$message.error("未选择订阅主题");
            return;
          }
          this.queryParams.topic = this.queryParams.topic;
          this.queryParams.message = "79";
          this.queryParams.qos = 1;

          this.onSend();
          getEmmc(vin).then((res) => {
            this.form = res.result;
          });
        }
      });
    },
    // 远程升级
    onRemoteUpgrade() {
      if (this.tboxForm.version === "1.1") {
        this.$message.error("已是最新版本");
        return;
      }
      if (!this.queryParams.topic) {
        this.$message.error("未选择订阅主题");
        return;
      }
      let own = this;
      own.dlProgress = 0;
      this.capacityDisb = true;
      for (var i = 0; i <= 99; i++) {
        if (i === 10) {
          (function (t, data) {
            // 注意这里是形参
            setTimeout(function () {
              own.dlProgress++;
              // console.log(`这是第 ${t} 次，这是其他参数：${own.dlProgress}`);
            }, 7000 * t); // 还是每秒执行一次，不是累加的
          })(i, own.dlProgress);
        } else {
          (function (t, data) {
            // 注意这里是形参
            setTimeout(function () {
              own.dlProgress++;
              // console.log(`这是第 ${t} 次，这是其他参数：${own.dlProgress}`);
            }, 1000 * t); // 还是每秒执行一次，不是累加的
          })(i, own.dlProgress);
        }

        // console.log(own.dlProgress);
        // if (own.dlProgress >= 15) {
        //   setTimeout(() => {
        //     own.dlProgress++;
        //   }, 6000);
        // } else if (own.dlProgress === 4) {
        //   setTimeout(() => {
        //     own.dlProgress++;
        //   }, 2500);
        // } else {
        //   setTimeout(() => {
        //     own.dlProgress++;
        //   }, 1500);
        //   // own.dlProgress++;
        // }
      }
    },
    progressText(percentage) {
      if (this.dlProgress === 0) {
        return `${percentage}%`;
      } else {
        if (this.dlProgress >= 100) {
          updateVersion(this.tboxForm).then((res) => {});
          this.capacityDisb = false;
        }
        return this.dlProgress >= 100 ? "升级完成" : `正在升级中请稍侯...`;
      }
    },
    onVersion() {
      if (!this.queryParams.topic) {
        this.$message.error("未选择订阅主题");
        return;
      }
      this.vin = this.queryParams.topic.substring(5, 22);
      get(this.vin).then((res) => {
        this.tboxForm = res.result;
      });
    },
    onTopicChange(val) {
      console.log(val);
      this.queryParams.topic = val;
      this.vin = "";
      this.version = "";
      this.dlProgress = 0;
    },
    clearTopic() {
      this.queryParams.topic = "";
    },
    clear() {
      this.vin = "";
      this.version = "";
      this.queryParams = {};
    },
  },
};
</script>

<style>
</style>
