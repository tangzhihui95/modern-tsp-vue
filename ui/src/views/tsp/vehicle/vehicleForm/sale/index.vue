<template>
  <div class="app-container">
    <el-row>
      <el-divider content-position="left">销售信息</el-divider>
    </el-row>
    <el-form
        ref="saleForm"
        :model="form"
        :rules="saleFormRules"
        label-width="80px"
    >
      <el-row>
        <el-col :span="7" :offset="0">
          <el-form-item
              label="购买领域"
              label-width="110px"
              prop="purchaserState"
          >
            <el-radio-group
                v-model="form.purchaserState"
                @change="handleRadio"
                :disabled="this.$props.title === '查看详情'"
            >
              <el-radio :label="1" v-model="form.purchaserState"
              >私人用车
              </el-radio
              >
              <el-radio :label="2" v-model="form.purchaserState"
              >单位用车
              </el-radio
              >
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="车辆用途" prop="purpose" label-width="110px">
            <el-select
                v-model="form.purpose"
                placeholder="请选择车辆用途"
                :disabled="title === '查看详情'"
                clearable
            >
              <el-option
                  v-for="item in purposes"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item
              label="是否是新车"
              label-width="110px"
              prop="newVehicleFlag"
          >
            <el-select
                v-model="form.newVehicleFlag"
                placeholder="是否是新车"
                :disabled="title === '查看详情'"
                clearable
            >
              <el-option label="新车" :value="1">新车</el-option>
              <el-option label="非新车" :value="2">非新车</el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="7" :offset="0">
          <el-form-item label="购买方名称" label-width="110px" prop="purchaser">
            <el-input
                :disabled="this.$props.title === '查看详情'"
                v-model="form.purchaser"
                placeholder="请输入购买方名称"
                maxlength="30"
                clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item
              label="身份证号"
              label-width="110px"
              prop="vehicleIdCard"
          >
            <el-input
                :disabled="this.$props.title === '查看详情'"
                v-model="form.vehicleIdCard"
                style="width: 195px;"
                placeholder="请输入身份证号"
                maxlength="18"
                clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item
              label="价税合计(小写)"
              label-width="110px"
              prop="priceTax"
          >
            <el-input-number
                :disabled="this.$props.title === '查看详情'"
                v-model="form.priceTax"
                style="width: 195px;"
                :min="0"
                type="number"
                :precision="2"
                maxlength="30"
                clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="7" :offset="0">
          <el-form-item label="发票号码" label-width="110px" prop="invoiceNo">
            <el-input
                onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))"
                :disabled="this.$props.title === '查看详情'"
                v-model="form.invoiceNo"
                placeholder="请输入发票号码"
                maxlength="8"
                clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item
              label="开票日期"
              label-width="110px"
              prop="invoicingDate"
          >
            <el-date-picker
                :disabled="this.$props.title === '查看详情'"
                v-model="form.invoicingDate"
                style="width: 195px;"
                :picker-options="forbiddenTime"
                type="date"
                placeholder="选择日期时间"
                value-format="yyyy-MM-dd"
                clearable
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item prop="isSanBao" label="是否三包" label-width="110px">
            <el-radio-group
                v-model="form.isSanBao"
                @change="handleRadio"
                :disabled="this.$props.title === '查看详情'"
            >
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="7" :offset="0">
          <el-form-item
              label="销货单位名称"
              label-width="110px"
              prop="salesUnitName"
          >
            <el-select
                v-model="form.salesUnitName"
                placeholder="请选择销货单位名称"
                style="width: 236px;"
                :disabled="title === '查看详情'"
                @change="saleChangeToAddress"
                clearable
            >
              <el-option
                  v-for="item in salesUnitNames"
                  :key="item.dealerName"
                  :label="item.dealerName"
                  :value="item.dealerName"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item
              label="销货单位地址"
              label-width="110px"
              prop="salesUnitAddress"
          >
            <el-input
                :disabled="true"
                v-model="form.salesUnitAddress"
                style="width: 195px;"
                placeholder="请输入销货单位地址"
                maxlength="30"
                type="textarea"
                autosize
                clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item
              label="车辆状态"
              label-width="110px"
              prop="vehicleStatus"
          >
            <el-select
                v-model="form.vehicleStatus"
                style="width: 195px;"
                placeholder="请选择车辆状态"
                :disabled="title === '查看详情'"
                clearable
            >
              <el-option label="生产期" :value="1">生产期</el-option>
              <el-option label="测试期" :value="2">测试期</el-option>
              <el-option label="待售" :value="3">待售</el-option>
              <el-option label="已售" :value="4">已售</el-option>
              <el-option label="过户" :value="5">过户</el-option>
              <el-option label="报废" :value="6">报废</el-option>
              <el-option label="其他" :value="7">其他</el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="7" :offset="0">
          <el-form-item
              label="销售渠道名称"
              label-width="110px"
              prop="salesChannel"
          >
            <el-input
                :disabled="this.$props.title === '查看详情'"
                v-model="form.salesChannel"
                placeholder="请输入销售渠道名称"
                maxlength="30"
                clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item
              label="办理员工姓名"
              label-width="110px"
              prop="employeeName"
          >
            <el-input
                :disabled="this.$props.title === '查看详情'"
                v-model="form.employeeName"
                style="width: 195px;"
                placeholder="请输入办理员工姓名"
                maxlength="30"
                clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item
              label="销售渠道类型"
              label-width="110px"
              prop="channelType"
          >
            <el-select
                v-model="form.channelType"
                style="width: 195px;"
                placeholder="请选择销售渠道类型"
                :disabled="title === '查看详情'"
                clearable
            >
              <el-option label="实体渠道" :value="1"></el-option>
              <el-option label="人员上门" :value="2"></el-option>
              <el-option label="电子渠道" :value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">
          <template>
            <el-form-item
                label="经销商省份"
                label-width="110px"
            >
              <el-select
                  v-model="provinceValue"
                  placeholder="请选择省"
                  @clear="clearProvinceAndUpdateDealerNames"
                  @change="getCity(provinceValue)"
                  :disabled="this.$props.title === '查看详情'"
                  clearable
              >
                <el-option
                    v-for="province in provincesOpt"
                    :key="province.value"
                    :label="province.label"
                    :value="province.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </template>
        </el-col>
        <el-col :span="5">
          <template>
            <el-form-item
                label="经销商城市"
                label-width="110px"
            >
              <el-select
                  v-model="cityValue"
                  @clear="clearCityAndUpdateDealerNames"
                  placeholder="请选择市"
                  @change="getArea(cityValue)"
                  :disabled="this.$props.title === '查看详情' ? this.$props.title === '查看详情' : disableCityDealer"
                  clearable
              >
                <el-option
                    v-for="city in cityTreesOpt"
                    :key="city.value"
                    :label="city.label"
                    :value="city.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </template>
        </el-col>
        <el-col :span="5">
          <template>
            <el-form-item
                label="经销商区县"
                label-width="110px"
            >
              <el-select
                  v-model="areaValue"
                  placeholder="请选择区"
                  @change="chooseArea(areaValue)"
                  :disabled="this.$props.title === '查看详情' ? this.$props.title === '查看详情' : disableAreaDealer"
                  clearable
                  @clear="clearAreaAndUpdateDealerNames"
              >
                <el-option
                    v-for="area in areaTreesOpt"
                    :key="area.value"
                    :label="area.label"
                    :value="area.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </template>
        </el-col>
        <el-col :span="9">
          <template>
            <el-form-item
                label="经销商"
                label-width="110px"
                prop="channelType"
            >
              <el-select
                  v-model="form.dealerId"
                  placeholder="请选择经销商"
                  style="width: 136px;"
                  :disabled="this.$props.title === '查看详情'"
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
          </template>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="7">
          <el-form-item label="发票" label-width="110px" prop="invoiceImgUrls">

            <el-upload
                :disabled="this.$props.title === '查看详情'"
                :action="this.imgUpload.url"
                :headers="this.imgUpload.headers"
                :file-list="this.fileList"
                :limit="1"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-success="handleAvatarSuccess"
                :on-remove="handleRemove"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible" append-to-body>
              <img width="100%" :src="dialogImageUrl" alt=""/>
            </el-dialog>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import {getToken} from "@/utils/auth";
import {saleNameGetAddress, saleNameList, saleNameListByLikeAddress} from "@/api/tsp/vehicle.js";
import {areaTrees, cityTrees, provincesTrees} from "@/api/tsp/provinces";
import {get as getDealer} from '@/api/tsp/dealer.js'

export default {
  name: "Sale",
  props: {
    form: {type: Object},
    title: {type: String},
  },
  watch: {
    //监听上传图片发生变化，达到重写渲染的结果
    form(nv, ov) {
      this.fileList = [];
      for (let index = 0; this.form.invoiceImgUrls && index < this.form.invoiceImgUrls.length; index++) {
        if (this.form.invoiceImgUrls[index]) {

          this.fileList.push({
            url: process.env.VUE_APP_BASE_API + this.form.invoiceImgUrls[index],
          });
          this.imgUpload.imgUrls.push(this.form.invoiceImgUrls[index]);
        }
      }
    }
  },
  data() {
    let cardIdNo = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("身份证长度为18位,由数值或数值加X组成"));
      } else {
        let reg = /((^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$))/;
        if (!reg.test(value)) {
          callback(new Error("身份证长度为18位,由数值或数值加X组成"));
        } else {
          callback();
        }
      }
    };
    return {
      saleFormData: JSON.parse(JSON.stringify(this.form)),
      // 表单校验
      saleFormRules: {
        purpose: [
          {required: true, message: "请选择车辆用途", trigger: "change"},
        ],
        purchaser: [
          {required: true, message: "请输入购买方", trigger: "blur"},
        ],
        tspVehicleTypeId: [
          {required: true, message: "请输入车辆型号", trigger: "change"},
        ],
        vehicleIdCard: [
          // { required: true, message: "身份证长度应在17位或18位,由数值或数值加X组成", trigger: "blur" },
          {required: true, trigger: "blur", validator: cardIdNo},
          // {
          //   min: 18,
          //   max: 19,
          //   message: "身份证长度应在17位或18位,由数值或数值加X组成",
          //   trigger: "blur",
          // },
        ],
        invoiceNo: [
          {required: true, message: "发票号码应为8位数字", trigger: "change"},
          {
            min: 8,
            max: 8,
            message: "发票号码应为8位数字",
            trigger: "blur",
          },
        ],
        invoicingDate: [
          {required: true, message: "请选择开票日期", trigger: "blur"},
        ],
        // salesUnitName: [
        //   { required: true, message: "请输入销货单位名称", trigger: "blur" },
        // ],
        // salesUnitAddress: [
        //   { required: true, message: "请输入销货单位地址", trigger: "blur" },
        // ],
        salesChannel: [
          {required: true, message: "请输入销售渠道名称", trigger: "blur"},
        ],
        channelType: [
          {required: true, message: "请选择销售渠道类型", trigger: "blur"},
        ],
        sale: [
          {required: true, message: "请选择经销商", trigger: "blur"},
        ],
        employeeName: [
          {required: true, message: "请输入办理员工姓名", trigger: "blur"},
        ],
        vehicleStatus: [
          {required: true, message: "请选择车辆状态", trigger: "blur"},
        ],
        newVehicleFlag: [
          {required: true, message: "请选择是否是新车", trigger: "blur"},
        ],
      },

      //市和区默认不可选
      disableAreaDealer: true,
      disableCityDealer: true,

      //获取时间>当前时间设为不可选
      forbiddenTime:{
        disabledDate(time){
          return time.getTime() > Date.now();
        }
      },
      // 车辆用途
      purposes: [
        {label: "私人乘用车", value: "私人乘用车"},
        {label: "公务乘用车", value: "公务乘用车"},
        {label: "私人运营车", value: "私人运营车"},
        {label: "公务运营车", value: "公务运营车"},
      ],
      // 遮罩层
      loading: true,
      saleTitle: "",
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      total: 0,
      salesUnitNames: [],
      saleForm: {},
      fileList: [],
      saleList: [],
      dialogImageUrl: "",
      dialogVisible: false,
      imgUpload: {
        // 设置上传的请求头部
        headers: {Authorization: "Bearer " + getToken()},
        url: process.env.VUE_APP_BASE_API + `/tsp/vehicle/upload/${1}`,
        imgUrls: [],
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
    };
  },
  created() {
    this.openAndInit();
  },
  methods: {
    openAndInit() {
      this.updateDealerProvinceCityArea(this.form.dealerId);

      this.fileList = [];
      for (let index = 0; this.form.invoiceImgUrls && index < this.form.invoiceImgUrls.length; index++) {
        this.fileList.push({
          url: process.env.VUE_APP_BASE_API + this.form.invoiceImgUrls[index],
        });
        this.imgUpload.imgUrls.push(this.form.invoiceImgUrls[index]);
      }
      this.getSaleNameList();
    },

    updateDealerProvinceCityArea(dealerId) {
      if (dealerId && dealerId !== "") {
        getDealer(dealerId).then((res) => {
          this.provinceValue = res.result.dealerProvince;
          this.cityValue = res.result.dealerCity;
          this.areaValue = res.result.dealerDistrict;

          this.disableAreaDealer = false;
          this.disableCityDealer = false;

          provincesTrees().then((res) => {
            this.provincesOpt = res.result;
          });
          cityTrees(this.provinceValue).then((res) => {
            this.cityTreesOpt = res.result;
          });
          areaTrees(this.cityValue).then((res) => {
            this.areaTreesOpt = res.result;
          });

          this.getDealerNames(this.provinceValue + this.cityValue + this.areaValue);
        }).catch((e) => {
          console.log(e);
        
          this.provinceValue = "",
          this.cityValue = "",
          this.areaValue = "",
          provincesTrees().then((res) => {
            this.provincesOpt = res.result;

            this.getDealerNames("");
          });
        });;
      } else {
        this.provinceValue = "",
        this.cityValue = "",
        this.areaValue = "",
        provincesTrees().then((res) => {
          this.provincesOpt = res.result;

          this.getDealerNames("");
        });
      }
    },

    getSaleNameList() {
      saleNameList().then((res) => {
        this.salesUnitNames = res.result;
      })
    },
    saleChangeToAddress(val) {
      saleNameGetAddress(val).then((res) => {
        this.form.salesUnitAddress = res.result.dealerAddress;
      })
    },
    handleUpdate() {
    },
    handleRadio(val) {
    },
    //⼦组件校验，传递到⽗组件
    validateForm() {
      let flag = null;
      this.$refs.saleForm.validate((valid) => {
        flag = !!valid;
      });
      return flag;
    },
    handleAvatarSuccess(file, fileList) {
      this.imgUpload.imgUrls.push(file.result);
      this.form.invoiceImgUrls = this.imgUpload.imgUrls;
    },
    handleRemove(file, fileList) {
      
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 经销商下拉列表
    getDealerNames(dealerName) {
      saleNameListByLikeAddress(dealerName).then((res) => {
        this.dealerNames = res.result;
      });
    },
    getCity(provinceValue) {
      this.clearProvince();
      
      this.disableAreaDealer = true;
      this.disableCityDealer = false;
      this.addressLike = provinceValue;
      this.provinceValue = provinceValue;
      if (provinceValue != null && provinceValue !== "") {
        cityTrees(provinceValue).then((res) => {
          this.cityTreesOpt = res.result;
          this.getDealerNames(this.addressLike);
        });
      }
    },
    getArea(cityValue) {
      this.clearCity();

      this.disableAreaDealer = false
      this.cityValue = cityValue;
      this.addressLike=this.provinceValue + cityValue
      if (cityValue != null && cityValue !== "") {
        areaTrees(cityValue).then((res) => {
          this.areaTreesOpt = res.result;
          this.getDealerNames(this.addressLike);
        });
      }
    },
    // 给区赋值
    chooseArea(areaValue) {
      this.clearArea();

      this.areaValue = areaValue;
      this.addressLike=this.provinceValue + this.cityValue + areaValue;
      this.getDealerNames(this.addressLike);
    },
    clearProvince() {
      this.disableAreaDealer = true
      this.disableCityDealer = true
      this.cityValue = "";
      this.areaValue = "";
      this.city = {
        label: null,
        value: null,
      };
      this.area = {
        label: null,
        value: null,
      };

      this.form.dealerId = null;
    },
    clearProvinceAndUpdateDealerNames() {
      this.clearProvince();
      this.getDealerNames("");
    },
    clearCity() {
      this.disableAreaDealer = true
      this.areaValue = "";
      this.area = {
        label: null,
        value: null,
      };

      this.form.dealerId = null;
    },
    clearCityAndUpdateDealerNames() {
      this.clearCity();
      this.addressLike = this.provinceValue;
      this.getDealerNames(this.addressLike);
    },
    clearArea() {
      this.form.dealerId = null;  
    },
    clearAreaAndUpdateDealerNames() {
      this.clearArea();
      this.addressLike = this.provinceValue + this.cityValue;
      this.getDealerNames(this.addressLike);
    },
  },
};
</script>

<style>
</style>
