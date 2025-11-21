<template>
  <div class="app-container">
    <el-row>
      <el-divider content-position="left">上牌信息</el-divider>
    </el-row>
    <el-form
      ref="upPlaceForm"
      :model="form"
      :rules="upPlaceFormRules"
      label-width="80px"
    >
      <el-row>
        <el-col :span="6" :offset="0">
          <el-form-item
            label="车管所名称"
            label-width="110px"
            prop="awardPlaceName"
          >
            <el-input
              v-model="form.awardPlaceName"
              :disabled="this.$props.title === '查看详情'"
              type="input"
              placeholder="请输入车管所名称"
              maxlength="30"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="7" :offset="1">
          <el-form-item label="上牌地" label-width="110px" prop="awardAreaList">
            <el-tooltip :content="form.awardProvince + '/' + form.awardCity + '/' + form.awardArea" placement="top" effect="light">
              <el-cascader
                :key="newKey"
                v-model="awardAreaList"
                :disabled="this.$props.title === '查看详情'"
                :props="cascaderProps"
                @change="areaChange"
                style="width: 100%"
                filterable
                clearable
              >
              </el-cascader>
            </el-tooltip>
          </el-form-item>
        </el-col>
        <el-col :span="6" :offset="1">
          <el-form-item
            label="注册详细地址"
            label-width="110px"
            prop="awardPlaceAddress"
          >
            <el-input
              v-model="form.awardPlaceAddress"
              :disabled="this.$props.title === '查看详情'"
              type="textarea"
              placeholder="请输入注册详细地址"
              maxlength="30"
              autosize
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6" :offset="0">
          <el-form-item
            label="上牌日期"
            label-width="110px"
            prop="currentUpPlaceDate"
          >
            <el-date-picker
              :disabled="this.$props.title === '查看详情'"
              v-model="form.currentUpPlaceDate"
              :picker-options="forbiddenTime"
              style="width: 100%"
              type="date"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd"
              clearable
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="7" :offset="1">
          <el-form-item label="车牌颜色" label-width="110px" prop="plateColour">
            <el-select
              v-model="form.plateColour"
              placeholder="请选择车牌颜色"
              :disabled="this.$props.title === '查看详情'"
              style="width: 100%"
              clearable
            >
              <el-option label="蓝色" value="蓝色"></el-option>
              <el-option label="黄色" value="黄色"></el-option>
              <el-option label="白色" value="白色"></el-option>
              <el-option label="黑色" value="黑色"></el-option>
              <el-option label="绿色" value="绿色"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" :offset="1">
          <el-form-item
            label="车牌号"
            label-width="110px"
            prop="plateCodeName"
          >
            <div v-if="this.$props.title === '查看详情'">
              <el-input
                :value="form.plateCodeName !== null ? form.plateCodeName + '  ' + form.plateCode : null"
                :disabled="this.$props.title === '查看详情'"
                >
              </el-input>
            </div>
            <div  v-if="this.$props.title !== '查看详情'" class="code-box">
              <el-select
                v-model="form.plateCodeName"
                placeholder="地区"
                :disabled="this.$props.title === '查看详情'"
                clearable
                @change="changePlateCodeName"
              >
                <el-option
                  v-for="item in plateCodeNameOpt"
                  :key="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <el-form-item  prop="plateCode" style="margin-bottom: auto">
                <el-input
                  :disabled="this.$props.title === '查看详情'"
                  type="input"
                  v-model="form.plateCode"
                  placeholder="请输入车牌号"
                  maxlength="30"
                  onkeyup="this.value = this.value.replace(/[^\a-\z\A-\Z0-9]/g,'');"
                  clearable
                />
              </el-form-item>
            </div>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="7">
          <el-form-item label="车牌号" label-width="110px" prop="plateCode">
            <el-input
              :disabled="this.$props.title === '查看详情'"
              type="input"
              v-model="form.plateCode"
              placeholder="请输入车牌号"
              maxlength="30"
              onkeyup="this.value = this.value.replace(/[^\a-\z\A-\Z0-9]/g,'');"
            />
          </el-form-item>
        </el-col> -->
        <el-col :span="15">
          <el-form-item
            label="上传车辆照片"
            label-width="110px"
            prop="plateImgUrls"
          >
            <el-upload
              :disabled="this.$props.title === '查看详情'"
              :action="this.imgUpload.url"
              :headers="this.imgUpload.headers"
              :limit="5"
              list-type="picture-card"
              :file-list="fileList"
              :on-success="handleAvatarSuccess"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible" append-to-body>
              <img width="100%" :src="dialogImageUrl" alt="" />
            </el-dialog>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import { provincesTrees, areaTrees, cityTrees } from '@/api/tsp/provinces.js'

export default {
  name: "UpPlace",
  props: {
    form: { type: Object },
    // form: {  },
    title: { type: String },
  },


  data() {
    return {
      newKey: 1,
      upPlaceFormRules: {
        awardPlaceName: [
          { required: true, message: "车管所名称不能为空", trigger: "blur" },
        ],
        plateColour:[
          { required: true, message: "车牌颜色不能为空",trigger:"blur"}
        ],
        // plateCode:[
        //   { required: true, message: "车牌号不能为空",trigger:"blur"}
        // ],
        // plateCodeName:[
        //   { required: true, message: "车牌地区不能为空",trigger:"blur"}
        // ],
      },
      // 车牌地区
      plateCodeNameOpt: [
        { label: "京", value: "京" },
        { label: "津", value: "津" },
        { label: "沪", value: "沪" },
        { label: "新", value: "新" },
        { label: "藏", value: "藏" },
        { label: "宁", value: "宁" },
        { label: "港", value: "港" },
        { label: "澳", value: "澳" },
        { label: "吉", value: "吉" },
        { label: "辽", value: "辽" },
        { label: "晋", value: "晋" },
        { label: "青", value: "青" },
        { label: "鲁", value: "鲁" },
        { label: "豫", value: "豫" },
        { label: "苏", value: "苏" },
        { label: "皖", value: "皖" },
        { label: "浙", value: "浙" },
        { label: "闽", value: "闽" },
        { label: "赣", value: "赣" },
        { label: "湘", value: "湘" },
        { label: "鄂", value: "鄂" },
        { label: "粤", value: "粤" },
        { label: "琼", value: "琼" },
        { label: "甘", value: "甘" },
        { label: "陕", value: "陕" },
        { label: "黔", value: "黔" },
        { label: "滇", value: "滇" },
        { label: "川", value: "川" },
      ],
      cascaderProps: {
        //checkStrictly: true,// 父子节点是否互相关联,其余配置见官网
        lazy: true,
        lazyLoad: this.lazyLoad,
      },
      // 遮罩层
      loading: true,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      //获取时间>当前时间为不可选
      forbiddenTime: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      total: 0,
      fileList: [],
      upPlaceForm: {},
      dialogImageUrl: "",
      dialogVisible: false,
      imgUpload: {
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        url: process.env.VUE_APP_BASE_API + `/tsp/vehicle/upload/${2}`,
        imgUrls: [],
      },
      awardAreaList: [],
    };
  },
  watch: {
    newKey: {
      //只要监听到数据源发生变化 ，改变keyValue的值，达到重新渲染的效果
      optionsMts() {
        console.log(this.newKey);
        this.newKey++;
      },
    },

    //监听上传图片发生变化，达到重写渲染的结果
    form(nv, ov) {
      this.fileList = [];
      for (let index = 0; this.form.plateImgUrls && index < this.form.plateImgUrls.length; index++) {
        this.fileList.push({
          url: process.env.VUE_APP_BASE_API + this.form.plateImgUrls[index],
        });
        this.imgUpload.imgUrls.push(this.form.plateImgUrls[index]);
      }
    }
  },
  created() {
    console.log(this.form);
    //  这个是图片的
    this.fileList = [];
    for (let index = 0; this.form.plateImgUrls && index < this.form.plateImgUrls.length; index++) {
      if(this.form.plateImgUrls[index]!=null){
        this.fileList.push({
          url: process.env.VUE_APP_BASE_API + this.form.plateImgUrls[index],
        });
        this.imgUpload.imgUrls.push(this.form.plateImgUrls[index]);
      }
    }
    console.log(this.fileList);

    this.awardAreaList = ['0' + this.form.awardProvince, '1' +this.form.awardCity, '2' + this.form.awardArea];
  },

  methods: {
    lazyLoad(node, resolve) {
      this.getHospital(node, resolve);
    },
    getHospital(node, resolve) {
      console.log(this.form);
      const { level } = node;
      console.log(level);
      setTimeout(() => {
        // 第一级
        if (level == 0) {
          provincesTrees().then((res) => {
            const nodes = res.result.map((i, index0) => ({
              value: '0' + i.value,  //加'0'解决子选项有value值相同时赋初值无法正常显示BUG
              label: i.label,
              leaf: level >= 1,
            }));
            resolve(nodes);
          });
        }
        //第二级
        if (node.level == 1) {
          cityTrees(node.value.substring(1)).then((res) => {
            const nodes = res.result.map((item, index1) => ({
              value: '1' + item.value,
              label: item.label,
              leaf: node.level >= 2,
            }));
            resolve(nodes);
          });
        }
        //第二级
        if (node.level == 2) {
          areaTrees(node.value.substring(1)).then((res) => {
            const nodes = res.result.map((item2, index2) => ({
              value: '2' + item2.value,
              label: item2.label,
              leaf: node.level >= 1,
            }));
            resolve(nodes);
          });
        }
      }, 200);
    },
    //⼦组件校验，传递到⽗组件
    validateForm() {
      let flag = null;

      console.log(this.upPlaceForm)
      this.$refs.upPlaceForm.validate((valid) => {

        if (valid) {
          flag = true;
        } else {
          flag = false;
        }
      });
      return flag;
    },
    areaChange(val) {
      console.log(val);
      if(val) {
        this.form.awardProvince = val[0].substring(1);;
        this.form.awardCity = val[1].substring(1);;
        this.form.awardArea = val[2].substring(1);;
      }
    },
    handleUpdate() {},
    handleRadio(val) {},
    handleRemove(file, list) {
      console.log("删除", file);

      let remainingImgUrls = [];
      for (let index = 0; this.form.plateImgUrls && index < this.form.plateImgUrls.length; index++) {
        if (file.url.indexOf(this.form.plateImgUrls[index]) === -1) {
          remainingImgUrls.push(this.form.plateImgUrls[index]);
        }
      }
      this.imgUpload.imgUrls = remainingImgUrls;
      this.form.plateImgUrls = this.imgUpload.imgUrls;
    },
    // handlePictureCardPreview(file) {
    //   console.log("点击了预览按钮");
    // },
    handleAvatarSuccess(response, file, fileList) {
      console.log(response);
      this.imgUpload.imgUrls.push(response.result);
      this.form.plateImgUrls = this.imgUpload.imgUrls;
      fileList[this.form.plateImgUrls.length - 1].url = process.env.VUE_APP_BASE_API + response.result;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },

    changePlateCodeName(val) {
      this.form.plateCode = null;
    }
  },
};
</script>

<style rel="stylesheet/scss" lang="scss">
.code-box {
  display: -webkit-flex;
  display: flex;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  max-height: 40px;
  overflow: hidden;
  .el-input__inner {
    border: none;
  }
  .el-select {
    width: 80px;
    background-color: #f4f4f4;
    .el-input__inner {
      padding: 0 15px;
      background: none;
    }
  }
}
</style>
