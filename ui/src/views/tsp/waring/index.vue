<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label-width="300" label="报警规则名称" prop="ruleName">
        <el-input
          v-model="queryParams.ruleName"
          placeholder="请输入报警规则名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
<!--      <el-form-item label="规则报警来源" prop="ruleSource">
        <el-input
          v-model="queryParams.ruleSource"
          placeholder="请输入报警规则来源"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="推送方式" prop="steelPhone">
        <el-input
          v-model="queryParams.steelPhone"
          placeholder="请输入推送方式"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
       <el-form-item label="推送次数" prop="sendCount">
        <el-input
          v-model="queryParams.sendCount"
          placeholder="请输入推送次数"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
<!--      <el-form-item label="预警类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择预警类型" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>-->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          :disabled="total>0"
          v-hasPermi="['system:info:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:info:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:info:remove']"
        >删除</el-button>
      </el-col>
<!--      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="handleExport"
          v-hasPermi="['system:info:export']"
        >导出</el-button>
      </el-col>-->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="infoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" align="center" prop="id" />
<!--      <el-table-column label="是否删除 1-是、0-否" align="center" prop="isDelete" />-->
      <el-table-column label="规则名称" align="center" prop="ruleName" />
<!--      <el-table-column label="规则描述" align="center" prop="ruleDetail" />
      <el-table-column label="规则来源" align="center" prop="ruleSource" />-->
      <el-table-column label="推送方式" align="center" prop="steelPhone" />
      <el-table-column label="推送次数" align="center" prop="sendCount" />
      <el-table-column label="预警距离(公里)" align="center" prop="waringDistance" />
      <el-table-column label="备注" align="center" prop="remark" />
<!--      <el-table-column label="预警类型" align="center" prop="type" />-->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:info:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:info:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改【请填写功能名称】对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="报警规则名称" prop="ruleName">
          <el-input v-model="form.ruleName" placeholder="请输入报警规则名称" clearable/>
        </el-form-item>
<!--        <el-form-item label="报警规则描述" prop="ruleDetail">
          <el-input v-model="form.ruleDetail" placeholder="请输入报警规则描述" />
        </el-form-item>
        <el-form-item label="报警规则来源" prop="ruleSource">
          <el-input v-model="form.ruleSource" placeholder="请输入报警规则来源" />
        </el-form-item>-->
        <el-form-item label="推送方式" prop="steelPhone">
          <el-checkbox-group v-model="checkList">
            <el-checkbox label="短信"></el-checkbox>
            <el-checkbox label="APP" disabled></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="推送次数" prop="sendCount">
          <el-input-number :disabled="true" v-model="form.sendCount" placeholder="请输入推送次数" /> 次
        </el-form-item>
        <el-form-item label="预警距离" prop="sendCount">
          <el-input-number :max="6" :min="1" v-model="form.waringDistance" placeholder="请输入预警距离" /> 公里
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" clearable/>
        </el-form-item>
<!--        <el-form-item label="预警类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择预警类型">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addInfo, delInfo, exportInfo, getInfo, listInfo, updateInfo } from '@/api/waring/info'

export default {
  name: "Info",
  data() {
    return {
      //复选框
      checkList:[],
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
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 【请填写功能名称】表格数据
      infoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        isDelete: null,
        ruleName: null,
        ruleDetail: null,
        ruleSource: null,
        steelPhone: null,
        sendCount: 1,
        type: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询【请填写功能名称】列表 */
    getList() {
      this.loading = true;
      listInfo(this.queryParams).then(response => {
        this.infoList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        isDelete: null,
        ruleName: null,
        ruleDetail: null,
        ruleSource: null,
        steelPhone: null,
        sendCount: 1,
        remark: null,
        type: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加移动报警规则";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getInfo(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改移动报警规则";
        this.checkList = row.steelPhone.split(',')
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          for (let i = 0;i<this.checkList.length;i++){

            console.log(this.checkList[i])
            console.log(this.checkList[i]!=="undefined")
            if(this.checkList[i]!=="undefined"){
              if (i===0){
                this.form.steelPhone = this.checkList[i];
              }else{
                this.form.steelPhone = this.form.steelPhone + "," + this.checkList[i]
              }
            }
          }
          if (this.form.id != null) {
            updateInfo(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addInfo(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除编号为"' + ids + '"的数据项？').then(function() {
        return delInfo(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有数据项？').then(() => {
        this.exportLoading = true;
        return exportInfo(queryParams);
      }).then(response => {
        this.$download.name(response.msg);
        this.exportLoading = false;
      }).catch(() => {});
    }
  }
};
</script>
