<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['tsp:vehicleType:add']"
          >新增分类</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          v-hasPermi="['tsp:vehicleType:deletes']"
          @click="handleDeletes"
          >批量删除</el-button
        >
      </el-col>
    </el-row>

    <el-table
      :data="vehicleTypeList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="序号" type="index" width="50" align="center">
        <template slot-scope="scope">
          <span>{{
            (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="车辆分类" align="center" prop="typeName" />
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
            v-hasPermi="['tsp:vehicleType:edit']"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['tsp:vehicleType:remove']"
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
    <eForm ref="form" />
  </div>
</template>

<script>
import { list, removes } from "@/api/tsp/vehicleType.js";
import eForm from "../vehicleType/eForm/index.vue";
export default {
name: "VehicleType",
  components: { eForm },
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
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 用户表格数据
      vehicleTypeList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      // 表单校验
      rules: {},
    };
  },
  watch: {},
  created() {
    this.getList();
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      list(this.queryParams).then((res) => {
        this.vehicleTypeList = res.result.list;
        this.total = res.result.total;
        this.loading = false;
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
      this.$refs.form.title = "新增车型分类";
      this.$refs.form.open = true;
    },
    // 编辑
    handleUpdate(row) {
      console.log(row);
      this.$refs.form.form = row;
      this.$refs.form.form.tspVehicleTypeId = row.id;
      this.$refs.form.title = "编辑车型分类";
      this.$refs.form.open = true;
    },
    // 删除
    handleDelete(row) {
      this.$modal
        .confirm('是否确认删除车型分类类型为"' + row.typeName + '"的数据项？')
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
    handleDeletes(){
      this.$confirm("是否确认删除所选车型分类的数据项？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          removes(this.ids).then((res) => {
          console.log("res：");
          console.log(res);
          if (res.code == 200) {
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
  },
}
</script>

<style>

</style>