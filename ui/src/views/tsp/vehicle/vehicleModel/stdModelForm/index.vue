<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="1000px"
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="cancel"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <!-- <el-tabs> -->
          <el-divider content-position="left">基本信息</el-divider>
          <!-- <el-tab-pane label="基本信息"> -->
            <el-row>
              <el-col :span="8">
                <el-form-item
                  label="车型"
                  prop="vehicleModelName"
                  label-width="110px"
                >
                  <el-input
                    disabled
                    v-model="form.vehicleModelName"
                    placeholder="请输入车型"
                    maxlength="30"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="型号名称"
                  prop="stdModeName"
                  label-width="110px"
                >
                  <el-input
                    :disabled="this.title === '二级型号详情'"
                    v-model="form.stdModeName"
                    placeholder="请输入型号名称"
                    maxlength="30"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="选择能源类型"
                  prop="dataKey"
                  label-width="110px"
                >
                  <el-select
                    v-model="form.dataKey"
                    :disabled="this.title === '二级型号详情'"
                    placeholder="请选择能源类型"
                    clearable
                  >
                    <el-option label="混合动力" :value="1"></el-option>
                    <el-option label="纯电动" :value="2"></el-option>
                    <el-option
                      label="燃料电池电动"
                      :value="3"
                    ></el-option>
                    <el-option
                      label="插电式混动"
                      :value="4"
                    ></el-option>
                    <el-option
                      label="增程式混动"
                      :value="5"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="公告型号"
                  prop="noticeModel"
                  label-width="110px"
                >
                  <el-input
                    :disabled="this.title === '二级型号详情'"
                    v-model="form.noticeModel"
                    placeholder="请输入公告型号"
                    maxlength="30"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="公告批次"
                  prop="noticeBatch"
                  label-width="110px"
                >
                  <el-input
                    :disabled="this.title === '二级型号详情'"
                    v-model="form.noticeBatch"
                    placeholder="请输入公告批次"
                    maxlength="30"
                    clearable
                  />
                </el-form-item>
              </el-col>
            </el-row>
          <!-- </el-tab-pane> -->
          <!-- <el-tab-pane label="设备参数">设备参数</el-tab-pane> -->
          <el-divider content-position="left">整车参数</el-divider>
          <!-- <el-tab-pane label="整车参数"> -->
            <el-row>
              <el-col :span="8">
                <el-form-item
                  label="气缸数(个)"
                  prop="stdModelExtraAddVO.cylinderNumber"
                  label-width="110px"
                >
                  <el-input
                    :disabled="this.title === '二级型号详情'"
                    v-model="form.stdModelExtraAddVO.cylinderNumber"
                    maxlength="9"
                    type="text"
                    oninput="this.value=this.value.replace(/\D/g,'')"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="环保标准"
                  prop="stdModelExtraAddVO.environmentalProtection"
                  label-width="110px"
                >
                  <el-select
                    :disabled="this.title === '二级型号详情'"
                    v-model="form.stdModelExtraAddVO.environmentalProtection"
                    placeholder="请选择环保标准"
                    clearable
                  >
                    <el-option
                      v-for="item in environmentalProtections"
                      :key="item.label"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="整车质保(年)"
                  prop="stdModelExtraAddVO.vehicleWarranty"
                  label-width="110px"
                >
                  <el-input
                    :disabled="this.title === '二级型号详情'"
                    v-model="form.stdModelExtraAddVO.vehicleWarranty"
                    maxlength="9"
                    type="text"
                    oninput="this.value=this.value.replace(/\D/g,'')"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="发动机型号"
                  prop="stdModelExtraAddVO.engineType"
                  label-width="110px"
                >
                  <el-input
                    :disabled="this.title === '二级型号详情'"
                    v-model="form.stdModelExtraAddVO.engineType"
                    maxlength="30"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="车身尺寸(长*宽*高)M"
                  prop="stdModelExtraAddVO.dimensions"
                  label-width="160px"
                >
                  <el-input
                    :disabled="this.title === '二级型号详情'"
                    v-model="form.stdModelExtraAddVO.dimensions"
                    placeholder="请输入车身尺寸"
                    maxlength="30"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8" :offset="1">
                <el-form-item
                  label="车型图片"
                  prop="stdModelExtraAddVO.extraImages"
                  label-width="110px"
                >
                  <el-upload
                    :disabled="this.title === '二级型号详情'"
                    v-model="form.stdModelExtraAddVO.extraImages"
                    :action="this.imgUpload.url"
                    :headers="this.imgUpload.headers"
                    :file-list="fileList"
                    list-type="picture-card"
                    :on-preview="handlePictureCardPreview"
                    :on-success="handleAvatarSuccess"
                    :on-remove="handleRemove"
                  >
                    <i class="el-icon-plus"></i>
                  </el-upload>
                </el-form-item>
              </el-col>
            </el-row>
          <el-divider content-position="left">性能参数</el-divider>
            <el-row>
              <el-col :span="9">
                <el-form-item
                  label="发动机排量(mL)"
                  prop="stdModelExtraAddVO.displacement"
                  label-width="140px"
                >
                  <el-input
                    :disabled="this.title === '二级型号详情'"
                    v-model="form.stdModelExtraAddVO.displacement"
                    maxlength="9"
                    type="text"
                    oninput="this.value=this.value.replace(/\D/g,'')"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item
                  label="综合油耗(L/100km)"
                  prop="stdModelExtraAddVO.oilWear"
                  label-width="140px"
                >
                  <el-input
                    :disabled="this.title === '二级型号详情'"
                    v-model="form.stdModelExtraAddVO.oilWear"
                    maxlength="9"
                    type="text"
                    oninput="this.value=this.value.replace(/\D/g,'')"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item
                  label="最大功率kw"
                  prop="stdModelExtraAddVO.maximumPower"
                  label-width="140px"
                >
                  <el-input
                    :disabled="this.title === '二级型号详情'"
                    v-model="form.stdModelExtraAddVO.maximumPower"
                    maxlength="9"
                    type="text"
                    oninput="this.value=this.value.replace(/\D/g,'')"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item
                  label="最大扭矩(N*m)"
                  prop="stdModelExtraAddVO.maximumTorque"
                  label-width="140px"
                >
                  <el-input
                    v-model="form.stdModelExtraAddVO.maximumTorque"
                    :disabled="this.title === '二级型号详情'"
                    maxlength="9"
                    type="text"
                    oninput="this.value=this.value.replace(/\D/g,'')"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item
                  label="变速箱"
                  prop="stdModelExtraAddVO.transmissionCase"
                  label-width="140px"
                >
                  <el-select
                    :disabled="this.title === '二级型号详情'"
                    v-model="form.stdModelExtraAddVO.transmissionCase"
                    placeholder="请选择变速箱"
                    clearable
                  >
                    <el-option label="6挡手自一体" value="6挡手自一体"></el-option>
                    <el-option label="8挡手自一体" value="8挡手自一体"></el-option>
                    <el-option label="CVT无极变速" value="CVT无极变速"></el-option>
                    <el-option label="6挡手动" value="6挡手动"></el-option>
                    <el-option label="7挡双离合" value="7挡双离合"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item
                  label="驱动方式"
                  prop="stdModelExtraAddVO.drivingMode"
                  label-width="140px"
                >
                  <el-input
                    v-model="form.stdModelExtraAddVO.drivingMode"
                    maxlength="30"
                    :disabled="this.title === '二级型号详情'"
                    clearable
                  />
                </el-form-item>
              </el-col>
            </el-row>
          <!-- </el-tab-pane> -->
        <!-- </el-tabs> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { add, edit } from "@/api/tsp/vehicleStdModel.js";
import { getToken } from "@/utils/auth";
export default {
  name: "stdModelForm",
  created() {},
  data() {
    return {
      form: {
        stdModelExtraAddVO: {
          cylinderNumber: "",
          extraImages:[],
        },
      },
      environmentalProtections:[
        {label: '国II',value:'国II'},
        {label: '国III',value:'国III'},
        {label: '国IV',value:'国IV'},
        {label: '国V',value:'国V'},
      ],
      // 表单校验
      rules: {
        stdModeName:[
          { required: true, message: "型号名称不能为空", trigger: "blur" },
        ],
        noticeModel:[
          { required: true, message: "公告型号不能为空", trigger: "blur" },
        ],
        noticeBatch:[
          { required: true, message: "公告批次不能为空", trigger: "blur" },
        ],
        stdModelExtraAddVO:{
          environmentalProtection:[{required: true, message: "请选择环保标准", trigger: "change"}],
          dimensions:[{required: true, message: "车身尺寸不能为空", trigger: "blur"},
          {
            pattern: /^[0-9]{1,}(\.[0-9]{1,})?\*[0-9]{1,}(\.[0-9]{1,})?\*[0-9]{1,}(\.[0-9]{1,})?$/,
            message: "车身尺寸示例：4.670*1.800*1.500",
            trigger: "blur"
          }],
          transmissionCase:[{required: true,message:"请选择变速箱",trigger:"change"}]
        },
        dataKey:[
          { required: true, message: "能源类型不能为空", trigger: "change" },
        ],
        // vehicleModelName: [
        //   { required: true, message: "车型名称不能为空", trigger: "blur" },
        //   {
        //     min: 2,
        //     max: 20,
        //     message: "车型名称长度必须介于 2 和 20 之间",
        //     trigger: "blur",
        //   },
        // ],
        // tspVehicleTypeId: [
        //   { required: true, message: '请选择车型分类', trigger: 'change' }
        // ],
      },
      open: false,
      title: "",
      imgUpload: {
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        url: process.env.VUE_APP_BASE_API + `/tsp/vehicle/upload/${1}`,
      },
      fileList: [],
    };
  },
  methods: {
    handleAvatarSuccess(response, file, fileList) {
      this.form.stdModelExtraAddVO.extraImages.push(response.result);
      fileList[this.form.stdModelExtraAddVO.extraImages.length - 1].url = process.env.VUE_APP_BASE_API + response.result;
    },
    handleRemove(file, fileList) {
      // console.log("删除");
      let remainingImgUrls = [];
      for (let index = 0; this.form.stdModelExtraAddVO.extraImages && index < this.form.stdModelExtraAddVO.extraImages.length; index++) {
        if (file.url.indexOf(this.form.stdModelExtraAddVO.extraImages[index]) === -1) {
          remainingImgUrls.push(this.form.stdModelExtraAddVO.extraImages[index]);
        }
      }
      this.form.stdModelExtraAddVO.extraImages = remainingImgUrls;
    },
    handlePictureCardPreview(file) {
      // console.log("预览");
    },
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.title === "添加型号") {
            add(JSON.parse(JSON.stringify(this.form))).then((res) => {
              this.$modal.msgSuccess("添加成功");
              this.cancel();
              this.$parent.getList();
            });
          } else {
            edit(JSON.parse(JSON.stringify(this.form))).then((res) => {
              this.$modal.msgSuccess("修改成功");
              this.cancel();
              this.$parent.getList();
            });
          }
        }
      });
    },
    openDialog() {
      this.fileList = [];
      for (let index = 0; this.form.stdModelExtraAddVO.extraImages && index < this.form.stdModelExtraAddVO.extraImages.length; index++) {
        if(this.form.stdModelExtraAddVO.extraImages[index]!=null){
          this.fileList.push({
            url: process.env.VUE_APP_BASE_API + this.form.stdModelExtraAddVO.extraImages[index],
          });
        }
      }

      this.open = true;
    },
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        stdModelExtraAddVO: {
          cylinderNumber: "",
          extraImages:[],
        },
      };
      this.fileList = [];
      this.$refs["form"].resetFields();
    },
  },
};
</script>

<style>
</style>
