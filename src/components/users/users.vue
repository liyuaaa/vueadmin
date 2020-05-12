<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <el-row>
        <!-- 文本搜索框 -->
        <el-col :span="8" class="searchBox">
          <el-input placeholder="请输入内容" v-model="queryUser.query" clearable @clear="getUserData">
            <el-button slot="append" icon="el-icon-search" @click="getUserData"></el-button>
          </el-input>
        </el-col>
        <!-- 添加用户按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="addUsers">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="usersList" stripe style="width: 100%">
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column prop="username" label="姓名" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template v-slot="scoped">
            <el-switch
              v-model="scoped.row.mg_state"
              @change="setState(scoped.row.id,scoped.row.mg_state)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scoped">
            <el-button type="primary" icon="el-icon-edit" circle @click="editUsers(scoped.row.id)"></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              @click="deleteUsers(scoped.row.id)"
            ></el-button>
            <el-tooltip effect="dark" content="角色管理" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-star-off"
                circle
                @click="rolesUsers(scoped.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryUser.pagenum"
        :page-sizes="[2, 3, 5, 10]"
        :page-size="queryUser.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="usersCount"
      ></el-pagination>
    </el-card>

    <!-- 添加用户弹出框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addClear">
      <el-form :model="addRuleForm" :rules="addRules" ref="addRuleFormRef" label-width="100px">
        <el-form-item label="用户名:" prop="username">
          <el-input v-model="addRuleForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码:" prop="password">
          <el-input v-model="addRuleForm.password" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="邮箱:" prop="email">
          <el-input v-model="addRuleForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="电话号码:" prop="mobile">
          <el-input v-model="addRuleForm.mobile" placeholder="请输入电话号码"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDialogEnter">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑用户弹出框 -->
    <el-dialog title="编辑用户" :visible.sync="editDialogVisible" width="50%" @close="editClear">
      <el-form :model="editRuleForm" :rules="editRules" ref="editRuleFormRef" label-width="100px">
        <el-form-item label="用户名:" prop="username">
          <el-input v-model="editRuleForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱:" prop="email">
          <el-input v-model="editRuleForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="电话号码:" prop="mobile">
          <el-input v-model="editRuleForm.mobile" placeholder="请输入电话号码"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogEnter">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 角色管理弹出框 -->
    <el-dialog title="用户管理" :visible.sync="rolesDialogVisible" width="50%" @close="rolesClose">
      <el-form :model="rolesRuleForm" label-width="100px">
        <h3>当前用户：{{rolesRuleForm.username}}</h3>
        <h3>当前角色：{{rolesRuleForm.role_name}}</h3>
        <!-- 下拉框 -->
        <el-select v-model="rolesSelectData" placeholder="请选择">
          <el-option
            v-for="item in rolesData"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDialogEnter">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 自定义邮箱表单验证
    const validateEmail = (rule, value, callback) => {
      const regEmail = /^([0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2})+/
      // 判断输入的数据是否和验证的内容相匹配
      if (regEmail.test(value)) return callback()
      callback(new Error('请输入合法的邮箱!'))
    }
    // 自定义电话表单验证
    const validateMobile = (rule, value, callback) => {
      const regMobile = /^([1][358][0-9][0-9]{8})|([1][4][37][0-9]{8})|([1][7][01367][0-9]{8})+/
      // 判断输入的数据是否和验证的内容相匹配
      if (regMobile.test(value)) return callback()
      callback(new Error('请输入合法的电话号码！'))
    }
    return {
      /* 返回给后台来获取用户数据列表的参数 */
      queryUser: {
        query: '', // 查询参数
        pagenum: 1, // 当前页数
        pagesize: 5 // 每页显示条数
      },
      usersList: [], // 获取用户数据列表
      usersCount: 0, // 获取用户数据的总条数
      addDialogVisible: false, // 添加用户弹出框是否显示
      addRuleForm: {
        // 添加用户输入的数据
        username: '', // 用户名
        password: '', // 密码
        email: '', // 邮箱
        mobile: '' // 密码
      },
      addRules: {
        // 添加用户的表单验证
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ]
      },
      editDialogVisible: false, // 是否弹出编辑用户弹出框
      editRuleForm: {}, // 编辑用户的数据
      editRules: {
        // 编辑用户的表单验证
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ]
      },
      rolesDialogVisible: false, // 是否显示角色管理对话框
      rolesRuleForm: {}, // 角色管理对话框里面的数据
      rolesData: {}, // 获取用户管理的下拉数据
      rolesSelectData: '' // 获取下拉框选中的数据
    }
  },
  methods: {
    // 获取用户数据列表
    async getUserData() {
      const { data: res } = await this.$axios.get('users', {
        params: this.queryUser
      })
      if (res.meta.status != 200) {
        return this.$message.error('获取数据失败')
      }
      this.usersList = res.data.users
      this.usersCount = res.data.total
    },
    // 修改用户状态触发的事件
    setState(id, state) {
      this.$axios.put(`users/${id}/state/${state}`)
    },
    // 分页功能数量发生改变触发的事件
    handleSizeChange(Val) {
      this.queryUser.pagesize = Val
      this.getUserData()
    },
    // 分页功能页数发生改变触发的事件
    handleCurrentChange(Val) {
      this.queryUser.pagenum = Val
      this.getUserData()
    },
    // 点击添加用户按钮触发的事件
    addUsers() {
      this.addDialogVisible = true
    },
    // 点击添加用户弹出的关闭按钮触发的事件
    addClear() {
      // 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
      this.$refs.addRuleFormRef.resetFields()
    },
    // 点击添加用户弹出框的确认按钮触发的事件
    addDialogEnter() {
      // 判断表单验证是否通过
      this.$refs.addRuleFormRef.validate(async valid => {
        if (valid) {
          // 发送数据到后台进行添加用户
          const { data: res } = await this.$axios.post(
            'users',
            this.addRuleForm
          )
          this.addDialogVisible = false
          this.getUserData()
        } else {
          return false
        }
      })
    },
    // 点击编辑用户按钮触发的事件
    async editUsers(id) {
      // 根据id在后台查询对应的编辑用户数据
      const { data: res } = await this.$axios.get(`users/${id}`)
      this.editRuleForm = res.data
      this.editDialogVisible = true
    },
    // 关闭编辑用户对话框触发的事件
    editClear() {
      // 移除编辑用户的表单验证
      this.$refs.editRuleFormRef.resetFields()
    },
    // 点击编辑用户对话框的确认按钮触发的事件
    async editDialogEnter() {
      const { data: res } = await this.$axios.put(
        `users/${this.editRuleForm.id}`,
        {
          email: this.editRuleForm.email,
          mobile: this.editRuleForm.mobile
        }
      )
      if (res.meta.status != 200) {
        return this.$message.error('更新数据失败！')
      }
      this.editDialogVisible = false
      this.getUserData()
    },
    // 点击删除按钮触发的事件
    deleteUsers(id) {
      this.$confirm('是否要删除这条用户信息？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$axios.delete(`users/${id}`)
          if (res.meta.status != 200) {
            return this.$message.error('删除用户数据失败!')
          }
          this.getUserData()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 点击角色管理按钮触发的事件
    async rolesUsers(rolesForm) {
      this.rolesRuleForm = rolesForm
      this.rolesDialogVisible = true
      // 获取下拉框的数据（角色列表）
      const { data: res } = await this.$axios.get('roles')
      this.rolesData = res.data
    },
    // 点击角色管理对话框的确定按钮触发的事件
    async addDialogEnter() {
      if (!this.rolesSelectData) return this.$message.error('请选择数据！！')
      const { data: res } = await this.$axios.put(
        `users/${this.rolesRuleForm.id}/role`,
        {
          rid: this.rolesSelectData
        }
      )
      if (res.meta.status != 200) {
        return this.$message.error('修改用户管理角色失败')
      }
      this.rolesDialogVisible = false
      this.getUserData()
    },
    // 关闭角色管理对话框触发的事件
    rolesClose() {
      this.rolesSelectData = ''
      this.rolesRuleForm = {}
    }
  },
  created() {
    // 获取用户数据列表
    this.getUserData()
  }
}
</script>

<style lang="less" scoped>
</style>
