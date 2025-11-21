<template>
  <div class="app-container">
    <el-row>
      <el-steps :active="active" finish-status="success" simple>
        <el-step title="出厂信息"></el-step>
        <el-step title="销售信息"></el-step>
        <el-step title="上牌信息"></el-step>
        <el-step title="绑定信息"></el-step>
        <el-step title="出入库记录"></el-step>
      </el-steps>
    </el-row>
    <el-row :gutter="20">
      <exFactory
        ref="exFactoryForm"
        v-if="this.active === 0"
        style="width: 100%"
        :form="form"
      />
      <Sale
        ref="saleForm"
        v-if="this.active === 1"
        style="width: 100%"
        :form="form"
      />
      <UpPlace
        ref="upPlaceForm"
        v-if="this.active === 2"
        style="width: 100%"
        :form="form"
      />
      <Bind
        ref="bindForm"
        v-if="this.active === 3"
        style="width: 100%"
        :form="form"
      />
      <Stock ref="stockForm" v-if="this.active === 4" style="width: 100%" />
    </el-row>

    <div slot="footer" class="dialog-footer" style="margin-left: 40%">
      <el-button type="primary" @click="save()" v-if="this.active !== 4"
        >保 存</el-button
      >
      <el-button type="primary" @click="comeBack()" v-if="this.active !== 0"
        >上一步</el-button
      >
      <el-button type="warning" @click="next()" v-if="this.active !== 4"
        >下一步</el-button
      >
      <!-- <el-button type="primary" @click="sendNewCard()" v-if="this.active === 0 && this.title === '编辑车辆'"
        >推送新卡号</el-button
      >
      <el-button type="primary" @click="changeVehicleCard()" v-if="this.active === 0 && this.title === '编辑车辆'"
        >更换车联网卡</el-button
      > -->
      <el-button @click="cancel" v-if="this.active !== 4">取 消</el-button>
      <el-button @click="cancel" v-if="this.active === 4">完 成</el-button>
    </div>
  </div>
</template>

<script>
import { list, add, edit,saleNameList, } from "@/api/tsp/vehicle.js";
import { provincesTrees } from "@/api/tsp/provinces.js";
import exFactory from "../vehicleForm/exFactory/index.vue";
import UpPlace from "./upPlace/index.vue";
import Sale from "./sale/index.vue";
import Bind from "./bind/index.vue";
import Stock from "./stock/index.vue";
import router from "../../../../router";
export default {
  name: "VehicleForm",
  components: { exFactory, Sale, UpPlace, Bind, Stock },
  data() {
    return {
      title: "",
      // 遮罩层
      loading: true,
      active: 0,
      // 表单参数
      form: {
        provincesTreeOpt: [],
      },
      provincesTreeOpt:[],
      tspVehicleId: "",
      refreshForm: {},
      refreshTitle: "",
      state: "save",
      activeName: "exFactoryForm",
    };
  },
  created() {
    window.addEventListener("beforeunload", (e) => this.beforeunloadFn(e));
    this.title = this.$route.query.title;
    if (this.$route.query.form) {
      this.form = this.$route.query.form;
    }
    // console.log(this.title);
    // console.log(this.form);
    if (this.title !== '查看详情') {
      this.getProvincesTrees();
    }
    // console.log(this.form);
  },
  mounted() {},
  destroyed() {
    window.removeEventListener("beforeunload", (e) => this.beforeunloadFn(e));
  },
  // mounted(){
  //   this.cancel();
  // },
  methods: {
    getProvincesTrees() {
      provincesTrees().then((res) => {
        this.provincesTreeOpt = res.result;
        this.form.provincesTreeOpt = this.provincesTreeOpt
      });
    },
    beforeunloadFn(e) {
      console.log("刷新或关闭");
      this.finalCart();
    },
    /** 查询列表 */
    getList() {
      this.loading = true;
      list(this.queryParams).then((res) => {
        this.equipmentList = res.result.list;
        this.total = res.result.total;
        this.loading = false;
      });
    },
    next(val) {
      this.submitForm();

      this.openNextView();
    },
    openNextView() {
      if (this.active === 0) {
        console.log("下一步到销售信息...")
      }
      if (this.active === 1){
        console.log("下一步到上牌信息...")
      }
      if (this.active === 2){
        console.log("下一步到绑定信息...")
      }
      if (this.active === 3){
        console.log("下一步到出入库记录...")
      }

      this.state = "next";
    },

    save() {
      this.state = "save";
      this.submitForm();
    },
    comeBack() {
      console.log("active : "+this.active);
      this.title = "编辑车辆";
      console.log(this.title)
      this.openBackView();
    },
    openBackView() {
      if (this.active === 0) {
        this.$router.go(-1);
        console.log("返回到车辆信息管理...")
      }
      if (this.active === 1){
        this.active = 0;
        console.log("返回到出厂信息...")
      }
      if (this.active === 2){
        this.active = 1;
        console.log("返回到销售信息...")
      }
      if (this.active === 3){
        this.active = 2;
        console.log("返回到上牌信息...")
      }
      if (this.active === 4){
       this.active = 3;
       console.log("返回到绑定信息...")
      }
    },
    cancel() {
      for (let i = 0; i < this.$store.state.tagsView.visitedViews.length; i++) {
        if (
          this.$store.state.tagsView.visitedViews[i].name == this.$route.name
        ) {
          this.$closeSelectedTag(this.$store.state.tagsView.visitedViews[i]);
        }
      }
      this.$router.push({
        name: "Vehicle",
      });
    },
    submitForm() {
      var flag = false;
      if (this.active === 0) {
        flag = this.$refs.exFactoryForm.validateForm();
      }
      if (this.active === 1) {
        flag = this.$refs.saleForm.validateForm();
      }
      if (this.active === 2) {
        console.log(this.$refs.upPlaceForm)
        flag = this.$refs.upPlaceForm.validateForm();
      }
      if (this.active === 3) {
        flag = this.$refs.bindForm.validateForm();
      }
      if (this.active >= 1) {
        this.title = "编辑车辆";
        console.log(this.form.provincesTreeOpt);
      }
      this.form.progress = this.active + 1;
      console.log(flag);
      if (flag === true) {
        console.log("准备提交表单");
        if (this.title === "新增车辆") {
          console.log(this.form);
          add(JSON.parse(JSON.stringify(this.form))).then((res) => {
            console.log("添加是否成功了：");
            console.log(res);
            if (res.code === 200) {
              this.form = res.result;
              this.tspVehicleId = res.result.id;
              console.log(res.result.id);
              this.form.tspVehicleId = this.tspVehicleId;
              this.$modal.msgSuccess("保存成功");
              this.tspVehicleId = "";
              if (this.active++ > 3) {
                this.active = 0;
              }
              if (this.active === 3) {
                this.form.isComplete = true;
              }
            }
          });
        } else {
          console.log("执行编辑");
          this.form.provincesTreeOpt = this.provincesTreeOpt;
          if (this.$route.query.tspVehicleId) {
            this.form.tspVehicleId = this.$route.query.tspVehicleId;
          }
          edit(JSON.parse(JSON.stringify(this.form))).then((res) => {
            if (res.code === 200) {
            this.$modal.msgSuccess("保存成功");
            if (this.active++ > 3) {
                this.active = 0;
              }
              if (this.active === 3) {
                this.form.isComplete = true;
              }
              console.log(this.active);
          }
          });
        }
      } else if (flag === false) {
        console.log(this.state);
        console.log("表单验证失败");
      }
    },
    // sendNewCard() {

    // },
    // changeVehicleCard() {

    // },
    // 表单重置
    reset() {
      this.form = {};
      this.state = "save";
      this.resetForm("form");
    },
    formData() {},
  },
};
</script>

<style>
</style>
