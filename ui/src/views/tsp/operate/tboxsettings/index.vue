<template>
  <div class="app-container">

    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="VIN" prop="vin">
        <el-input
          v-model="queryParams.vin"
          placeholder="请输入VIN"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery" v-hasPermi="['zhiyuan:tsp:tbox-query']" :disabled="loading">查询</el-button>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          plain
          icon="el-icon-edit"
          size="mini"
          @click="handleUpdate"
          v-hasPermi="['zhiyuan:tsp:tbox-update']"
          :disabled="loading"
        >修改</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="settingsList">
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="VIN" align="center" prop="vin" />
      <el-table-column label="数据类型" align="center" prop="dataType" />
      <el-table-column label="本地存储时间周期" align="center" prop="storeCycle" />
      <el-table-column label="正常时上报周期" align="center" prop="sendInterval" />
      <el-table-column label="报警时上报周期" align="center" prop="sendIntervalDuringAlarm" />
      <el-table-column label="远程平台域名长度" align="center" prop="serverPlatformDomainNameLength" />
      <el-table-column label="远程平台域名" align="center" prop="serverPlatformDomainName" />
      <el-table-column label="远程平台端口" align="center" prop="serverPlatformPort" />
      <el-table-column label="硬件版本" align="center" prop="hardwareVersion" />
      <el-table-column label="固件版本" align="center" prop="firmwareVersion" />
      <el-table-column label="心跳发送周期" align="center" prop="heartbeatInterval" />
      <el-table-column label="终端应答超时时间" align="center" prop="responseTimeout" />
      <el-table-column label="平台应答超时时间" align="center" prop="serverResponseTimeout" />
      <el-table-column label="登入间隔时间" align="center" prop="loginIntervalAfterFailure" />
      <el-table-column label="公共平台域名长度" align="center" prop="nationalPlatformDomainNameLength" />
      <el-table-column label="公共平台域名" align="center" prop="nationalPlatformDomainName" />
      <el-table-column label="公共平台端口" align="center" prop="nationalPlatformPort" />
      <el-table-column label="是否抽样监测" align="center" prop="whetherSamplingMonitoring" />
      <el-table-column label="数据时间" align="center" prop="collectTime" width="180">
        <!-- <template slot-scope="scope">
          <span>{{ parseTime(scope.row.collectTime) }}</span>
        </template> -->
      </el-table-column>
    </el-table>

    <!-- 添加或修改智源TBox设置数据对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="130px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="VIN" prop="vin">
              <el-input v-model="form.vin" placeholder="请输入VIN" />
            </el-form-item>
            <el-form-item label="本地存储时间周期" prop="storeCycle">
              <el-input v-model="form.storeCycle" placeholder="0-60000ms" type="number"/>
            </el-form-item>
            <el-form-item label="正常时上报周期" prop="sendInterval">
              <el-input v-model="form.sendInterval" placeholder="1-30s"  type="number"/>
            </el-form-item>
            <el-form-item label="报警时上报周期" prop="sendIntervalDuringAlarm">
              <el-input v-model="form.sendIntervalDuringAlarm" placeholder="0-60000ms" type="number"/>
            </el-form-item>
            <el-form-item label="远程平台域名" prop="serverPlatformDomainName">
              <el-input v-model="form.serverPlatformDomainName" placeholder="" />
            </el-form-item>
            <el-form-item label="远程平台端口" prop="serverPlatformPort">
              <el-input v-model="form.serverPlatformPort" placeholder="0-65531" type="number"/>
            </el-form-item>
            <el-form-item label="硬件版本" prop="hardwareVersion">
              <el-input v-model="form.hardwareVersion" placeholder="" />
            </el-form-item>
            <el-form-item label="固件版本" prop="firmwareVersion">
              <el-input v-model="form.firmwareVersion" placeholder="" />
            </el-form-item>

          </el-col>
          <el-col :span="12">
            <el-form-item label="心跳发送周期" prop="heartbeatInterval">
              <el-input v-model="form.heartbeatInterval" placeholder="1-240s" type="number"/>
            </el-form-item>
            <el-form-item label="终端应答超时时间" prop="responseTimeout">
              <el-input v-model="form.responseTimeout" placeholder="1-600s" type="number"/>
            </el-form-item>
            <el-form-item label="平台应答超时时间" prop="serverResponseTimeout">
              <el-input v-model="form.serverResponseTimeout" placeholder="1-600s" type="number"/>
            </el-form-item>
            <el-form-item label="登入间隔时间" prop="loginIntervalAfterFailure">
              <el-input v-model="form.loginIntervalAfterFailure" placeholder="1-240s" type="number"/>
            </el-form-item>
            <el-form-item label="公共平台域名" prop="nationalPlatformDomainName">
              <el-input v-model="form.nationalPlatformDomainName" placeholder="" />
            </el-form-item>
            <el-form-item label="公共平台端口" prop="nationalPlatformPort">
              <el-input v-model="form.nationalPlatformPort" placeholder="0-65531" type="number"/>
            </el-form-item>
            <el-form-item label="是否抽样监测" prop="whetherSamplingMonitoring">
              <el-input v-model="form.whetherSamplingMonitoring" placeholder="1=是，2=否" type="number"/>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input type="password" v-model="form.password" placeholder="密码" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { sendZhiYuanTboxSettingsQueryCommand, getZhiYuanTboxSettings, sendZhiYuanTboxSettingsUpdateCommand, getZhiYuanTboxSettingsUpdateResult} from "@/api/tsp/zhiyuan";

export default {
  name: "Settings",
  data() {
    return {
      // 遮罩层
      loading: false,
      // 非单个禁用
      single: true,
      // 总条数
      total: 0,
      // 智源TBox设置数据表格数据
      settingsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        vin: null,
        dataType: null,
        storeCycle: null,
        sendInterval: null,
        sendIntervalDuringAlarm: null,
        serverPlatformDomainNameLength: null,
        serverPlatformDomainName: null,
        serverPlatformPort: null,
        hardwareVersion: null,
        firmwareVersion: null,
        heartbeatInterval: null,
        responseTimeout: null,
        serverResponseTimeout: null,
        loginIntervalAfterFailure: null,
        nationalPlatformDomainNameLength: null,
        nationalPlatformDomainName: null,
        nationalPlatformPort: null,
        whetherSamplingMonitoring: null,
        httpServerDomainNameLength: null,
        httpServerDomainName: null,
        httpServerPort: null,
        deviceRegisteredAddressLength: null,
        deviceRegisteredAddress: null,
        energyStorageEquipmentType: null,
        coolingType: null,
        collectTime: null,
        deleted: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        vin: [
          { required: true, message: "VIN不能为空", trigger: "blur" }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" }
        ],

        storeCycle: [
          {
            pattern: /^(\d{1,4}|[1-5]\d{4}|60000|65534|65535)$/,
            message: "0-6000ms",
            trigger: "blur",
          },
        ],

        sendInterval: [
          {
            pattern: /^([1-9]|[1-2]\d|30|65534|65535)$/,
            message: "1-30s",
            trigger: "blur",
          },
        ],

        sendIntervalDuringAlarm: [
          {
            pattern: /^(\d{1,4}|[1-5]\d{4}|60000|65534|65535)$/,
            message: "0-6000ms",
            trigger: "blur",
          },
        ],

        serverPlatformDomainName: [
          { min: 0, max: 1024, message: '字符长度：0-1024', trigger: 'blur' }
        ],

        serverPlatformPort: [
          {
            pattern: /^(\d{1,4}|[1-6]\d{4}|70000|65534|65535)$/,
            message: "0-65531",
            trigger: "blur",
          },
        ],

        hardwareVersion: [
          {
            pattern: /^V[0-9].\d{2}$/,
            message: "格式错误，例：V0.10",
            trigger: "blur",
          },
        ],
        firmwareVersion: [
          {
            pattern: /^V[0-9].\d{2}$/,
            message: "格式错误，例：V0.10",
            trigger: "blur",
          },
        ],

        heartbeatInterval: [
          {
            pattern: /^([1-9]|[1-9]\d|[1-2][0-3]\d|240|65534|65535)$/,
            message: "1-240ms",
            trigger: "blur",
          },
        ],

        responseTimeout: [
          {
            pattern: /^([1-9]|[1-9]\d|[1-5]\d{2}|600|65534|65535)$/,
            message: "1-600s",
            trigger: "blur",
          },
        ],

        serverResponseTimeout: [
          {
            pattern: /^([1-9]|[1-9]\d|[1-5]\d{2}|600|65534|65535)$/,
            message: "1-600s",
            trigger: "blur",
          },
        ],

        loginIntervalAfterFailure: [
          {
            pattern: /^([1-9]|[1-9]\d|[1-2][0-3]\d|240|65534|65535)$/,
            message: "1-240s",
            trigger: "blur",
          },
        ],
        
        nationalPlatformDomainName: [
          { min: 0, max: 1024, message: '字符长度：0-1024', trigger: 'blur' }
        ],

        nationalPlatformPort: [
          {
            pattern: /^(\d{1,4}|[1-6]\d{4}|70000|65534|65535)$/,
            message: "0-65531",
            trigger: "blur",
          },
        ],

        whetherSamplingMonitoring: [
          {
            pattern: /^(1|2|254|255)$/,
            message: "1-2",
            trigger: "blur",
          },
        ],

      },

      getTBoxSettingsCount: 5,
      getTBoxSettingsTimer: null,
      getTBoxSettingsTimerInterval: 2000,
      updateTBoxSettingsCount: 5,
      updateTBoxSettingsTimer: null,
      updateTBoxSettingsTimerInterval: 2000,
    };
  },
  created() {
    //this.getList();
  },
  methods: {
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        vin: null,
        dataType: null,
        storeCycle: null,
        sendInterval: null,
        sendIntervalDuringAlarm: null,
        serverPlatformDomainNameLength: null,
        serverPlatformDomainName: null,
        serverPlatformPort: null,
        hardwareVersion: null,
        firmwareVersion: null,
        heartbeatInterval: null,
        responseTimeout: null,
        serverResponseTimeout: null,
        loginIntervalAfterFailure: null,
        nationalPlatformDomainNameLength: null,
        nationalPlatformDomainName: null,
        nationalPlatformPort: null,
        whetherSamplingMonitoring: null,
        httpServerDomainNameLength: null,
        httpServerDomainName: null,
        httpServerPort: null,
        deviceRegisteredAddressLength: null,
        deviceRegisteredAddress: null,
        energyStorageEquipmentType: null,
        coolingType: null,
        collectTime: null,
        createTime: null,
        deleted: null,

        password: null,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      if (this.queryParams.vin === null || this.queryParams.vin ==="") {
        this.$message.error("VIN不能为空");
        return; 
      }
      this.$message.success("正在发送查询命令...");
      this.loading = true;
      sendZhiYuanTboxSettingsQueryCommand(this.queryParams.vin).then(res => {
       if (res.code === 200) {
          this.resetGetTBoxSettingsTimer(this.queryParams.vin);
        } else {
          this.loading = false;

          this.$message.error(res.msg);
        }
      }).catch(() => {this.loading = false;});
    },

    resetGetTBoxSettingsTimer(vin) {
      this.getTBoxSettingsCount = 5;
      this.getTBoxSettingsTimer && clearInterval(this.getTBoxSettingsTimer);
      this.getTBoxSettingsTimer = setInterval(() => {
        this.invokeGetTBoxSettings(vin);
      }, this.getTBoxSettingsTimerInterval);
    },

    clearGetTBoxSettingsTimer() {
      this.loading = false;
      this.getTBoxSettingsTimer && clearInterval(this.getTBoxSettingsTimer);
    },

    invokeGetTBoxSettings(vin) {
      getZhiYuanTboxSettings(vin).then(res => {
        this.getTBoxSettingsCount--;
        if (res.code === 200) {
          if (res.result != null && res.result.vin != null) {
            this.clearGetTBoxSettingsTimer();

            this.settingsList.unshift(res.result);

            this.$message.success("查询成功");
          } else {
            if (this.getTBoxSettingsCount <= 0) {
              this.clearGetTBoxSettingsTimer();
              
              this.$message.error("失败，车辆未响应");
            }
          }
        } else {
          this.$message.error(res.msg);

          this.clearGetTBoxSettingsTimer();
        }
      }).catch(() => {this.clearGetTBoxSettingsTimer();});
    },


    /** 修改按钮操作 */
    handleUpdate() {
      this.reset();
      this.open = true;
      this.title = "修改智源TBox设置数据";
    },

    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.vin != null) {
            this.$message.success("正在发送修改命令...");
            this.open = false;

            this.loading = true;
            sendZhiYuanTboxSettingsUpdateCommand(this.form).then(res => {
              if (res.code === 200) {
                this.resetUpdateTBoxSettingsTimer(this.form.vin);
              } else {
                this.$message.error(res.msg);

                this.loading = false;
              }
            }).catch(() => {this.loading = false;});
          }
        }
      });
    },

    resetUpdateTBoxSettingsTimer(vin) {
      this.updateTBoxSettingsCount = 5;
      this.updateTBoxSettingsTimer && clearInterval(this.updateTBoxSettingsTimer);
      this.updateTBoxSettingsTimer = setInterval(() => {
        this.invokeUpdateTBoxSettings(vin);
      }, this.updateTBoxSettingsTimerInterval);
    },

    clearUpdateTBoxSettingsTimer() {
      this.loading = false;
      this.updateTBoxSettingsTimer && clearInterval(this.updateTBoxSettingsTimer);
    },

    invokeUpdateTBoxSettings(vin) {
      getZhiYuanTboxSettingsUpdateResult(vin).then(res => {
        this.updateTBoxSettingsCount--;
        if (res.code === 200) {
          if (res.result != null && res.result.vin != null) {
            this.$message.success("修改成功");

            this.clearUpdateTBoxSettingsTimer();
          } else {
            if (this.updateTBoxSettingsCount <= 0) {
              this.$message.error("失败，车辆未响应");

              this.clearUpdateTBoxSettingsTimer();
            }
          }
        } else {
          console.log("2");
          this.$message.error(res.msg);

          this.clearUpdateTBoxSettingsTimer();
        }
      }).catch(() => {this.clearUpdateTBoxSettingsTimer();});
    },
  }
};
</script>

<style scoped>
  .el-form-item {
      margin-bottom: 18px;
  }
</style>