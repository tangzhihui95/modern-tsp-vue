<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="1300px"
      append-to-body
      :before-close="cancel"
      v-if="open"
    >
      <el-form ref="vehicleInfoForm" :model="form" label-width="80px">
        <el-tabs @tab-click="handleClickTab" v-model="curTabName">
          <el-tab-pane label="基本信息">
            <ExFactory ref="exFactoryForm" :form="form" v-if="open" :title="title" />
          </el-tab-pane>
          <el-tab-pane label="销售信息">
            <Sale ref="saleForm" :form="form" :title="title" />
          </el-tab-pane>
          <el-tab-pane label="上牌信息">
            <UpPlace ref="upPlaceForm" :form="form" :title="title" />
          </el-tab-pane>
          <el-tab-pane label="绑定信息">
            <Bind ref="bindForm" :form="form" :title="title" />
          </el-tab-pane>
          <el-tab-pane label="出入库记录">
            <Stock ref="stockForm" :form="form" :title="title" />
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import ExFactoryInfo from "./exFactoryForm/index.vue";
import ExFactory from "../exFactory/index.vue";
import Sale from "../sale/index.vue";
import UpPlace from "../upPlace/index.vue";
import Bind from "../bind/index.vue";
import Stock from "../stock/index.vue";
export default {
  name: "VehicleInfoForm",
  components: { ExFactory, Sale, UpPlace, Bind, Stock },
  created() {
    // this.$nextTick(() => {
    //   this.$refs.ExFactory.form = this.form;
    // });
  },
  data() {
    return {
      form: { id: "" },
      open: false,
      title: "查看详情",
      curTabName: "0",
    };
  },
  methods: {
    openAndInit() {
      if (this.form.priceTax === null) {
        //为解决查看详情->销售信息->价税合计(小写)为null时仍显示0.00
        this.form.priceTax = undefined;
      }

      this.curTabName = "0";
      this.open = true;
    },

    cancel() {
      this.form = {};
      this.open = false;
    },
    handleClickTab(tab, event) {
      console.log("curTabName: ", this.curTabName);

      if (this.curTabName === "1") {  //销售信息
        if (this.$refs.saleForm.form.salesUnitAddress) {
          //为解决查看详情->销售信息->销货单位地址未自适应高度
          let salesUnitAddress = this.$refs.saleForm.form.salesUnitAddress;
          this.$refs.saleForm.form.salesUnitAddress = salesUnitAddress + " ";
        }
      }
    }
  },
};
</script>

<style lang="scss" scoped>

::v-deep input:disabled::-webkit-input-placeholder {
  -webkit-text-fill-color: rgba(255,255,255,0);
}
 
::v-deep textarea:disabled::-webkit-input-placeholder {
  -webkit-text-fill-color: rgba(255,255,255,0);
}

</style>
