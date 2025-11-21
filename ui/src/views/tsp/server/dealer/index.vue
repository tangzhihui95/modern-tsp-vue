<template>
  <div style="margin-top: 20px">
    <el-form label-width="80px" v-model="queryParams">
      <el-row style="padding-top: 12px" type="flex" align="top">
        <el-col :span="5">
          <el-form-item label="经销商名称：" label-width="110px" prop="search">
            <el-input
              type="input"
              placeholder="请输入经销商名称"
              maxlength="30"
              v-model="queryParams.search"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="地区：" label-width="80px">
            <el-col :span="7">
              <template>
                <el-select
                  v-model="provinceValue"
                  placeholder="请选择省"
                  @clear="clearProvince"
                  clearable
                  @change="getCity(provinceValue)"
                >
                  <el-option
                    v-for="province in provincesOpt"
                    :key="province.value"
                    :label="province.label"
                    :value="province.value"
                  >
                  </el-option>
                </el-select>
              </template>
            </el-col>
            <el-col :span="7">
              <template>
                <el-select
                  v-model="cityValue"
                  clearable
                  @clear="clearCity"
                  :disabled="disableCity"
                  placeholder="请选择市"
                  @change="getArea(cityValue)"
                >
                  <el-option
                    v-for="city in cityTreesOpt"
                    :key="city.value"
                    :label="city.label"
                    :value="city.value"
                  >
                  </el-option>
                </el-select>
              </template>
            </el-col>
            <el-col :span="7">
              <template>
                <el-select
                  v-model="areaValue"
                  clearable
                  :disabled="disableArea"
                  placeholder="请选择区"
                  @change="chooseArea(areaValue)"
                >
                  <el-option
                    v-for="area in areaTreesOpt"
                    :key="area.value"
                    :label="area.label"
                    :value="area.value"
                  >
                  </el-option>
                </el-select>
              </template>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-button type="primary" @click="handleSearch" style="margin-left: 2%"
            >查 询</el-button
          >
          <el-button @click="clear">清空条件</el-button>
        </el-col>
      </el-row>
      <el-row class="mb20" :gutter="10" style="margin-left: 20px">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
            v-hasPermi="['tsp:dealer:add']"
            >新增</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDeletes"
            v-hasPermi="['tsp:dealer:deletes']"
            >批量删除</el-button
          >
        </el-col>
      </el-row>
    </el-form>
    <el-table :data="dealerList" @selection-change="handleSelectionChange" row-key="id">
      <el-table-column type="selection" width="50" align="center" :reserve-selection="true"/>
      <el-table-column label="序号" type="index" width="50" align="center">
        <template slot-scope="scope">
          <span>{{
            (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="经销商名称" align="center" prop="dealerName" />
      <el-table-column label="地址" align="center" prop="dealerAddress" />
      <el-table-column label="联系电话" align="center" prop="dealerPhone" />
      <el-table-column label="编辑时间" align="center" prop="updateTime" />
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
            v-hasPermi="['tsp:dealer:edit']"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleInfo(scope.row)"
            v-hasPermi="['tsp:dealer:get']"
            >详情</el-button
          >

          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDeleteOne(scope.row)"
            v-has-permi="['tsp:dealer:delete']"
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
import { deletes, get, list, remove } from '@/api/tsp/dealer.js'
import eForm from '../dealer/eForm/index.vue'
import { areaTrees, cityTrees, provincesTrees } from '@/api/tsp/provinces.js'

export default {
  name: "dealer",
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
        provinceValue: null,
        cityValue: null,
        areaValue: null,
        dealerAddress: "",
      },
      title: "",
      // 遮罩层
      loading: true,
      dealerList: [],
      // 日期范围
      dateRange: [],
      //
      province: {
        label: null,
        value: null,
      },
      // 省
      provincesOpt: [],
      // 市
      cityTreesOpt: [],
      disableCity:true,
      //
      city: {
        label: null,
        value: null,
      },
      // 区
      areaTreesOpt: [],
      disableArea:true,
      //
      area: {
        label: null,
        value: null,
      },
      newKey: 1,
      cascaderProps: {
        //checkStrictly: true,// 父子节点是否互相关联,其余配置见官网
        lazy: true,
        lazyLoad: this.lazyLoad,
      },
      provinceValue: "",
      cityValue: "",
      areaValue: "",
      geocoder: null,
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
    provincesTrees().then((res) => {
      console.log("开始加载省份----");
      console.log(res.result);
      this.provincesOpt = res.result;
      console.log("赋值完毕---");
      console.log(this.provincesOpt);
    });
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
      console.log("开始查询----");
      list(this.queryParams).then((res) => {
        console.log("结束查询----");
        console.log(res.result.list);
        this.dealerList = res.result.list;
        this.total = res.result.total;
        loading.close();
      });
    },
    getCity(provinceValue) {
      this.disableArea = true;
      this.disableCity = false;
      this.queryParams.areaValue = null;
      this.queryParams.cityValue = null;
      this.areaValue = null;
      this.cityValue = null
      this.queryParams.provinceValue = provinceValue;
      if (provinceValue != null && provinceValue != "") {
        cityTrees(provinceValue).then((res) => {
          console.log("开始加载省份下面的地级市----");
          console.log(res.result);
          this.cityTreesOpt = res.result;
          console.log("赋值完毕---");
          console.log(this.cityTreesOpt);
        });
      }
    },
    getArea(cityValue) {
      this.disableArea = false;
      this.queryParams.cityValue = cityValue;
      this.queryParams.areaValue = null;
      this.areaValue = null;
      if (cityValue != null && cityValue !== "") {
        areaTrees(cityValue).then((res) => {
          console.log("开始加载地级市下面的区/县----");
          console.log(res.result);
          this.areaTreesOpt = res.result;
          console.log("赋值完毕---");
          console.log(this.areaTreesOpt);
        });
      }
    },
    // 给区赋值
    chooseArea(areaValue) {
      this.queryParams.areaValue = areaValue;
      console.log(this.queryParams);
    },

    handleDeleteOne(row){
      this.$modal
        .confirm(`是否确认删除经销商名称为${row.dealerName}的数据项？`)
        .then(function () {
          return remove(row.id);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },

    handleDeletes() {
      this.$confirm("是否确认删除所选数据项？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          console.log(this.ids);
          deletes(this.ids).then((res) => {
            if (res.code === 200) {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
            }
            this.getList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
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
    clearProvince() {
      this.disableArea= true;
      this.disableCity= true;
      this.cityValue = "";
      this.areaValue = "";
      this.city = {
        label: null,
        value: null,
      };
      this.area = {
        label: null,
        value: null,
      };
    },
    clearCity() {
      this.areaValue = "";
      this.disableArea = true;
      this.area = {
        label: null,
        value: null,
      };
    },
    // 搜索
    handleSearch() {
      this.queryParams.pageNum = 1;

      if (this.provinceValue === null) {
      } else {
        this.queryParams.dealerAddress = this.provinceValue;
        if (this.cityValue === null) {
        } else {
          this.queryParams.dealerAddress =
            this.queryParams.dealerAddress + this.cityValue;
          if (this.areaValue === null) {
          } else {
            this.queryParams.dealerAddress =
              this.queryParams.dealerAddress + this.areaValue;
          }
        }
      }
      console.log(this.queryParams);
      this.getList();
    },
    // 清除表单
    clear() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        provinceValue: "",
        cityValue: "",
        areaValue: "",
      };
      this.provinceValue = null;
      this.cityValue = "";
      this.areaValue = "";
      this.clearCity();
      this.clearProvince();
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
        this.$refs.form.form.tspDealerId = row.id;
        this.$refs.form.form.isUpdateMarkerPosition = true;
        this.$refs.form.open = true;

        // this.openInfo();
      });
    },
    // 查看详情
    handleInfo(row) {
      get(row.id).then((res) => {
        this.$refs.form.title = "查看详情";
        this.$refs.form.form = res.result;
        this.$refs.form.form.isUpdateMarkerPosition = true;
        this.$refs.form.open = true;

        // this.openInfo();
      });
    },

    openInfo() {
      if (this.geocoder === null) {
        this.geocoder = new BMap.Geocoder();
      }
      this.$refs.form.open = true;
      this.geocoder.getPoint(
        this.$refs.form.form.dealerAddress,
        (point) => {
          if (point) {
            this.$refs.form.form.dealerLngLat = point;
            this.$refs.form.open = true;
          } else {
            console.log("您选择的地址没有解析到结果！");
          }
        },
        "全国"
      );
    },
  },
};
</script>

<style></style>
