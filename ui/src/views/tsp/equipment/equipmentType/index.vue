<template>
  <div class="app-container">
    <el-row type="flex" align="top">
      <el-col :span="12">
        <el-form :model="queryParams" style="padding: 0">
          <el-col :span="12">
            <el-form-item label="设备类型" label-width="105px">
              <el-input
                type="input"
                v-model="queryParams.search"
                placeholder="类型/扩展信息类型"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备类型-型号" label-width="130px">
              <el-cascader
                v-model="choose"
                style="width: 200px;"
                :key="newKey"
                :options="selectList"
                @change="optChange"
                clearable
                :props="{ checkStrictly: true }"
              >
              </el-cascader>
            </el-form-item>
          </el-col>
        </el-form>
      </el-col>
      <el-col :span="6" :offset="1">
        <el-button type="primary" @click="handleSearch">查 询</el-button>
        <el-button @click="clear">清空条件</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['tsp:equipmentType:add']"
          >新增分类</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-upload2"
          @click="handleImportEquipmentType"
          size="mini"
          v-hasPermi="['tsp:equipmentType:importEquipmentType']"
          >导入设备类型</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-upload2"
          @click="handleImportEquipmentModel"
          size="mini"
          v-hasPermi="['tsp:equipmentType:importEquipmentModel']"
          >导入设备型号</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-download"
          @click="handleExport"
          size="mini"
          v-hasPermi="['tsp:equipmentType:export']"
          >导出</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          v-hasPermi="['tsp:equipmentType:deletes']"
          @click="handleRemoves"
          >批量删除</el-button
        >
      </el-col>
    </el-row>

    <el-table
      :data="equipmentTypeList"
      @selection-change="handleSelectionChange"
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
            <el-table-column label="设备型号" align="center" prop="modelName" />
            <el-table-column label="供应商" align="center" prop="suppliers" />
            <el-table-column
              label="生产批次"
              align="center"
              prop="batchNumber"
            />
            <el-table-column
              label="创建时间"
              align="center"
              prop="createTime"
            />
            <el-table-column label="关联设备" align="center" prop="count" />
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
                  @click="handleEditModel(scope.row)"
                  v-hasPermi="['tsp:equipmentModel:edit']"
                  >编辑型号</el-button
                >
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  @click="handleDeleteModel(scope.row)"
                  v-hasPermi="['tsp:equipmentModel:delete']"
                  >删除型号</el-button
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
      <el-table-column label="设备类型" align="center" prop="name" />
      <el-table-column label="创建时间" align="center" prop="createTime">
      </el-table-column>
      <el-table-column label="是否为终端" align="center" prop="isTerminal">
        <template slot-scope="scope">
          {{ scope.row.isTerminal ? "是" : "否" }}
        </template>
      </el-table-column>
      <el-table-column
        label="设备扩展信息类型"
        align="center"
        prop="extraType"
      />
      <el-table-column label="关联设备数" align="center" prop="count" />
      <el-table-column
        label="操作"
        align="center"
        width="160"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            icon="el-icon-plus"
            v-hasPermi="['tsp:equipmentModel:add']"
            size="mini"
            @click="handleAddModel(scope.row)"
          >
            添加型号
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['tsp:equipmentType:edit']"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['tsp:equipmentType:delete']"
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
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link
            type="primary"
            :underline="false"
            style="font-size: 12px; vertical-align: baseline"
            @click="importTypeTemplate"
            >下载模板</el-link
          >
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 导入对话框 -->
    <el-dialog
      :title="uploadModel.title"
      :visible.sync="uploadModel.open"
      width="400px"
      append-to-body
    >
      <el-upload
        ref="uploadModel"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="uploadModel.headers"
        :action="
          uploadModel.url + '?isUpdateSupport=' + uploadModel.isUpdateSupport
        "
        :disabled="uploadModel.isUploading"
        :on-progress="handleModelFileUploadProgress"
        :on-success="handleModelFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip text-center" slot="tip">
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link
            type="primary"
            :underline="false"
            style="font-size: 12px; vertical-align: baseline"
            @click="importModelTemplate"
            >下载模板</el-link
          >
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitModelFileForm">确 定</el-button>
        <el-button @click="uploadModel.open = false">取 消</el-button>
      </div>
    </el-dialog>
    <eForm ref="form" />
    <equipmentModelForm ref="equipmentModelForm" />
  </div>
</template>

<script>
import {
  selectList,
  list,
  remove,
  deletes,
  exportEquipmentType,
  importEquipmentType,
  importModelTemplate,
  importEquipmentModel,
  importTypeTemplate,
} from "@/api/tsp/equipmentType.js";
import { removeModel } from "@/api/tsp/equipmentModel.js";
import { getToken } from "@/utils/auth";
import eForm from "../equipmentType/eForm/index.vue";
import equipmentModelForm from "../equipmentType/equipmentModelForm/index.vue";
export default {
  name: "EquipmentType",
  components: { eForm, equipmentModelForm },
  data() {
    return {
      newKey: 0,
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
      choose: [],
      // 用户表格数据
      equipmentTypeList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        tspEquipmentModelId: "",
        tspEquipmentTypeId: "",
      },
      // 表单校验
      rules: {},
      selectList: [],
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
        url:
          process.env.VUE_APP_BASE_API +
          "/tsp/equipmentType/importEquipmentType",
      },
      // 用户导入参数
      uploadModel: {
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
          "/tsp/equipmentType/importEquipmentModel",
      },
    };
  },
  watch: {},
  created() {
    this.getList();
    this.getSelectList();
  },
  activated() {
    this.getList();
    this.getSelectList();
  },

  methods: {
    /** 查询列表 */
    getList() {

      const loading = this.$loading({
        lock: true,
        text: '数据加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.equipmentTypeList = [];
      list(this.queryParams).then((res) => {
        loading.close()
        this.equipmentTypeList = res.result.list;
        for (let i=0; i < this.equipmentTypeList.length; i++) {
          this.equipmentTypeList[i].index = i;
        }
        
        this.total = res.result.total;
        this.loading = false;
      });
    },
    // 下拉列表
    getSelectList() {
      selectList(this.queryParams).then((res) => {
        this.selectList = res.result;
      });
    },
    optChange(val) {
      this.choose = val;
      if (val.length === 1) {
        this.queryParams.tspEquipmentModelId = null;
        this.queryParams.tspEquipmentTypeId = val[0];
      } else {
        this.queryParams.tspEquipmentModelId = val[val.length - 1];
        this.queryParams.tspEquipmentTypeId = null;
      }
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    // 添加
    handleAdd() {
      this.$refs.form.title = "新增分类";
      this.$refs.form.open = true;
    },
    handleSearch() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    clear() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
      };
      this.choose = [];
      this.getList();
    },
    /** 下载模板操作 */
    importTypeTemplate() {
      importTypeTemplate().then((response) => {
        this.$download.name(response.msg);
      });
    },
    /** 下载模板操作 */
    importModelTemplate() {
      importModelTemplate().then((response) => {
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
    handleModelFileUploadProgress(event, file, fileList) {
      this.uploadModel.isUploading = true;
    },
    // 文件上传成功处理
    handleModelFileSuccess(response, file, fileList) {
      this.uploadModel.open = false;
      this.uploadModel.isUploading = false;
      this.$refs.uploadModel.clearFiles();
      this.$alert(response.message || response.msg, "导入结果", {
        dangerouslyUseHTMLString: true,
      });

      this.getList();
    },
    // 提交上传文件
    submitModelFileForm() {
      this.$refs.uploadModel.submit();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },
    // 添加型号
    handleAddModel(row) {
      this.$refs.equipmentModelForm.form.tspEquipmentTypeId = row.id;
      this.$refs.equipmentModelForm.title = "添加型号";
      this.$refs.equipmentModelForm.open = true;
      this.getList();
    },
    // 编辑型号
    handleEditModel(row) {
      this.$refs.equipmentModelForm.form = JSON.parse(JSON.stringify(row));
      this.$refs.equipmentModelForm.form.tspEquipmentModelId = row.id;
      this.$refs.equipmentModelForm.title = "编辑型号";
      this.$refs.equipmentModelForm.open = true;
      this.getList();
    },
    handleDeleteModel(row) {
      this.$modal
        .confirm('是否确认删除设备型号为"' + row.modelName + '"的数据项？')
        .then(function () {
          return removeModel(row.id).then((res) => {
            // console.log(res);
          });
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    // 编辑
    handleUpdate(row) {
      this.$refs.form.form = JSON.parse(JSON.stringify(row));
      this.$refs.form.form.equipmentTypeId = row.id;
      this.$refs.form.title = "编辑分类";
      this.$refs.form.open = true;
    },
    // 删除
    handleDelete(row) {
      this.$modal
        .confirm('是否确认删除设备分类类型为"' + row.extraType + '"的数据项？')
        .then(function () {
          return remove(row.id);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    // 导入设备类型
    handleImportEquipmentType() {
      this.upload.title = "导入设备类型";
      this.upload.open = true;
    },
    // 导入设备型号
    handleImportEquipmentModel() {
      this.uploadModel.title = "导入设备型号";
      this.uploadModel.open = true;
    },
    // 导出
    handleExport() {
      const query = this.queryParams;
      this.$modal
        .confirm("是否确认导出所有设备分类及型号信息数据项？")
        .then(() => {
          this.exportLoading = true;
          return exportEquipmentType(query);
        })
        .then((response) => {
          this.$download.name(response.msg);
          this.exportLoading = false;
        })
        .catch(() => {});
    },
    // 批量删除
    handleRemoves() {
      this.$confirm("是否确认删除所选设备分类?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deletes(this.ids).then((res) => {
            if (res.code === 200) {
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
  },
};
</script>
