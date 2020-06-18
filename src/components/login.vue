<template>
  <div class="login">
    <div class="login_box01">
      <el-form :model="loginRuleForm" :rules="loginRules" ref="loginRuleForm">
        <el-form-item prop="username">
          <el-input v-model="loginRuleForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginRuleForm.password" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
      </el-form>
      <div class="btn_box">
        <span>
          <a href="javascript:;" @click.prevent="toRegister">没有用户？请先注册！</a>
        </span>
        <div class="login_btn">
          <el-button type="success" @click="toLogin">登录</el-button>
          <el-button @click="toReset">重置</el-button>
        </div>
      </div>
    </div>
    <div class="login_box02">
      <h2>欢迎来到后台管理页面</h2>
      <p>这是一个后台管理页面</p>
      <p>一个很简陋的后台管理页面</p>
      <p>请登录来管理这个简陋的后台页面</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginRuleForm: {
        // 表单里面的值
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    /* 点击登录按钮触发的事件 */
    toLogin() {
      // 验证表单是否成功
      this.$refs.loginRuleForm.validate(async valid => {
        if (valid) {
          // 表单验证成功就使用axios向后台发送请求来验证是否可以登录
          const { data: res } = await this.$axios.post(
            'login',
            this.loginRuleForm
          )
          if (res.meta.status !== 200) {
            return this.$message.error('用户名或密码错误')
          }
          // 登录成功就把登录的token存放到本地session中
          window.sessionStorage.setItem('user', res.data.token)
          // 并且跳转到首页
          this.$router.push('home')
        }
      })
    },
    /* 点击重置按钮触发的事件 */
    toReset() {
      this.$refs.loginRuleForm.resetFields()
    },
    /* 点击跳转到注册界面 */
    toRegister() {
      this.$router.push('register')
    }
  }
}
</script>

<style lang="less">
.login {
  width: 100%;
  height: 100%;
  background: url(../assets/img/input_bg_04.jpg) no-repeat;
  background-size: 100%;
  .login_box01,
  .login_box02 {
    width: 450px;
    height: 320px;
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
  .login_box02 {
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
