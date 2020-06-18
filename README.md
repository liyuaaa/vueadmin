## admin
## @李育-2020年4月14日15:39:30
------------------------------------
### 基本配置
1. 创建vue.config.js来进行端口配置以及设置默认启动
2. 删除views文件和components文件夹下的helloword文件，并修改App.vue以及main.js的配置,以及修改路由配置
---------------------------------------
### 插件使用
1. 使用element-ui来进行页面的渲染(在插件里面安装)
> 在安装element-ui需要选中Import  on demand  按需导入 安装完成会生成一个plugins文件夹
> 打开element.js文件来进行按需导入组件
2. 安装less-loader和less来让项目可以支持less(在安装依赖里的开发依赖安装)
3. 安装axios(在安装依赖里的开发依赖安装)
> 在main.js中导入axios
> 通过axios请求拦截器添加token，保证拥有获取数据的权限
> 并且把axios挂载到Vue上，每次访问axios只需要输入$axios即可调用，同时设置默认axios的路径
```
	import axios from 'axios';
	/* 通过axios请求拦截器添加token，保证拥有获取数据的权限 */
	axios.interceptors.request.use(config => {
		/* 为请求头对象，添加 Token 验证的 Authorization 字段 */
		config.headers.Authorization = window.sessionStorage.getItem('user')
		return config
	})
	/* 把axios挂在到Vue上面 */
	Vue.prototype.$axios = axios;
	/* 配置axios的默认请求路径 */
	axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
```
-------------------------------------
### api接口地址
1. https://github.com/liyuaaa/api
-------------------------------------
### 登录页面
1. 配置路由，以及默认打开页面为登录页面
> 在路由里面设置path为'/login',并且使用重定向redirect来进行路由默认跳转的路径为login
2. 界面渲染
> 使用element来进行页面渲染，使用element的form来进行表单验证
> 验证成功跳转到后台首页
---------------------------------------
### 注册页面
1. 点击登录页面里面的注册文字跳转到注册页面
2. 界面渲染
> 使用element来进行页面渲染，使用element的form来进行表单验证
> 注册成功跳转到登录页面
---------------------------------------
### 路由导航
1. 在router.js(路由配置文件中) 来进行路由导航操作
2. 判断用户的url地址是否为login，如果是，就直接放行
3. 如果不是，就先获取本地session，然后进行判断是否有拿到本地session的值
4. 没有拿到，证明该用户没有进行登录操作，强制跳转到login页面，有拿到就直接放行
```
	router.beforeEach((to,from,next)=>{
		if(to.path=='/login') return next(); //如果输入的是login就直接放行
		//获取本地存储到session的user值,如果没有,证明玩家没有进行登录操作,强制跳转到login页面
		const token = window.sessionStorage.getItem('user');
		if(!token) return next('/login'); //没有获取到token证明没有进行登录操作
		next(); //如果有输入就直接放行
	}
```
##### 详细请看[Vue Router](https://router.vuejs.org/zh/guide/advanced/navigation-guards.html)
--------------------------------------------------------
### 后台页面布局home
1. 使用Container布局容器来进行页面的布局
2. 左侧使用NavMenu导航页面来进行导航列表渲染，使用本地session来保存点击哪个选项，并每次页面刷新的时候就把选项选择起来--api接口(menus)
3. 头部有搜索框，消息提示，背景颜色更改，头像，设置，以及退出
-------------------------------------------------
### 首页Welcome
1. 使用Echarts来进行数据的图表渲染
-------------------------------------------------
### 用户管理users
1. 使用面包屑来进行头部显示
2. 使用表格来进行数据渲染--api接口(users)
3. 使用分页功能来进行页数跳转
4. 使用switch控件来进行状态的渲染--api接口(users/:uId/state/:type)
5. 点击添加按钮，弹出dialog弹出框来进行数据添加--api接口(users)
6. 点击编辑按钮，弹出dialog弹出框来进行数据编辑--api接口(users/:id)
7. 用户分配角色，弹出dialog弹出框来进行用户分配角色数据，使用select下拉框来进行用户分配列表显示--api接口(roles);修改用户分配角色数据--api接口(users/:id/role)
-------------------------------------------------
### 权限管理--权限列表
1. 使用表格来进行数据渲染--api接口(rights/:type)
-------------------------------------------------
### 权限管理--角色列表
1. 使用表格来进行数据渲染--api接口(roles)
2. 使用展开行来对角色管理的权限进行渲染--api(roles--children)
3. 点击展开行里面角色管理的权限关闭按钮的时候删除角色指定权限--api(roles/:roleId/rights/:rightId)
4. 编辑角色列表
+ 点击编辑列表获取用户指定id信息--api接口(roles/:id)-get
+ 下拉框使用角色列表的roleDesc--api接口(roles)
+ 点击确认按钮把编辑的内容发送到后台进行修改--api接口(roles/:id)-put
5. 删除角色列表--api接口(roles/:id)
6. 分配权限数据
+ 点击分配权限，弹出分配权限对话框，获取对应的数据--api接口(rights/tree)
+ 使用遍历递归来对后台数据进行获取，把获取到的数据使用树形组件来进行数据渲染
+ 点击分配权限的弹出层确认按钮把数据发送到后台进行更改
-------------------------------------------------
### 商品管理-商品分类
1. 使用第三方表格来进行数据渲染--vue-table-with-tree-grid --api接口(categories)
+ https://github.com/MisterTaki/vue-table-with-tree-grid
+ 在main.js里面导入第三方表格
```
import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', TreeTable);
```
2. 添加功能，使用级联选择器来进行数据添加到具体的位置 --api(categories)-post
+ 级联选择器使用后会出现高度出错问题，需要进行样式修改
```
.el-cascader__dropdown {
	height: 200px;
}
.el-cascader-panel {
	height: 200px;
}
```
+ 同时级联选择器还需要对参数显示进行配置,把配置的数据放在prop里面
```
addPropsData: {
	// 级联选择器的配置信息
	checkStrictly: "true",
	value: "cat_id",
	label: "cat_name",
	children: "children"
},
```
3. 编辑功能，先根据id查找对应的数据-api(categories/:id)-get
+ 在进行编辑提交分类-api(categories/:id)-put
4. 删除功能-api(categories/:id)-delete
-------------------------------------------------
### 商品管理-分类参数
1. 使用级联选择器来获取选中的数据从而进行数据显示-api(categories)-get
+ 当级联选择器选中什么，下面表格数据就显示选中对应的数据
2. 使用Tabs 标签页来进行动态参数和静态属性的切换
3. 表格显示数据，当Tabs点击哪一个标签页，就显示相应的数据-api(categories/:id/attributes)-get
+ 把tabs标签页不同的数据存放到各自的数据中
+ 表格下拉列表显示数据的attr_vals数据，需要用到分割字符串来对数据分开，因为api的attr_vals是字符串
+ 使用new Tag组件来进行下拉框数据(attr_vals)添加(push)-api(categories/:id/attributes/:attrId)-put
+ 点击下拉数据里面的Tag关闭按钮就把attr_vals进行数据删除(splice)-api(categories/:id/attributes/:attrId)-put
4. 添加动态参数或者静态属性-api(categories/:id/attributes)-post
+ 点击添加动态参数弹出添加对话框，并进行数据添加
5. 编辑功能-api(categories/:id/attributes/:attrId)-put
6. 删除功能-api(categories/:id/attributes/:attrid)-delete
-------------------------------------------------
### 商品管理-商品列表
1. 使用表格对数据进行渲染--api(goods)-get
2. 编辑功能
+ 点击编辑功能查询id,并把数据渲染到编辑弹出框--api(goods/:id)-get
+ 编辑提交商品--api(goods/:id)-put
3. 删除商品--api(goods/:id)-delete
4. 点击添加商品，跳转路由到goods/goodsAdd路由里面
```
this.$router.push({ path: "/goods/goodsAdd" });
```
-------------------------------------------------
### 商品管理-商品列表-添加功能
1. 使用步骤条来对添加功能进行步骤显示
2. 使用标签页来进行每个步骤的跳转
- 基本信息
- 商品参数
- 商品属性
- 商品图片
- 商品内容
3. 基本信息内容
+ 使用el-form+input进行数据渲染
+ 使用级联选择器来进行渲染分类列表--api(categories)-get
+ 判断在基本信息标签页里面和分类列表选中的长度等于3，不是就不让跳转到别的标签页
4. 商品参数
+ 使用多选框来进行数据渲染-api(categories/:id/attributes,sel:many)-get
+ 需要把attr_vals变成数组，然后渲染出来
5. 商品属性
+ 使用el-form+input进行数据渲染-api(categories/:id/attributes,sel:only)-get
6. 商品图片
+ 上传图片的地址(action) http://127.0.0.1:8888/api/private/v1/upload
+ 上传图片功能，使用el-upload组件进行上传功能
+ 点击上传图片后的图片，弹出图片弹出框，并把上传的图片赋给弹出框里面的img
+ 需要修改el-upload里面的表头 在里面使用headers
```
:headers="headerToken"
headerToken: {
	// 获取token验证的Authorization字段，来让图片能保存到后台
	Authorization: window.sessionStorage.getItem("user")
},
```
+ 上传图片成功，获取上传图片成功的tmp_path,把数据存放到要提交给后台的数据里面(this.infoRuleForm.pics)
+ 点击删除图片按钮，使用findIndex来查询与之匹配的图片索引，并进行删除
```
const i = this.infoRuleForm.pics.findIndex(item => {
	return item.pic == fileData;
});
this.infoRuleForm.pics.splice(i, 1); //删除对应的数据
```
7. 商品内容
+ 使用第三方富文本编辑器，来进行添加介绍
+ npm i vue-quill-editor
+ 导入富文本编辑器
```
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.component('quill-editor', quillEditor);
```
8. 添加数据
+ 使用js插件(loadsh) 来进行数据深拷贝(this.infoRuleForm)，防止级联选择器变成字符串后显示错误
+ npm i loadsh ---- 导入 import _ from 'loadsh'
```
// 数据深拷贝
const infoData = _.cloneDeep(this.infoRuleForm);
```
+ 把添加的数据发送给后台进行添加--api(goods,infoData)-post
-------------------------------------------------
### 订单管理-订单列表
1. 使用表格来对数据进行渲染--api(orders)-get
2. 物流信息
+ 使用时间线组件来进行数据渲染--api(/kuaidi/:id)-get
--------------------------------------------------
### 安装NProgress插件来进行每次点击出现加载条
1. 安装NProgress --  npm i nprogress
2. 导入Nprogress
```
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
```
3. 在axios的request 拦截器中，显示进度条NProgress.start()
```
axios.interceptors.request.use(config => {
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
```
4. 在 response 拦截器中，隐藏进度条 NProgress.done()
```
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})
```
-------------------------------------------------------
### 配置eslint --vsCode
1. 在项目里面新建文件 .prettierrc
```
{
  "semi":false, //移除分号
  "singleQuote":true //双引号边单引号
}
```
+ 配置完成后所以.vue 按下快捷键 alt+shift+f 来进行代码格式化
2. 解决eslint的tab键错误和需要在方法前面有个小空格的错误
+ 在eslintrc.js的rules 里面输入
```
"no-tabs": "off" // 解决tab的错误
"space-before-function-paren":0, //解决方法名后面需要加上空格的错误
"printWidth":200, //默认一行代码的长度，eslint没报错可省略，默认一行代码长度为80
"eqeqeq":"off", //解决项目出现==而不是===的错误
``` 
---------------------------------------------------------
### 项目优化
## 配置优化
+ npm run build
+ 生成阶段移除所有的console.log
- 使用插件babel-plugin-transform-remove-console(去除console.log插件)
- https://www.npmjs.com/package/babel-plugin-transform-remove-console
- 安装babel-plugin-transform-remove-console 
```
npm install babel-plugin-transform-remove-console --save-dev
```
- 在babel.config.js 里面的plugins添加 "plugins": ["transform-remove-console"]
- 配置在开发阶段可以使用console.log,发布阶段就不可用
- vue-cli-service build --mode production --dest dist --target app --dashboard(这是发布阶段mode显示production)
- 解决方案-在babel.config.js里面判断process.env.NODE_ENV === 'production',如果是就是证明发布阶段，就使用babel-plugin-transform-remove-console 插件
```
const prodPlugins = [];
if(process.env.NODE_ENV === 'production'){
  prodPlugins.push('transform-remove-console')
}
在plugins里面使用...prodPlugins 展开数组来输出transform-remove-console
```
1. 生成打包报告
+ 通过vue.config.js来修改webpack的配置信息
+ 为开发模式和发布模式指定不同的打包入口
```
module.exports = {}
```
- 开发模式打包入口为 src/main-dev.js
- 发布模式打包入口为 src/main-prod.js
+ 在vue.config.js中，新增configWebpack或者chainWebpack节点，来自定义webpack打包配置
```
chainWebpack: config => {
	//发布阶段
	config.when(process.env.NODE_ENV === 'production', config => {
		config.entry('app').clear().add('./src/main-prod.js')
	})
	//开发阶段
	config.when(process.env.NODE_ENV === 'development', config => {
		config.entry('app').clear().add('./src/main-dev.js')
	})
}
```
2. 第三方库启用CDN
+ 通过external加载外部CDN资源
- 在vue.config.js的发布阶段里面引用
```
config.when(process.env.NODE_ENV === 'development', config => {
	config.entry('app').clear().add('./src/main-prod.js')
	config.set('externals', {
		vue: 'Vue', 'vue-router': 'VueRouter',
		axios: 'axios',
		lodash: '_',
		echarts: 'echarts',
		nprogress: 'NProgress', 'vue-quill-editor': 'VueQuillEditor'
	})
})
```
+ 同时，需要在 public/index.html 文件的头部，添加对应的 CDN 资源,并且在main-prod.js删除对应的样式引入
```
<!-- nprogress 的样式表文件 --> 
<link rel="stylesheet" href="https://cdn.staticfile.org/nprogress/0.2.0/nprogress.min.css" />
<!-- 富文本编辑器 的样式表文件 -->
<link rel="stylesheet" href="https://cdn.staticfile.org/quill/1.3.4/quill.core.min.css" />
<link rel="stylesheet" href="https://cdn.staticfile.org/quill/1.3.4/quill.snow.min.css" />
<link rel="stylesheet" href="https://cdn.staticfile.org/quill/1.3.4/quill.bubble.min.css" />

<script src="https://cdn.staticfile.org/vue/2.5.22/vue.min.js"></script>
<script src="https://cdn.staticfile.org/vue-router/3.0.1/vue-router.min.js"></script>
<script src="https://cdn.staticfile.org/axios/0.18.0/axios.min.js"></script>
<script src="https://cdn.staticfile.org/lodash.js/4.17.11/lodash.min.js"></script>
<script src="https://cdn.staticfile.org/echarts/4.1.0/echarts.min.js"></script>
<script src="https://cdn.staticfile.org/nprogress/0.2.0/nprogress.min.js"></script>
<!-- 富文本编辑器的 js 文件 -->
<script src="https://cdn.staticfile.org/quill/1.3.4/quill.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/vue-quill-editor@3.0.4/dist/vue-quill-editor.js"></script>
```
3. element-ui 组件按需导入
+ 在public/index.html导入CDN，然后在main-prod.js删除import './plugins/element.js'
```
<!-- element-ui 的样式表文件 --> <link rel="stylesheet" href="https://cdn.staticfile.org/element-ui/2.8.2/themechalk/index.css" />
<!-- element-ui 的 js 文件 -->
<script src="https://cdn.staticfile.org/element-ui/2.8.2/index.js"></script>
```
4. 路由懒加载
+ 安装 @babel/plugin-syntax-dynamic-import 包。
- npm install --save-dev @babel/plugin-syntax-dynamic-import
+ 在 babel.config.js 的plugins 配置文件中声明该插件。
- '@babel/plugin-syntax-dynamic-import'
+ 将路由改为按需加载的形式，示例代码如下：
```
const Foo = () => import(/* webpackChunkName: "group-foo" */ './Foo.vue')
const Bar = () => import(/* webpackChunkName: "group-foo" */ './Bar.vue')
const Baz = () => import(/* webpackChunkName: "group-boo" */ './Baz.vue')
// 有时候我们想把某个路由下的所有组件都打包在同个异步块 (chunk) 中。只需要使用 命名 chunk，一个特殊的注释语法来提供 chunk name (需要 Webpack > 2.4)。
// Webpack 会将任何一个异步模块与相同的块名称组合到相同的异步块中。
```
可查看文档https://router.vuejs.org/zh/guide/advanced/lazy-loading.html
5. 首页内容定制-目的是解决开发阶段和发布阶段的项目页面名称
+ 在vue.config.js里面进行配置
```
// 如果是生成阶段，就把title变为true，不是就为false
config.plugin('html').tap(args => {
	args[0].title = true
	return args
})
```
+ 在public/src中按需渲染页面的标题
```
<!– 按需渲染页面的标题 -->
<title><%= htmlWebpackPlugin.options.title ? '' : 'dev - ' %>电商后台管理系统</title>
<!– 按需加载外部的 CDN 资源 -->
<% if(htmlWebpackPlugin.options.title) { %>
<!—通过 externals 加载的外部 CDN 资源-->
<% } %>
```
6. 图片压缩
+ 安装相关依赖包
- npm install --save-dev image-webpack-loader
+ 在vue.config.js进行配置(在chainWebpack的发布阶段里面使用)
```
// 开启图片压缩
config.module
	.rule('images')
	.use('image-webpack-loader')
	.loader('image-webpack-loader')
	.options({ bypassOnDebug: true })
	.end()
```