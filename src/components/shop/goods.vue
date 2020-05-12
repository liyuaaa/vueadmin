<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 搜索框和添加按钮 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsData()">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsData()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addGoods">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格数据 -->
      <el-table :data="goodsList" stripe style="width: 100%" border>
        <el-table-column type="index" label="#" width="50"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格" width="80"></el-table-column>
        <el-table-column prop="goods_number" label="商品数量" width="80"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="80"></el-table-column>
        <el-table-column label="创建时间" width="170">
          <template v-slot="scoped">
            <!-- 使用插槽和过滤器来处理时间的显示 -->
            <span>{{scoped.row.add_time|formartDate}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template v-slot="scoped">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editShow(scoped.row.goods_id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteGoods(scoped.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 8, 10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑参数列表" :visible.sync="editDialogVisible" width="50%">
      <el-form :model="editRuleForm" :rules="editRules" ref="editRuleForm" label-width="100px">
        <el-form-item label="商品名称:" prop="goods_name">
          <el-input v-model="editRuleForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="价格:" prop="goods_price">
          <el-input v-model="editRuleForm.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="数量:" prop="goods_number">
          <el-input v-model="editRuleForm.goods_number"></el-input>
        </el-form-item>
        <el-form-item label="重量:" prop="goods_weight">
          <el-input v-model="editRuleForm.goods_weight"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editEnter()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        // 获取参数列表的参数
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      goodsList: [], // 获取商品数据
      total: 0, // 商品总数量
      editDialogVisible: false, // 编辑弹出框是否显示
      editRuleForm: {
        // 编辑弹出框的数据
        goods_name: '', // 商品名称
        goods_price: '', // 价格
        goods_number: '', // 数量
        goods_weight: '' // 重量
      },
      editRules: {
        // 编辑弹出框的表单验证
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入价格', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入数量', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入重量', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async getGoodsData() {
      const { data: res } = await this.$axios.get('goods', {
        params: this.queryInfo
      })
      this.goodsList = res.data.goods
      console.log(this.goodsList)
      this.total = res.data.total
    },
    // 分页功能数量发生变化触发的事件
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getGoodsData()
    },
    // 分页功能页数发生变化触发的事件
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getGoodsData()
    },
    // 点击编辑按钮触发的事件
    async editShow(id) {
      this.editDialogVisible = true
      // 根据id查找后台数据，并把数据赋给编辑的值
      const { data: res } = await this.$axios.get(`goods/${id}`)
      this.editRuleForm = res.data
      console.log(this.editRuleForm)
    },
    // 点击编辑对话框的确认按钮触发的事件
    editEnter() {
      this.$refs.editRuleForm.validate(async valid => {
        if (valid) {
          // 表单验证成功发送编辑操作
          const { data: res } = await this.$axios.put(
            `goods/${this.editRuleForm.goods_id}`,
            {
              goods_name: this.editRuleForm.goods_name,
              goods_price: this.editRuleForm.goods_price,
              goods_number: this.editRuleForm.goods_number,
              goods_weight: this.editRuleForm.goods_weight
            }
          )
          if (res.meta.status != 201) {
            console.log(res)
            return this.$message.error('更新数据失败！')
          }
          this.$message.error('更新数据成功！')
          this.editDialogVisible = false
          this.getGoodsData()
        } else {
          return false
        }
      })
    },
    // 点击删除按钮触发的事件
    deleteGoods(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$axios.delete(`goods/${id}`)
          if (res.meta.status != 200) {
            return this.$message.error('删除数据失败！')
          }
          this.$message.success('删除数据成功！')
          this.getGoodsData()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 点击添加按钮触发的事件
    addGoods() {
      // 跳转到对应的路由(goodsAdd)
      this.$router.push({ path: '/goods/goodsAdd' })
    }
  },
  created() {
    this.getGoodsData()
  }
}
</script>
<style lang='less' scoped>
</style>
