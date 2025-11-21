<template>
  <div>
    <el-dialog title="历史绑定记录" :visible.sync="open" :before-close="close">
      <el-form v-model="form" ref="bindForm">
        <!-- <el-row>
          <el-col :span="8">
            <el-form-item label="电话号码" label-width="110px" prop="form.mobile">
              <el-input v-model="form.mobile" disabled maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="真实姓名" label-width="110px" prop="realName">
              <el-input v-model="form.realName" disabled maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="身份证号" label-width="110px" prop="idCard">
              <el-input v-model="form.idCard" disabled maxlength="30" />
            </el-form-item>
          </el-col>
        </el-row> -->
      </el-form>
      <el-row>
        <!-- <el-divider></el-divider>
        <el-col :span="8" :offset="1">
          <span style="font-size: 20px">历史绑定记录</span>
        </el-col> -->
        <el-table :data="resultList" style="width: 100%">
          <el-table-column prop="mobile" label="电话号码">
          </el-table-column>
          <el-table-column prop="realName" label="真实姓名">
          </el-table-column>
          <el-table-column prop="idCard" label="证件编码"> </el-table-column>
        </el-table>
        <el-col style="margin-top: 10px; text-align: right" >
          <el-button @click="close" type="primary">关 闭</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "bindForm",
  data() {
    return {
      form: {},
      resultList: [{}],
      open: false,
      prefix: undefined,
    };
  },
  created() {
    console.log(this.form);
    this.prefix = process.env.VUE_APP_BASE_API;
  },
  methods: {
    close() {
      this.open = false;
    },
  },
};
</script>

<style>
</style>
