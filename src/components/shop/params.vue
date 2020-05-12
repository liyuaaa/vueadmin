<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 内容区域 -->
    <el-card>
      <el-alert title="注意，只允许第三个分类设置相关参数" type="warning" show-icon :closable="false"></el-alert>
      <!-- 级联选择器来进行数据选中显示 -->
      <div class="selectShop">
        <span>请选择商品分类：</span>
        <el-cascader
          v-model="selectParamsData"
          :options="selectParamsList"
          :props="selectShopProp"
          @change="paramsChange"
        ></el-cascader>
      </div>
      <!-- 标签页显示数据 -->
      <el-tabs v-model="paramsActiveName" @tab-click="handleTabsClick">
        <!-- 动态参数 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加按钮 -->
          <el-button
            type="primary"
            size="mini"
            :disabled="addBtnDisabled"
            @click="addParamsShow"
          >添加动态参数</el-button>
          <!-- 表格 -->
          <el-table :data="paramsManyList" stripe style="width: 100%">
            <!-- 表格下拉数据 -->
            <el-table-column type="expand">
              <template v-slot="scoped">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item>
                    <el-tag
                      v-for="(item,i) in scoped.row.attr_vals"
                      :key="i"
                      closable
                      @close="paramsTagClose(scoped.row,i)"
                    >{{item}}</el-tag>
                    <!-- new Tag输入框 -->
                    <el-input
                      v-if="scoped.row.inputVisible"
                      class="input-new-tag"
                      v-model="scoped.row.paramsInputValue"
                      ref="saveTagInput"
                      size="small"
                      @keyup.enter.native="handleInputConfirm(scoped.row)"
                      @blur="handleInputConfirm(scoped.row)"
                    ></el-input>
                    <!-- new Tag按钮 -->
                    <el-button
                      v-else
                      class="button-new-tag"
                      size="small"
                      @click="showInput(scoped.row)"
                    >+ New Tag</el-button>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column prop="attr_name" label="动态参数名称" width="180"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scoped">
                <el-button
                  icon="el-icon-edit"
                  type="primary"
                  size="mini"
                  @click="editParamsShow(scoped.row)"
                >修改</el-button>
                <el-button
                  icon="el-icon-delete"
                  type="danger"
                  size="mini"
                  @click="deleteParams(scoped.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="addBtnDisabled"
            @click="addParamsShow"
          >添加静态属性</el-button>
          <!-- 表格 -->
          <el-table :data="paramsOnlyList" stripe style="width: 100%">
            <!-- 表格下拉数据 -->
            <el-table-column type="expand">
              <template v-slot="scoped">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item>
                    <el-tag
                      v-for="(item,i) in scoped.row.attr_vals"
                      :key="i"
                      closable
                      @close="paramsTagClose(scoped.row,i)"
                    >{{item}}</el-tag>
                    <!-- new Tag输入框 -->
                    <el-input
                      v-if="scoped.row.inputVisible"
                      class="input-new-tag"
                      v-model="scoped.row.paramsInputValue"
                      ref="saveTagInput"
                      size="small"
                      @keyup.enter.native="handleInputConfirm(scoped.row)"
                      @blur="handleInputConfirm(scoped.row)"
                    ></el-input>
                    <!-- new Tag按钮 -->
                    <el-button
                      v-else
                      class="button-new-tag"
                      size="small"
                      @click="showInput(scoped.row)"
                    >+ New Tag</el-button>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column prop="attr_name" label="动态参数名称" width="180"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scoped">
                <el-button
                  icon="el-icon-edit"
                  type="primary"
                  size="mini"
                  @click="editParamsShow(scoped.row)"
                >修改</el-button>
                <el-button
                  icon="el-icon-delete"
                  type="danger"
                  size="mini"
                  @click="deleteParams(scoped.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加弹出框 -->
    <el-dialog
      :title="'添加'+getParamsBtnData"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addClose"
    >
      <el-form :model="addRuleForm" :rules="addRules" ref="addRuleForm" label-width="100px">
        <el-form-item label="参数名称:" prop="attr_name">
          <el-input v-model="addRuleForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addEnter">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑弹出框 -->
    <el-dialog
      :title="'编辑'+getParamsBtnData"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editClose"
    >
      <el-form :model="editRuleForm" :rules="editRules" ref="editRuleForm" label-width="100px">
        <el-form-item label="参数名称:" prop="attr_name">
          <el-input v-model="editRuleForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editEnter">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectParamsList: [], // 获取级联选择器的数据显示
      selectParamsData: [], // 获取级联选择器选中的数据
      selectShopProp: {
        // 级联选择器的配置信息
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      paramsActiveName: 'many', // tabs标签页选中相应的数据,默认是动态参数
      paramsManyList: [], // 获取表格动态参数对应的数据
      paramsOnlyList: [], // 获取表格静态属性对应的数据
      addDialogVisible: false, // 添加弹出框是否显示
      addRuleForm: {
        // 添加弹出框输入的数据
        attr_name: ''
      },
      addRules: {
        // 添加弹出框的表单验证
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ]
      },
      editDialogVisible: false, // 编辑弹出框是否显示
      editRuleForm: {
        // 添加弹出框输入的数据
        attr_id: '',
        attr_name: ''
      },
      editRules: {
        // 添加弹出框的表单验证
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 获取级联选择器的数据
    async getSelectData() {
      const { data: res } = await this.$axios.get('categories')
      this.selectParamsList = res.data
    },
    // 获取参数列表数据
    async getParamsData() {
      if (this.selectParamsData.length < 3) {
        this.selectParamsData = []
        this.$message.error('请选择三级分类!!!')
        return
      }
      // 发送请求，获取相应的数据
      const { data: res } = await this.$axios.get(
        `categories/${this.selectParamsId}/attributes`,
        {
          params: {
            sel: this.paramsActiveName
          }
        }
      )
      res.data.forEach(item => {
        // 使用三元表达式，为了防止有一些是没有数据导致显示错误
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 下面这两个参数是来获取new Tag的数据，放在这里是避免所有new Tag数据共享，导致点击其中一个，其余都触发到
        item.inputVisible = false // new Tag是否显示输入框
        item.paramsInputValue = '' // new Tag输入框输入的数据
      })
      // 判断当前选中的是动态参数还是静态属性，并把相应的数据存放到各个位置中
      if (this.paramsActiveName == 'many') {
        this.paramsManyList = res.data
        console.log(this.paramsManyList)
      } else {
        this.paramsOnlyList = res.data
        console.log(this.paramsOnlyList)
      }
    },
    // 级联选择器选中触发的事件
    paramsChange() {
      // 调用获取参数信息的方法
      this.getParamsData()
    },
    // 点击tab标签页切换触发的事件
    handleTabsClick() {
      // 调用获取参数信息的方法
      this.paramsChange()
    },
    // new Tag点击触发的事件
    showInput(scoped) {
      scoped.inputVisible = true
      // 点击new Tag就获取焦点;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // new Tag文本框发生变化触发的事件
    handleInputConfirm(scoped) {
      // 判断是否有输入内容
      if (scoped.paramsInputValue.trim().length == 0) {
        scoped.paramsInputValue = ''
        scoped.inputVisible = false
        return
      }
      // 如果有输入内容，失去焦点或者点击回车按钮就添加到attr_vals中
      scoped.attr_vals.push(scoped.paramsInputValue.trim())
      scoped.paramsInputValue = ''
      scoped.inputVisible = false
      // 调用这个方法来对数据进行后台添加
      this.setHandleInputConfirm(scoped)
    },
    // 这个是来对new Tag数据更新添加进行操作
    async setHandleInputConfirm(scoped) {
      const { data: res } = await this.$axios.put(
        `categories/${this.selectParamsId}/attributes/${scoped.attr_id}`,
        {
          attr_name: scoped.attr_name, // 参数名称
          attr_sel: scoped.attr_sel,
          attr_vals: scoped.attr_vals.join(' ') // 需要把数据转为字符串，后台接收的是字符串数据
        }
      )
      if (res.meta.status != 200) {
        console.log(res)
        return this.$message.error('添加数据失败！')
      }
      this.$message.success('操作数据成功！')
    },
    // 点击数据中tag里面的关闭按钮触发的事件
    paramsTagClose(scoped, i) {
      // 删除对应的数据，并重新发送请求到后台
      scoped.attr_vals.splice(i, 1)
      this.setHandleInputConfirm(scoped)
    },
    // 点击添加按钮触发的事件
    addParamsShow() {
      this.addDialogVisible = true
    },
    // 点击添加弹出框的关闭按钮触发的事件
    addClose() {
      this.$refs.addRuleForm.resetFields()
    },
    // 点击添加弹出框的确认按钮触发的事件
    addEnter() {
      this.$refs.addRuleForm.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$axios.post(
            `categories/${this.selectParamsId}/attributes`,
            {
              attr_name: this.addRuleForm.attr_name,
              attr_sel: this.paramsActiveName
            }
          )
          if (res.meta.status != 201) {
            return this.$message.error(
              '添加' + this.getParamsBtnData + '失败！'
            )
          }
          this.$message.success('添加' + this.getParamsBtnData + '成功！')
          this.addDialogVisible = false
          this.getParamsData()
        } else {
          return false
        }
      })
    },
    // 点击编辑按钮触发的事件
    editParamsShow(row) {
      this.editDialogVisible = true
      this.editRuleForm.attr_id = row.attr_id
      this.editRuleForm.attr_name = row.attr_name
    },
    // 点击编辑弹出框的关闭按钮触发的事件
    editClose() {
      this.$refs.editRuleForm.resetFields()
    },
    // 点击编辑弹出框的确认按钮触发的事件
    editEnter() {
      this.$refs.editRuleForm.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$axios.put(
            `categories/${this.selectParamsId}/attributes/${this.editRuleForm.attr_id}`,
            {
              attr_name: this.editRuleForm.attr_name,
              attr_sel: this.paramsActiveName
            }
          )
          if (res.meta.status != 200) {
            return this.$message.error(
              '更新' + this.getParamsBtnData + '失败！'
            )
          }
          this.$message.success('更新' + this.getParamsBtnData + '成功！')
          this.editDialogVisible = false
          this.getParamsData()
        } else {
          return false
        }
      })
    },
    // 点击删除按钮触发的事件
    async deleteParams(id) {
      const { data: res } = await this.$axios.delete(
        `categories/${this.selectParamsId}/attributes/${id}`
      )
      if (res.meta.status != 200) {
        return this.$message.error(
          '删除' + this.getParamsBtnData + '数据失败！'
        )
      }
      this.$message.success('删除' + this.getParamsBtnData + '数据成功！')
      this.getParamsData()
    }
  },
  created() {
    this.getSelectData()
  },
  computed: {
    // 获取级联选择器选中的数据
    selectParamsId() {
      // 判断级联选择器选中的数据是否为三级分类，是就返回最后一个数据，不是就返回空值
      if (this.selectParamsData.length === 3) {
        return this.selectParamsData[2]
      }
      return null
    },
    // 判断级联选择器是否选中为三级，是就把添加动态参数/静态属性的按钮为可用，否则不可用
    addBtnDisabled() {
      if (this.selectParamsData.length === 3) {
        return false
      }
      return true
    },
    // 判断tabs标签页选中哪个，来对弹出框的名称进行更改
    getParamsBtnData() {
      if (this.paramsActiveName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  }
}
</script>
<style lang='less' scoped>
.el-alert {
  margin-bottom: 10px;
}
.el-tag {
  margin-right: 10px;
}
// new Tag文本框样式
.input-new-tag {
  width: 100px;
}
</style>
