<template>
  <div class="app-container">
    <el-row>
      <el-divider content-position="left">车主绑定信息</el-divider>
    </el-row>
    <el-form
      ref="bindForm"
      :model="form"
      :rules="bindFormRules"
      label-width="80px"
    >
      <el-row>
        <el-col :span="7" :offset="2">
          <el-form-item label="车主手机号" label-width="110px" prop="mobile">
            <el-input
              onkeyup="this.value = this.value.replace(/[^\d]/g,'');"
              :disabled="this.$props.title === '查看详情'"
              style="width: 200px;"
              v-model="form.mobile"
              placeholder="请输入车主手机号"
              maxlength="11"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="车主姓名" label-width="110px" prop="realName">
            <el-input
              :disabled="this.$props.title === '查看详情'"
              v-model="form.realName"
              style="width: 200px;"
              placeholder="请输入车主姓名"
              maxlength="30"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="车主身份证号" label-width="130px" prop="idCard">
            <el-input
              :disabled="this.$props.title === '查看详情'"
              v-model="form.idCard"
              style="width: 200px;"
              placeholder="请输入车主身份证号"
              maxlength="18"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="7" :offset="2">
          <el-form-item
            label="请上传手持身份证正面照片"
            label-width="110px"
            prop="cardFrontImg"
          >
            <el-upload
              :disabled="this.$props.title === '查看详情'"
              v-model="this.form.cardFrontImg"
              :action="this.imgUpload.url"
              :headers="this.imgUpload.headers"
              list-type="picture-card"
              :limit="1"
              :file-list="this.fileFrontList"
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
        <el-col :span="7">
          <el-form-item
            label="请上传手持身份证反面照片"
            label-width="110px"
            prop="cardBackImg"
          >
            <el-upload
              :disabled="this.$props.title === '查看详情'"
              v-model="this.form.cardBackImg"
              :action="this.imgUpload.url"
              :headers="this.imgUpload.headers"
              list-type="picture-card"
              :limit="1"
              :file-list="this.fileBackList"
              :on-preview="handlePictureBackPreview"
              :on-success="handleBackSuccess"
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
    <el-row>
      <el-divider content-position="left">绑定记录</el-divider>
    </el-row>
    <el-row>
      <el-col>
        <el-table :data="useVehicleRecordList">
          <el-table-column label="序号" type="index" width="50" align="center">
            <template slot-scope="scope">
              <span>{{
                (queryParams.pageNum - 1) * queryParams.pageSize +
                scope.$index +
                1
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="手机号" align="center" prop="mobile" />
          <el-table-column label="车主姓名" align="center" prop="realName" />
          <el-table-column label="身份证号" align="center" prop="idCard" />
          <el-table-column label="操作用户" align="center" prop="updateBy" />
          <el-table-column label="操作时间" align="center" prop="updateTime" />
<!--          <el-table-column label="操作内容" align="center" prop="remark" />-->
        </el-table>
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
import { getToken } from '@/utils/auth'
import { list } from '@/api/tsp/useVehicleRecord.js'

export default {
  name: "bind",
  props: {
    form: { type: Object },
    title: { type: String },
  },

  data() {
    let cardIdNo = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('身份证长度为18位,由数值或数值加X组成'));
      } else {
        let reg = /((^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$))/;
        if (!reg.test(value)) {
          callback(new Error('身份证长度为18位,由数值或数值加X组成'));
        } else {
          callback();
        }
      }
    };
    return {
      bindFormRules: {
        mobile: [
          { required: true, message: "请输入11位阿拉伯数字", trigger: "blur" },
          {
            min: 11,
            max: 11,
            message: "请输入11位阿拉伯数字",
            trigger: "blur",
          },
        ],
        realName: [
          { required: true, message: "请输入姓名", trigger: "change" },
          {
            min: 1,
            message: "姓名不能为空",
            trigger: "blur",
          },
        ],
        idCard: [
          // { required: true, message: "身份证长度应在17位或18位,由数值或数值加X组成", trigger: "blur" },
          { required: true, trigger: 'blur', validator: cardIdNo },
          {
            min: 18,
            max: 18,
            message: "身份证长度为18位,由数值或数值加X组成",
            trigger: "blur",
          },
        ],
      },
      // 遮罩层
      loading: true,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      dialogImageUrl: "",
      dialogVisible: false,
      imgUpload: {
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        url: process.env.VUE_APP_BASE_API + `/tsp/vehicle/upload/${3}`,
      },
      total: 0,
      bindTitle: "",
      bindForm: {},
      bindList: [],
      fileFrontList: [],
      fileBackList: [],
      useVehicleRecordList: [],
    };
  },
  created() {
    this.openAndInit();
  },
  methods: {
    openAndInit() {
      this.fileFrontList = [];
      if (this.form.cardFrontImg && this.form.cardFrontImg !== "") {
        this.fileFrontList.push({
          url: process.env.VUE_APP_BASE_API + this.form.cardFrontImg,
        });
      }
      this.fileBackList = [];
      if (this.form.cardBackImg && this.form.cardBackImg !== "") {
        this.fileBackList.push({
          url: process.env.VUE_APP_BASE_API + this.form.cardBackImg,
        });
      }

      if (this.$props.title !== '新增车辆') {
        this.getList();
      }
    },

    //⼦组件校验，传递到⽗组件
    validateForm() {
      let flag = null;
      this.$refs.bindForm.validate((valid) => {
        if (valid) {
          flag = true;
        } else {
          flag = false;
        }
      });
      return flag;
    },
    getList() {
      this.loading = true;
      this.queryParams.tspVehicleId = this.form.tspVehicleId;
      list(this.queryParams).then((res) => {
        this.useVehicleRecordList = res.result.list;
        console.log(this.useVehicleRecordList)
        this.total = res.result.total;
        this.loading = false;
      });
    },
    handleUpdate() {},
    handleRadio(val) {},
    // 点击切换条数
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.queryParams.pageSize = val;
      this.getList();
    },
    // 点击页数
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      //
      this.queryParams.pageNum = val;
      this.getList();
    },
    handleAvatarSuccess(file, fileList) {
      console.log(file);
      this.form.cardFrontImg = file.result;
    },
    handleRemove(file) {
      console.log("删除");
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleBackSuccess(file) {
      this.form.cardBackImg = file.result;
      console.log(file);
    },
    handlePictureBackPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
  },
};
</script>

<style>
</style>
