<template>
  <div class="add-car">
    <el-form :inline="true" :model="queryParams" class="fence-form">
      <el-form-item label="VIN:">
        <el-input
          v-model="queryParams.search"
          placeholder="请输入设备SN、VIN、车牌号"
          clearable
          style="min-width: 210px"
        ></el-input>
      </el-form-item>
      <el-form-item label="关联账号:">
        <el-select
          v-model="queryParams.mobile"
          placeholder="请选择关联账号"
          clearable
        >
          <el-option
            v-for="item in relationMobileOption"
            :key="item.mobile"
            :label="item.mobile"
            :value="item.mobile"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="clickQuery">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain @click="clear">清空条件</el-button>
      </el-form-item>
    </el-form>
    <div class="car-table">
      <el-table :data="carList" border @selection-change="handleSelectionChange" ref="vehicleList" row-key="id">
        <el-table-column type="selection" width="50" align="center" :reserve-selection="true"/>
        <el-table-column label="序号" type="index" width="50" align="center">
          <template slot-scope="scope">
            <span>{{
              (queryParams.pageNum - 1) * queryParams.pageSize +
              scope.$index +
              1
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="VIN" align="center" prop="vin" />
        <el-table-column label="车型" align="center" prop="stdModeName" />
        <el-table-column label="关联账号" align="center" prop="mobile" />
        <el-table-column label="车主姓名" align="center" prop="realName" />
      </el-table>

      <el-row style="padding-top: 20px;">
        <el-col :span="6">
          <el-badge :value="selectedCarList.length">
            <el-popover
              placement="right"
              width="768"
              trigger="click">
              <el-table :data="selectedCarList" height="500">
                <el-table-column label="序号" type="index" width="50" align="center"/>
                <el-table-column label="VIN" align="center" prop="vin" />
                <el-table-column label="车型" align="center" prop="stdModeName" />
                <el-table-column label="关联账号" align="center" prop="mobile" />
                <el-table-column label="车主姓名" align="center" prop="realName" />
              </el-table>
              <el-button slot="reference">已选车辆</el-button>
            </el-popover>
          </el-badge>
        </el-col>
        <el-col :span="18">
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
        </el-col>
      </el-row>

      <div class="btn-box">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="onSubmit" :disabled="this.selectedCarList.length === 0">确定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {list, relationMobileOption} from "@/api/tsp/vehicle.js";
export default {
  data() {
    return {
      total: 0,
      queryParams: {
        search: "",
        mobile: "",
        pageNum: 1,
        pageSize: 10,
      },
      // 关联车辆
      carList: [],

      // 关联账号
      relationMobileOption: [],

      // 选中的车辆
      selectedCarList: [],
      initSelection: false,
    };
  },
  created() {
    
  },
  methods: {
    // 关联账号下拉列表
    getRelationMobileOption() {
      relationMobileOption().then((res) => {
        this.relationMobileOption = res.result;
      });
    },
    
    // 多选框选中数据
    handleSelectionChange(selection) {
      if (!this.initSelection) {
        this.selectedCarList = selection;
      }
    },

    open(selectedCarList) {
      this.init(selectedCarList);

      this.getList();
      this.getRelationMobileOption();
    },

    init(selectedCarList) {
      this.initSelection = true;
      this.total = 0;
      this.carList = [];
      if (selectedCarList) {
        this.selectedCarList = selectedCarList;

        for (let i = 0; i < this.selectedCarList.length; i++) {
          this.$refs.vehicleList.toggleRowSelection(selectedCarList[i],true);
        }
      } else {
        this.selectedCarList = [];
      }
      
      // 清空查询条件
      this.queryParams = {
        search: "",
        mobile: "",
        pageNum: 1,
        pageSize: 10,
      };

      this.initSelection = false;
    },

    clear() {
      this.init(this.selectedCarList);

      this.getList();
    },
    // 点击查询
    clickQuery() {
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
    getList() {
      this.loading = true;
      list(this.queryParams).then((res) => {
        this.carList = res.result.list;
        this.total = res.result.total;
        this.loading = false;

        this.$nextTick(()=>{
          this.reloadCheck();
        })
      });
    },

    reloadCheck() {
      if(!this.$refs.vehicleList){
        return;
      }
      for (let i = 0; i < this.carList.length; i++) {
        let car = this.carList[i];
        this.selectedCarList.forEach(item=>{
           if(item.id === car.id ){
            this.$refs.vehicleList.toggleRowSelection(car,true);
           }
        })
      }
    },

    cancel() {
      this.$emit('cancel');
    },
    onSubmit() {
      this.$emit('add', this.selectedCarList);
    }
  },
};
</script>

<style lang="scss" scoped>
.add-car {
  padding: 20px;
  box-sizing: border-box;
  .pagination {
    margin-top: 20px;
  }
  .btn-box {
    margin-top: 20px;
    text-align: right;
  }
}
</style>
