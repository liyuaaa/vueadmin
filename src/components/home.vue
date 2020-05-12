<template>
  <div class="home_box">
    <el-container class="home_container">
      <!-- 点击左侧侧边栏进行大小更改 -->
      <el-button
        :icon="leftIconBtn"
        @click="leftFlodBtn"
        class="leftSizeChange"
        ref="leftFlodBtnRef"
      ></el-button>
      <!-- 左边侧边栏区域 -->
      <el-aside :width="isLeftFlag ? '64px':'260px'">
        <h3 ref="asideText">后台管理模板</h3>
        <!-- 选项内容 -->
        <el-menu
          background-color="#272c33"
          text-color="#fff"
          active-text-color="#c23616"
          unique-opened
          router
          :default-active="activeNav"
          :collapse="isLeftFlag"
          :collapse-transition="false"
        >
          <!-- 首页菜单 -->
          <el-menu-item index="/welcome" @click="activeNavClick('/welcome')">
            <i class="el-icon-s-home"></i>
            <span slot="title">首页</span>
          </el-menu-item>
          <!-- 从后台返回的对应菜单 -->
          <el-submenu :index="item.id+''" v-for="item in leftData" :key="item.id">
            <!-- 一级菜单 -->
            <template slot="title">
              <i :class="leftIcon[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/'+item2.path"
              v-for="item2 in item.children"
              :key="item2.id"
              @click="activeNavClick('/'+item2.path)"
            >
              <i class="el-icon-s-operation"></i>
              <span slot="title">{{item2.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container class="home_container_main">
        <!-- 头部区域 -->
        <el-header ref="header">
          <!-- 左边区域 -->
          <div class="left_header">
            <!-- 搜索框 -->
            <el-button icon="el-icon-search" @click="searchShow"></el-button>

            <!-- 消息提示 -->
            <el-dropdown placement="bottom-start" trigger="click">
              <el-button icon="el-icon-message-solid"></el-button>
              <span class="badgeItem">3</span>
              <el-dropdown-menu class="el-dropdown-menu-one">
                <p>当前有3条消息</p>
                <el-dropdown-item icon="el-icon-s-flag">消息1</el-dropdown-item>
                <el-dropdown-item icon="el-icon-s-flag">消息2</el-dropdown-item>
                <el-dropdown-item icon="el-icon-s-flag">消息3</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

            <!-- 信息提示 -->
            <el-dropdown placement="bottom-start" trigger="click">
              <el-button icon="el-icon-date"></el-button>
              <span class="badgeItem badgeItemTwo">4</span>
              <el-dropdown-menu class="el-dropdown-menu-one el-dropdown-menu-two">
                <p>当前有4条信息</p>
                <el-dropdown-item icon="el-icon-s-opportunity">这是第一条消息</el-dropdown-item>
                <el-dropdown-item icon="el-icon-s-opportunity">这是第二条消息</el-dropdown-item>
                <el-dropdown-item icon="el-icon-s-opportunity">这是第三条消息</el-dropdown-item>
                <el-dropdown-item icon="el-icon-s-opportunity">这是第四条消息</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <!-- 右边区域 -->
          <div class="right_header">
            <!-- 更改颜色 -->
            <select @change="selectColor" ref="selectColorRef" v-model="colorValue">
              <option
                v-for="item in options"
                :key="item.value"
                :value="item.value"
                :style="{ backgroundColor: item.value }"
              ></option>
            </select>

            <!-- 头像 -->
            <el-dropdown placement="bottom-start" trigger="click" @command="dropdownItem">
              <!-- 头像 -->
              <el-avatar
                src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
                size="small"
              ></el-avatar>
              <el-dropdown-menu>
                <el-dropdown-item icon="el-icon-user-solid" command="1">我的信息</el-dropdown-item>
                <el-dropdown-item icon="el-icon-s-tools" command="2">设置</el-dropdown-item>
                <el-dropdown-item icon="el-icon-warning" command="3">退出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-header>
        <!-- 内容区域 -->
        <el-main ref="main">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>

    <!-- 搜索弹出框 -->
    <div class="showSearch" ref="showSearchRef">
      <input type="text" placeholder="搜索" v-model="searchVal" />
      <el-button icon="el-icon-close" @click="closeSearch"></el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      options: [
        {
          value: '#ff7675'
        },
        {
          value: '#ffeaa7'
        },
        {
          value: '#00cec9'
        },
        {
          value: '#ffffff'
        },
        {
          value: '#dfe6e9'
        },
        {
          value: '#fab1a0'
        }
      ],
      colorValue: '#dfe6e9',
      searchVal: '',
      leftIconBtn: 'el-icon-back', // 左侧侧边栏的按钮图标
      leftIcon: {
        125: 'el-icon-user-solid',
        103: 'el-icon-s-help',
        101: 'el-icon-s-cooperation',
        102: 'el-icon-s-order',
        145: 'el-icon-s-platform'
      },
      leftData: [], // 左侧选项数据
      isLeftFlag: false, // 左侧选项是否折叠
      activeNav: '' // 左侧侧边栏点击激活的菜单的index
    }
  },
  methods: {
    /* 下拉框改变颜色触发的事件 */
    selectColor() {
      this.$refs.selectColorRef.style.backgroundColor = this.colorValue
      this.$refs.selectColorRef.style.color = this.colorValue
      this.$refs.header.$el.style.backgroundColor = this.colorValue
      this.$refs.main.$el.style.backgroundColor = this.colorValue
      /* 把选中的颜色保存到本地session */
      window.sessionStorage.setItem('bgColor', this.colorValue)
    },
    /* 点击头像下拉菜单触发的事件 */
    dropdownItem(command) {
      /* 判断是否点击了退出的下拉菜单 */
      if (command === '3') {
        // 清楚本地session的user
        window.sessionStorage.removeItem('user')
        // 跳转到登录页面
        this.$router.push('/login')
      }
    },
    /* 点击搜索框按钮触发的事件 */
    searchShow() {
      this.$refs.showSearchRef.style.display = 'block'
    },
    /* 点击搜索弹出框的关闭按钮触发的事件 */
    closeSearch() {
      // 点击关闭按钮，把搜索弹出框隐藏，同时清除input输入的数据
      this.$refs.showSearchRef.style.display = 'none'
      this.searchVal = ''
    },
    /* 左侧侧边栏的选项 */
    async getLeftMsg() {
      const { data: res } = await this.$axios.get('menus')
      if (res.meta.status !== 200) {
        return this.$message.error('获取选项失败！！')
      }
      this.leftData = res.data
    },
    /* 点击左侧侧边栏的按钮触发的事件 */
    leftFlodBtn() {
      this.isLeftFlag = !this.isLeftFlag
      // 判断是否折叠，是就把h3文字隐藏，不是就显示
      if (this.isLeftFlag) {
        this.$refs.asideText.style.display = 'none'
        this.$refs.leftFlodBtnRef.$el.style.left = '48px'
        this.leftIconBtn = 'el-icon-right'
      } else {
        this.$refs.asideText.style.display = 'block'
        this.$refs.leftFlodBtnRef.$el.style.left = '242px'
        this.leftIconBtn = 'el-icon-back'
      }
    },
    /* 点击左侧二级菜单的时候，把选择的index保存到本地session中 */
    activeNavClick(index) {
      window.sessionStorage.setItem('leftNav', index)
    }
  },
  mounted() {
    /* 判断本地session有没有数据，有就把对应的背景颜色替换为本地session数据 */
    this.colorValue = window.sessionStorage.getItem('bgColor')
    this.selectColor()
    /* 左侧侧边栏的选项 */
    this.getLeftMsg()
    /* 获取本地session数据，有就把对应的选中左侧选项赋值给activeNav(左侧选中的index) */
    this.activeNav = window.sessionStorage.getItem('leftNav')
  }
}
</script>

<style lang="less" scoped>
.home_box {
  height: 100%;
  .home_container {
    height: 100%;
    /* 左侧区域 */
    .el-aside {
      background-color: #272c33;
      position: relative;
      padding-top: 20px;
      h3 {
        height: 5px;
        line-height: 5px;
        text-align: center;
        color: white;
        font-weight: 300;
        padding-bottom: 30px;
        border-bottom: 1px solid #4e4e52;
      }
      /* 选项菜单 */
      .el-menu {
        border: 0;
      }
    }
  }
  .home_container_main {
    background-color: #f1f2f7;
    /* 头部区域 */
    .el-header {
      height: 75px !important;
      margin-bottom: 5px;
      background-color: #fff;
      box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.15);
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 2.5rem;
      .el-button {
        border: 0;
        color: black;
        font-weight: 700 !important;
        margin: 0 1rem;
        padding: 0;
        font-size: 1.2rem;
        background-color: transparent;
        &:hover,
        &:focus {
          color: black;
          background-color: transparent;
        }
      }
      .right_header {
        position: relative;
        select {
          width: 1.5rem;
          height: 15px;
          border: 3px solid rgba(0, 0, 0, 127);
          color: #ffffff;
          position: absolute;
          top: 2.5px;
          right: 50px;
          outline: none;
          option {
            &:active {
              background-color: transparent;
            }
          }
        }
      }
      /* 头像 */
      .el-avatar {
        margin-top: -0.3rem;
        outline: none;
        cursor: pointer;
      }
    }
    /* 内容区域 */
    .el-main {
      margin-top: 0.2rem;
      background-color: #ffffff;
      box-shadow: 0px 1px 10px rgba(0, 0, 0, 0.15);
    }
  }
}
/* 下拉框样式 */
.el-dropdown-menu {
  border-radius: 0;
  margin-top: 1.7rem !important;
  li {
    &:hover {
      color: black;
      background-color: white !important;
    }
  }
}
.el-dropdown-menu-one {
  width: 12rem;
  padding: 0 0;
  p {
    font-size: 0.7rem;
    text-align: center;
    margin: 0.3rem 0;
  }
  li {
    height: 1.5rem;
    line-height: 1.5rem;
    font-size: 0.8rem;
    color: black;
    &:nth-child(4n) {
      background-color: #f86c6b;
    }
    &:nth-child(4n-1) {
      background-color: #20a8d8;
    }
    &:nth-child(4n-2) {
      background-color: #4dbd74;
    }
    &:nth-child(4n-3) {
      background-color: #ffc107;
    }
  }
}
.el-dropdown-menu-two {
  width: 20rem;
  p {
    font-size: 1rem;
    margin: 0.3rem 0;
    text-align: left;
    padding: 0 0.5rem;
  }
  li {
    height: 3rem;
    line-height: 3rem;
    font-size: 1rem;
    color: black;
  }
}
.badgeItem {
  position: absolute;
  font-size: 0.6rem;
  right: 0.4rem;
  bottom: 1rem;
  width: 0.8rem;
  text-align: center;
  height: 0.8rem;
  line-height: 0.8rem;
  background-color: #dc3545;
  color: white;
  border-radius: 50%;
}
.badgeItemTwo {
  background-color: #007bff;
}
/* 搜索弹出框 */
.showSearch {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 75px;
  background-color: #272c33;
  text-align: center;
  display: none;
  input {
    width: 60%;
    height: 70px;
    border: 0;
    outline: none;
    font-size: 20px;
    background-color: #272c33;
    color: white;
  }
  .el-button {
    border: 0;
    background-color: #272c33;
    color: white;
    font-weight: 700;
    &:hover {
      background-color: #272c33;
    }
  }
}
/* 点击左侧按钮左侧侧边栏代大小更换的样式 */
.leftSizeChange {
  position: absolute;
  left: 242px;
  top: 58px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  background-color: #e84118;
  color: #f1f2f7;
  padding: 0;
  border: 1px solid #e84118;
  z-index: 100;
  &:hover,
  &:active,
  &:focus {
    background-color: #e84118;
    color: white;
    border: 1px solid #e84118;
  }
}
</style>
