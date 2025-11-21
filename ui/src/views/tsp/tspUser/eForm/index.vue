<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="700px"
      append-to-body
      :before-close="cancel"
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="16">
            <el-form-item label="车主姓名" prop="realName" label-width="110px" style="width: 400px">
              <el-input
                :disabled="this.title === '查看详情'"
                v-model="form.realName"
                clearable
                placeholder="请输入车主姓名"
                maxlength="8"
              />
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item
              label="手机号(账号)"
              prop="mobile"
              label-width="110px"
              style="width: 400px"
            >
              <el-input
                :disabled="this.title === '查看详情'"
                v-model="form.mobile"
                clearable
                placeholder="请输入手机号(账号)"
                maxlength="11"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="身份证号" prop="idCard" label-width="110px" style="width: 400px">
              <el-input
                v-model="form.idCard"
                clearable
                maxlength="18"
                placeholder="请输入身份证号"
                :disabled="this.title === '查看详情'"
              />
            </el-form-item>
          </el-col>
          <el-col :span="17">
            <el-form-item label="出生日期" prop="birthday" label-width="110px">
              <el-date-picker
                :disabled="this.title === '查看详情'"
                v-model="form.birthday"
                style="width: 292px"
                clearable
                type="date"
                placeholder="选择日期时间"
                value-format="yyyy-MM-dd"
                :picker-options="disableTime"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="14">
            <el-form-item label="车主性别" prop="sex" label-width="110px" style="width: 400px">
              <el-radio-group v-model="form.sex" @change="handleRadio">
                <el-radio :label="1" :disabled="this.title === '查看详情'"
                  >男</el-radio
                >
                <el-radio :label="2" :disabled="this.title === '查看详情'"
                  >女</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="14">
            <el-form-item
              label="注册地址"
              prop="isTerminal"
              label-width="110px"
            >
              <el-cascader
                v-model="form.isTerminal"
                style="width: 292px"
                :key="newKey"
                :disabled="this.title === '查看详情'"
                :props="cascaderProps"
                @change="areaChange"
                clearable
                v-if="showCascader"
              >
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="详细地址" prop="address" label-width="110px" style="width: 400px">
              <el-input
                :disabled="this.title === '查看详情'"
                v-model="form.address"
                clearable
                placeholder="请输入详细地址"
                maxlength="30"
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
            <el-form-item label="用户标签" prop="label" label-width="110px" style="width: 400px">
              <el-select
                v-model="form.label"
                multiple
                placeholder="请选择"
                :disabled="this.title === '查看详情'"
                style="width: 100%"
                clearable
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
              label="请上传手持身份证正面照片"
              label-width="110px"
            >
              <el-upload
                style="display: inline-block;"
                :disabled="this.title === '查看详情'"
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
                :disabled="this.title === '查看详情'"
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
import { add, edit, get } from "@/api/tsp/user.js";
import { getToken } from "@/utils/auth";
import { getLabel } from "@/api/tsp/tag.js";
import { cityTrees, areaTrees, provincesTrees } from "@/api/tsp/provinces.js";
export default {
  name: "eForm",
  data() {
    return {
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {
        isTerminal: [],
      },
      wid: "",
      dialogImageUrl: "",
      dialogVisible: false,
      fileFrontList: [],
      fileBackList: [],
      //获取时间>当前时间设置为不可选
      disableTime:{
        disabledDate(time){
        return time.getTime() > Date.now();
        }
      },
      imgUpload: {
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        url: process.env.VUE_APP_BASE_API + `/tsp/vehicle/upload/${4}`,
        imgUrls: [],
      },
      newKey: 1,
      labelList:[{}],
      areas: [],
      cascaderProps: {
        //checkStrictly: true,// 父子节点是否互相关联,其余配置见官网
        lazy: true,
        lazyLoad: this.lazyLoad,
      },
      // 表单校验
      rules: {
        realName: [
          { required: true, message: "车主姓名不能为空", trigger: "blur" },
          {
            min: 2,
            max: 8,
            message: "姓名必须介于 2 和 8 之间",
            trigger: "blur",
          },
        ],
        mobile: [
          { required: true, message: "手机号不能为空", trigger: "change" },
          {
            min: 11,
            max: 11,
            message: "手机号长度必须是11位",
            trigger: "blur",
          },
        ],
        idCard: [
          // { required: true, message: "身份证长度应在17位或18位,由数值或数值加X组成", trigger: "blur" },
          { required: true, message: "请输入身份证号", trigger: "change" },
          {
            min: 18,
            max: 18,
            message: "身份证长度为18位,由数值或数值加X组成",
            trigger: "change",
          },
        ],
        isTerminal: [
          { required: true, message: "注册地址不能为空", trigger: "change" },
        ],
        label: [
          { required: true, message: "用户标签不能为空", trigger: "blur" },
        ],
      },
      showCascader: true,
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
  },
  created() {
    console.log(this.title);
    console.log(this.wid);
    this.getLabel();
  },

  methods: {
    lazyLoad(node, resolve) {
      this.getHospital(node, resolve);
    },
    getHospital(node, resolve) {
      const { level } = node;
      setTimeout(() => {
        // 第一级
        if (level === 0) {
          provincesTrees().then((res) => {
            const nodes = res.result.map((i, index1) => ({
              value: '0' + i.value,  //加'0'解决子选项有value值相同时赋初值无法正常显示BUG
              label: i.label,
              leaf: level >= 1,
            }));
            resolve(nodes);
          });
        }
        //第二级
        if (node.level === 1) {
          cityTrees(node.value.substring(1)).then((res) => {
            const nodes = res.result.map((item, index2) => ({
              value: '1' + item.value,  //加'1'解决子选项有value值相同时赋初值无法正常显示BUG
              label: item.label,
              leaf: node.level >= 2,
            }));
            resolve(nodes);
          });
        }
        //第三级
        if (node.level === 2) {
          areaTrees(node.value.substring(1)).then((res) => {
            const nodes = res.result.map((j, index3) => ({
              value: '2' + j.value,  //加'2'解决子选项有value值相同时赋初值无法正常显示BUG
              label: j.label,
              leaf: node.level >= 1,
            }));
            resolve(nodes);
          });
        }
      }, 200);
    },
    getLabel(){
      getLabel(0).then((res) => {
        console.log(res);
        this.labelList = res.result;
        console.log(this.labelList);
      })
    },
    areaChange(val) {
      if (val) {
        this.form.province = val[0].substring(1);
        this.form.city = val[1].substring(1);
        this.form.area = val[2].substring(1);
        console.log(this.form.isTerminal, this.form.province, this.form.city, this.form.area);
      }
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.title === "新增账户") {
            console.log(this.form);
            add(this.form).then((res) => {
              this.$modal.msgSuccess("操作成功");
              this.$parent.getList();
              this.cancel();
            });
          } else {
            console.log(this.form);
            edit(this.form).then((res) => {
              this.$modal.msgSuccess("操作成功");
              this.$parent.getList();
              this.cancel();
            });
          }
        }
      });
    },
    // 表单重置
    reset() {
      this.form =  {
        isTerminal: [],
      };
      this.areas = [];
      this.newKey = 1;
      this.fileFrontList = [];
      this.fileBackList = [];
      this.resetForm("form");
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.showCascader = false;
      this.reset();
    },

    openDialog() {
      this.showCascader = true;
      this.open = true;
    },

    handleRadio() {},
    handleChange() {},
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
  },
};
</script>

<style>
</style>
