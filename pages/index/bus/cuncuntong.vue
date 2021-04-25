<template>
	<view class="content">
		<form>
			<view class="cu-form-group margin-top">
				<view class="title">村村通账号:</view>
				<input placeholder="请输入用户名" maxlength=20 name="username" v-model="cuncuntonglogindata.username"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">村村通密码:</view>
				<input placeholder="请输入密码" name="password" maxlength=20 type="password" v-model="cuncuntonglogindata.password"></input>
			</view>
			
			<view class="padding flex flex-direction">
				<button v-if="!correlationShow" class="cu-btn bg-red margin-tb-sm lg" @click="login">登 录</button>
				<button v-if="correlationShow" class="cu-btn bg-red margin-tb-sm lg" @click="correlation">绑定此账号</button>
			</view>
			<view class="action-row">
				<text style="color: #E03997;">请使用GPS村村通账号登录</text>
			</view> 
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
		</form>
	</view>
</template>

<script>
	import {mapState,mapMutations} from 'vuex'; //mapState数据计算简化模式mapMutations方法的简化模式写法如下
	export default {
		mounted(){ //这个挂在第一次进入页面后运行一次
			this.getToken();  //从缓存中获取token和数据
			this.ifLoginReturn();
		},
		components: {
			
		},
		data() {
			return {
				cuncuntonglogindata:{
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
				'getToken',
				'ifLoginReturn'
			]),
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
