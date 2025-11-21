<template>
  <div class="app-container">
    <el-row>
      <el-divider content-position="left">基本信息</el-divider>
    </el-row>
    <el-form
      ref="exFactoryForm"
      :model="form"
      :rules="exFactoryFormRules"
      label-width="80px"
    >
      <el-row>
        <el-col :span="7" :offset="2">
          <el-form-item
            label="车辆厂商"
            prop="providerName"
            label-width="110px"
          >
            <el-input
              :disabled="true"
              v-model="form.providerName"
              class="myInput"
              maxlength="30"
            />
          </el-form-item>
        </el-col>

        <el-col :span="7">
          <el-form-item
            label="车辆型号"
            prop="tspVehicleStdModelId"
            label-width="110px"
          >
            <el-cascader
              v-model="choise"
              class="myInput"
              :key="newKey"
              :disabled="this.title === '查看详情'"
              :options="selectChildrenList"
              @change="optModelChange"
              clearable
            >
            </el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item
            label="CDU序列号"
            label-width="110px"
            prop="cduNum"
          >
            <el-input
              :disabled="this.$props.title === '查看详情'"
              v-model="form.cduNum"
              class="myInput"
              placeholder="请输入CDU序列号"
              maxlength="11"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="7" :offset="2">
          <el-form-item
            label="车辆配置名称"
            prop="configureName"
            label-width="110px"
          >
            <el-input
              :disabled="title === '查看详情'"
              v-model="form.configureName"
              class="myInput"
              placeholder="请输入车辆配置名称"
              maxlength="30"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item prop="color" label="外观颜色" label-width="110px">
            <el-select
              v-model="form.color"
              class="myInput"
              placeholder="请选择外观颜色"
              :disabled="title === '查看详情'"
              clearable
            >
              <el-option label="KM02 玉兰瓷白" value="KM02 玉兰瓷白">KM02 玉兰瓷白</el-option>
              <el-option label="KM05 克拉尊黑" value="KM05 克拉尊黑">KM05 克拉尊黑</el-option>
              <el-option label="KM07 黑顶+玉兰瓷白" value="KM07 黑顶+玉兰瓷白">KM07 黑顶+玉兰瓷白</el-option>
              <el-option label="KM08 黑顶+绫罗旗红" value="KM08 黑顶+绫罗旗红">KM08 黑顶+绫罗旗红</el-option>
              <el-option label="KM09 黑顶+魔都薄荷绿" value="KM09 黑顶+魔都薄荷绿">KM09 黑顶+魔都薄荷绿</el-option>
              <el-option label="KM10 凌罗旗红" value="KM10 凌罗旗红">KM10 凌罗旗红</el-option>
              <el-option label="KM11 魔都薄荷绿" value="KM11 魔都薄荷绿">KM11 魔都薄荷绿</el-option>
              <el-option label="KM12 天光宝蓝" value="KM12 天光宝蓝">KM12 天光宝蓝</el-option>
              <el-option label="KM14 蜜桃粉金" value="KM14 蜜桃粉金">KM14 蜜桃粉金</el-option>
              <el-option label="KM15 黑顶+蜜桃粉金" value="KM15 黑顶+蜜桃粉金">KM15 黑顶+蜜桃粉金</el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="VIN" prop="vin" label-width="110px">
            <el-input
              :disabled="title === '查看详情'"
              v-model="form.vin"
              class="myInput"
              placeholder="请输入VIN"
              maxlength="17"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="7" :offset="2">
          <el-form-item prop="batchNo" label="批次号" label-width="110px">
            <el-input
              :disabled="title === '查看详情'"
              v-model="form.batchNo"
              class="myInput"
              placeholder="请输入批次号"
              maxlength="30"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item
            label="出厂日期"
            label-width="110px"
            prop="exFactoryDate"
          >
            <el-date-picker
              :disabled="title === '查看详情'"
              v-model="form.exFactoryDate"
              class="myInput"
              type="date"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd"
              :picker-options="forbiddenTime"
              clearable
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="下线日期" label-width="110px" prop="operateDate">
            <el-date-picker
              :disabled="title === '查看详情'"
              v-model="form.operateDate"
              class="myInput"
              type="date"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd"
              :picker-options="forbiddenTime"
              clearable
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="7" :offset="2">
          <el-form-item label="电池包规格" label-width="110px" prop="essModel">
            <el-select
              v-model="form.essModel"
              class="myInput"
              placeholder="请选择电池包规格"
              :disabled="title === '查看详情'"
              clearable
            >
              <el-option label="73度中航大包" value="73度中航大包">73度中航大包</el-option>
              <el-option label="80度中航大包" value="80度中航大包">80度中航大包</el-option>
              <el-option label="53度国轩小包" value="53度国轩小包">53度国轩小包</el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="电池包编号" label-width="110px" prop="essNum">
            <el-input
              :disabled="this.$props.title === '查看详情'"
              v-model="form.essNum"
              class="myInput"
              placeholder="请输入电池包序列号"
              maxlength="24"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="7" >
          <el-form-item label="发动机序列号" label-width="110px" prop="engineNum">
            <el-input
              :disabled="this.$props.title === '查看详情'"
              v-model="form.engineNum"
              class="myInput"
              placeholder="请输入发动机序列号"
              maxlength="30"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="7" :offset="2">
          <el-form-item label="电动机品牌" label-width="110px" prop="motorBrand">
            <el-select
              v-model="form.motorBrand"
              class="myInput"
              placeholder="请选择电动机品牌"
              :disabled="title === '查看详情'"
              clearable
            >
              <el-option label="青山" value="青山">青山</el-option>
              <el-option label="上汽齿" value="上汽齿">上汽齿</el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item
            label="电动机序列号"
            label-width="110px"
            prop="motorNum"
          >
            <el-input
              :disabled="this.$props.title === '查看详情'"
              v-model="form.motorNum"
              class="myInput"
              placeholder="请输入电动机序列号"
              maxlength="27"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-row>
            <el-divider content-position="left">当前设备信息</el-divider>
          </el-row>
          <el-table
            row-key="id"
            :data="equipmentChoiceList"
            ref="singleTable"
            :show-header="true"
          >
            <el-table-column
              label="序号"
              type="index"
              width="50"
              align="center"
            >
            </el-table-column>
            <el-table-column
              label="设备类型-型号"
              align="center"
              prop="typeModel"
            />
            <el-table-column label="设备SN" align="center" prop="sn" />
            <el-table-column label="车联网卡" align="center" prop="sim" />
            <el-table-column label="ICCID" align="center" prop="iccId" />
            <el-table-column label="IMEI" align="center" prop="imei" />
            <el-table-column
              label="操作"
              align="center"
              width="160"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="scope">
                <el-button
                  v-show="title !== '查看详情'"
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="showGetEquipment(scope.row)"
                  :disabled="scope.row.sn != null"
                  >选择设备</el-button
                >
                <el-button
                  size="mini"
                  v-show="title != '查看详情'"
                  type="text"
                  icon="el-icon-delete"
                  :disabled="scope.row.sn === null || scope.row.sn === undefined"
                  @click="dealEquipment(scope.row)"
                  >解绑设备</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <el-dialog
            :visible.sync="equipmentOpen"
            width="1400px"
            append-to-body
            title="选择设备"
          >
            <el-row>
              <el-form :model="queryParams">
                <el-col :span="7">
                  <el-form-item label="设备SN" label-width="80px">
                    <el-input
                      v-model="queryParams.sn"
                      style="width: 220px"
                      placeholder="sn"
                      clearable
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item label="设备类型-型号" label-width="110px">
                    <el-cascader
                      v-model="choose"
                      style="width: 220px"
                      :key="modelKey"
                      :disabled="this.title === '查看详情'"
                      :options="equipmentTypeSelectList"
                      @change="optChange"
                      clearable
                    >
                    </el-cascader>
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item label="绑定状态" label-width="80px">
                    <el-select
                      v-model="queryParams.bindStatus"
                      style="width: 220px"
                      placeholder="请选择绑定状态"
                      :disabled="title === '查看详情'"
                      clearable
                    >
                      <el-option label="已绑定" value="1">已绑定</el-option>
                      <el-option label="未绑定" value="0">未绑定</el-option>
                      <el-option label="全部" value="2">全部</el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-button
                  icon="el-icon-search"
                  circle
                  @click="handleSearch"
                ></el-button>
                <el-button @click="reset">重置</el-button>
              </el-form>
            </el-row>
            <div class="wrap">
              <div class="myTable">
                <el-table
                  row-key="id"
                  :data="equipmentList"
                  ref="singleTable"
                  highlight-current-row
                >
                  <el-table-column label="选择" width="50" align="center">
                    <template slot-scope="scope">
                      <el-radio style="margin-left: 6px;" v-model="selectedVehicle" :label="scope.row" @input="vehicleSelectChange">{{''}}</el-radio>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="序号"
                    type="index"
                    width="50"
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
                  <el-table-column label="车联网卡" align="center" prop="sim" />
                  <el-table-column label="ICCID" align="center" prop="iccId" />
                  <el-table-column label="IMEI" align="center" prop="imei" />
                  <el-table-column label="设备SN" align="center" prop="sn" />
                  <el-table-column
                    label="版本号"
                    align="center"
                    prop="version"
                  />
                  <el-table-column
                    label="设备类型-型号"
                    align="center"
                    prop="typeModel"
                  />
                  <el-table-column
                    label="是否为终端"
                    align="center"
                    prop="isTerminal"
                  >
                    <template slot-scope="scope">
                      {{ scope.row.isTerminal ? "是" : "否" }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="供应商代码"
                    align="center"
                    prop="supplierCode"
                  />
                  <el-table-column
                    label="批次流水号"
                    align="center"
                    prop="serialNumber"
                  />
                  <el-table-column
                    label="在线状态"
                    align="center"
                    prop="isOnline"
                  >
                    <template slot-scope="scope">
                      {{ scope.row.isOnline ? "在线" : "离线" }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="注册状态"
                    align="center"
                    prop="isRegister"
                  >
                    <template slot-scope="scope">
                      {{ scope.row.isRegister ? "已注册" : "未注册" }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="报废状态"
                    align="center"
                    prop="isScrap"
                  >
                    <template slot-scope="scope">
                      {{ scope.row.isScrap ? "已报废" : "-" }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="绑定状态"
                    align="center"
                    prop="bindStatus"
                  />
                  <el-table-column
                    label="创建时间"
                    align="center"
                    prop="createTime"
                  />
                </el-table>
                <pagination
                  v-show="total > 0"
                  :total="total"
                  :page.sync="queryParams.pageNum"
                  :limit.sync="queryParams.pageSize"
                  @pagination="getList"
                />
              </div>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="submitFileForm" :disabled="!selectedVehicle">确定</el-button>
              <el-button @click="clear">取消</el-button>
            </div>
          </el-dialog>
        </el-col>
      </el-row>
      <el-row>
        <el-divider content-position="left">历史绑定设备</el-divider>
      </el-row>
      <el-row>
        <el-table row-key="id" :data="historyEquipmentList" :show-header="true">
          <el-table-column label="序号" type="index" width="50" align="center">
          </el-table-column>
          <el-table-column
            label="设备类型-型号"
            align="center"
            prop="modelName"
          />
          <el-table-column label="设备SN" align="center" prop="sn" />
          <el-table-column label="车联网卡" align="center" prop="sim" />
          <el-table-column label="ICCID" align="center" prop="iccId" />
          <el-table-column label="IMEI" align="center" prop="imei" />
          <el-table-column label="绑定时间" align="center" prop="createTime" />
          <el-table-column label="解绑时间" align="center" prop="unBindTime" />
          <el-table-column label="上传时间" align="center" prop="uploadTime" />
        </el-table>
        <el-row>
          <el-divider content-position="left">其他信息</el-divider>
        </el-row>
        <el-col :span="7">
          <el-form-item label="标签" label-width="110px" prop="label">
            <el-select
                v-model="form.label"
                multiple
                multiple-limit=20
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
          <el-form-item label="备注" label-width="110px" prop="remark">
            <el-input
              :disabled="title === '查看详情'"
              v-model="form.remark"
              type="textarea"
              placeholder="请输入备注"
              maxlength="30"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { list } from "@/api/tsp/equipment.js";
import { select } from "@/api/tsp/vehicleStdModel.js";
import { selectChildrenList } from "@/api/tsp/vehicleModel.js";
import { selectList } from "@/api/tsp/equipmentType.js";
import { getLabel } from "@/api/tsp/tag.js";
import { dealEquipment, get, equipmentHistory,equipmentNow } from "@/api/tsp/vehicle.js";
import { provincesTrees } from "@/api/tsp/provinces.js";
export default {
  name: "ExFactory",
  props: {
    form: { type: Object },
    title: { type: String },
  },
  data() {
    var vinValid = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("VIN必须为17位字母与数字组成"));
      } else {
        var chrnum = /^\w{3,17}$/;
        if (!chrnum.test(value)) {
          callback(new Error("VIN必须为17位字母与数字组成"));
        }
        callback();
      }
    };
    var essValid = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("电池包编号不能为空"));
      } else {
        var chrnum = /^\w{1,25}$/;
        if (!chrnum.test(value)) {
          callback(new Error("电池包编号必须由字母与数字组成"));
        }
        callback();
      }
    };
    // 校验车辆型号
    const validateStdModelId = (rule, value, callback) => {
      if (!this.choise.length) {
        callback(new Error("请选择车辆型号"));
      } else {
        callback();
      }
    };
    return {
      newKey: 1,
      modelKey: 0,
      exFactoryTitle: "",
      areaList: [],
      equipmentOpen: false,
      choose: [],
      choise: [],
      selectChildrenList: [],
      cascaderProps: {},
      labelList:[{}],

      //出厂/下线日期
      forbiddenTime:{
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      // 表单校验
      exFactoryFormRules: {
        providerName: [
          {
            required: true,
            message: "车辆厂商长度必须介于 2 和 20 之间",
            trigger: "blur",
          },
          {
            min: 2,
            max: 20,
            message: "车辆厂商长度必须介于 2 和 20 之间",
            trigger: "blur",
          },
        ],
        // tspVehicleModelId: [
        //   { required: true, message: "请选择车辆型号", trigger: "change" },
        // ],
        tspVehicleStdModelId: [
          { required: true, validator: validateStdModelId },
        ],
        configureName: [
          {
            required: true,
            message: "车辆配置名称长度必须介于 1 和 30 之间",
            trigger: "blur",
          },
          {
            min: 1,
            max: 30,
            message: "车辆配置名称长度必须介于 1 和 30 之间",
            trigger: "blur",
          },
        ],
        color: [
          { required: true, message: "请选择外观颜色", trigger: "change" },
        ],
        vin: [
          {
            required: true,
            message: "VIN必须为17位字母与数字组成",
            trigger: "blur",
          },
          {
            min: 17,
            max: 17,
            message: "VIN必须为17位字母与数字组成",
            trigger: "blur",
          },
          { validator: vinValid, trigger: "blur" },
        ],
        batchNo: [{ required: true, message: "请输入批次号", trigger: "blur" }],
        exFactoryDate: [
          { required: true, message: "请选择出厂日期", trigger: "blur" },
        ],
        operateDate: [
          { required: true, message: "请选择下线日期", trigger: "blur" },
        ],
        motorNum: [
        {
            required: true,
            message: "电动机序列号长度不能超过27位",
            trigger: "blur",
          },
          {
            min: 1,
            max: 27,
            message: "电动机序列号长度不能超过27位",
            trigger: "blur",
          },
        ],
        essNum: [
          { required: true, message: "请输入电池包编号", trigger: "blur" },
          {
            min: 24,
            max: 24,
            message: "电池包编号必须由长度为24位的数字和字母组成",
            trigger: "blur",
          },
          { validator: essValid, trigger: "blur" },
        ],
        /*
        cduNum: [
          {
            required: true,
            message: "CDU序列号不能为空值",
            trigger: "blur",
          },
          {
            min: 11,
            max: 11,
            message: "CDU序列号长度必须为11位",
            trigger: "blur",
          },
        ],
        */
        essModel: [
          { required: true, message: "请选择电池包规格", trigger: "blur" },
        ],
        motorBrand: [
          { required: true, message: "请选择电动机品牌", trigger: "blur" },
        ],
      },
      needAll:0,
      // 遮罩层
      loading: true,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        tspEquipmentModelId: "",
        showScrap: 1,
        bindStatus:"",
      },
      total: 0,
      // form: {},
      equipmentList: [],
      historyEquipmentList: [],
      equipmentChoiceList: [{}],
      selectList: [],
      equipmentTypeSelectList: [],
      selectedVehicle: null,
    };
  },
  created() {
    if (this.$props.title) {
      this.title = this.$props.title;
    }
    if ("tspVehicleId" in this.form && this.form.tspVehicleId != null) {
      this.getHistoryList(this.form.tspVehicleId);
    }
    if ("tspEquipmentId" in this.form && this.form.tspEquipmentId != null) {
      this.getNowList(this.form.tspEquipmentId);
    }
    this.getSelectList();
    this.getModelSelectList();
    this.getEquipmentSelectList();
    let list = this.getList();
    if (this.form !== undefined) {
      list.then((result) => {
        for (const iterator of result) {
          if (iterator.id === this.form.tspEquipmentId) {
            this.equipmentChoiceList = [];
            this.equipmentChoiceList.push(iterator);
          }
        }
      });
    }
    this.getLabel();
    let row = this.form;
    row.id = this.form.tspEquipmentId;
    this.$nextTick(() => {
      this.choise = this.form.tspVehicleStdModelId;
    });
    if (this.exFactoryTitle === "编辑车辆") {
      if (Object.keys(this.form).length === 0) {
        this.$router.push({
          name: "Vehicle",
        });
      }
    }
  },
  beforeDestroy() {
    this.$once('hook:beforeDestroy',() =>{
      clearInterval(this.timer)
    })
  },
  methods: {
    selectable(row, index) {
      if (this.exFactoryTitle === "查看详情") {
        return false;
      } else {
        return true;
      }
    },
    getLabel(){
      getLabel(1).then((res) => {
        this.labelList = res.result;
      })
    },
    /** 查询列表 */
    getList() {
      const loading = this.$loading({
        lock: true,
        text: '数据加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.equipmentList = [];
      return list(this.queryParams).then((res) => {
        this.equipmentList = res.result.list;
        this.total = res.result.total;
        this.queryParams.pageNum =res.result.pageNum
        loading.close();
        return this.equipmentList;
      });
    },
    /** 查询历史绑定列表 */
    getHistoryList(id) {
      this.loading = true;
      return equipmentHistory(id).then((res) => {
        this.historyEquipmentList = res.result.list;
        this.total = res.result.total;
        this.loading = false;
        // return this.historyEquipmentList;
      });
    },
    /** 查询历史绑定列表 */
    getNowList(id) {
      this.loading = true;
      return equipmentNow(id).then((res) => {
        this.equipmentChoiceList = res.result.list;
        this.total = res.result.total;
        this.loading = false;
      });
    },
    vehicleSelectChange(row) {
      //empty
    },
    optChange(val) {
      this.choose = val;
      this.queryParams.tspEquipmentModelId = val[2];
    },
    optModelChange(val) {
      this.choise = val;
      this.queryParams.tspVehicleStdModelId = val[1];
      this.form.tspVehicleStdModelId = val[1];
    },
    // 下拉列表
    getModelSelectList() {
      selectChildrenList(this.queryParams).then((res) => {
        this.selectChildrenList = res.result;
      });
    },
    beforeunloadFn(e) {

    },
    //⼦组件校验，传递到⽗组件
    validateForm() {
      let flag = null;
      this.$refs.exFactoryForm.validate((valid) => {
        if (valid) {
          flag = true;
        } else {
          flag = false;
        }
      });
      return flag;
    },
    showGetEquipment() {
      this.equipmentOpen = true;
    },
    dealEquipment(row) {
      this.$confirm("是否确认解绑该设备？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let res = dealEquipment(row.id);
          if (res.code === 200) {
            this.$message({
              type: "success",
              message: "解绑成功!",
            });
          }
          this.$router.go(-1);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消解绑",
          });
        });
    },
    handleUpdate() {},
    // 下拉列表
    getSelectList() {
      if (this.form.tspVehicleStdModelId) {
        select(this.form.tspVehicleStdModelId).then((res) => {
          this.selectList = res.result;
        });
      } else {
        select().then((res) => {
          this.selectList = res.result;
        });
      }
    },
    // 下拉列表
    getEquipmentSelectList() {
      selectList(this.queryParams).then((res) => {
        this.equipmentTypeSelectList = res.result;
      });
    },
    handleSearch() {
      this.queryParams.pageNum = 1;

      this.getList();
    },
    submitFileForm() {
      if (this.selectedVehicle) {
        this.equipmentChoiceList = [];
        this.equipmentChoiceList.push(this.selectedVehicle);
        this.form.tspEquipmentId = this.selectedVehicle.id;
        this.equipmentOpen = false;
      }
    },
    clear() {
      this.selectedVehicle = null;
      this.equipmentOpen = false;
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
      };
    },
    reset() {
      this.selectedVehicle = null;
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        showScrap: 1,
        bindStatus:"",
      };
      this.getList();
    },
  },
};
</script>

<style lang="scss" scoped>
.wrap {
  padding: 0 25px 0 15px;
  /deep/ .myTable {
    /*  审查DOM也可以找到这个结构，同上  */
    .el-table__header-wrapper {
      .el-checkbox__inner {
        display: none !important;
      }
    }
  }
}

/deep/ .el-input--suffix .el-input__inner {
    padding-right: 10px;
}

.myInput {
  width: 220px;
}

</style>
