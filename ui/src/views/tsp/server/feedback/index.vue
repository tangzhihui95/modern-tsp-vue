<template>
  <div>
    <el-form label-width="80px" v-model="queryParams">
      <el-row style="padding-top: 12px" type="flex" align="top">
        <el-col :span="5">
          <el-form-item label="反馈内容" label-width="80px" prop="search">
            <el-input
              type="input"
              placeholder="请输入反馈内容"
              maxlength="30"
              v-model="queryParams.search"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="反馈时间" label-width="110px" prop="feedbackTime">
            <el-date-picker
              v-model="dateRange"
              style="width: 230px"
              value-format="yyyy-MM-dd HH:mm:ss "
              type="datetimerange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="forbiddenTime"
              clearable
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="处理状态" label-width="110px" prop="dealStatus">
            <el-select v-model="queryParams.dealStatus" clearable>
              <el-option label="待处理" :value="0"></el-option>
              <el-option label="已处理" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5" :offset="1">
          <el-button type="primary" @click="handleSearch" style="margin-left: 2%"
            >查 询</el-button
          >
          <el-button @click="clear">消除条件</el-button>
        </el-col>
      </el-row>
      <el-row class="mb20" :gutter="10" style="margin-left: 20px">
        <el-col :span="11" style="margin-left: 20px">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
            v-hasPermi="['tsp:feedback:add']"
            >反馈问题</el-button
          >
        </el-col>
      </el-row>
    </el-form>
    <el-table :data="feedbackList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="序号" type="index" width="50" align="center">
        <template slot-scope="scope">
          <span>{{
            (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="反馈内容" align="center" prop="feedbackContent" />
      <el-table-column label="反馈账号" align="center" prop="createBy" />
      <el-table-column label="反馈时间" align="center" prop="feedbackTime" />
      <el-table-column label="处理时间" align="center" prop="dealTime" />
      <el-table-column label="处理状态" align="center" prop="dealStatus">
        <template slot-scope="scope">
          {{ scope.row.dealStatus === 0 ? "待处理" : "已处理" }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="160"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.dealStatus === 0"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['tsp:feedback:deal']"
            >处理
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleInfo(scope.row)"
            v-hasPermi="['tsp:feedback:delete']"
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
import { list, get, down } from "@/api/tsp/feedback.js";
import eForm from "../feedback/eForm/index.vue";
export default {
  name: "feedback",
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
      feedbackList: [],
      // 日期范围
      dateRange: [],
      forbiddenTime:{
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 列表
    getList() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      console.log(this.queryParams);
      list(this.queryParams).then((res) => {
        console.log(res.result.list);
        this.feedbackList = res.result.list;
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

      this.queryParams.startTime = this.dateRange[0];
      this.queryParams.endTime = this.dateRange[1];
      this.getList();
    },
    // 清除表单
    clear() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
      };
      this.dateRange = [];
      this.getList();
    },
    // 发布信息
    handleAdd() {
      this.$refs.form.title = "新增";
      this.$refs.form.open = true;
    },
    // 查看详情
    handleInfo(row) {
      this.$modal
        .confirm('是否确认删除时间为："' + row.createTime + '"的数据项？')
        .then(function () {
          return down(row.id);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    // 编辑
    handleUpdate(row) {
      get(row.id).then((res) => {
        console.log(res);
        this.$refs.form.title = "处理";
        this.$refs.form.form = res.result;
        this.$refs.form.form.tspFeedbackId = row.id;
      });
      this.$refs.form.open = true;
    },
  },
};
</script>

<style></style>
