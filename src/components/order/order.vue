<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 内容区域 -->
    <el-card>
      <!-- 搜索框 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" clearable v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="getOrders"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="ordersList" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column label="是否发货" width="80">
          <template v-slot="scoped">
            <el-tag v-if="scoped.row.is_send==='否'" type="danger">未发货</el-tag>
            <el-tag v-else type="success">已发货</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="80"></el-table-column>
        <el-table-column label="是否付款" width="80">
          <template v-slot="scoped">
            <el-tag v-if="scoped.row.order_pay==='0'" type="danger">未付款</el-tag>
            <el-tag v-else type="success">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="order_pay" label="支付方式" width="80">
          <template v-slot="scoped">
            <el-tag v-if="scoped.row.order_pay==='0'" type="danger">未支付</el-tag>
            <el-tag v-else-if="scoped.row.order_pay==='1'" type="primary">支付宝</el-tag>
            <el-tag v-else-if="scoped.row.order_pay==='2'" type="success">微信</el-tag>
            <el-tag v-else-if="scoped.row.order_pay==='3'" type="warning">银行卡</el-tag>
            <el-tag v-else>未知</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" width="180">
          <template v-slot="scoped">
            <span>{{scoped.row.updatedtime|formartDate}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template v-slot="scoped">
            <el-button icon="el-icon-edit" type="primary" size="mini" @click="editShow(scoped.row)"></el-button>
            <el-tooltip effect="dark" content="物流详情" placement="top" :enterable="false">
              <el-button icon="el-icon-s-claim" type="success" size="mini" @click="logisticsShow"></el-button>
            </el-tooltip>
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
        :total="count"
      ></el-pagination>
    </el-card>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑内容" :visible.sync="editDialogVisible" width="50%">
      <el-form :rules="editRules" :model="editRuleForm" ref="editRuleForm">
        <el-form-item label="订单价格" prop="order_price">
          <el-input v-model="editRuleForm.order_price"></el-input>
        </el-form-item>
        <el-form-item label="是否发货" prop="is_send">
          <el-input v-model="editRuleForm.is_send"></el-input>
        </el-form-item>
        <el-form-item label="是否付款-0表示未付款-1表示付款" prop="pay_status">
          <el-input v-model="editRuleForm.pay_status"></el-input>
        </el-form-item>
        <el-form-item label="支付方式-0表示未支付-1表示支付宝-2表示微信-3表示银行卡" prop="order_pay">
          <el-input v-model="editRuleForm.order_pay"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editEnter">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 物流信息弹出框 -->
    <el-dialog title="物流信息" :visible.sync="logisticsDialogVisible" width="50%">
      <!-- 时间线组件来显示物流信息 -->
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in logisticsList "
          :key="index"
          :timestamp="activity.time"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        // 订单列表请求的参数
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      ordersList: [], // 获取订单列表数据
      count: 0, // 订单列表数据总数量
      editDialogVisible: false, // 编辑弹出框是否显示
      editRuleForm: {}, // 编辑弹出层里面的数据
      editRules: {}, // 编辑弹出层里面的表单验证
      logisticsDialogVisible: false, // 物流信息弹出框是否显示
      logisticsList: [] // 订单数据
    }
  },
  methods: {
    // 获取订单列表数据
    async getOrders() {
      const { data: res } = await this.$axios.get('orders', {
        params: this.queryInfo
      })
      this.ordersList = res.data.data
      this.count = res.data.count
      console.log(this.ordersList)
    },
    // 分页数量发生变化触发的事件
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getOrders()
    },
    // 分页页数发生变化触发的事件
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getOrders()
    },
    // 点击编辑按钮触发的事件
    async editShow(scoped) {
      const { data: res } = await this.$axios.get(`/orders/${scoped.order_id}`)
      this.editRuleForm = res.data
      console.log(this.editRuleForm)
      this.editDialogVisible = true
    },
    //点击编辑按钮里面的确认按钮触发的事件
    async editEnter() {
      console.log(this.editRuleForm.pay_status)
      const { data: res } = await this.$axios.put(
        `/orders/${this.editRuleForm.order_id}`,
        {
          is_send: this.editRuleForm.is_send,
          order_pay: this.editRuleForm.order_pay,
          order_price: this.editRuleForm.order_price,
          pay_status: this.editRuleForm.pay_status
        }
      )
      if (res.meta.status != 200) {
        return this.$message.error('更新数据失败！')
      }
      this.$message.success('更新数据成功！')
      this.getOrders()
      this.editDialogVisible = false
    },
    // 点击物流信息触发的事件
    async logisticsShow() {
      this.logisticsDialogVisible = true
      // 获取订单数据
      const { data: res } = await this.$axios.get('/kuaidi/1106975712662')
      this.logisticsList = res.data
    }
  },
  created() {
    this.getOrders()
  }
}
</script>
<style lang='less' scoped>
</style>
