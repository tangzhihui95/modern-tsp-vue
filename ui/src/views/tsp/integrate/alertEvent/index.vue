<template>
  <div class="app-container">
    <el-form label-width="80px" v-model="queryParams">
      <el-row type="flex" align="top">
        <el-col :span="6">
          <el-form-item label="告警规则名称" label-width="110px" prop="search">
            <el-input
              type="input"
              maxlength="30"
              v-model="queryParams.eventName"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-button @click="handleSearch" style="margin-left: 2%"
            >查 询</el-button
          >
          <el-button type="primary" @click="clear">重置</el-button>
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
          v-hasPermi="['tsp:alertEvent:add']"
          >告警配置</el-button
        >
      </el-col>
    </el-row>

    <el-table :data="datas">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="序号" type="index" width="50" align="center">
        <template slot-scope="scope">
          <span>{{
            (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="告警规则名称" align="center" prop="eventName" />
      <el-table-column label="告警等级" align="center" prop="eventLevel" />
      <el-table-column label="规则创建时间" align="center" prop="createTime" />
      <el-table-column label="创建用户" align="center" prop="createBy" />
      <el-table-column label="告警方式" align="center" prop="eventType" >
        <template slot-scope="scope">
          {{ scope.row.eventType === 1 ? "平台报警" : scope.row.eventType === 2 ? "短信报警" : scope.row.eventType === 3 ? "app端报警" : scope.row.eventType }}
        </template>
      </el-table-column>
      <el-table-column label="是否开启" align="center" prop="isOpen">
        <template slot-scope="scope">
          {{ scope.row.isOpen === true ? "已开启" : "已停用" }}
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
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['tsp:alertEvent:edit']"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleRemove(scope.row)"
            v-hasPermi="['tsp:alertEvent:delete']"
            >删除规则</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleSetState(scope.row)"
            v-hasPermi="['tsp:alertEvent:setState']"
            >{{ scope.row.isOpen === true ? "关闭" : "开启" }}</el-button
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
import { get, list, remove, setState } from '@/api/tsp/vehicleAlertEvent.js'
import eForm from './eForm/index.vue'

export default {
  components: { eForm },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 用户表格数据
      datas: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      open: false,
      title: "",
    };
  },
  created() {
    this.getList();
  },
  activated() {
    this.getList();
  },
  methods: {
    /** 查询列表 */
    getList() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      list(this.queryParams).then((res) => {
        this.datas = res.result.list;
        this.total = res.result.total;
        loading.close();
      });
    },
    handleSetState(row) {
      setState(row.id).then((res) => {
        this.$modal.msgSuccess("操作成功");
        this.getList();
      });
    },
    // 添加
    handleAdd() {
      console.log(this.$refs.form.title);
      this.$refs.form.title = "告警配置";
      this.$refs.form.open = true;
    },
    handleRemove(row){
      this.$modal
        .confirm('是否确认删除告警规则为"' + row.eventName + '"的数据项？')
        .then(function () {
          return remove(row.id);
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
        this.$refs.form.form = res.result;
        this.$refs.form.form.tspAlertEventId = res.result.id;
        let times = [];
        times.push(res.result.monitorStartTime);
        times.push(res.result.monitorEndTime);
        this.$refs.form.dateRange = times;
        console.log(this.$refs.form.dateRange);
        // this.$refs.form.dateRange[0] = res.result.monitorStartTime;
        // this.$refs.form.dateRange[1] = res.result.monitorEndTime;
      });
      this.$refs.form.title = "编辑";
      this.$refs.form.open = true;
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
    clear() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
      };
      this.dateRange = [];
      this.getList();
    },
  },
};
</script>

<style>
</style>
