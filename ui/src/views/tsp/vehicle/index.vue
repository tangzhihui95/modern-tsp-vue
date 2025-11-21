<template>
  <div class="app-container">
    <el-form label-width="80px" v-model="queryParams">
      <el-row>
        <el-col :span="6">
          <el-form-item label="关键字" label-width="110px" prop="search">
            <el-input
              type="input"
              placeholder="VIN、车牌号、SN、SIM"
              maxlength="30"
              v-model="queryParams.search"
              clearable
            />
          </el-form-item>

        </el-col>
        <el-col :span="6">
          <el-form-item label="关联账号" label-width="110px" prop="mobile">
            <el-select
              v-model="queryParams.mobile"
              placeholder="请选择关联账号"
              clearable
            >
              <el-option
                v-for="item in relationMobileOption"
                :key="item.mobile"
                :label="item.mobile"
                :value="item.mobile"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="车辆状态" label-width="110px" prop="state">
            <el-select v-model="queryParams.state" placeholder="请选择车辆状态" clearable>
              <el-option
                v-for="item in vehicleOption"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="设备绑定状态" label-width="110px">
            <el-select
              v-model="queryParams.bindStatus"
              placeholder="请选择绑定状态"
              clearable
            >
              <el-option
                v-for="item in bindStatusOption"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

      </el-row>
      <el-row type="flex" align="top">
        <el-col :span="6">
          <el-form-item label="二级车型" label-width="110px">
            <!-- <el-input
              placeholder="请输入车型"
              v-model="queryParams.stdModeName"
            /> -->
              <el-cascader
                v-model="choise"
                :key="newKey"
                :options="selectChildrenList"
                @change="optModelChange"
                clearable
              >
              </el-cascader>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="6">
          <el-form-item label="认证状态" label-width="110px">
            <el-select
              v-model="queryParams.certificationState"
              placeholder="请选择认证状态"
              clearable
            >
              <el-option
                v-for="item in certificationStateOption"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col> -->
        <el-col :span="6">
          <el-form-item label="推送状态" label-width="110px">
            <el-select
              v-model="queryParams.sendStatus"
              placeholder="请选择认证状态"
              clearable
            >
              <el-option
                v-for="item in sendStatusOption"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>



          <el-button type="primary" style="margin-left: 110px" @click="handleVehicleSearch"
            >查询</el-button
          >
          <el-button @click="clear">清空条件</el-button>

      </el-row>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['tsp:vehicle:add']"
          >新增车辆</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="el-icon-upload2"
          size="mini"
          @click="handleImportVehicle"
          v-hasPermi="['tsp:vehicle:importVehicle']"
          >导入出厂信息</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="el-icon-upload2"
          size="mini"
          @click="handleImportSales"
          v-hasPermi="['tsp:vehicle:importSales']"
          >导入销售信息</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          >导出车辆信息</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExFactoryExport"
          >导出出厂信息</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleSalesExport"
          >导出销售信息</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-error"
          size="mini"
          @click="handleScrap"
          >报废</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          v-hasPermi="['tsp:vehicle:deletes']"
          @click="handleDeletes"
          >批量删除</el-button
        >
      </el-col>
    </el-row>

    <el-table :data="vehicleList" @selection-change="handleSelectionChange" row-key="id">
      <el-table-column type="selection" width="50" align="center" :reserve-selection="true"/>
      <el-table-column label="序号" type="index" width="50" align="center">
        <template slot-scope="scope">
          <span>{{
            (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="VIN" align="center" prop="vin" />
      <el-table-column label="车牌号" align="center" prop="plateCode" />
<!--      <el-table-column label="设备SN" align="center" prop="sn" />-->
      <el-table-column label="SIM" align="center" prop="sim" />
      <el-table-column label="车型" align="center" prop="vehicleType" />
      <el-table-column label="设备绑定状态" align="center" prop="bindStatus" />
      <el-table-column label="关联账号" align="center" prop="mobile" />
      <el-table-column
        label="认证状态"
        align="center"
        prop="identificationStatus"
      />
      <el-table-column label="车辆状态" align="center" prop="state" />
      <el-table-column label="推送状态" align="center" prop="sendStatus" />
      <el-table-column label="创建时间" align="center" prop="createTime">
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="160"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleInfo(scope.row)"
            v-hasPermi="['tsp:vehicle:get']"
            >详情</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            :disabled="scope.row.state === '已报废'"
            v-hasPermi="['tsp:vehicle:edit']"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-connection"
            @click="handleBind(scope.row)"
            :disabled="scope.row.state === '已报废'"
            v-hasPermi="['tsp:vehicle:edit']"
            >绑定记录</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['tsp:vehicle:delete']"
            >删除</el-button
          >
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleAuthentication(scope.row)"
            :disabled="scope.row.state === '已报废'"
            v-hasPermi="['tsp:vehicle:authentication']"
            >申请认证</el-button
          > -->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-d-arrow-right"
            @click="sendMessage(scope.row)"
            v-hasPermi="['tsp:vehicle:sendVehicleMessage']"
            >推送</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-refresh"
            @click="changeVehicleCard(scope.row)"
            :disabled="scope.row.state === '已报废'"
            v-hasPermi="['tsp:vehicle:changeVehicleCard']"
            >更换车卡信息</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-s-claim"
            @click="handleSelectRealName(scope.row)"
            :disabled="scope.row.state === '已报废'"
            v-hasPermi="['tsp:vehicle:getRealNameResult']"
            >实名查询</el-button
          >
        </template>
      </el-table-column>
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

    <el-dialog :title="title" :visible.sync="open" :before-close="handleClose">
      <el-form
        label-width="80px"
        ref="userQueryParams"
        v-model="userQueryParams"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="车主手机号" label-width="110px" prop="mobile">
              <el-input
                v-model="userQueryParams.mobile"
                placeholder="请输入车主手机号"
                maxlength="30"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车主姓名" label-width="110px" prop="realName">
              <el-input
                v-model="userQueryParams.realName"
                placeholder="请输入车主姓名"
                maxlength="30"
              />
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-button @click="handleSearch">搜索</el-button>
            <el-button @click="handleUserReset" type="primary">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-table :data="userList">
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
        <el-table-column label="车主身份证" align="center" prop="idCard" />
        <el-table-column label="账号状态" align="center" prop="isEnable">
          <template slot-scope="scope">
            {{ scope.row.isEnable ? "启用" : "禁用" }}
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleClose">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 导入对话框 -->
    <el-dialog
      :title="upload.title"
      :visible.sync="upload.open"
      width="400px"
      append-to-body
    >
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?isUpdateSupport=' + upload.isUpdateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip text-center" slot="tip">
          <!-- <div class="el-upload__tip" slot="tip">
            <el-checkbox v-model="upload.isUpdateSupport" />
            是否更新已经存在的数据
          </div> -->
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link
            type="primary"
            :underline="false"
            style="font-size: 12px; vertical-align: baseline"
            @click="importTemplate(1)"
            >下载模板</el-link
          >
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="uploadSales.title"
      :visible.sync="uploadSales.open"
      width="400px"
      append-to-body
    >
      <el-upload
        ref="uploadSales"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="uploadSales.headers"
        :action="uploadSales.url + '?isUpdateSupport=' + uploadSales.isUpdateSupport"
        :disabled="uploadSales.isUploading"
        :on-progress="handleSalesFileUploadProgress"
        :on-success="handleSalesFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip text-center" slot="tip">
          <!-- <div class="el-upload__tip" slot="tip">
            <el-checkbox v-model="uploadSales.isUpdateSupport" />
            是否更新已经存在的数据
          </div> -->
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link
            type="primary"
            :underline="false"
            style="font-size: 12px; vertical-align: baseline"
            @click="importTemplate(2)"
            >下载模板</el-link
          >
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitSalesFileForm">确 定</el-button>
        <el-button @click="uploadSales.open = false">取 消</el-button>
      </div>
    </el-dialog>
    <AuthenticationForm ref="authenticationForm" />
    <ScrapForm ref="scrapForm" />
    <VehicleInfoForm ref="vehicleInfoForm" />
    <BindForm ref="bindForm" />
  </div>
</template>

<script>
import {
  bind,
  exportExFactory,
  exportSales,
  exportVehicle,
  get,
  getAuditInfo,
  getBind,
  getRealNameResult,
  importExFactoryTemplate,
  importSaleTemplate,
  list,
  relationMobileOption,
  remove,
  removes
} from '@/api/tsp/vehicle.js'
import { userList } from '@/api/tsp/user.js'
import { select } from '@/api/tsp/vehicleStdModel.js'
import AuthenticationForm from './authenticationForm/index.vue'
import { getToken } from '@/utils/auth'
import ScrapForm from './scrapForm/index.vue'
import { selectChildrenList } from '@/api/tsp/vehicleModel.js'
import VehicleInfoForm from './vehicleForm/vehicleInfoForm/index.vue'
import BindForm from './bindForm/index.vue'
import { provincesTrees } from '@/api/tsp/provinces.js'
import { sendVehicleMessage, updateVehicleMessage } from '@/api/tsp/identification.js'

export default {
  name: "Vehicle",
  components: { AuthenticationForm, ScrapForm, VehicleInfoForm, BindForm, },
  data() {
    return {
      vehicleOption: [
        { label: "全部", value: 0 },
        { label: "已创建", value: 1 },
        { label: "已销售", value: 2 },
        { label: "已绑定", value: 3 },
        { label: "已解绑", value: 4 },
        { label: "已报废", value: 5 },
        { label: "已注册", value: 6 },
      ],
      certificationStateOption: [
        { label: "全部", value: 0 },
        { label: "未认证", value: 1 },
        { label: "认证中", value: 2 },
        { label: "认证失败", value: 3 },
        { label: "已认证", value: 4 },
      ],
      sendStatusOption: [
        { label: "未推送", value: 0 },
        { label: "已推送", value: 1 },
        { label: "全部", value: 2 },
      ],
      bindStatusOption: [
        { label: "未绑定", value: 0 },
        { label: "已绑定", value: 1 },
      ],

      newKey: 1,
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 关联账号
      relationMobileOption: [],
      // 用户表格数据
      vehicleList: [],
      // 用户数据
      userList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        needAll:1,
      },
      // 查询参数
      userQueryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      userListTotal: 0,
      userListLoading: false,
      selectChildrenList: [],
      choise:[],
      // 表单校验
      rules: {},
      open: false,
      title: "",
      tspVehicleId: "",
      // 接口地址
      uploadAddress:"",
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        isUpdateSupport: false,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API +"/tsp/vehicle/importVehicle",
      },
      // 用户导入参数
      uploadSales: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        isUpdateSupport: false,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API +"/tsp/vehicle/importSales",
      },
      // 车型下拉列表
      stdModelSelect: [],
    };
  },
  created() {
    this.getList();
    this.getRelationMobileOption();
    this.getModelSelectList();
  },
  activated() {
    this.getList();
  },
  methods: {
    /** 查询列表 */
    getList() {
      const loading = this.$loading({
        lock: true,
        text: '数据加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      if (this.queryParams.state === "") {
        this.queryParams.state = null;
      }
      if (this.queryParams.sendStatus === "") {
        this.queryParams.sendStatus = null;
      }
      if (this.queryParams.certificationState === "") {
        this.queryParams.certificationState = null;
      }
      if (this.queryParams.bindStatus === "") {
        this.queryParams.bindStatus = null;
      }

      list(this.queryParams).then((res) => {
        this.vehicleList = res.result.list;
        for (let i=0; i < this.vehicleList.length; i++) {
          this.vehicleList[i].vehicleType = this.vehicleList[i].vehicleModelName + " / " + this.vehicleList[i].stdModeName;
        }
        this.total = res.result.total;
        loading.close();
      });
    },
    // 下拉列表
    getModelSelectList() {
      selectChildrenList(this.queryParams).then((res) => {
        this.selectChildrenList = res.result;
      });
    },
    getUserList() {
      this.userListLoading = true;
      userList(this.userQueryParams).then((res) => {
        this.userList = res.result.list;
        this.userListTotal = res.result.total;
        this.userListLoading = false;
      });
    },
    // 关联账号下拉列表
    getRelationMobileOption() {
      relationMobileOption().then((res) => {
        this.relationMobileOption = res.result;
      });
    },
    // 车型下拉列表
    getStdModelSelect() {
      select().then((res) => {
        this.stdModelSelect = res.result;
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    // 添加
    handleAdd() {
      this.$router.push({
        name: "VehicleForm",
        query: {
          title: "新增车辆",
          form: {
            provincesTreeOpt: [],
            providerName: "摩登汽车有限公司",
          },
        },
      });
    },
    sendMessage(row) {
      this.$confirm("是否确认上传所选车辆信息数据项？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          sendVehicleMessage(row.id).then((res) => {
            if (res.Code === "200") {
              this.getList();
              this.$modal.msgSuccess("推送成功");
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消推送",
          });
        });
    },
    changeVehicleCard(row) {
      this.$confirm("是否确认更换车联网卡？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          updateVehicleMessage(row.id).then((res) => {
            if (res.Code === "200") {
              this.getList();
              this.$modal.msgSuccess("更换成功");
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消更换",
          });
        });
    },
    // 编辑
    handleUpdate(row) {
      this.title = "编辑车辆";
      get(row.id).then((res) => {
        res.result.awardAreaList = [];
        res.result.awardAreaList.push(
          res.result.awardProvince,
          res.result.awardCity,
          res.result.awardArea
        );
        this.$router.push({
          name: "VehicleForm",
          query: {
            form: res.result,
            tspVehicleId: row.id,
            title: "编辑车辆",
          },
        });
      });
    },
    optModelChange(val) {
      this.choise = val;
      this.queryParams.tspVehicleStdModelId = val[1];
    },
    // 删除
    handleDelete(row) {
      this.$modal
        .confirm(`是否确认删除vin为${row.vin}的数据项？`)
        .then(function () {
          return remove(row.id);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    // 批量删除
    handleDeletes() {
      this.$confirm("是否确认删除所选车辆信息数据项？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          removes(this.ids).then((res) => {
          if (res.code === 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          }
          this.getList();
        });
        }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    handleInfo(row) {
      get(row.id).then((res) => {
        this.$refs.vehicleInfoForm.form = res.result;
        this.$refs.vehicleInfoForm.form.title = "查看详情";
        this.$refs.vehicleInfoForm.openAndInit();
      });
    },
    handleBind(row) {
      getBind(row.id).then((res) => {
        if (res.code === 200) {
          this.$refs.bindForm.open = true;
          // this.$refs.bindForm.form = res.result;
          this.$refs.bindForm.resultList = res.result;
        }
      });
    },
    onBind() {
      bind(this.tspVehicleId).then((res) => {
        this.$modal.msgSuccess("绑定成功");
        this.getList();
      });
    },
    handleClose() {
      this.open = false;
      this.tspVehicleId = "";
    },
    handleSearch() {
      this.getUserList();
    },
    handleUserReset() {
      this.userQueryParams = {
        pageNum: 1,
        pageSize: 10,
      };
      this.getUserList();
    },
    // 点击切换条数
    handleSizeChange(val) {
      this.queryParams.pageSize = val;
      this.getList();
    },
    // 点击页数
    handleCurrentChange(val) {
      this.queryParams.pageNum = val;
      this.getList();
    },
    handleAuthentication(row) {
      getAuditInfo(row.id).then((res) => {
        if (res.code === 200) {
          this.$refs.authenticationForm.onOpen(res.result, null);
        }
      });
    },
    handleSelectRealName(row) {
      getRealNameResult(row.id).then((res) => {
        if (res.code === 200) {
          this.$refs.authenticationForm.onOpen(res.result, res.result.resultList);
        }
      });
    },
    // 导入出厂信息
    handleImportVehicle() {
      this.upload.title = "导入出厂信息";
      this.upload.open = true;
    },
    // 导入销售信息
    handleImportSales() {
      this.uploadSales.title = "导入销售信息";
      this.uploadSales.open = true;
    },
    // 导出
    handleExport() {
      let queryParams = {
        pageNum: 1,
        pageSize: 10,
      };
      queryParams.carIds = this.ids;

      this.$modal
        .confirm("是否确认导出车辆信息数据项？")
        .then(() => {
          this.exportLoading = true;
          return exportVehicle(queryParams);
        })
        .then((response) => {
          this.$download.name(response.msg);
          this.exportLoading = false;
        })
        .catch(() => {});
    },
    // 导出出厂信息
    handleExFactoryExport() {
      const query = this.queryParams;
      this.$modal
        .confirm("是否确认导出所有车辆出厂信息数据项？")
        .then(() => {
          this.exportLoading = true;
          return exportExFactory(this.queryParams);
        })
        .then((response) => {
          this.$download.name(response.msg);
          this.exportLoading = false;
        })
        .catch(() => {});
    },
    // 导出销售信息
    handleSalesExport() {
      const query = this.queryParams;
      this.$modal
        .confirm("是否确认导出所有车辆销售信息数据项？")
        .then(() => {
          this.exportLoading = true;
          return exportSales(this.queryParams);
        })
        .then((response) => {
          console.log("成功访问到后端接口---" + response);
          this.$download.name(response.msg);
          this.exportLoading = false;
        })
        .catch(() => {});
    },
    // 下载模板
    importTemplate(type) {
      console.log("下载车辆出厂/销售模板访问到后端接口前------");
      if (type===1) {
        importExFactoryTemplate().then((res) => {
          console.log("成功访问到出厂模板接口------" + res);
          this.$download.name(res.msg);
        });
      }
      if (type===2) {
        importSaleTemplate().then((res) => {
          console.log("成功访问到销售模板接口------" + res);
          this.$download.name(res.msg);
        });
      }
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(response.message || response.msg, "导入结果", {
        dangerouslyUseHTMLString: true,
      });

      this.getList();
    },
    // 文件上传中处理
    handleSalesFileUploadProgress(event, file, fileList) {
      this.uploadSales.isUploading = true;
    },
    // 文件上传成功处理
    handleSalesFileSuccess(response, file, fileList) {
      this.uploadSales.open = false;
      this.uploadSales.isUploading = false;
      this.$refs.uploadSales.clearFiles();
      this.$alert(response.message || response.msg, "导入结果", {
        dangerouslyUseHTMLString: true,
      });
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },
    submitSalesFileForm() {
      this.$refs.uploadSales.submit();
    },
    // 报废
    handleScrap() {
      if (this.ids.length <= 0) {
        this.$message.error("未选择报废车辆");
        return;
      }
      this.$refs.scrapForm.open = true;
      this.$refs.scrapForm.form.tspVehicleIds = this.ids;
    },
    // 搜索
    handleVehicleSearch() {
      this.queryParams.pageNum = 1;

      this.getList();
    },
    clear() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
      };
      this.choise=[];
      this.getList();
    },
  },
};
</script>

<style>
</style>
