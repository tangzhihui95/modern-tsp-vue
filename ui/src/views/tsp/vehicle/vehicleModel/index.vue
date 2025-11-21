<template>
  <div class="app-container">
    <el-form :model="queryParams">
      <el-row type="flex" align="top">
        <el-col :span="7">
          <el-form-item label="关键字" label-width="106px">
            <el-input
              type="input"
              v-model="queryParams.vehicleModelName"
              style="width: 190px"
              placeholder="车型/型号"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="二级车型" label-width="100px">
            <!-- <el-input
              placeholder="请输入车型"
              v-model="queryParams.stdModeName"
            /> -->
            <el-cascader
              v-model="choise"
              style="width: 190px"
              :key="newKey"
              :options="selectChildrenList"
              @change="optModelChange"
              clearable
            >
            </el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-button @click="handleSearch">查询</el-button>
          <el-button type="primary" @click="clear">清空条件</el-button>
        </el-col>
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
          v-hasPermi="['tsp:vehicleModel:add']"
          >新增车型</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['tsp:vehicleModel:export']"
          >导出</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-upload2"
          size="mini"
          @click="handleImportModel"
          v-hasPermi="['tsp:vehicleModel:importVehicleModel']"
          >导入一级车型</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-upload2"
          size="mini"
          @click="handleImportStdModel"
          v-hasPermi="['tsp:vehicleModel:importVehicleStdModel']"
          >导入二级车型</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          v-hasPermi="['tsp:vehicleModel:deletes']"
          @click="handleDeletes"
          >批量删除</el-button
        >
      </el-col>
    </el-row>

    <el-table
      :data="vehicleList"
      @selection-change="handleSelectionChange"
      size="mini"
      row-key="id"
    >
      <el-table-column type="selection" width="50" align="center" :reserve-selection="true"/>
      <el-table-column width="50" align="center" type="expand">
        <template slot-scope="scope">
          <el-table size="mini" :data="scope.row.children">
            <el-table-column
              label="序号"
              type="index"
              width="50"
              align="center"
            />
            <el-table-column
              label="二级型号"
              align="center"
              prop="stdModeName"
            />
            <el-table-column
              label="公告型号"
              align="center"
              prop="noticeModel"
            />
            <el-table-column
              label="公告批次"
              align="center"
              prop="noticeBatch"
            />
            <el-table-column
              label="关联车辆"
              align="center"
              prop="stdModeCount"
            />
            <el-table-column label="能源类型" align="center" prop="dataKey" />
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
                  icon="el-icon-edit"
                  @click="handleStdModelEdit(scope.row)"
                  v-hasPermi="['tsp:stdModel:edit']"
                  >编辑型号</el-button
                >
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  @click="handleStdModelDelete(scope.row)"
                  v-hasPermi="['tsp:stdModel:remove']"
                  >删除型号</el-button
                >
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-view"
                  @click="handleStdModelInfo(scope.row)"
                  v-hasPermi="['tsp:stdModel:get']"
                  >详情</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="序号" type="index" width="50" align="center">
        <template slot-scope="scope">
          <span>{{
            (queryParams.pageNum - 1) * queryParams.pageSize + scope.row.index + 1
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="一级车型"
        align="center"
        prop="vehicleModelName"
      />
      <!-- <el-table-column label="型号数量" align="center" prop="quantity" /> -->
      <!-- <el-table-column label="车辆分类" align="center" prop="typeName" /> -->
      <el-table-column label="关联车辆" align="center" prop="vehicleCount" />
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
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['tsp:vehicleModel:edit']"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAddStdModel(scope.row)"
            v-hasPermi="['tsp:stdModel:addStdModel']"
            >添加型号</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['tsp:vehicleModel:deletes']"
            >删除</el-button
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
            是否添加一级车型已存在的二级车型
          </div> -->
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link
            type="primary"
            :underline="false"
            style="font-size: 12px; vertical-align: baseline"
            @click="importTemplateModel"
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
      :title="uploadStd.title"
      :visible.sync="uploadStd.open"
      width="400px"
      append-to-body
    >
      <el-upload
        ref="uploadStd"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="uploadStd.headers"
        :action="
          uploadStd.url + '?isUpdateSupport=' + uploadStd.isUpdateSupport
        "
        :disabled="uploadStd.isUploading"
        :on-progress="handleStdFileUploadProgress"
        :on-success="handleStdFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip text-center" slot="tip">
          <!-- <div class="el-upload__tip" slot="tip">
            <el-checkbox v-model="upload.isUpdateSupport" />
            是否添加一级车型已存在的二级车型
          </div> -->
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link
            type="primary"
            :underline="false"
            style="font-size: 12px; vertical-align: baseline"
            @click="importTemplateStdModel"
            >下载模板</el-link
          >
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitStdFileForm">确 定</el-button>
        <el-button @click="uploadStd.open = false">取 消</el-button>
      </div>
    </el-dialog>
    <eForm ref="form" />
    <stdModelForm ref="stdModelForm" />
  </div>
</template>

<script>
import {
  list,
  removes,
  exportVehicleModel,
  importTemplateModel,
  importTemplateStdModel,
  importVehicleModel,
  importVehicleStdModel,
} from "@/api/tsp/vehicleModel.js";
import { remove, get } from "@/api/tsp/vehicleStdModel.js";
import eForm from "../vehicleModel/eForm";
import { selectChildrenList } from "@/api/tsp/vehicleModel.js";
import { getToken } from "@/utils/auth";
import stdModelForm from "../vehicleModel/stdModelForm";
export default {
  name: "VehicleModel",
  components: { eForm, stdModelForm },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      newKey: 1,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 用户表格数据
      vehicleList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      // 表单校验
      rules: {},
      selectChildrenList: [],
      title: "",
      choise: [],
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
        url:
          process.env.VUE_APP_BASE_API +
          "/tsp/vehicle/model/importVehicleModel",
      },
      uploadStd: {
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
        url:
          process.env.VUE_APP_BASE_API +
          "/tsp/vehicle/model/importVehicleStdModel",
      },
    };
  },
  watch: {},
  created() {
    this.getList();
    this.getModelSelectList();
  },
  activated() {
    this.getList();
    this.getModelSelectList();
  },
  // mounted() {
  //   this.timer = setInterval(() => {
  //     console.log("刷新数据");
  //     this.getList();
  //   }, 5000);
  // },
  // beforeDestroy() {
  //   this.$once("hook:beforeDestroy", () => {
  //     clearInterval(this.timer);
  //   });
  // },
  methods: {
    /** 查询列表 */
    getList() {
      const loading = this.$loading({
        lock: true,
        text: '数据加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.loading = true;
      list(this.queryParams).then((res) => {
        loading.close();
        this.vehicleList = res.result.list;
        for (let i=0; i < this.vehicleList.length; i++) {
          this.vehicleList[i].index = i;
        }

        this.total = res.result.total;
        this.loading = false;
      });
    },
    optModelChange(val) {
      console.log(val);
      this.choise = val;
      this.queryParams.tspVehicleStdModelId = val[1];
      console.log(this.choise);
    },
    // 下拉列表
    getModelSelectList() {
      selectChildrenList(this.queryParams).then((res) => {
        this.selectChildrenList = res.result;
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    // 添加
    handleAdd() {
      console.log(this.$refs.form.title);
      this.$refs.form.getSelectList();
      this.$refs.form.title = "新增车型";
      this.$refs.form.open = true;
    },
    // 导出
    handleExport() {
      const queryParams = (this.ids != null && this.ids.length > 0) ? {ids: this.ids.join()} : {};

      this.$modal
        .confirm("是否确认导出车型信息数据项？")
        .then(() => {
          this.exportLoading = true;
          return exportVehicleModel(queryParams);
        })
        .then((response) => {
          this.$download.name(response.msg);
          this.exportLoading = false;
        })
        .catch(() => {});
    },
    // 编辑
    handleUpdate(
      row) {
      console.log(row);
      this.$refs.form.getSelectList();
      this.$refs.form.form = row;
      this.$refs.form.form.tspVehicleModelId = row.id;
      this.$refs.form.title = "编辑车型";
      this.$refs.form.open = true;
    },
    handleStdModelDelete(row) {
      this.$modal
        .confirm('是否确认删除二级车型为"' + row.stdModeName + '"的数据项？')
        .then(function () {
          return remove(row.id);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    handleStdModelInfo(row) {
      get(row.id).then((res) => {
        this.$refs.stdModelForm.form = res.result;
        this.$refs.stdModelForm.form.vehicleModelName = row.vehicleModelName;
        this.$refs.stdModelForm.form.stdModelExtraAddVO =
          res.result.stdModelExtra;
        this.$refs.stdModelForm.title = "二级型号详情";
        this.$refs.stdModelForm.openDialog();
      });
    },
    // 删除
    handleDelete(row) {
      this.$modal
        .confirm(
          '是否确认删除车型名称为"' + row.vehicleModelName + '"的数据项？'
        )
        .then(function () {
          return removes(row.id);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    // 批量删除
    handleDeletes() {
      console.log(this.ids);
      this.$confirm("是否确认删除所选车型类型数据项？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          console.log(this.ids);
          removes(this.ids).then((res) => {
            console.log(res);
            if (res.code == 200) {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
            }
            this.getList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 导入
    handleImportModel() {
      this.upload.title = "导入一级车型信息";
      this.upload.open = true;
    },
    // 导入
    handleImportStdModel() {
      this.uploadStd.title = "导入二级车型信息";
      this.uploadStd.open = true;
    },
    // 下载模板
    importTemplateStdModel() {
      console.log("下载一级车型模板访问到后端接口前------");
      importTemplateStdModel().then((response) => {
        console.log("成功访问到接口------" + response);
        this.$download.name(response.msg);
      });
    },
    // 下载模板
    importTemplateModel() {
      console.log("下载一级车型模板访问到后端接口前------");
      importTemplateModel().then((response) => {
        console.log("成功访问到接口------" + response);
        this.$download.name(response.msg);
      });
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
    handleStdFileUploadProgress(event, file, fileList) {
      this.uploadStd.isUploading = true;
    },
    // 文件上传成功处理
    handleStdFileSuccess(response, file, fileList) {
      this.uploadStd.open = false;
      this.uploadStd.isUploading = false;
      this.$refs.uploadStd.clearFiles();
      this.$alert(response.message || response.msg, "导入结果", {
        dangerouslyUseHTMLString: true,
      });
      this.getList();
    },
    handleAddStdModel(row) {
      this.$refs.stdModelForm.title = "添加型号";
      this.$refs.stdModelForm.form.vehicleModelName = row.vehicleModelName;
      this.$refs.stdModelForm.form.tspVehicleModelId = row.id;
      this.$refs.stdModelForm.openDialog();
    },
    handleStdModelEdit(row) {
      get(row.id).then((res) => {
        console.log(res);
        this.$refs.stdModelForm.form = res.result;
        this.$refs.stdModelForm.form.vehicleModelName = row.vehicleModelName;
        this.$refs.stdModelForm.form.stdModelExtraAddVO =
          res.result.stdModelExtra;
        this.$refs.stdModelForm.form.tspVehicleStdModelId = row.id;
        this.$refs.stdModelForm.title = "编辑型号";
        this.$refs.stdModelForm.openDialog();
      });
      
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
    handleSearch() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },
    submitStdFileForm() {
      this.$refs.uploadStd.submit();
    },
    clear() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
      };
      this.choise = [];
      this.getList();
    },
  },
};
</script>

<style></style>
