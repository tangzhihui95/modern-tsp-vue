<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default { 
  name: 'App',
  metaInfo() {
    return {
      title: this.$store.state.settings.dynamicTitle && this.$store.state.settings.title,
      titleTemplate: title => {
        return title ? `${title} - ${process.env.VUE_APP_TITLE}` : process.env.VUE_APP_TITLE
      }
    }
  }
}
</script>
<style lang="scss">
.ellipsis2 {
  display: -webkit-box;
  word-break: break-all;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
}
.red{
  color: #F56C6C;
}
.yellow{
  color: #E6A23C;
}
.green{
  color: #67C23A;
}
.el-picker-panel__footer .el-button--text.el-picker-panel__link-btn {
  display: none;
}
.options{
  .el-alert .el-alert__description{
    margin: 0 0 !important;
  }
}
</style>
