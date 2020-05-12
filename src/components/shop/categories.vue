<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 内容区域 -->
    <el-card>
      <!-- 添加按钮 -->
      <el-button type="primary" @click="addCategories" class="addBtn">添加分类</el-button>
      <!-- 数据显示 -->
      <tree-table
        :data="categoriesList"
        :columns="columns"
        :expand-type="false"
        :show-index="true"
        index-text="#"
        :selection-type="false"
        border
      >
        <!-- 是否有效内容区域 -->
        <template slot="isOk" scope="scoped">
          <div class="isOkBox">
            <i class="el-icon-success" v-if="scoped.row.cat_pid===0"></i>
            <i class="el-icon-error isError" v-else></i>
          </div>
        </template>
        <!-- 排序内容区域 -->
        <template slot="order" scope="scoped">
          <el-tag v-if="scoped.row.cat_level===0" size="mini">一级</el-tag>
          <el-tag type="success" v-else-if="scoped.row.cat_level===1" size="mini">二级</el-tag>
          <el-tag type="warning" v-else size="mini">三级</el-tag>
        </template>
        <!-- 操作按钮 -->
        <template slot="option" scope="scoped">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="editCategories(scoped.row.cat_id)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="deleteCategories(scoped.row.cat_id)"
          >删除</el-button>
        </template>
      </tree-table>

      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>

      <!-- 添加数据弹出框 -->
      <el-dialog title="添加分类" :visible.sync="addDialogVisible" width="50%" @close="addClose">
        <el-form :model="addRuleForm" :rules="addRules" ref="addRuleForm" label-width="100px">
          <el-form-item label="分类名称:" prop="cat_name">
            <el-input v-model="addRuleForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="添加的分类:">
            <!-- 使用级联选择器来对数据进行渲染 -->
            <el-cascader
              v-model="addcategoriesData"
              :options="categoriesList"
              :props="addPropsData"
              @change="addCategoriesClick"
              clearable
            ></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addEnter">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑弹出框 -->
      <el-dialog title="编辑分类" :visible.sync="editDialogVisible" width="50%" @close="editClose">
        <el-form :model="editRuleForm" :rules="editRules" ref="editRuleForm" label-width="100px">
          <el-form-item label="分类名称:" prop="cat_name">
            <el-input v-model="editRuleForm.cat_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editEnter">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        // 获取数据请求的参数
        type: 3,
        pagenum: 1,
        pagesize: 3
      },
      categoriesList: [], // 获取商品分类数据
      columns: [
        // 第三方表格各列配置信息
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isOk'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'option'
        }
      ],
      total: 0, // 商品总数量
      addDialogVisible: false, // 添加商品对话框是否显示
      addRuleForm: {
        // 添加分类弹出框的数据
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      addRules: {
        // 添加分类弹出框的表单验证
        cat_name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ]
      },
      addPropsData: {
        // 级联选择器的配置信息
        checkStrictly: 'true',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      addcategoriesData: [], // 添加分类弹出框的级联选择器选中的数据
      editDialogVisible: false, // 编辑用户弹出框是否显示
      editRuleForm: {},
      editRules: {
        cat_name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 获取商品分类的数据
    async getCategoriesData() {
      const { data: res } = await this.$axios.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status != 200) {
        return this.message.error('获取数据失败!')
      }
      this.categoriesList = res.data.result
      this.total = res.data.total
    },
    // 分页功能数量发生变化触发的事件
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getCategoriesData()
    },
    // 分页功能页数发生变化触发的事件
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getCategoriesData()
    },
    // 点击添加分类按钮触发的事件
    addCategories() {
      this.addDialogVisible = true
      // 让级联选择器只有两层
      this.queryInfo.type = 2
      this.getCategoriesData()
    },
    // 添加弹出框的级联选择器选中触发的事件
    addCategoriesClick() {
      // 如果选中的数据长度大于1，证明选中的是第三级
      if (this.addcategoriesData.length > 1) {
        this.addRuleForm.cat_pid = this.addcategoriesData[1]
        this.addRuleForm.cat_level = 2
      } else if (this.addcategoriesData.length == 1) {
        // 证明选择的是第二级
        this.addRuleForm.cat_pid = this.addcategoriesData[0]
        this.addRuleForm.cat_level = 1
      } else {
        // 证明选择的是第一级
        this.addRuleForm.cat_pid = 0
        this.addRuleForm.cat_level = 0
      }
    },
    // 点击添加对话框的确认按钮触发的事件
    addEnter() {
      this.$refs.addRuleForm.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$axios.post(
            'categories',
            this.addRuleForm
          )
          if (res.meta.status != 201) {
            return this.$message.error('添加数据失败！')
          }
          this.queryInfo.type = 3
          this.addDialogVisible = false
          this.getCategoriesData()
          console.log(res)
        } else {
          return false
        }
      })
    },
    // 点击添加弹出框的关闭按钮触发的事件
    addClose() {
      this.$refs.addRuleForm.resetFields()
      this.queryInfo.type = 3
      this.getCategoriesData()
    },
    // 点击商品编辑按钮触发的事件
    async editCategories(id) {
      this.editDialogVisible = true
      // 根据id来查找编辑用户弹出框的数据
      const { data: res } = await this.$axios.get(`categories/${id}`)
      this.editRuleForm = res.data
      console.log(this.editRuleForm)
    },
    // 点击编辑弹出框确认按钮触发的事件
    async editEnter() {
      const { data: res } = await this.$axios.put(
        `categories/${this.editRuleForm.cat_id}`,
        {
          cat_name: this.editRuleForm.cat_name
        }
      )
      if (res.meta.status != 200) {
        return this.$message.error('更新数据失败！')
      }
      this.editDialogVisible = false
      this.getCategoriesData()
    },
    // 点击编辑弹出框关闭按钮触发的事件
    editClose() {
      this.$refs.editRuleForm.resetFields()
    },
    // 点击删除按钮触发的事件
    deleteCategories(id) {
      this.$confirm('此操作要删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$axios.delete(`categories/${id}`)
          if (res.meta.status != 200) {
            return this.$message.error('删除数据失败！')
          }
          this.$message.success('删除数据成功！')
          this.getCategoriesData()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  },
  created() {
    this.getCategoriesData()
  }
}
</script>
<style lang='less' scoped>
.addBtn {
  margin-bottom: 10px;
}
.isOkBox {
  i {
    color: green;
  }
  .isError {
    color: red;
  }
}
</style>
