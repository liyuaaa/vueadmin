<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 提示框 -->
    <el-alert title="添加商品列表数据" type="info" center show-icon :closable="false"></el-alert>
    <!-- 步骤条 -->
    <el-steps :active="active-0" finish-status="success">
      <el-step title="版本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
      <el-step title="完成"></el-step>
    </el-steps>
    <!-- 标签页 -->
    <el-tabs
      :tab-position="tabPosition"
      :before-leave="tabsBeforeLeave"
      v-model="active"
      @tab-click="tabsHandleClick"
    >
      <el-tab-pane label="基本信息">
        <el-form
          :model="infoRuleForm"
          :rules="infoRules"
          ref="infoRuleForm"
          label-position="top"
          name="0"
        >
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="infoRuleForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="infoRuleForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="infoRuleForm.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="infoRuleForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="分类列表" prop="goods_cat">
            <!-- 级联选择器 -->
            <el-cascader
              v-model="infoRuleForm.goods_cat"
              :options="categoriesList"
              :props="categoriesProps"
              @change="handleChange"
            ></el-cascader>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品参数" name="1">
        <el-form v-model="manyList" label-position="top">
          <el-form-item :label="item.attr_name" v-for="item in manyList" :key="item.attr_id">
            <!-- 多选框组 -->
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox :label="item2" v-for="(item2,i) in item.attr_vals" :key="i" border></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品属性" name="2">
        <el-form v-model="onlyList" label-position="top">
          <el-form-item :label="item.attr_name" v-for="item in onlyList" :key="item.attr_id">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name="3">
        <el-upload
          ref="upload"
          action="http://127.0.0.1:8899/api/upload"
          :on-preview="picHandlePreview"
          :on-success="picHandleSuccess"
          :on-remove="picHandleRemove"
          list-type="picture"
          :headers="headerToken"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="4">
        <!-- 富文本编辑器 -->
        <quill-editor v-model="infoRuleForm.goods_introduce" />
        <el-button type="primary" @click="addGoods" class="addBtn">添加商品</el-button>
      </el-tab-pane>
    </el-tabs>

    <!-- 点击图片弹出框 -->
    <el-dialog :visible.sync="picDialogVisible" width="50%">
      <img :src="picSrcShow" alt />
    </el-dialog>
  </div>
</template>

<script>
import _ from 'loadsh' // 引入loadsh来进行数据深拷贝
export default {
  data() {
    return {
      active: '0', // 步骤条位置
      tabPosition: 'left', // 标签页的位置
      infoRuleForm: {
        // 基本信息的数据
        goods_name: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_cat: '',
        goods_introduce: '', // 介绍
        pics: [], // 上传图片的路径
        attrs: [] // 商品参数
      },
      infoRules: {
        // 基本信息的表单验证
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请输入商品类型', trigger: 'blur' }
        ]
      },
      categoriesProps: {
        // 基本信息的级联选择器配置信息
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      categoriesList: [], // 基本信息的级联选择器里面的数据
      manyList: [], // 获取动态参数的数据
      onlyList: [], // 获取静态属性的数据
      picSrcShow: '', // 获取显示图片
      picDialogVisible: false, // 图片弹出框是否显示
      upLoadUrl: 'http://127.0.0.1:8899/tmp_uploads', // 图片上传的位置
      headerToken: {
        // 获取token验证的Authorization字段，来让图片能保存到后台
        Authorization: window.sessionStorage.getItem('user')
      },
      picData: [] // 获取所有图片的数组
    }
  },
  methods: {
    // 获取基本信息级联选择器里面的数据
    async getCategoriesData() {
      const { data: res } = await this.$axios.get('categories')
      this.categoriesList = res.data.data
    },
    // 基本信息的级联选择器选中的时候触发的事件
    handleChange() {
      // 判断级联选择器是否选中长度为3，不是就返回空数组
      if (this.infoRuleForm.goods_cat.length !== 3) {
        return (this.infoRuleForm.goods_cat = [])
      }
    },
    // 标签页切换的时候触发的事件
    tabsBeforeLeave(activeName, oldActiveName) {
      // 判断切换到别的标签页的时候，第一个标签页里面是否有选择级联选择器为三级分类
      if (oldActiveName == '0' && this.infoRuleForm.goods_cat.length !== 3) {
        this.$message.error('请选择商品分类')
        return false
      }
    },
    // 标签页被选中的时候触发的事件
    async tabsHandleClick() {
      // 切换到商品参数的时候，获取动态参数数据，并进行渲染
      if (this.active == '1') {
        const { data: res } = await this.$axios.get(
          `categories/${this.getCategoriesId}/attributes`,
          {
            params: {
              sel: 'many'
            }
          }
        )
        if (res.meta.status != 200) {
          return this.$message.error('获取数据失败！')
        }
        // 把后台的attr_vals分割成数组，并重新赋值
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.split(' ')
        })
        this.manyList = res.data
      } else if (this.active == '2') {
        // 切换到静态参数的时候，获取静态参数的数据，并进行渲染
        const { data: res } = await this.$axios.get(
          `categories/${this.getCategoriesId}/attributes`,
          {
            params: {
              sel: 'only'
            }
          }
        )
        if (res.meta.status != 200) {
          return this.$message.error('获取数据失败！')
        }
        this.onlyList = res.data
      }
    },
    // 点击上传图片的图片触发的事件
    picHandlePreview(files) {
      // 获取上传到的图片
      this.picSrcShow = file.response.data.url
      this.picDialogVisible = true
      console.log(this.infoRuleForm)
    },
    // 图片上传成功的触发的事件
    picHandleSuccess(file) {
      console.log(file)
      // 把上传成功的图片，拼接成一组数据，并存储到infoRuleForm的pics里面
      const picData = { pic: file.data.tmp_path }
      this.infoRuleForm.pics.push(picData)
      console.log(this.infoRuleForm)
    },
    // 移除图片触发的事件
    picHandleRemove(file) {
      // 点击移除的时候，把infoRuleForm里面的pics对应的图片进行删除
      const fileData = file.response.data.tmp_path
      // 使用遍历来获取相匹配对应的索引，并进行删除，遍历索引
      const i = this.infoRuleForm.pics.findIndex(item => {
        return item.pic == fileData
      })
      this.infoRuleForm.pics.splice(i, 1) // 删除对应的数据
      console.log(this.infoRuleForm)
    },
    // 点击添加商品按钮触发的事件
    addGoods() {
      this.$refs.infoRuleForm.validate(async valid => {
        if (valid) {
          // 需要把商品参数的goods_cat变成字符串，如果变成字符串，会导致级联选择器里面的数据显示错误
          // 所以需要进行深拷贝，然后把拷贝到的数据发送给后台--loadsh
          const infoData = _.cloneDeep(this.infoRuleForm)
          infoData.goods_cat = infoData.goods_cat.join(',')
          // 获取动态参数和静态属性的数据，存放到attrs中
          this.manyList.forEach(item => {
            console.log(item)
            const attrsData = {
              attr_id: item.id,
              attr_vals: item.attr_vals.join(' ')
            }
            infoData.attrs.push(attrsData)
          })
          this.onlyList.forEach(item => {
            const attrsData = {
              attr_id: item.id,
              attr_vals: item.attr_vals
            }
            infoData.attrs.push(attrsData)
          })
          console.log(infoData)
          const { data: res } = await this.$axios.post('goods', infoData)
          if (res.meta.status != 201) {
            return this.$message.error('添加数据失败！')
          }
          this.$message.success('添加数据成功！')
        } else {
          return this.$message.error('请输入完整信息')
        }
      })
    }
  },
  created() {
    this.getCategoriesData()
  },
  computed: {
    // 获取基本信息里面级联选择器，选中的最后一个id
    getCategoriesId() {
      if (this.infoRuleForm.goods_cat.length === 3) {
        return this.infoRuleForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>
<style lang='less' scoped>
.el-alert {
  margin: 10px 0;
}
.el-steps {
  margin-bottom: 20px;
}
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.el-dialog {
  img {
    width: 100%;
    height: 100%;
  }
}
.addBtn {
  margin-top: 20px;
}
</style>
