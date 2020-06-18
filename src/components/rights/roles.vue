<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-table :data="rolesList" stripe>
        <!-- 展开行 -->
        <el-table-column type="expand">
          <template v-slot="scoped">
            <el-row
              v-for="(item1,i1) in scoped.row.chidren"
              :key="item1.id"
              :class="[i1==0 ?'border_top':'']"
            >
              <!-- 一级菜单 -->
              <el-col :span="6">
                <el-tag closable @close="removeRolesItem(scoped.row,item1.id)">{{item1.authname}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级菜单 -->
              <el-col :span="18">
                <el-row v-for="item2 in item1.chidren" :key="item2.id">
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRolesItem(scoped.row,item2.id)"
                    >{{item2.authname}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="danger"
                      v-for="item3 in item2.chidren"
                      :key="item3.id"
                      closable
                      @close="removeRolesItem(scoped.row,item3.id)"
                    >{{item3.authname}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>

        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column prop="roleId" label="id"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column prop="roleDesc" label="操作" width="300px">
          <template v-slot="scoped">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editRoles(scoped.row.roleId)"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteRoles(scoped.row.roleId)"
            >删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-s-tools"
              size="mini"
              @click="authorityRoles(scoped.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑角色" :visible.sync="editDialogVisible" width="50%" @close="editClose">
      <el-form :model="editRuleForm" :rules="editRules" ref="editRuleForm" label-width="100px">
        <el-form-item label="角色名称">
          <el-select v-model="editSelect" :placeholder="editRuleForm.roleName">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.roleName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRuleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogEnter">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限弹出框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="authorityDialogVisible"
      width="50%"
      @close="closeAuthDialog"
    >
      <!-- 树形控件来显示数据 -->
      <el-tree
        :data="authorityList"
        show-checkbox
        node-key="id"
        :default-checked-keys="rolesDefKeys"
        :props="treeProps"
        default-expand-all
        ref="rolesTreeData"
      ></el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="authorityDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="authorityEnter">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [], // 获取表格数据
      editDialogVisible: false, // 编辑用户弹出框是否显示
      editRuleForm: {}, // 编辑用户获取到的数据
      editRules: {
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ]
      },
      editSelect: '', // 选择编辑弹出框的下拉框获取的数据
      authorityDialogVisible: false, // 分配权限弹出框是否显示
      treeProps: {
        // 分配权限树状的结构列表
        label: 'authname',
        chidren: 'chidren'
      },
      authorityList: [], // 分配权限的数据
      rolesDefKeys: [], // 获取分配权限勾选的数据
      rolesId: '' // 点击分配权限按钮对应的id
    }
  },
  methods: {
    // 获取角色列表的数据
    async getRolesData() {
      const { data: res } = await this.$axios.get('roles')
      console.log(res)
      if (res.meta.status != 200) {
        return this.error('获取数据失败！')
      }
      this.rolesList = res.data
    },
    // 点击角色列表展开行里面的角色管理权限的关闭按钮触发的事件
    removeRolesItem(roleId, rightId) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$axios.delete(
            `roles/${roleId.roleId}/rights/${rightId}`
          )
          console.log(res.data[0])
          if (res.meta.status != 200) {
            return this.$message.error('数据删除失败！')
          }
          this.$message.success('数据删除成功！')
          roleId.chidren = res.data[0].chidren
          console.log(roleId)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 点击编辑按钮做出的事件
    async editRoles(id) {
      this.editDialogVisible = true
      // 根据id查找角色
      const { data: res } = await this.$axios.get(`roles/${id}`)
      this.editRuleForm = res.data
      console.log(this.editRuleForm)
    },
    // 点击编辑用户弹出框的确认按钮做出的事件
    async editDialogEnter() {
      if (this.editSelect == '') {
        this.editSelect = this.editRuleForm.roleName
      }
      const { data: res } = await this.$axios.put(
        `roles/${this.editRuleForm.roleId}`,
        {
          roleName: this.editSelect,
          roleDesc: this.editRuleForm.roleDesc
        }
      )
      if (res.meta.status != 200) {
        return this.$message.error('更新数据失败！')
      }
      this.$message.success('更新数据成功！')
      this.getRolesData()
      this.editDialogVisible = false
    },
    // 点击编辑用户弹出框的关闭按钮触发的事件
    editClose() {
      this.editRuleForm = {}
      this.editSelect = ''
    },
    // 点击删除按钮触发的事件
    deleteRoles(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$axios.delete(`roles/${id}`)
          if (res.meta.status != 200) {
            return this.$message.error('数据删除失败！')
          }
          this.$message.success('数据删除成功！')
          this.getRolesData()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 点击分配权限按钮做出的事件
    async authorityRoles(scoped) {
      console.log(scoped)
      this.authorityDialogVisible = true
      // 获取数据
      const { data: res } = await this.$axios.get('rights/tree')
      this.authorityList = res.data
      console.log(this.authorityList)
      // 调用方法来获取勾选的数据
      this.getCheckedDefkeys(scoped, this.rolesDefKeys)
      // 把点击对应的id赋值给rolesId
      this.rolesId = scoped.roleId
    },
    // 根据对应的数据来查找该数据可勾选的数据
    getCheckedDefkeys(node, arr) {
      // 判断该数据是否有子节点，没有代表已经没有勾选的数据,并把数据赋值给第二个参数
      if (!node.chidren) {
        return arr.push(node.id)
      }
      // 使用遍历递归来把所有的子节点全部赋给第二个参数
      node.chidren.forEach(item => {
        this.getCheckedDefkeys(item, arr)
      })
    },
    // 关闭分配权限对话框做出的事件
    closeAuthDialog() {
      // 把获取的勾选数据清空，防止数据跟上一次叠加
      this.rolesDefKeys = []
    },
    // 点击分配权限弹出框的确认按钮做出的事件
    async authorityEnter() {
      // 获取选中的树形控件数据
      const rolesTreeData = [
        // ...表示获取展开数据里面的数据
        // getCheckedKeys若节点可被选择，则返回目前被选中的节点的 key 所组成的数组
        // getHalfCheckedKeys若节点可被选择,则返回目前半选中的节点的 key 所组成的数组
        ...this.$refs.rolesTreeData.getCheckedKeys(),
        ...this.$refs.rolesTreeData.getHalfCheckedKeys()
      ]
      console.log(rolesTreeData)
      console.log(this.rolesId)
      const rolesTreeDatas = rolesTreeData.join(',')
      const { data: res } = await this.$axios.post(
        `roles/${this.rolesId}/rights`,
        {
          rids: rolesTreeDatas
        }
      )
      if (res.meta.status != 200) {
        return this.message.error('更新数据失败！')
      }
      this.authorityDialogVisible = false
      this.getRolesData()
    }
  },
  created() {
    this.getRolesData()
  }
}
</script>
<style lang='less' scoped>
.el-tag {
  margin: 8px;
}
.el-row {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}
.border_top {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}
</style>
