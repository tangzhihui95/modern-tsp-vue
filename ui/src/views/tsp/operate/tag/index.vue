<template>
  <div>
    <el-form label-width="80px" v-model="queryParams">
      <el-row type="flex" align="top" style="padding-top: 12px;">
        <el-col :span="6">
          <el-form-item label="标签名字" label-width="110px" prop="search">
            <el-input
              type="input"
              placeholder="请输入标签"
              maxlength="30"
              v-model="queryParams.search"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="5" :offset="1">
          <el-button type="primary" @click="handleSearch"
            >查 询</el-button
          >
          <el-button @click="clear">清空条件</el-button>
        </el-col>
      </el-row>
      <el-row class="el-col-23" :gutter="10">
        <el-col :span="11" :offset="1" style="margin-bottom: 8px">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
            v-hasPermi="['tsp:tag:add']"
            >新增</el-button
          >
        </el-col>
      </el-row>
    </el-form>
    <el-table :data="tagList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="编号" type="index" width="50" align="center">
        <template slot-scope="scope">
          <span>{{
            (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" align="center" prop="tagName" />
      <el-table-column label="标签类型" align="center" prop="tagType">
        <template slot-scope="scope">
          {{ scope.row.tagType === 0 ? "用户标签" : "车辆标签" }}
        </template>
      </el-table-column>
      <el-table-column label="关联数量" align="center" prop="tagCount" />
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
            v-hasPermi="['tsp:tag:edit']"
            >编辑</el-button
          >
          <el-button
            style="color: red"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['tsp:tag:delete']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      style="margin-bottom: 6px"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryParams.pageNum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="queryParams.pageSize"
      layout="->,total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <eForm ref="form" />
  </div>
</template>

<script>
import { list, get, remove } from "@/api/tsp/tag.js";
import eForm from "../tag/eForm/index.vue";
export default {
  name: "tag",
  components: { eForm },
  data() {
    return {
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
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
      tagList: [],
      // 日期范围
      dateRange: [],
      newKey: 1,
      cascaderProps: {
        //checkStrictly: true,// 父子节点是否互相关联,其余配置见官网
        lazy: true,
        lazyLoad: this.lazyLoad,
      },
      provinceValue: "",
      cityValue: "",
      areaValue: "",
    };
  },
  watch: {
    newKey: {
      //只要监听到数据源发生变化 ，改变keyValue的值，达到重新渲染的效果
      optionsMts() {
        console.log(this.newKey);
        this.newKey++;
      },
    },
  },
  created() {
    this.getList();
  },
  activated() {
    console.log("标签管理")
    this.getList();
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
    // 列表
    getList() {
      this.loading = true;
      console.log("开始查询----");
      list(this.queryParams).then((res) => {
        console.log("结束查询----");
        console.log(res.result.list);
        this.tagList = res.result.list;
        this.total = res.result.total;
        this.loading = false;
      });
    },
    handleDelete(row) {
      this.$modal
        .confirm('是否确认删除标签名称为"' + row.tagName + '"的数据项？')
        .then(function () {
          return remove(row.id);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    areaChange(val) {
      console.log(val);
      if(val) {
        this.form.awardProvince = val[0];
        this.form.awardCity = val[1];
        this.form.awardArea = val[2];
      }
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
    // 搜索
    handleSearch() {
      this.queryParams.pageNum = 1;
      
      console.log(this.queryParams);
      this.getList();
    },
    // 清除表单
    clear() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
      };
      this.getList();
    },
    // 发布信息
    handleAdd() {
      this.$refs.form.title = "新增";
      this.$refs.form.open = true;
    },
    // 编辑
    handleUpdate(row) {
      get(row.id).then((res) => {
        this.$refs.form.title = "编辑";
        this.$refs.form.form = res.result;
        this.$refs.form.form.tspTagId = row.id;
      });
      this.$refs.form.open = true;
    },
    // 查看详情
    handleInfo(row) {
      get(row.id).then((res) => {
        this.$refs.form.title = "查看详情";
        this.$refs.form.form = res.result;
      });
      this.$refs.form.open = true;
    },
  },
};
</script>

<style>



</style>
