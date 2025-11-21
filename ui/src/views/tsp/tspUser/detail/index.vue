<template>
  <div
    v-loading="loading"
    style="margin-top: 20px; margin-left: 5px; margin-right: 5px"
  >
    <el-row>
      <el-col type="border-card">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="查看信息" name="integrate" size="mini">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
              <el-row>
                <el-col :span="14">
                  <el-form-item
                    label="车主姓名"
                    prop="realName"
                    label-width="110px"
                  >
                    <el-input
                      v-model="form.realName"
                      maxlength="30"
                      :disabled="true"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="16">
                  <el-form-item
                    label="手机号(账号)"
                    prop="mobile"
                    label-width="110px"
                  >
                    <el-input
                      v-model="form.mobile"
                      maxlength="30"
                      :disabled="true"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="17">
                  <el-form-item
                    label="身份证号"
                    prop="idCard"
                    label-width="110px"
                  >
                    <el-input v-model="form.idCard" :disabled="true" />
                  </el-form-item>
                </el-col>
                <el-col :span="16">
                  <el-form-item label="状态" prop="status" label-width="110px">
                    <el-input
                      v-model="form.status"
                      maxlength="30"
                      :disabled="true"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="17">
                  <el-form-item
                    label="出生日期"
                    prop="birthday"
                    label-width="110px"
                  >
                    <el-input v-model="form.birthday" :disabled="true" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="14">
                  <el-form-item
                    label="车主性别"
                    prop="sex"
                    label-width="110px"
                  >
                    <el-radio-group v-model="form.sex" @change="handleRadio" :disabled="true">
                      <el-radio :label="1">男</el-radio>
                      <el-radio :label="2">女</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="14">
                  <el-form-item
                    label="注册地址"
                    prop="area"
                    label-width="110px"
                  >
                    <el-input
                      v-model="form.signAddress"
                      maxlength="30"
                      :disabled="true"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="14">
                  <el-form-item
                    label="详细地址"
                    prop="address"
                    label-width="110px"
                  >
                    <el-input
                      v-model="form.address"
                      maxlength="30"
                      :disabled="true"
                    />
                    <!-- <el-input
              v-model="form.awardPlaceArea"
              :disabled="this.$props.title === '查看详情'"
              type="input"
              placeholder="请输入上牌地"
              maxlength="30"
            /> -->
                  </el-form-item>
                </el-col>
                <el-col :span="14">
                  <el-form-item
                    label="用户标签"
                    prop="label"
                    label-width="110px"
                  >
                    <el-select
                      v-model="form.label"
                      multiple
                      placeholder="请选择"
                      :disabled="true"
                      style="width: 100%"
                    >
                      <el-option
                        v-for="item in labelList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="14">
                  <el-form-item
                    label="注册渠道"
                    prop="channels"
                    label-width="110px"
                  >
                    <el-input
                      v-model="form.channels"
                      maxlength="30"
                      :disabled="true"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="14">
                  <el-form-item
                    label="第三方授权"
                    prop="comeSourse"
                    label-width="110px"
                  >
                    <el-input
                      v-model="form.comeSourse"
                      maxlength="30"
                      :disabled="true"
                    />
                  </el-form-item>
                </el-col>
                <!-- <el-col :span="14">
                  <el-form-item
                    label="请上传手持身份证正面照片"
                    label-width="110px"
                    prop="userCardFrontImg"
                  >
                    <el-upload
                      v-model="this.form.userCardFrontImg"
                      :action="this.imgUpload.url"
                      :headers="this.imgUpload.headers"
                      :limit="1"
                      list-type="picture-card"
                      :file-list="this.fileFrontList"
                      :on-success="handleFrontSuccess"
                      :on-preview="handlePictureCardPreview"
                      :on-remove="handleRemove"
                    >
                      <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog :visible.sync="dialogVisible">
                      <img width="100%" :src="dialogImageUrl" alt="" />
                    </el-dialog>
                  </el-form-item>
                </el-col>
                <el-col :span="14">
                  <el-form-item
                    label="请上传手持身份证反面照片"
                    label-width="110px"
                    prop="userCardBackImg"
                  >
                    <el-upload
                      :action="this.imgUpload.url"
                      v-model="this.form.userCardBackImg"
                      :headers="this.imgUpload.headers"
                      :limit="1"
                      list-type="picture-card"
                      :file-list="this.fileBackList"
                      :on-preview="handlePictureBackPreview"
                      :on-success="handleBackSuccess"
                      :on-remove="handleRemove"
                    >
                      <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog :visible.sync="dialogVisible">
                      <img width="100%" :src="dialogImageUrl" alt="" />
                    </el-dialog>
                  </el-form-item>
                </el-col> -->
              </el-row>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="当前绑定车辆" name="nowList">
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
                label="车牌号"
                align="center"
                width="150px"
                prop="plateCode"
              />
              <el-table-column
                label="VIN码"
                align="center"
                width="150px"
                prop="vin"
              />
              <el-table-column label="实名状态" align="center" prop="status" />
              <el-table-column label="SIM" align="center" prop="sim" />
              <el-table-column label="同步时间" align="center" prop="date" />
              <el-table-column
                label="一级车型/二级车型"
                align="center"
                prop="vehicleModel"
              >
              </el-table-column>
              <el-table-column
                label="电机编号"
                align="center"
                prop="motorNum"
              >
              </el-table-column>
              <el-table-column
                label="设备分类/设备型号"
                align="center"
                prop="equipmentModel"
              >
              </el-table-column>
              <el-table-column label="设备SN" align="center" prop="SN">
              </el-table-column>
              <el-table-column label="设备ICCID" align="center" prop="ICCID">
              </el-table-column>
              <el-table-column label="设备IMEI" align="center" prop="IMEI">
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="历史绑定车辆" name="historyList">
            <el-table :data="historyDatas" size="mini">
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
                label="车牌号"
                align="center"
                width="150px"
                prop="plateCode"
              />
              <el-table-column
                label="VIN码"
                align="center"
                width="150px"
                prop="vin"
              />
              <el-table-column label="实名状态" align="center" prop="status" />
              <el-table-column label="SIM" align="center" prop="sim" />
              <el-table-column label="同步时间" align="center" prop="date" />
              <el-table-column
                label="一级车型/二级车型"
                align="center"
                prop="vehicleModel"
              >
              </el-table-column>
              <el-table-column
                label="电机编号"
                align="center"
                prop="motorNum"
              >
              </el-table-column>
              <el-table-column
                label="设备分类/设备型号"
                align="center"
                prop="equipmentModel"
              >
              </el-table-column>
              <el-table-column label="设备SN" align="center" prop="SN">
              </el-table-column>
              <el-table-column label="设备ICCID" align="center" prop="ICCID">
              </el-table-column>
              <el-table-column label="设备IMEI" align="center" prop="IMEI">
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
          :v-if="this.title === '查看详情'"
        >
        </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { get, find, findHistory } from "@/api/tsp/user.js";
import { getToken } from "@/utils/auth";
import { getLabel } from "@/api/tsp/tag.js";
import dayjs from "dayjs";

export default {
  name: "UserDetail",
  data() {
    return {
      // Loading加载
      loading: false,
      form: { signAddress: "", status: "启用/未认证", comeSourse: "" },
      title: "",
      newKey: 1,
      id: "",
      labelList: [{}],
      cascaderProps: {
        //checkStrictly: true,// 父子节点是否互相关联,其余配置见官网
        lazy: true,
        lazyLoad: this.lazyLoad,
      },
      imgUpload: {
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        url: process.env.VUE_APP_BASE_API + `/tsp/vehicle/upload/${4}`,
        imgUrls: [],
      },
      fileFrontList: [],
      fileBackList: [],
      dialogVisible: false,
      dialogImageUrl: "",
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
      historyDatas: [{}],
      rules: {
        search: [
          { required: true, message: "请输入查询车辆", trigger: "blur" },
        ],
      },
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
    console.log(this.$route);
    this.id = this.$route.query.id;
    this.getDetail(this.id);
    this.getBindList(this.id);
    this.getLabel();
    this.getHistoryList(this.id);
  },

  methods: {
    getLabel() {
      getLabel(0).then((res) => {
        this.labelList = res.result;
      });
    },
    getDetail(id) {
      get(id).then((res) => {
        this.form = res.result;
        this.form.signAddress =
          this.form.province + this.form.city + this.form.area;
        console.log("this.form", this.form);
        if (this.form.isEnable === true) {
          if (this.form.realNameAudit === 0) {
            this.form.status = "启用/未认证";
          } else {
            this.form.status = "启用/已认证";
          }
        } else {
          if (this.form.realNameAudit === 0) {
            this.form.status = "未启用/未认证";
          } else {
            this.form.status = "未启用/已认证";
          }
        }
        if (this.form.registeredChannels === 0) {
          this.form.channels = "平台账号";
        }
        if (this.form.source === 0) {
          this.form.comeSourse = "未知";
        }
        if (this.form.source === 1) {
          this.form.comeSourse = "商店";
        }
        if (this.form.source === 2) {
          this.form.comeSourse = "公众号";
        }
        if (this.form.source === 3) {
          this.form.comeSourse = "第三方";
        }
      });
    },
    getBindList(id) {
      find(id).then((res) => {
        this.datas = res.result;
        this.total = res.result.total;
        console.log("this.datas", this.datas);
      });
    },
    getHistoryList(id) {
      findHistory(id).then((res) => {
        this.historyDatas = res.result;
        this.total = res.result.total;
        console.log("this.datas", this.historyDatas);
      });
    },
    loadingStart() {
      this.loading = true;
    },
    loadingEnd() {
      this.loading = false;
    },
    areaChange(val) {
      console.log(val);
      this.$set(this.form, "isTerminal", val);
      if(val) {
        this.form.province = val[0];
        this.form.city = val[1];
        this.form.area = val[2];
        console.log(this.form.area);
      }
    },
    handleClick(tab, event) {
      console.log(tab.name);
      if (this.queryParams.search) {
        switch (tab.name) {
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
          case "essTemperature":
            this.getEssTemperatureList();
            break;
          case "extreme":
            this.getExtremeList();
            break;
          default:
            break;
        }
      }
    },
    handleFrontSuccess(file, fileList) {
      console.log(file);
      this.form.userCardFrontImg = file.result;
    },
    handleBackSuccess(file) {
      this.form.userCardBackImg = file.result;
      console.log(file);
    },
    handleRemove(file, fileList) {
      console.log("删除");
    },
    handlePictureCardPreview(file) {
      console.log("点击了预览按钮");
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handlePictureBackPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 点击切换条数
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.queryParams.pageSize = val;
      this.handleList(this.activeName);
    },
    handleList(activeName) {
      this.datas = [];
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
        case "essTemperature":
          this.getEssTemperatureList();
          break;
        default:
          break;
      }
    },
    // 点击页数
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      //
      this.queryParams.pageNum = val;
      this.handleList(this.activeName);
    },
    handleSearch() {
      //TODO:this.queryParams.pageNum?
      
      this.$refs["queryParams"].validate((valid) => {
        if (valid) {
          this.queryParams.collectStartTime = this.dateRange[0];
          this.queryParams.collectEndTime = this.dateRange[1];
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
      // this.handleList(this.activeName);
    },

    // 导出
    clickExport() {
      this.$refs["queryParams"].validate((valid) => {
        if (valid) {
          this.queryParams.collectStartTime = this.dateRange[0];
          this.queryParams.collectEndTime = this.dateRange[1];

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
    handleRadio() {},
  },
};
</script>

<style>
</style>
