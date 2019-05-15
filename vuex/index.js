import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from '../node_modules/vuex-persistedstate' //持久化存储状态信息
Vue.use(Vuex);

const state={
    count:3,//测试数据
    userToken:'',//用户token身份
    userdata:{
        userName:'',//用户名字
        hasEnter:'',//用户登录状态
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
    },
    //设置名字
    setName(state,name){
        state.userdata.userName = name;
    },
    //设置用户登录状态
    setHasEntere(state,hasEnter){
        state.userdata.hasEnter = hasEnter;
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
    //获取token方法
    getToken(state){
        return  state.userToken;
    },
    //删除用户状态
    deleteUser(state){
        if (state.userToken != ''){
            //清空tiken和用户信息
            state.userToken = '';
            state.userdata = {
                userName:'',//用户名字
                hasEnter:'',//用户登录状态
             };
        }
        return state;
    },
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
    getters,
    // ...这样配置表示把VUEX中的所有数据存到localStorage中
    plugins: [createPersistedState()]
})


