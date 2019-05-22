<template>
	<view class="center">
		<view class="logo" @click="goLogin('/pages/pages/auth/login')" :hover-class="!login ? 'logo-hover' : ''">
			<image class="logo-img" :src="login ? uerInfo.avatarUrl :avatarUrl"></image>
			<view class="logo-title">
				<text class="uer-name">Hi，{{userdata.hasEnter ? userdata.user.name : '您未登录!'}}</text>
				
			</view>
		</view>
		<view class="center-list">
			<view class="center-list-item border-bottom">
				<text class="list-icon">&#xe60f;</text>
				<text class="list-text">账号管理</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
		</view>
		<view class="center-list">
			<view class="center-list-item border-bottom">
				<text class="list-icon">&#xe639;</text>
				<text class="list-text">新消息通知</text>
			</view>
		</view>
		<view class="center-list">
			<view class="center-list-item border-bottom">
				<text class="list-icon">&#xe60b;</text>
				<text class="list-text">帮助与反馈</text>
			</view>
		</view>
		<view class="center-list">
			<view class="center-list-item border-bottom">
				<text class="list-icon">&#xe65f;</text>
				<text class="list-text">服务条款及隐私</text>
			</view>
		</view>
		<view class="center-list" @click="quitUser()">
			<view class="center-list-item">
				<text class="list-icon">&#xe614;</text>
				<text class="list-text">用户退出</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {mapState,mapMutations,mapGetters} from 'vuex'; //mapState数据计算简化模式mapMutations方法的简化模式写法如下
	export default {
		mounted(){ //这个挂在第一次进入页面后运行一次
		  
		},
		data() {
			return {
				login:false,
				avatarUrl: '/static/logo.png',
				uerInfo: {}
			}
		},
		computed:{//数据计算
			...mapState(['userToken','userdata']),
		},
		methods: {
			//用vuex里面的方法
			...mapMutations([
			    'deleteUser'
			]), 
			goLogin(url) {
				if(this.userdata.hasEnter){
					return ;
				}else{
					if (!this.login) {
						uni.navigateTo({
							url: url
						});			
						console.log('点击前往登录');
					}
				}
			},
			 //退出用户
			quitUser(){
				console.log('chakan',this.userToken);
				//用户登录
			    if(this.userToken!=""){
					let token = this.userToken;
					this.$api.postToken('/api/logout',token).then((res)=>{
						let userData=JSON.parse(res.data);//把json转换数组
						console.log('数据请求', res);
						if(res.statusCode=='200'){
							  this.deleteUser();//vuex删除用户数据
							  uni.showToast({
							     title: userData.message,
							     icon: 'success',
							     mask: true
							 });
						}
					  //  this.res = '请求结果 : ' + JSON.stringify(res);
					}).catch((err)=>{
					    console.log('数据请求失败', err);
					})
			    }else{
					 uni.showToast({
					    title: "未登录",
					    icon: 'success',
					    mask: true
					});
			    } 
			}
		}
	}
</script>

<style>
	page,
	view {
		display: flex;
	}
	
	page {
		background-color: #f8f8f8;
	}
	
	.center {
		flex-direction: column;
		background-color: #FFFFFF;
	}
	
	.logo {
		width: 750upx;
		height: 240upx;
		padding: 20upx;
		box-sizing: border-box;
		background-color: #ec706b;
		flex-direction: row;
		align-items: center;
	}
	
	.logo-hover {
		opacity: 0.8;
	}
	
	.logo-img {
		width: 150upx;
		height: 150upx;
		border-radius: 150upx;
	}
	
	.logo-title {
		height: 150upx;
		flex: 1;
		align-items: center;
		justify-content: space-between;
		flex-direction: row;
		margin-left: 20upx;
	}
	
	.uer-name {
		height: 60upx;
		line-height: 60upx;
		font-size: 38upx;
		color: #FFFFFF;
	}
	
	.go-login.navigat-arrow {
		font-size: 38upx;
		color: #FFFFFF;
	}
	
	.login-title {
		height: 150upx;
		align-items: self-start;
		justify-content: center;
		flex-direction: column;
		margin-left: 20upx;
	}
	
	.center-list {
		background-color: #FFFFFF;
		margin-top: 20upx;
		width: 750upx;
		flex-direction: column;
	}
	
	.center-list-item {
		height: 90upx;
		width: 750upx;
		box-sizing: border-box;
		flex-direction: row;
		padding: 0upx 20upx;
	}
	
	.border-bottom {
		border-bottom-width: 1upx;
		border-color: #c8c7cc;
		border-bottom-style: solid;
	}
	
	.list-icon {
		width: 40upx;
		height: 90upx;
		line-height: 90upx;
		font-size: 34upx;
		color: #2F85FC;
		text-align: center;
		font-family: texticons;
		margin-right: 20upx;
	}
	
	.list-text {
		height: 90upx;
		line-height: 90upx;
		font-size: 34upx;
		color: #555;
		flex: 1;
		text-align: left;
	}
	
	.navigat-arrow {
		height: 90upx;
		width: 40upx;
		line-height: 90upx;
		font-size: 34upx;
		color: #555;
		text-align: right;
		font-family: texticons;
	}
</style>
