<template>
	<view class="content">
		<form>
			<view class="cu-form-group margin-top">
				<view class="title">账 号 </view>
				<input placeholder="请输入用户名" maxlength=20 name="username" v-model="logindata.username"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">密 码 </view>
				<input placeholder="请输入密码" name="password" maxlength=20 type="password" v-model="logindata.password"></input>
			</view>
			
			<view class="padding flex flex-direction">
				<button v-if="!correlationShow" class="cu-btn bg-red margin-tb-sm lg" @click="login">登 录</button>
				<button v-if="correlationShow" class="cu-btn bg-red margin-tb-sm lg" @click="correlation">绑定此账号</button>
			</view>
		<!-- 	<view class="action-row">
			    <navigator url="/pages/common/commonurl?url=http://server.diziw.cn/register&title=账号注册&backnav=pages/index/index">注册账号</navigator>
			    <text>|</text>
			    <navigator url="/pages/pages/auth/retrieve">忘记密码</navigator>
			</view> -->

			<!-- #ifdef APP-PLUS || MP-WEIXIN-->
			<view class="padding correlation" v-show="!correlationShow">
				<view class="text-center padding correlation-title">——————— 其他登录方式 ———————</view>
				<view class="oauth-row">
					<view class="oauth-image" @click="providerlogin('qq')">
						<image src="../../../static/qq.png" ></image>
					</view>
					<view class="oauth-image"  @click="providerlogin('sinaweibo')">
						<image src="../../../static/sinaweibo.png"  ></image>
					</view>
				</view>
			</view>
			<!-- #endif -->
			<view>
				<p class="text-center  correlation-title" style="color: red;">暂未对外开放注册，如果需要账号请联系管理员！</p>
			</view>
		</form>
	</view>
</template>

<script>
	import {mapState,mapMutations,mapGetters} from 'vuex'; //mapState数据计算简化模式mapMutations方法的简化模式写法如下
	export default {
		components: {
			
		},
		data() {
			return {
				logindata:{
					'username':'',
					'password':''
				},
				correlationShow:false,//第三方登录关联显示
				correlationData:{
					'nickName':'',
					'gender':'',
					'provider_id':'',
					'provider':'',
					'avatarUrl':''
				}
				
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
			    'setName',
				'setdayikey',
				'setcarUserDara'
			]),
			/*  if (/^[a-zA-Z0-9]{2,15}$/.test(value))
			*  if (/^[a-zA-Z0-9]{6,15}$/.test(value))
			*  */
			login(){ //输入账号密码登录
				let data = {
					username:this.logindata.username,
					password:this.logindata.password,
				}
				//用户登录
				this.$api.post('/api/login',data).then((res)=>{
					let userData=JSON.parse(res.data);//把json转换数组
					//console.log('打印token', userData);
					if(res.statusCode=='200'){
						this.successLogin(userData); //登陆成功
						console.log('打印tokenssss', res.data)
					}
				  //  this.res = '请求结果 : ' + JSON.stringify(res);
				}).catch((err)=>{
					let data = JSON.parse(err.data);
					uni.showToast({
						title: '用户不存在',
						icon:'none',
						mask: true
					});
					console.log('数据请求失败', err.data);
				})
			},
			//获取用户信息
			getuserdata(token){
				if(this.userToken!=""){
					this.$api.postToken('/api/passport',token).then((res)=>{
						if(res.statusCode=='200'){
							let user=JSON.parse(res.data);
							//权限转换为以为数组
							let parmission =user.user['parmission'];
							let parmis = [];
							for (let x in parmission){
								parmis.push(parmission[x]['name']);
							}
							user.user['parmission'] =  parmis; 
							//用户信息设置本地
							this.setName(user);
							if(this.userdata.user.parmission.includes('cuncuntong')||this.userdata.user.parmission.includes('keyun')){
								//console.log('我是keyu或者是村账号',);		
								this.getdayikey();//获取平台key
							}
							//console.log('用户数据信息',	user.user['parmission']);			
						}
					}).catch((err)=>{
					    console.log('数据请求失败', err);
					})
				}
			},
			//
			//获取大一平台的key
			getdayikey(){
				if(this.userToken!=""){
					this.$api.postToken('/api/getDayiKey',this.userToken).then((res)=>{
						if(res.statusCode=='200'){
							let dayikey=JSON.parse(res.data);
							this.setdayikey(dayikey); //设置大一登录信息
							if(this.userdata.user.parmission.includes('api.user')){ //普通车辆用户权限
								this.getCarData(this.userdata.user[0].name,dayikey.data.sessionId);//如果是驾驶员用户就获取车龄id
							}
							console.log('测试数据返回有问题',res.data);
						}
					}).catch((err)=>{
					    console.log('数据请求失败', err);
					})
				}
			},
			//获取当前车辆信息
			getCarData(carName,sessionId){
				let url="/search_car.jsp?plate="+carName+
				"&video=false&userId=xxfhgj&loginType=user&loginWay=interface&loginLang=zh_CN&appDevId=&appId=&sessionId="+sessionId;
				if(this.userToken!=""){
					this.$api.dayinGet(url).then((res)=>{
						if(res.statusCode=='200'){
							let data=JSON.parse(res.data);
							let carDate  = data.list[0]; //获取当前车辆数据	 
							this.setcarUserDara(carDate);//把车辆信息保存到缓存
						}
						console.log('获取当前车辆信息',res.data);
					}).catch((err)=>{
						console.log('数据请求失败', err);
					})
				}
			},
			//第三方登录
			providerlogin(provider){
				let this_ =this;
				uni.login({
					provider: provider,
					success: (resp) => {
						//var access_token=resp.authResult.access_token;
						uni.getUserInfo({
						    provider: provider,
						    success: function (infoRes) {
								/* console.log('测试数据昵称---'+infoRes.userInfo.nickname)
								console.log('测试数据性别---'+infoRes.userInfo.gender)
								console.log('测试数据id---'+infoRes.userInfo.openId)
								console.log('测试数据图标地址---'+infoRes.userInfo.avatarUrl) */
								let gender = infoRes.userInfo.gender; //因为微博数据不一样
								if(provider=='sinaweibo'){
									gender = infoRes.userInfo.gender=='m'?'男':'女';
								}
								this_.correlationData={
									nickName:infoRes.userInfo.nickname,
									gender:gender,	
									provider_id:infoRes.userInfo.openId,
									provider:provider=='sinaweibo'?'weibo':provider,
									avatarUrl:infoRes.userInfo.avatarUrl
									//access_token:access_token,
								};
								//第三方后台登录
								this_.$api.post('/api/social/login',this_.correlationData).then((res)=>{
									let userData=JSON.parse(res.data);//把json转换数组
									if(res.statusCode=='200'){
										 this_.successLogin(userData);
										// console.log('打印token', uni.getStorageSync('userToken'));
									}
								}).catch((err)=>{
									let data = JSON.parse(err.data);
									uni.showToast({
										title: '请绑定账号',
										icon:'none',
										mask: true
									});
									//显示绑定此账号
									this_.correlationShow = true;
								    //改变登录框内容
									console.log('数据请求失败', data);
								})
							}
						})
					},
					fail: (err) => {}
				});
			},
			correlation(){
				//绑定已有账号逻辑
				let data = {
					username:this.logindata.username,
					password:this.logindata.password,
					correlationData:JSON.stringify(this.correlationData), //问题出在这里传送过去的数据没有转换json
				}
				console.log('打印data',data);
				//第三方绑定并登陆
				this.$api.post('/api/social/correlation',data).then((res)=>{
					let userData=JSON.parse(res.data);//把json转换数组
					if(res.statusCode=='200'){
						 this.successLogin(userData);
						// console.log('打印token', uni.getStorageSync('userToken'));
					}
				}).catch((err)=>{
					let data = JSON.parse(err.data);
					//显示绑定此账号
					this.correlationShow = true;
				    //改变登录框内容 
					uni.showToast({
						title: '账号密码不正确！',
						icon:'none',
						mask: true
					});
					console.log('绑定已有账号', data.statusCode);
				})
			},
			//登录成功后方法
			successLogin(userData){
				this.setToken(userData.token);//把token保存到vuex里面
				 //获取用户信息
				 //this.getuserdata(this.userToken);
				 this.getuserdata(userData.token);
				 uni.showToast({
					 title: userData.message,
					 icon: 'success',
					 mask: true
				 });
				 uni.reLaunch({
					url:'/pages/pages/my',
				});
			},
		}
	}
</script>

<style>
	.action-row {
	    display: flex;
	    flex-direction: row;
	    justify-content: center;
	}
	.action-row navigator {
	    color: #007aff;
	    padding: 0 20upx;
	}
	.oauth-row {
		padding-top: 20upx;
	    display: flex;
	    flex-direction: row;
	    justify-content: center;
	
	    width: 100%;
	}
	.oauth-image {
	    width: 100upx;
	    height: 100upx;
	    border: 1upx solid #dddddd;
	    border-radius: 100upx;
	    margin: 0 40upx;
	    background-color: #ffffff;
	}
	
	.oauth-image image {
	    width: 60upx;
	    height: 60upx;
	    margin: 20upx;
	}
	.correlation {
		margin-top: 180upx;
	}
	.correlation-title{
		font-size: 26upx;
		color: #666666;
	}
</style>
