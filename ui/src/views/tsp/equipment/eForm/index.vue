<template>
  <div class="app-container">
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="600px"
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="cancel"
    >
      <el-row>
        <el-form :model="queryParams">
          <el-col :span="6">
            <el-form-item label="设备SN" label-width="80px" v-if="(1 === 0)">
              <el-input
                v-model="queryParams.sn"
                placeholder="sn"
                :disabled="this.title === '设备详情'"
                clearable
                v-if="(1 === 0)"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <el-form ref="form" :model="form" :rules="rules" label-width="200px">
        <el-row>
          <el-col :span="20">
            <el-form-item
              label="选择设备分类"
              prop="tspEquipmentModelId"
              label-width="110px"
            >
              <el-cascader
                v-model="choose"
                style="width: 240px"
                :key="newKey"
                :disabled="this.title === '设备详情'"
                :options="selectList"
                @change="optChange"
                clearable
              >
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="设备SN" prop="sn" label-width="110px">
              <el-input
                v-model="form.sn"
                style="width: 240px"
                placeholder="请输入设备SN"
                :disabled="this.title === '设备详情'"
                maxlength="24"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="ICCID" prop="iccId" label-width="110px">
              <el-input
                v-model="form.iccId"
                style="width: 240px"
                placeholder="请输入ICCID"
                :disabled="this.title === '设备详情'"
                maxlength="19"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="IMSI" prop="imsi" label-width="110px">
              <el-input
                v-model="form.imsi"
                style="width: 240px"
                placeholder="请输入IMSI"
                :disabled="this.title === '设备详情'"
                maxlength="15"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="SIM" prop="sim" label-width="110px">
              <el-input
                v-model="form.sim"
                style="width: 240px"
                placeholder="请输入SIM"
                :disabled="this.title === '设备详情'"
                maxlength="11"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="IMEI" prop="imei" label-width="110px">
              <el-input
                v-model="form.imei"
                style="width: 240px"
                placeholder="请输入IMEI"
                :disabled="this.title === '设备详情'"
                maxlength="15"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="17">
            <el-form-item label="版本号" prop="version" label-width="110px">
              <el-input v-model="form.version"  style="width: 240px" :disabled="this.title === '设备详情'" placeholder="请输入版本号" clearable/>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="17">
            <el-form-item label="设备类型-型号" prop="name" label-width="110px">
              <el-input v-model="form.name" placeholder="请输入设备类型-型号" />
            </el-form-item>
          </el-col> -->
        </el-row>
        <el-row>
          <el-col :span="14">
            <el-form-item
              label="批次流水号"
              prop="serialNumber"
              label-width="110px"
            >
              <el-input
                v-model="form.serialNumber"
                style="width: 240px"
                placeholder="请输入批次流水号"
                :disabled="this.title === '设备详情'"
                maxlength="24"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item
              label="供应商代码"
              prop="supplierCode"
              label-width="110px"
            >
              <el-input
                v-model="form.supplierCode"
                style="width: 240px"
                placeholder="请输入供应商代码"
                :disabled="this.title === '设备详情'"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="运营商" prop="operator" label-width="110px">
              <el-select v-model="form.operator" style="width: 240px" placeholder="请选择运营商" :disabled="this.title === '设备详情'" clearable>
                <el-option label="移动" :value="1"></el-option>
                <el-option label="联通" :value="2"></el-option>
                <el-option label="电信" :value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="14">
            <el-form-item label="在线状态" prop="isOnline" label-width="110px">
              <el-radio-group v-model="form.isOnline" @change="handleRadio">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col> -->
        </el-row>
        <el-row>
          <el-col :span="14">
            <el-form-item
              label="是否为终端"
              prop="isTerminal"
              label-width="110px"
            >
              <el-radio-group v-model="form.isTerminal" style="width: 240px" @change="handleRadio" :disabled="this.title === '设备详情'">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item
              label="注册状态"
              prop="isRegister"
              label-width="110px"
            >
              <el-radio-group v-model="form.isRegister" style="width: 240px" @change="handleRadio" :disabled="this.title === '设备详情'">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="14">
            <el-form-item label="报废状态" prop="isScrap" label-width="110px">
              <el-radio-group v-model="form.isScrap" @change="handleRadio">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col> -->
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" v-show="this.title != '设备详情'">确 定</el-button>
        <el-button type="primary" @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { add, edit } from '@/api/tsp/equipment.js'
import { selectList } from '@/api/tsp/equipmentType.js'

export default {
  name: "eForm",
  data() {
    var iccIdValid = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("ICCID长度为19位由字母或数字组成"));
      } else {
        var chrnum = /^[0-9A-Za-z]{19}$/;
        if (!chrnum.test(value)) {
          callback(new Error("ICCID长度为19位由字母或数字组成"));
        }
        callback();
      }
    };
    var snValid = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("设备SN不得超过24位、区分大小写"));
      } else {
        var chrnum = /^\w{1,24}$/;
        if (!chrnum.test(value)) {
          callback(new Error("设备SN不得超过24位、区分大小写"));
        }
        callback();
      }
    };
    var serialNumberValid = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("批次流水号不得超过24位、区分大小写"));
      } else {
        var chrnum = /^\w{1,24}$/;
        if (!chrnum.test(value)) {
          callback(new Error("批次流水号不得超过24位、区分大小写"));
        }
        callback();
      }
    };
    var versionValid = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("版本号格式错误,版本号格式应为X-X-X组成"));
      } else {
        var chrnum = /^([0-9A-Za-z]){1,10}(-([0-9A-Za-z]){1,10}){2}$/;
        if (!chrnum.test(value)) {
          callback(new Error("版本号格式错误,版本号格式应为X-X-X组成"));
        }
        callback();
      }
    };
    return {
      newKey: 0,
      choose: [],
      // 弹出层标题
      title: "新增设备",
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {},
      // 下拉列表
      selectList: [],
      queryParams:{
        pageNum: 1,
        pageSize: 10,
      },
      // 表单校验
      rules: {
        tspEquipmentModelId: [
          { required: true, message: "设备分类不能为空", trigger: "blur" },
        ],
        sn: [
          {
            required: true,
            message: "设备SN不得超过24位、区分大小写",
            trigger: "blur",
          },
          {
            min: 1,
            max: 24,
            message: "设备SN不得超过24位、区分大小写",
            trigger: "blur",
          },
          // { required: true, message: "设备SN不能为空", trigger: "blur" },
          { required: true, validator: snValid, trigger: "blur" },
        ],
        serialNumber: [
          {
            required: true,
            message: "批次流水号不得超过24位、区分大小写",
            trigger: "blur",
          },
          {
            min: 1,
            max: 24,
            message: "批次流水号不得超过24位、区分大小写",
            trigger: "blur",
          },
          { required: true, validator: serialNumberValid, trigger: "blur" },
        ],
        version: [
          { required: true, message: "请输入版本号", trigger: "blur" },
          { required: true, validator: versionValid, trigger: "blur" },
        ],
        imsi: [
          {
            required: true,
            message: "IMSI只能由不超过15位的数字组成",
            trigger: "blur",
          },
          {
            min: 3,
            max: 15,
            message: "IMSI只能由不超过15位的数字组成",
            trigger: "blur",
          },
          {
            pattern: /^[0-9]\d*$/,
            message: "IMSI只能由不超过15位的数字组成",
            trigger: "change",
          },
        ],
        sim: [
          {
            required: true,
            message: "SIM长度必须为11位的整数",
            trigger: "blur",
          },
          {
            min: 11,
            max: 11,
            message: "SIM长度必须为11位的整数",
            trigger: "blur",
          },
          {
            pattern: /^[0-9]\d*$/,
            message: "SIM长度必须为11位的整数",
            trigger: "change",
          },
        ],
        iccId: [
          {
            required: true,
            message: "ICCID长度为19位由字母或数字组成",
            trigger: "blur",
          },
          { validator: iccIdValid, trigger: "blur" },
        ],
        imei: [
          {
            required: true,
            message: "IMEI必须长度为15位数字组成",
            trigger: "blur",
          },
          {
            min: 15,
            max: 15,
            message: "IMEI必须长度为15位数字组成",
            trigger: "blur",
          },
          {
            pattern: /^[0-9]\d*$/,
            message: "IMEI必须长度为15位数字组成",
            trigger: "change",
          },
        ],
        // name: [
        //   { required: true, message: "设备类型不能为空", trigger: "blur" },
        //   {
        //     min: 2,
        //     max: 20,
        //     message: "设备类型长度必须介于 2 和 20 之间",
        //     trigger: "blur",
        //   },
        // ],
        extraType: [
          { required: true, message: "请输入扩展信息类型", trigger: "blur" },
        ],
        supplierCode: [
          { required: true, message: "请输入供应商代码", trigger: "blur" },
        ],
        operator: [
          { required: true, message: "请输入运营商", trigger: "change" },
        ],
      },
    };
  },
  watch: {},
  created() {},
  methods: {
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.title === "新增设备") {
            console.log(this.form);
            add(this.form).then((res) => {
              if (res.code === 200) {
                this.$modal.msgSuccess("操作成功");
                this.$parent.getList();
                this.cancel();
              }
            });
          } else {
            console.log(this.form);
            edit(this.form).then((res) => {
              if (res.code === 200) {
                this.$modal.msgSuccess("操作成功");
                this.$parent.getList();
                this.cancel();
              }
            });
          }
        }
      });
    },
    // 下拉列表
    getSelectList() {
      selectList(this.queryParams).then((res) => {
        this.selectList = res.result;
      });
    },
    optChange(val) {
      console.log(val);
      this.choose = val;
      this.form.tspEquipmentModelId = val[2];
    },
    // 表单重置
    reset() {
      this.form = {};
      this.choose = [];
      this.resetForm("form");
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    handleRadio(val) {
      console.log(val);
    },
  },
};
</script>
<style scoped>
/* .el-form--inline .el-form-item {
  margin-bottom: 22px;
} */
</style>
