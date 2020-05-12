import Vue from 'vue'
import VueRouter from 'vue-router'

/* 引入组件 */
// import Login from '../components/login.vue' // 登录组件
const Login = () => import(/* webpackChunkName: "login_home" */ '../components/login.vue')
// import Home from '../components/home.vue' // 首页组件
const Home = () => import(/* webpackChunkName: "login_home" */ '../components/home.vue')

/* 引入内容区域的组件 */
// import Welcome from '../components/welcome/welcome.vue' // 首页组件
const Welcome = () => import(/* webpackChunkName: "welcome_users" */ '../components/welcome/welcome.vue')
// import Users from '../components/users/users.vue' // 用户列表组件
const Users = () => import(/* webpackChunkName: "welcome_users" */ '../components/users/users.vue')

// import Rights from '../components/rights/rights.vue' // 权限列表组件
const Rights = () => import(/* webpackChunkName: "rights_roles" */ '../components/rights/rights.vue')
// import Roles from '../components/rights/roles.vue' // 权限角色列表组件
const Roles = () => import(/* webpackChunkName: "rights_roles" */ '../components/rights/roles.vue')


// import Categories from '../components/shop/categories.vue' // 商品分类组件
const Categories = () => import(/* webpackChunkName: "categories_params" */ '../components/shop/categories.vue')
// import Params from '../components/shop/params' // 商品分类参数组件
const Params = () => import(/* webpackChunkName: "categories_params" */ '../components/shop/params')

// import Goods from '../components/shop/goods' // 商品列表组件
const Goods = () => import(/* webpackChunkName: "goods_goodsAdd" */ '../components/shop/goods')
// import GoodsAdd from '../components/shop/goodsAdd' // 商品列表添加组件
const GoodsAdd = () => import(/* webpackChunkName: "goods_goodsAdd" */ '../components/shop/goodsAdd')

// import Order from '../components/order/order' // 订单列表组件
const Order = () => import(/* webpackChunkName: "order" */ '../components/order/order')


Vue.use(VueRouter)

const routes = [{
  path: '/',
  redirect: '/login'
}, {
  path: '/login',
  component: Login
},
{
  path: '/home',
  component: Home,
  redirect: 'welcome',
  children: [
    { path: '/welcome', component: Welcome },
    { path: '/users', component: Users },
    { path: '/rights', component: Rights },
    { path: '/roles', component: Roles },
    { path: '/categories', component: Categories },
    { path: '/params', component: Params },
    { path: '/goods', component: Goods },
    { path: '/goods/goodsAdd', component: GoodsAdd },
    { path: '/orders', component: Order }
  ]
}
]

const router = new VueRouter({
  routes
})

/* 使用导航守卫来判断用户输入的是否为login页面或者别的页面 */
router.beforeEach((to, from, next) => {
  if (to.path == '/login') return next() // 如果输入的是login就直接放行
  // 获取本地存储到session的user值,如果没有,证明玩家没有进行登录操作,强制跳转到login页面
  const token = window.sessionStorage.getItem('user')
  if (!token) return next('/login') // 没有获取到token证明没有进行登录操作
  next() // 如果有输入就直接放行
})

export default router
