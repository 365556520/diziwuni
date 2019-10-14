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
				<button class="cu-btn bg-red margin-tb-sm lg" @click="login()">登 录</button>
			</view>
			<view class="action-row">
			    <navigator url="/pages/common/commonurl?url=http://www.diziw.cn/register&title=账号注册">注册账号</navigator>
			    <text>|</text>
			    <navigator url="/pages/pages/auth/retrieve">忘记密码</navigator>
			</view>
			<view class="padding ">
				<view class="text-center padding">————第三方登录————</view>
				<view class="oauth-row">
					<view class="oauth-image" @click="providerlogin('qq')">
						<image src="../../../static/qq.png" ></image>
					</view>
					<view class="oauth-image"  @click="providerlogin('sinaweibo')">
						<image src="../../../static/sinaweibo.png"  ></image>
					</view>
				</view>
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
			    'setName'
				
			]),
			login(){
				/*  if (/^[a-zA-Z0-9]{2,15}$/.test(value))
				*  if (/^[a-zA-Z0-9]{6,15}$/.test(value))
				*  */
				let data = {
					username:this.logindata.username,
					password:this.logindata.password,
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
						icon:'none',
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
						console.log('用户数据信息', res.data);
					}).catch((err)=>{
					    console.log('数据请求失败', err);
					})
				}
			},
			providerlogin(provider){
				uni.login({
					provider: provider,
					success: (resp) => {
						//var access_token=resp.authResult.access_token;
						uni.getUserInfo({
						    provider: provider,
						    success: function (infoRes) {
								console.log('测试微博数据昵称'+infoRes.userInfo.nickname)
								console.log('测试微博数据性别'+infoRes.userInfo.gender)
								console.log('测试微博数据id'+infoRes.userInfo.openid)
								console.log('测试微博数据图标地址'+infoRes.userInfo.avatarUrl)
								//console.log('测试微博数据'+access_token)
								var formdata={
									nickName:infoRes.userInfo.nickname,
									gender:infoRes.userInfo.gender=='男'?0:1,
									openId:infoRes.userInfo.openid,
									provider:provider,
									//access_token:access_token,
								};
								//self.$go.post("/qqlogin",formdata).then(res=>{});
							}
						})
					},
					fail: (err) => {}
				});
			}

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
</style>
