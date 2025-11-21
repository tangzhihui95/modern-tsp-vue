<template>
  <div class="app-container">
    <el-row>
      <el-divider content-position="left">出入库记录</el-divider>
    </el-row>
    <el-row>
      <el-col>
        <el-table :data="stockList" >
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="序号" type="index" width="50" align="center">
            <template slot-scope="scope">
              <span>{{
                (queryParams.pageNum - 1) * queryParams.pageSize +
                scope.$index +
                1
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="出入库类型" align="center" prop="sn" />
          <el-table-column label="出入库时间" align="center" prop="version" />
          <el-table-column label="出入库名称" align="center" prop="name" />
          <el-table-column label="操作用户" align="center" prop="name" />
          <el-table-column label="操作时间" align="center" prop="name" />
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { list } from "@/api/tsp/equipmentType.js";
export default {
  name: "Stock",
  props: {
    form: { type: Object },
    // form: {  },
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      total: 0,
      title:'',
      stockList: [],
    };
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      list(this.queryParams).then((res) => {
        console.log(res);
        this.equipmentList = res.result.list;
        this.total = res.result.total;
        this.loading = false;
      });
    },
  },
};
</script>

<style>
</style>
