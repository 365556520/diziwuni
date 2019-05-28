<template>
	<view class="content ">
		<cu-custom bgColor="bg-gradual-pink" :isBack="true"><block slot="backText">返回</block><block slot="content">登录</block></cu-custom>
		<view>
				<inputs :inputsArray="inputsArray" activeName="登 录"  
				 @activeFc="login" animationType="rotate3d-fade" :animationDuration=".1"
				 submitReSet :buttonStyle="buttonStyle" :inputDebounceSet="inputDebounceSet"/>
		</view>
		<view class="action-row">
		    <navigator url="">注册账号</navigator>
		    <text>|</text>
		    <navigator url="">忘记密码</navigator>
		</view>
	</view>
</template>

<script>
	import inputs from "@/components/QuShe-inputs/inputs.vue";
	import {mapState,mapMutations,mapGetters} from 'vuex'; //mapState数据计算简化模式mapMutations方法的简化模式写法如下
	export default {
		components: {
		    inputs
		},
		data() {
			return {
				inputDebounceSet: {
                    openInputDebounce: true,
                    delay: 500
                },
				"buttonStyle": { //按钮样式
                    "activeButton": "background-color: #EC208C;border-radius: 2px;box-shadow: 2px 2px 1px 1px #EC208C;", //主按钮样式
                },
                "inputsArray": [
                    {
                        "title": "用户名",
						"variableName":"username",//自定义变量名取值时候用
			            "ignore":true,
						"verifyFc": function(value) {
                            if (/^[a-zA-Z0-9]{2,15}$/.test(value)) // '/^[1][3,4,5,7,8][0-9]{9}$/'电话号码正则
                                return true;
                            return false;
                        },
                        "verifyErr": "用户名和密码错误"
                    }, {
                        "title": "密 码",
						"ignore":true,
						"variableName":"password",//自定义变量名取值时候用
                        //"tapClear": true, //input一键清除功能
                        "password": true, //input密码类型
						"verifyFc": function(value) {
						    if (/^[a-zA-Z0-9]{6,15}$/.test(value)) // '/^[1][3,4,5,7,8][0-9]{9}$/'电话号码正则
						        return true;
						    return false;
						},
						"verifyErr": "用户名和密码错误",
                        "filterFc": function(value) { //input值过滤函数
                            //自定义过滤函数
                            value = value;
                            return value;
						},
					},
				]
			}
		},
		onLoad: function (option) { //option为object类型，会序列化上个页面传递的参数
			
		},
		computed:{//数据计算
		    ...mapState(['userToken','userdata']),
		},
		methods: {
			 //用vuex里面的方法
			...mapMutations([
			    'setToken',
			    'setName'
				
			]),
			login(res){
				/* // 最终取值
				//主方法，携带用户输入的数据对象
				// 如果项内定义了variableName属性，则取值为定义的variableName，否则取值为 this.onloadData + index, onloadData默认值为'data_'
				// 需要把数据传至服务器时也可以把整个对象传过去，由后端直接处理数据，这样可以实现整体的表单类型、布局、取值都由后端决定
				//let _this = this; */
				 let data = {
				    username:res.username,
				    password:res.password,
				}
				//用户登录
				this.$api.post('/api/login',data).then((res)=>{
					let userData=JSON.parse(res.data);//把json转换数组
					if(res.statusCode=='200'){
						 this.setToken(userData.token);//把token保存到vuex里面
						 //获取用户信息
						 this.getuserdata(this.userToken);
						 uni.showToast({
						     title: userData.message,
						     icon: 'success',
						     mask: true
						 });
						 uni.navigateBack({
							delta: 1, //返回上一页
							animationType: 'pop-out', //动画
							animationDuration: 300 //动画时间
						});
						// console.log('打印token', uni.getStorageSync('userToken'));
					}
				  //  this.res = '请求结果 : ' + JSON.stringify(res);
				}).catch((err)=>{
					let data = JSON.parse(err.data);
					uni.showToast({
					    title: '用户不存在',
					    mask: true
					});
				    console.log('数据请求失败', data);
				})
			},
			//获取用户信息
			getuserdata(token){
				if(this.userToken!=""){
					this.$api.postToken('/api/passport',token).then((res)=>{
						if(res.statusCode=='200'){
							let user=JSON.parse(res.data);
							this.setName(user);
						}
						console.log('用户数据信息', this.userdata);
					}).catch((err)=>{
					    console.log('数据请求失败', err);
					})
				}
			}
		
		}
	}
</script>

<style>
	.content{

	}
	.action-row {
	    display: flex;
	    flex-direction: row;
	    justify-content: center;
	}
	.action-row navigator {
	    color: #007aff;
	    padding: 0 20upx;
	}
	view,button, textarea, input{
		box-sizing: border-box;
	}
	button::after {
		border: none;
	}
	
</style>
