<template>
  <div class="app-container">
    <el-form :model="queryParams">
      <el-row>
        <el-col :span="6">
          <el-form-item label="设备" label-width="106px">
            <el-input
              type="input"
              v-model="queryParams.sn"
              placeholder="SN、SIM、ICCID"
              clearable
            />
          </el-form-item>
        </el-col>

        <!--         sn和sim 分开查询如下 以备需求-->
        <!--          <el-col :span="12">-->
        <!--            <el-form-item label="设备SIM" label-width="110px">-->
        <!--              <el-input-->
        <!--                type="input"-->
        <!--                v-model="queryParams.sim"-->
        <!--                placeholder="SIM"-->
        <!--                clearable-->
        <!--              />-->
        <!--            </el-form-item>-->
        <!--          </el-col>-->

        <el-col :span="6" style="margin-left: 20px">
          <el-form-item label="设备类型-型号" label-width="110px">
            <!--              &lt;!&ndash; <el-select-->
            <!--              v-model="queryParams.tspEquipmentTypeId"-->
            <!--              placeholder="请选择设备类型"-->
            <!--            >-->
            <!--              <el-option-->
            <!--                v-for="item in selectList"-->
            <!--                :key="item.id"-->
            <!--                :label="item.tspEquipmentTypeName"-->
            <!--                :value="item.id"-->
            <!--              ></el-option>-->
            <!--            </el-select> &ndash;&gt;-->
            <el-cascader
              v-model="choose"
              :key="newKey"
              :options="selectList"
              @change="optChange"
              clearable
            >
            </el-cascader>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="车辆绑定状态" label-width="110px" style="margin-left: 20px">
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
          <el-button type="primary" style="margin-left: 20px" @click="handleSearch">查 询</el-button>
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
          v-hasPermi="['tsp:equipment:add']"
        >新增设备
        </el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-upload2"
          @click="handleImportEquipment"
          size="mini"
          v-hasPermi="['tsp:equipment:importEquipment']"
        >导入
        </el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-download"
          @click="handleExport"
          size="mini"
          v-hasPermi="['tsp:equipment:export']"
        >导出
        </el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-error"
          size="mini"
          @click="handleScrap"
        >报废
        </el-button
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
          @click="handleDeletes"
        >批量删除设备
        </el-button
        >
      </el-col>
    </el-row>

    <el-table :data="equipmentList" @selection-change="handleSelectionChange" row-key="id">
      <el-table-column type="selection" width="50" align="center" :reserve-selection="true"/>
      <el-table-column label="序号" type="index" width="50" align="center">
        <template slot-scope="scope">
          <span>{{
              (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1
            }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备SN" align="center" prop="sn"/>
      <el-table-column label="SIM" align="center" prop="sim"/>
      <el-table-column label="车辆绑定状态" align="center" prop="bindStatus"/>
      <el-table-column label="ICCID" align="center" prop="iccId"/>
      <el-table-column label="IMSI" align="center" prop="imsi"/>
      <el-table-column label="版本号" align="center" prop="version"/>
      <el-table-column label="设备类型-型号" align="center" prop="typeModel"/>
      <el-table-column label="是否为终端" align="center" prop="isTerminal">
        <template slot-scope="scope">
          {{ scope.row.isTerminal ? "是" : "否" }}
        </template>
      </el-table-column>
      <el-table-column label="供应商代码" align="center" prop="supplierCode"/>
      <el-table-column label="批次流水号" align="center" prop="serialNumber"/>
      <el-table-column label="在线状态" align="center" prop="isOnline">
        <template slot-scope="scope">
          {{ scope.row.isOnline ? "在线" : "离线" }}
        </template>
      </el-table-column>
      <el-table-column label="注册状态" align="center" prop="isRegister">
        <template slot-scope="scope">
          {{ scope.row.isRegister ? "已注册" : "未注册" }}
        </template>
      </el-table-column>
      <el-table-column label="报废状态" align="center" prop="isScrap">
        <template slot-scope="scope">
          {{ scope.row.isScrap ? "已报废" : "-" }}
        </template>
      </el-table-column>
      <el-table-column label="报废时间" align="center" prop="scrapTime"/>
      <el-table-column label="创建时间" align="center" prop="createTime"/>
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
            v-hasPermi="['tsp:equipment:get']"
          >详情
          </el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['tsp:equipment:edit']"
            :disabled="scope.row.isScrap"
          >编辑
          </el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['tsp:equipment:deletes']"
            :disabled="scope.row.isScrap"
          >删除
          </el-button
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
            是否更新已经存在的用户数据
          </div> -->
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link
            type="primary"
            :underline="false"
            style="font-size: 12px; vertical-align: baseline"
            @click="importTemplate"
          >下载模板
          </el-link
          >
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
    <ScrapForm ref="scrapForm"/>
    <eForm ref="form"/>
  </div>
</template>

<script>
import {
  list,
  removes,
  exportEquipment,
  importTemplate,
  importEquipment,
} from "@/api/tsp/equipment.js";
import {getToken} from "@/utils/auth";
import eForm from "../equipment/eForm/index.vue";
import ScrapForm from "./scrapForm/index.vue";
import {selectList} from "@/api/tsp/equipmentType.js";

export default {
  name: "Equipment",
  components: {eForm, ScrapForm},
  data() {
    return {
      bindStatusOption: [
        {label: "已绑定", value: 1},
        {label: "未绑定", value: 0},
      ],
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
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        tspEquipmentModelId: "",
        needAll: 1,
      },
      // 用户表格数据
      equipmentList: [],
      // 下拉列表
      selectList: [],
      times: null,
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
        headers: {Authorization: "Bearer " + getToken()},
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/tsp/equipment/importEquipment",
      },
    };
  },
  watch: {},
  created() {
    this.getList();
    this.getSelectList();
  },
  activated() {
    console.log("设备信息")
    this.getList();
    this.getSelectList();
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
      if (this.queryParams.state === "") {
        this.queryParams.state = null;
      }
      const loading = this.$loading({
        lock: true,
        text: '数据加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.equipmentList = [];
      list(this.queryParams).then((res) => {
        loading.close();
        this.equipmentList = res.result.list;
        this.total = res.result.total;
        this.loading = false;
        console.log(this.equipmentList);
      });
    },
    optChange(val) {
      console.log(val);
      this.choose = val;
      this.queryParams.tspEquipmentModelId = val[2];
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    // 添加
    handleAdd() {
      console.log(this.$refs.form.title);
      this.$refs.form.getSelectList();
      this.$refs.form.title = "新增设备";
      this.$refs.form.open = true;
    },
    // 报废
    handleScrap() {
      console.log(this.ids);
      if (this.ids.length <= 0) {
        this.$message.error("未选择报废设备");
        return;
      }
      this.$refs.scrapForm.open = true;
      this.$refs.scrapForm.form.tspEquipmentIds = this.ids;
    },
    // 编辑
    handleUpdate(row) {
      console.log(row, "===================");
      this.$refs.form.form = JSON.parse(JSON.stringify(row));
      this.$refs.form.form.tspEquipmentId = row.id;
      this.$refs.form.getSelectList();
      this.$refs.form.choose[0] = row.tspEquipmentTypeId;
      this.$refs.form.choose[1] = row.tspEquipmentModelId;
      this.$refs.form.choose[2] = row.tspEquipmentModelId;
      this.$refs.form.newKey++;
      console.log(this.$refs.form.choose);
      this.$refs.form.title = "编辑设备";
      this.$refs.form.open = true;
    },
    handleInfo(row) {
      this.$refs.form.form = JSON.parse(JSON.stringify(row));
      this.$refs.form.form.tspEquipmentId = row.id;
      this.$refs.form.getSelectList();
      this.$refs.form.choose[0] = row.tspEquipmentTypeId;
      this.$refs.form.choose[1] = row.tspEquipmentModelId;
      this.$refs.form.choose[2] = row.tspEquipmentModelId;
      this.$refs.form.newKey++;
      console.log(this.$refs.form.choose);
      this.$refs.form.title = "设备详情";
      this.$refs.form.open = true;
    },
    // 删除
    handleDelete(row) {
      console.log("row:---------------------------------------" + row);
      this.$modal
        .confirm('是否确认删除设备型号为"' + row.name + '"的数据项？')
        .then(function () {
          return removes(row.id);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
      // .catch((reason) => {
      //   console.log("删除:", reason)
      //   // this.$message({
      //   //   type: "error",
      //   //   message: reason,
      //   // });
      // })
    },
    // 批量删除
    handleDeletes() {
      this.$confirm("是否确认删除所选设备型号数据项？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          console.log("批量删除", this.ids);
          removes(this.ids)
            .then((res) => {
              console.log("批量删除", res)
              if (res.code === 200) {
                console.log("批量删除 " + this.ids)
                this.$message({
                  type: "success",
                  message: "删除成功!",
                });
              } else {
                this.$message({
                  type: "warning",
                  message: res.data.errInfo.errmsg,
                });
              }
              this.getList();
            })
          //   .catch((reason) => {
          //     console.log("批量删除:", reason)
          //     // this.$message({
          //     //   type: "error",
          //     //   message: reason,
          //     // });
          // })
        })
      // .catch(() => {
      //   this.$message({
      //     type: "info",
      //     message: "已取消删除",
      //   });
      // });
    },
    // 导入
    handleImportEquipment() {
      this.upload.title = "用户导入";
      this.upload.open = true;
    },
    // 导出
    handleExport() {
      const query = this.queryParams;
      this.$modal
        .confirm("是否确认导出所有设备信息数据项？")
        .then(() => {
          this.exportLoading = true;
          return exportEquipment(query);
        })
        .then((response) => {
          this.$download.name(response.msg);
          this.exportLoading = false;
        })
        .catch(() => {
        });
    },
    /** 下载模板操作 */
    importTemplate() {
      console.log("下载设备模板访问到后端接口前------");
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
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },
    // 下拉列表
    getSelectList() {
      selectList(this.queryParams).then((res) => {
        console.log(res);
        this.selectList = res.result;
      });
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
  },
};
</script>
