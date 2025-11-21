
export default {
  data() {
    return {
      loading: true, list: [], page: 1, size: 10, total: 0, url: '', params: {}, query: {}, isAdd: false
    }
  },
  methods: {
    hasPermission(val) {
      if (val == null || val === '') {
        return false
      }
      // 判断是否包含操作权限,暂时没用
      // return this.permission.includes(`${this.permsKey}:${val}`)
      return true
    },
    pageChange(e) {
      this.page = e
      this.initList()
    },
    sizeChange(e) {
      this.page = 1
      this.size = e
      this.initList()
    },
    toQuery() {
      this.page = 1
      this.initList()
    },
    indexMethod(index) {
      return (index + 1) + ((this.page - 1) * this.size)
    }
  }
}
