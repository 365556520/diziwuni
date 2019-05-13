import Vue from 'vue'
import App from './App'
Vue.config.productionTip = false
App.mpType = 'app'
import api from '@/components/vmeitime-http/'
// 全局挂载后使用
Vue.prototype.$api = api

const app = new Vue({
    ...App
})
app.$mount()
