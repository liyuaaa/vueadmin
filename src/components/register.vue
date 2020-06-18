<template>
  <div class="register">
    <div class="register_box02">
      <h2>注册用户</h2>
      <p>请注册一个用户来进行登录！</p>
      <p>请输入一个响亮亮的用户吧！</p>
    </div>
    <div class="register_box01">
      <el-form :model="registerRuleForm" :rules="registerRules" ref="registerRuleForm">
        <el-form-item prop="username">
          <el-input v-model="registerRuleForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="registerRuleForm.password" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item prop="email">
          <el-input v-model="registerRuleForm.email" type="email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="registerRuleForm.mobile" type="mobile" placeholder="请输入手机号码"></el-input>
        </el-form-item>
      </el-form>
      <div class="btn_box">
        <div class="register_btn">
          <el-button type="success" @click="toregister">注册</el-button>
          <el-button @click="toReset">重置</el-button>
        </div>
        <span>
          <a href="javascript:;" @click.prevent="toLogin">已有用户？点击登录</a>
        </span>
      </div>
    </div>
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
      registerRuleForm: {
        // 表单里面的值
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      registerRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    /* 点击登录按钮触发的事件 */
    toregister() {
      // 验证表单是否成功
      this.$refs.registerRuleForm.validate(async valid => {
        if (valid) {
          //判断用户名是否存在
          const { data: isExist } = await this.$axios.post('isExist', {
            username: this.registerRuleForm.username
          })
          //用户名已经存在
          if (isExist.meta.status != 200) {
            return this.$message.error('用户名已经存在')
          }
          // 表单验证成功就使用axios向后台发送请求来验证是否可以登录
          const { data: res } = await this.$axios.post(
            'register',
            this.registerRuleForm
          )
          if (res.meta.status !== 201) {
            return this.$message.error('注册失败')
          }
          this.$message.success('注册成功')
          // 并且跳转到登录页面
          this.$router.push('login')
        }
      })
    },
    /* 点击重置按钮触发的事件 */
    toReset() {
      this.$refs.registerRuleForm.resetFields()
    },
    /* 点击跳转到注册界面 */
    toLogin() {
      this.$router.push('login')
    }
  }
}
</script>

<style lang="less">
.register {
  width: 100%;
  height: 100%;
  background: url(../assets/img/input_bg_04.jpg) no-repeat;
  background-size: 100%;
  .register_box01,
  .register_box02 {
    width: 450px;
    height: 450px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-100%, -35%);
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    font-size: 18px;
    padding: 3.3rem;
    box-sizing: border-box;
  }
  .register_box01 {
    transform: translate(5%, -35%);
    p {
      font-size: 0.9rem;
    }
  }
  .btn_box {
    margin-top: 3rem;
    display: flex;
    justify-content: space-between;
    .el-button {
      border-radius: 0;
    }
  }
}
</style>
