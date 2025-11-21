<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="1300px"
      append-to-body
      :before-close="cancel"
    >
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="用户管理" name="first">用户管理</el-tab-pane>
        <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
        <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import "@/drawer-drag/drawer-drag";
export default {
  name: "MonitorForm",
  data() {
    return {
      dateRange: "",
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {},
      activeName: "second",
      //地图数据
      mapData: {
        //中心坐标
        center: { lng: 0, lat: 0 },
        //缩放级别
        zoom: 5,
      },
      drawer: false,
    };
  },
  created() {},
  mounted() {
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    // 表单重置
    reset() {
      this.form = {};
      this.resetForm("form");
      this.dateRange = "";
    },
    submitForm() {},
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    mapHandler() {
    },
  },
};
</script>

<style>
</style>