<template>
  <div>
    <el-dialog title="实名结果查询" :visible.sync="open" :before-close="onClose">
      <el-form v-model="form" ref="authenticationForm">
        <el-row>
          <el-col :span="8">
            <el-form-item label="VIN" label-width="110px" prop="vin">
              <el-input v-model="form.vin" disabled maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车牌号" label-width="110px" prop="plateCode">
              <el-input v-model="form.plateCode" disabled maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="SIM卡号" label-width="110px" prop="sim">
              <el-input v-model="form.sim" disabled maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="运营商" label-width="110px" prop="operator">
              <el-input v-model="form.operator" disabled maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="个人或单位实名名称"
              label-width="110px"
              prop="partyName"
            >
              <el-input v-model="form.partyName" disabled maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="个人或单位实名证件编码"
              label-width="110px"
              prop="certNum"
            >
              <el-input v-model="form.certNum" disabled maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备sn" label-width="110px" prop="sn">
              <el-input v-model="form.sn" disabled maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备ICCID" label-width="110px" prop="iccid">
              <el-input v-model="form.iccid" disabled maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备IMEI" label-width="110px" prop="imei">
              <el-input v-model="form.imei" disabled maxlength="30" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row>
        <el-divider></el-divider>
        <el-col :span="8" :offset="1">
          <span style="font-size: 20px">实名结果</span>
        </el-col>
        <el-table :data="resultList" style="width: 100%">
          <el-table-column prop="CertNum" label="实名认证证件编码"></el-table-column>
          <el-table-column prop="ICCID" label="ICCID"></el-table-column>
          <el-table-column prop="PartyName" label="实名认证真实姓名"></el-table-column>
        </el-table>
        <el-col style="margin-top: 10px; text-align: right" >
          <el-button @click="onClose" type="primary">关 闭</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "authenticationForm",
  data() {
    return {
      form: {},
      resultList: [{}],
      open: false,
    };
  },
  created() {
  },
  methods: {
    onOpen(form, resultList) {
      this.form = form;
      this.resultList = resultList;
      this.open = true;
    },

    onClose() {
      this.open = false;
    },
  },
};
</script>

<style>
</style>
