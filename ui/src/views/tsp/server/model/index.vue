<template>
  <div class="fence">
    <el-form :inline="true" :model="queryParams" class="fence-form">
      <el-form-item label="短信模板标题:">
        <el-input
          v-model="queryParams.modelTitle"
          placeholder="请输入模板标题:"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain @click="clear">清空条件</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="add" plain icon="el-icon-plus"
          >新增短信模板</el-button
        >
      </el-form-item>
    </el-form>
    <div class="fence-table">
      <el-table :data="fenceList" border>
        <el-table-column label="序号" type="index" width="50" align="center">
          <template slot-scope="scope">
            <span>{{
              (queryParams.pageNum - 1) * queryParams.pageSize +
              scope.$index +
              1
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="模板标题" align="center" prop="modelTitle" />
        <el-table-column label="模板内容" align="center" prop="modelContent" />
        <el-table-column label="创建时间" align="center" prop="createTime" />
        <el-table-column
          label="操作"
          align="center"
          width="160"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="edit(scope.row)"
              >编辑</el-button
            >
            <el-button size="mini" type="text" @click="handleDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
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
    </div>
  </div>
</template>

<script>
import { listModel, add, edit, remove, get } from "@/api/tsp/model.js";
import eForm from "../model/eForm/index.vue";
export default {
  name: "model",
  components: { eForm },
  data() {
    return {
      queryParams: {
        modelTitle: "",
        pageNum: 1,
        pageSize: 10,
      },
      // 总条数
      total: 0,
      fenceList: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    clear() {
      // 清空查询条件
      this.queryParams.pageNum = 1;
      this.queryParams.modelTitle = "";
      
      this.getList();
    },
    add() {
      // 新建短信模板
      this.$refs.form.title = "新建短信模板";
      this.$refs.form.open = true;
    },
    edit(row) {
      // 编辑短信模板
      this.$refs.form.title = "编辑短信模板";
      get(row.id).then((res) => {
        this.$refs.form.form = res.result;
        this.$refs.form.form.tspModelId = row.id;
      });
      this.$refs.form.open = true;
    },
    // 点击查询
    onSubmit() {
      this.queryParams.pageNum = 1;

      this.getList();
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
    handleDelete(row){
      this.$confirm("是否确认删除所选数据项？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          remove(row.id).then((res) => {
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
    // 获取列表
    getList() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      listModel(this.queryParams).then((res) => {
        this.fenceList = res.result.list;
        this.total = res.result.total;
        loading.close();
      });
    },
    // 点击详情
    todetail(row) {
      this.$router.push({
        path: "fence/detail",
        query: {
          id: row.id,
          title: "详情",
        }
      })
    }
  },
};
</script>

<style lang="scss" scoped>
.fence {
  padding: 20px;
  box-sizing: border-box;
  .pagination {
    margin-top: 20px;
  }
}
</style>
