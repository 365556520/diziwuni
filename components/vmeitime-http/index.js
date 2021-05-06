import http from './interface'

/**
 * 将业务所有接口统一起来便于维护
 * 如果项目很大可以将 url 独立成文件，接口分成不同的模块
 * 
 */
let headUrl = 'http://server.diziw.cn';  //自己服务器地址 http://server.diziw.cn http://www.diziw.cn
let dayiUrl = "http://123.162.189.21/gps-web/api"; //大一平台服务地址
// 单独导出(测试接口) import {test} from '@/common/vmeitime-http/'
export const test = (url,data) => {
	//http.config.baseUrl = "http://server.diziw.cn"
	//设置请求前拦截器
	/* http.interceptor.request = (config) => {
		config.header = {
			"token": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
		}
	} */
	//设置请求结束后拦截器
	http.interceptor.response = (response) => {
		console.log('个性化response....')
		//判断返回状态 执行相应操作
		return response;
	}
    return http.request({
		baseUrl: headUrl,
        url: url,
		dataType: 'text',
        data,
    })
}
// 天气预报
export const baiduapi = (url,data) => {
	//http.config.baseUrl = "http://server.diziw.cn"
	//设置请求前拦截器
	/* http.interceptor.request = (config) => {
		config.header = {
			"token": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
		}
	} */
	//设置请求结束后拦截器
	http.interceptor.response = (response) => {
		console.log('个性化response....')
		//判断返回状态 执行相应操作
		return response;
	}
    return http.request({
		baseUrl: 'http://api.map.baidu.com',
        url: url,
		dataType: 'text',
        data,
    })
}
//post
export const post = (url,data) => {
	//http.config.baseUrl = "http://server.diziw.cn"
	//设置请求前拦截器
	/* http.interceptor.request = (config) => {
		config.header = {
			"token": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
		}
	} */
	//设置请求结束后拦截器
	http.interceptor.response = (response) => {
		console.log('个性化response....')
		//判断返回状态 执行相应操作
		return response;
	}
    return http.request({
		baseUrl: headUrl,
		method: 'POST', 
        url: url,
		dataType: 'text',
        data,
    })
}
//带token的请求
export const postToken = (url,token,data='') => {
	//http.config.baseUrl = "http://server.diziw.cn"
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		config.header = {
			'Accept':'application/json',
			"Authorization": 'Bearer ' + token,
		}
	} 
	//设置请求结束后拦截器
	http.interceptor.response = (response) => {
		console.log('个性化response....')
		//判断返回状态 执行相应操作
		return response;
	}
    return http.request({
		baseUrl: headUrl,
		method: 'POST', 
        url: url,
		dataType: 'text',
        data,
    })
}

//大一平台链接
export const dayinPOst = (url,data='') =>{
	//设置请求结束后拦截器
	http.interceptor.response = (response) => {
		console.log('个性化response....')
		//判断返回状态 执行相应操作
		return response;
	}
	return http.request({
		baseUrl: dayiUrl,
		method: 'POST', 
	    url: url,
		dataType: 'text',
	    data,
	})
}


// 轮播图
export const banner = (data) => {
    return http.request({
        url: '/banner/36kr',
        method: 'GET', 
        data,
		// handle:true
    })
}

// 默认全部导出  import api from '@/common/vmeitime-http/'
export default {
	test,
    banner,
	post,
	baiduapi,
	postToken,
	dayinPOst
}