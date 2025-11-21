<template>
  <!-- 授权用户 -->
  <el-dialog title="选择用户" :visible.sync="visible" width="1024px" top="5vh" append-to-body>
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="用户名称" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入用户名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号码" prop="phonenumber">
        <el-input
          v-model="queryParams.phonenumber"
          placeholder="请输入手机号码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row>
      <el-table ref="table" :data="userList" @select="handleSelectionChange" height="539px">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="用户名称" prop="userName" :show-overflow-tooltip="true" />
        <el-table-column label="用户昵称" prop="nickName" :show-overflow-tooltip="true" />
        <el-table-column label="邮箱" prop="email" :show-overflow-tooltip="true" />
        <el-table-column label="手机" prop="phonenumber" :show-overflow-tooltip="true" />
        <el-table-column label="状态" align="center" prop="status">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.status"/>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
      </el-table>

    </el-row>

    <el-row>
      <el-col :span="6" style="padding-top: 20px;">
        <el-badge :value="selectedUser.length">
          <el-popover
            placement="right"
            width="650"
            trigger="click">
            <el-table :data="selectedUser" height="500">
              <el-table-column label="序号" type="index" width="50" align="center"/>
              <el-table-column label="用户名称" prop="userName"/>
              <el-table-column label="用户昵称" prop="nickName"/>
              <el-table-column label="邮箱" prop="email"/>
              <el-table-column label="手机" prop="phonenumber"/>
            </el-table>
            <el-button slot="reference">已选用户</el-button>
          </el-popover>
        </el-badge>
      </el-col>
      <el-col :span="18">
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSelectUser" :disabled="this.selectedUser.length === 0">确 定</el-button>
      <el-button @click="visible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { unallocatedUserList, authUserSelectAll } from "@/api/system/role";
export default {
  dicts: ['sys_normal_disable'],
  props: {
    // 角色编号
    roleId: {
      type: [Number, String]
    }
  },
  data() {
    return {
      // 遮罩层
      visible: false,
      // 选中的用户
      selectedUser: [],
      // 总条数
      total: 0,
      // 未授权用户数据
      userList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        roleId: undefined,
        userName: undefined,
        phonenumber: undefined
      }
    };
  },
  methods: {
    // 显示弹框
    show() {
      this.selectedUser =[];
      this.total = 0;
      this.userList = [];

      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        roleId: this.roleId,
        userName: undefined,
        phonenumber: undefined
      }
      this.getList();
      this.visible = true;
    },
    
    // 多选框选中数据
    handleSelectionChange(selection, row) {
      let isSelected = selection.length && selection.indexOf(row) !== -1;
      if (isSelected) {
        this.selectedUser.push(row);
      } else {
        let newSelectedUser = [];
        for (let i = 0; i < this.selectedUser.length; i++) {
          if (this.selectedUser[i].userId !== row.userId) {
            newSelectedUser.push(this.selectedUser[i]);
          }
        }
        this.selectedUser = newSelectedUser;
      }
    },
    // 查询表数据
    getList() {
      unallocatedUserList(this.queryParams).then(res => {
        this.userList = res.rows;
        this.total = res.total;

        this.$nextTick(()=>{
          this.reloadCheck();
        })
      });
    },
    reloadCheck() {
      if(!this.$refs.table){
        return;
      }
      for (let i = 0; i < this.userList.length; i++) {
        let user = this.userList[i];
        this.selectedUser.forEach(item=>{
          if(item.userId === user.userId ){
            this.$refs.table.toggleRowSelection(user,true);
          }
        })
      }
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 选择授权用户操作 */
    handleSelectUser() {
      const roleId = this.queryParams.roleId;
      const userIds = this.selectedUser.map(item => item.userId).join(",");
      authUserSelectAll({ roleId: roleId, userIds: userIds }).then(res => {
        this.$modal.msgSuccess(res.msg);
        if (res.code === 200) {
          this.visible = false;
          this.$emit("ok");
        }
      });
    }
  }
};
</script>

<style scoped>
  /*去除el-table表头的全选框*/
  /deep/ .el-table__header-wrapper .el-checkbox {
    display: none;
  }
</style>
