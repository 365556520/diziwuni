import Vue from 'vue'
import App from './App'
Vue.config.productionTip = false
App.mpType = 'app'
//远程连接
import api from '@/components/vmeitime-http/'
// 全局挂载后使用
Vue.prototype.$api = api
/*vuex全局应用*/
import store from './vuex'
// vuex全局挂载后使用
Vue.prototype.$store = store  
const app = new Vue({
	store,
    ...App
})
app.$mount()
