import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import './plugins/element.js'
/* 引入全局样式 */
import './assets/css/global.css'
/* 引入NProgress插件来进行进度条显示 */
import NProgress from 'nprogress'
/* 引入axios' */
import axios from 'axios'

/* 引入百度地图插件 */
// import BaiduMap from 'vue-baidu-map'

/* 导入第三方表格插件  */
import TreeTable from 'vue-table-with-tree-grid'

// 引入富文本编辑器
import { quillEditor } from 'vue-quill-editor'
/* 通过axios请求拦截器添加token，保证拥有获取数据的权限 */
axios.interceptors.request.use(config => {
	/* 请求的时候，展示进度条 */
	NProgress.start()
	/* 为请求头对象，添加 Token 验证的 Authorization 字段 */
	config.headers.Authorization = window.sessionStorage.getItem('user')
	return config
})
/* 请求axios结束的时候，隐藏进度条 */
axios.interceptors.response.use(config => {
	NProgress.done()
	return config
})
/* 把axios挂在到Vue上面 */
Vue.prototype.$axios = axios
/* 配置axios的默认请求路径 */
axios.defaults.baseURL = 'http: //127.0.0.1:8899/api/'
Vue.component('tree-table', TreeTable)

Vue.use(BaiduMap, {
	// ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
	ak: 'ASuBNPd2MUgeYVuvCAYSKTz6mM0GsYuI'
})

// 时间过滤器
Vue.filter('formartDate', function (value) {
	const data = new Date(value) // 获取对应的事件
	const Y = data.getFullYear() // 获取年
	// 使用padStart要把数据改为字符串，需要在获取到的时间后面添加空字符串即可把数据变成字符串
	const M = (data.getMonth() + 1 + '').padStart(2, '0') // 获取月,当获取的时间不足两位数时候，使用padStart来进行字符串填充'0';
	const D = (data.getDate() + '').padStart(2, '0') // 获取日,当获取的时间不足两位数时候，使用padStart来进行字符串填充'0';
	const H = (data.getHours() + '').padStart(2, '0') // 获取时,当获取的时间不足两位数时候，使用padStart来进行字符串填充'0';
	const I = (data.getMinutes() + '').padStart(2, '0') // 获取分,当获取的时间不足两位数时候，使用padStart来进行字符串填充'0';
	const S = (data.getSeconds() + '').padStart(2, '0') // 获取秒,当获取的时间不足两位数时候，使用padStart来进行字符串填充'0';
	return `${Y}-${M}-${D} ${H}:${I}:${S}`
})
Vue.component('quill-editor', quillEditor)

Vue.config.productionTip = false

new Vue({
	router,
	render: h => h(App)
}).$mount('#app')
