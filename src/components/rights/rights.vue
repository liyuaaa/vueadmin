<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-table :data="rightsList" border stripe>
        <el-table-column label="#" width="50" type="index"></el-table-column>
        <el-table-column prop="authname" label="权限管理"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template v-slot="scoped">
            <el-tag type="primary" v-if="scoped.row.level==='0'">一级</el-tag>
            <el-tag type="success" v-else-if="scoped.row.level==='1'">二级</el-tag>
            <el-tag type="danger" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rightsList: [] // 获取权限列表的数据
    }
  },
  methods: {
    async getRightsData() {
      const { data: res } = await this.$axios.get('rights/list')
      if (res.meta.status != 200) {
        return this.$message.error('获取数据失败！')
      }
      this.rightsList = res.data
      console.log(this.rightsList)
    }
  },
  created() {
    this.getRightsData()
  }
}
</script>
<style lang="less" scoped>
</style>
