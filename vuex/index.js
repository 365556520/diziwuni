import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

const state={
    count:3,//测试数据
    userToken:'',//用户token身份
    userdata:{
        user:{
			id:'',
			name:'',
			headimg:'',
			getUserData:{}
		},//用户信息
        hasEnter:false,//用户登录状态
    },
    userbaidumap:{
        ak:'LQjsPOAqD3uooTTVrIUePWUm',//百度地图秘钥
        center:{lng: 0, lat: 0},//经纬度
        centername:'',//定位的地名
        date:'',//更新时间
        results: '', //天气预报信息
    }
}
//状态数据修改
const mutations={
    //设置token
    setToken(state,token){
        state.userToken = token;
		try {
			uni.setStorageSync('userToken', state.userToken);//存到缓存中
		} catch (e) {
			// error
		}
    },
    //设置用户信息
    setName(state,data,hasEnter=true){
        state.userdata = data;
		state.userdata.hasEnter = hasEnter;
			console.log('用户数据信息2',state.userdata);
		try {
			uni.setStorageSync('userdata', state.userdata);//存到缓存中
		} catch (e) {
			// error
		}
    },
    //设置当前位置的经纬度
    setMapCenter(state,center){
        state.userbaidumap.center=center;
    },
    //设置当前位置的地名
    setMapCenterName(state,centername){
        state.userbaidumap.centername = centername;
    },
    /*设置更新天气预报时间*/
    setMapdate(state,date){
        state.userbaidumap.date = date;
    },
    /*天气预报信息*/
    setMapresults(state,results){
        state.userbaidumap.results=results;
    },
    //从缓存中获取token和用户数据的方法
    getToken(state){
		try {
			state.userToken = uni.getStorageSync('userToken');//获取本地缓存中的token
			state.userdata = uni.getStorageSync('userdata');//获取本地缓存中的数据
		} catch (e) {
			// error
		}
    },
	
    //删除用户状态
    deleteUser(state){
		try {
			if (state.userToken != ''){
			    //清空tiken和用户信息
			    state.userToken = '';
			    state.userdata = {
			        user:{
						id:'',
						name:'',
						getUserData:{}
					},//用户信息
			        hasEnter:false,//用户登录状态
			     };
			}
			uni.removeStorageSync('userToken'); //清除本地缓存中的token
			uni.removeStorageSync('userdata'); //清除本地缓存中的token
		} catch (e) {
			// error
		}
        return state;
    },	//0
	

    //下面是测试
    add(state,n){
        state.count+=n;
    },
    reduce(state){
        state.count--;
    }
}
//状态过滤器
const getters = {
    count:function(state){
        return state.count +=100;
    }
}
/*用export default 封装代码，让外部可以引用*/
export default new Vuex.Store({
    state,
    mutations,
    getters
})


