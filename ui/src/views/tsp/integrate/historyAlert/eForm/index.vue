<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="1200px"
      append-to-body
      :before-close="cancel"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-divider content-position="left">车辆信息</el-divider>
        <el-row>
          <el-col :span="8">
            <el-form-item label="VIN" prop="vin" label-width="110px">
              <el-input disabled v-model="form.vin" maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车主" prop="realName" label-width="110px">
              <el-input disabled v-model="form.realName" maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车牌号" prop="plateCode" label-width="110px">
              <el-input v-model="form.plateCode" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="left">报警信息</el-divider>
        <el-row>
          <el-col>
            <el-table :data="alertList" size="mini">
              <el-table-column
                label="序号"
                fixed="left"
                type="index"
                width="50"
                align="center"
              >
                <template slot-scope="scope">
                  <span>{{
                    scope.$index +
                    1
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="温度差异报警"
                align="center"
                width="130px"
                prop="generalAlarmSign"
              >
                <template slot-scope="scope">
                  {{ (scope.row.generalAlarmSign >>> 0) & 1 ? "报警" : "正常" }}
                </template>
              </el-table-column>
              <el-table-column
                label="电池高温报警"
                align="center"
                width="130px"
              >
                <template slot-scope="scope">
                  {{ (scope.row.generalAlarmSign >>> 1) & 1 ? "报警" : "正常" }}
                </template>
              </el-table-column>
              <el-table-column
                label="车载储能装置类型过压报警"
                width="130px"
                align="center"
              >
                <template slot-scope="scope">
                  {{ (scope.row.generalAlarmSign >>> 2) & 1 ? "报警" : "正常" }}
                </template>
              </el-table-column>
              <el-table-column
                label="车载储能装置类型欠压报警"
                width="130px"
                align="center"
              >
                <template slot-scope="scope">
                  {{ (scope.row.generalAlarmSign >>> 3) & 1 ? "报警" : "正常" }}
                </template>
              </el-table-column>
              <el-table-column label="SOC过低报警" align="center" width="130px">
                <template slot-scope="scope">
                  {{ (scope.row.generalAlarmSign >>> 4) & 1 ? "报警" : "正常" }}
                </template>
              </el-table-column>
              <el-table-column
                label="单体电池过压报警"
                align="center"
                width="130px"
              >
                <template slot-scope="scope">
                  {{ (scope.row.generalAlarmSign >>> 5) & 1 ? "报警" : "正常" }}
                </template>
              </el-table-column>
              <el-table-column
                label="单体电池欠压报警"
                align="center"
                width="130px"
              >
                <template slot-scope="scope">
                  {{ (scope.row.generalAlarmSign >>> 6) & 1 ? "报警" : "正常" }}
                </template>
              </el-table-column>
              <el-table-column label="SOC过高报警" align="center" width="130px">
                <template slot-scope="scope">
                  {{ (scope.row.generalAlarmSign >>> 7) & 1 ? "报警" : "正常" }}
                </template>
              </el-table-column>
              <el-table-column label="SOC跳变报警" align="center" width="130px">
                <template slot-scope="scope">
                  {{ (scope.row.generalAlarmSign >>> 8) & 1 ? "报警" : "正常" }}
                </template>
              </el-table-column>
              <el-table-column
                label="可充电储能系统不匹配报警"
                align="center"
                width="130px"
              >
                <template slot-scope="scope">
                  {{ (scope.row.generalAlarmSign >>> 9) & 1 ? "报警" : "正常" }}
                </template>
              </el-table-column>
              <el-table-column
                label="电池单体一致性差报警"
                align="center"
                width="130px"
              >
                <template slot-scope="scope">
                  {{
                    (scope.row.generalAlarmSign >>> 10) & 1 ? "报警" : "正常"
                  }}
                </template>
              </el-table-column>
              <el-table-column label="绝缘报警" align="center" width="130px">
                <template slot-scope="scope">
                  {{
                    (scope.row.generalAlarmSign >>> 11) & 1 ? "报警" : "正常"
                  }}
                </template>
              </el-table-column>
              <el-table-column
                label="DC-DC温度报警"
                align="center"
                width="130px"
              >
                <template slot-scope="scope">
                  {{
                    (scope.row.generalAlarmSign >>> 12) & 1 ? "报警" : "正常"
                  }}
                </template>
              </el-table-column>
              <el-table-column
                label="制动系统报警"
                align="center"
                width="130px"
              >
                <template slot-scope="scope">
                  {{
                    (scope.row.generalAlarmSign >>> 13) & 1 ? "报警" : "正常"
                  }}
                </template>
              </el-table-column>
              <el-table-column
                label="DC-DC状态报警"
                align="center"
                width="130px"
              >
                <template slot-scope="scope">
                  {{
                    (scope.row.generalAlarmSign >>> 14) & 1 ? "报警" : "正常"
                  }}
                </template>
              </el-table-column>
              <el-table-column
                label="驱动电机控制器温度报警"
                align="center"
                width="130px"
              >
                <template slot-scope="scope">
                  {{
                    (scope.row.generalAlarmSign >>> 15) & 1 ? "报警" : "正常"
                  }}
                </template>
              </el-table-column>
              <el-table-column
                label="高压互锁状态报警"
                align="center"
                width="130px"
              >
                <template slot-scope="scope">
                  {{
                    (scope.row.generalAlarmSign >>> 16) & 1 ? "报警" : "正常"
                  }}
                </template>
              </el-table-column>
              <el-table-column
                label="驱动电机温度报警"
                align="center"
                width="130px"
              >
                <template slot-scope="scope">
                  {{
                    (scope.row.generalAlarmSign >>> 17) & 1 ? "报警" : "正常"
                  }}
                </template>
              </el-table-column>
              <el-table-column
                label="车载储能装置类型过充"
                align="center"
                width="300px"
              >
                <template slot-scope="scope">
                  {{
                    (scope.row.generalAlarmSign >>> 18) & 1 ? "报警" : "正常"
                  }}
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <el-divider content-position="left">处理信息</el-divider>
        <el-row>
          <el-col :span="14">
            <el-form-item label="处理状态" prop="status" label-width="110px">
              <el-select v-model="form.status" placeholder="请选择" :disabled="this.title === '详情'">
                <el-option
                  key="已处理"
                  label="已处理"
                  value="已处理">
                </el-option>
                <el-option
                  key="未处理"
                  label="未处理"
                  value="未处理">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="14">
            <el-form-item label="处理详情" prop="dealContent" label-width="110px">
              <el-input
                v-model="form.dealContent"
                :disabled="this.title === '详情'"
              />
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
import { deal } from '@/api/tsp/vehicleHistoryAlert.js'
import { parseTime } from '../../../../../utils/paramsUtil'

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
        pageNum:1,
        pageSize:10,
      },
      // 表单校验
      rules: {
        remark: [
          { required: true, message: "处理详情不能为空", trigger: "blur" },
        ],
      },
      alertList: [],
    };
  },
  created() {},
  methods: {
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if ('pageNum' in this.form) {
              this.form.pageNum = 1,
              this.form.pageSize = 10
            }
            else {
              this.form.pageNum = 1,
              this.form.pageSize = 10
            }
            this.form.dealTime = parseTime(new Date);
          console.log(this.form);
          deal(this.form).then((res) => {
            if (res.code === 200) {
              this.$modal.msgSuccess("操作成功");
              this.$parent.getList();
              this.cancel();
            }
          });
        }
      });
    },
    // 表单重置
    reset() {
      this.form = {};
      this.resetForm("form");
    },
    // 取消按钮
    cancel() {
      this.open = false;
      console.log(this.alertList);
      this.reset();
    },
    handleRadio() {},
    handleChange() {},
  },
};
</script>

<style>
</style>
