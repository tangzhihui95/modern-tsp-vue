<template>
  <div>
    <el-form label-width="80px" v-model="queryParams" style="padding-top: 22px">
      <el-row type="flex" align="top">
        <el-col :span="6">
          <el-form-item label="账号" label-width="60px" prop="mobile">
            <el-input
              type="input"
              placeholder="请输入账号"
              maxlength="30"
              v-model="queryParams.mobile"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="姓名" label-width="115px" prop="realName">
            <el-input
              type="input"
              placeholder="请输入姓名"
              maxlength="30"
              v-model="queryParams.realName"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="handleSearch" style="margin-left: 10%"
            >查 询</el-button
          >
          <el-button @click="clear">清空条件</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5" style="margin-left: 2%">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['tsp:user:add']"
          >新增账户</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="el-icon-upload2"
          size="mini"
          @click="handleImportUser"
          v-hasPermi="['tsp:user:importUser']"
          >导入</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          v-hasPermi="['tsp:user:export']"
          @click="handleExport"
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
          v-hasPermi="['tsp:user:deletes']"
          @click="handleRemoves"
          >批量删除</el-button
        >

      </el-col>
    </el-row>
    <el-table :data="userList" @selection-change="handleSelectionChange" row-key="id">
      <el-table-column type="selection" width="50" align="center" :reserve-selection="true"/>
      <el-table-column label="序号" type="index" width="50" align="center">
        <template slot-scope="scope">
          <span>{{
            (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账号" align="center" prop="mobile" />
      <el-table-column label="姓名" align="center" prop="realName" />
      <el-table-column label="身份证号" align="center" prop="idCard" />
      <el-table-column label="状态" align="center" prop="realNameAudit">
        <template slot-scope="scope">
          {{ scope.row.realNameAudit === 1 ? "已认证" : "已注册" }}
        </template>
      </el-table-column>
      <el-table-column label="注册时间" align="center" prop="regTime" />
      <el-table-column label="车辆数量" align="center" prop="vehicleCount" />
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
            @click="todetail(scope.row)"
            v-hasPermi="['tsp:user:get']"
            >详情</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['tsp:user:edit']"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['tsp:user:deletes']"
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
            是否更新已经存在的数据
          </div> -->
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link
            type="primary"
            :underline="false"
            style="font-size: 12px; vertical-align: baseline"
            @click="importTemplate"
            >下载模板</el-link
          >
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
    <eForm ref="form" />
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import eForm from "../tspUser/eForm/index.vue";
import UserDetail from "../tspUser/detail/index.vue";
import { userList, deletes, exportUser, get,importTemplate } from "@/api/tsp/user.js";
export default {
  name: "tspUser",
  components: { eForm,UserDetail },
  data() {
    return {
      userList: [],
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 导出遮罩层
      exportLoading: false,
      // 总条数
      total: 0,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      title: "",
      // 遮罩层
      loading: true,
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
        url: process.env.VUE_APP_BASE_API + "/tsp/user/importUser",
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      userList(this.queryParams).then((res) => {
        console.log(res);
        this.userList = res.result.list;
        this.total = res.result.total;
        loading.close();
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    handleSearch() {
      this.queryParams.pageNum = 1;
      
      console.log(this.queryParams);
      this.getList();
    },
    clear() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
      };
      this.getList();
    },
    handleAdd() {
      this.$refs.form.title = "新增账户";
      this.$refs.form.openDialog();
    },
    handleUpdate(row) {
      this.$refs.form.title = "编辑账户";
      get(row.id).then((res) => {
        this.$refs.form.form = res.result;
        this.$refs.form.form.tspUserId = row.id;
        this.$refs.form.form.isTerminal = ['0' + res.result.province, '1' + res.result.city, '2' + res.result.area];

        if (res.result.userCardFrontImg !== null && res.result.userCardFrontImg !== "") {
          this.$refs.form.fileFrontList.push({
            url: process.env.VUE_APP_BASE_API + res.result.userCardFrontImg,
          });
        }
        if (res.result.userCardBackImg !== null && res.result.userCardBackImg !== "") {
          this.$refs.form.fileBackList.push({
            url: process.env.VUE_APP_BASE_API + res.result.userCardBackImg,
          });
        }

        console.log(this.$refs.form.form);
        this.$refs.form.openDialog();
      });
    },
    handleDelete(row) {
      const mobile = row.mobile;
      this.$confirm("是否删除账号为"+ mobile+"是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deletes(row.id).then((res) => {
            if (res.code === 200) {
              this.getList();
              this.$message({
                type: "success",
                message: "删除成功!",
              });
            }
          });
        })
        // .catch(() => {
        //   this.$message({
        //     type: "info",
        //     message: "已取消删除",
        //   });
        // });
    },
    handleRemoves() {
      this.$confirm("是否删除所选中数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deletes(this.ids).then((res) => {
            if (res.code === 200) {
              this.getList();
              this.$message({
                type: "success",
                message: "删除成功!",
              });
            }
          });
        })
        // .catch(() => {
        //   this.$message({
        //     type: "info",
        //     message: "已取消删除",
        //   });
        // });
    },

    // 点击详情
    todetail(row) {
      console.log(row)
      this.$router.push({
        name: "Tsp/tspUser/detail",
        query: {
          id: row.id,
          title: "详情",
        }
      })
    },
    handleExport() {
      const queryParams = (this.ids != null && this.ids.length > 0) ? {ids: this.ids.join()} : {};

      this.$modal
        .confirm("是否确认导出一般账户信息数据项？")
        .then(() => {
          this.exportLoading = true;
          return exportUser(queryParams);
        })
        .then((response) => {
          console.log("成功访问到后端接口---" + response);
          this.$download.name(response.msg);
          this.exportLoading = false;
        })
        .catch(() => {});
    },
    handleImportUser() {
      this.upload.title = "导入用户信息";
      this.upload.open = true;
    },
    // 导入
    importUser() {},
    // 下载模板
    importTemplate() {
      console.log("下载账户模板访问到后端接口前------");
      importTemplate().then((response) => {
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
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },
  },
};
</script>

<style>
</style>
