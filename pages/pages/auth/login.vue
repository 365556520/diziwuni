<template>
	<view class="content center">
		 <view class="input-group">
		    <view class="input-row border">
		        <text class="title">账号：</text>
		        <m-input class="m-input" type="text" clearable focus v-model="account" placeholder="请输入账号"></m-input>
		    </view>
		    <view class="input-row">
		        <text class="title">密码：</text>
		        <m-input type="password" displayable v-model="password" placeholder="请输入密码"></m-input>
		    </view>
		</view>
		<view class="btn-row">
		    <button type="primary" class="primary" @tap="login">登 录</button>
		</view>
		<view class="action-row">
		    <navigator url="">注册账号</navigator>
		    <text>|</text>
		    <navigator url="">忘记密码</navigator>
		</view>
	</view>
</template>

<script>
	import mInput from '../../../components/m-input/m-input.vue'
	export default {
		components: {
		    mInput
		},
		data() {
			return {
				providerList: [],
				hasProvider: false,
				account: '',
				password: '',
				positionTop: 0
			}
		},
		onLoad: function (option) { //option为object类型，会序列化上个页面传递的参数
			
		},
		methods: {
			login(){
				  /**
				 * 客户端对账号信息进行一些必要的校验。
				 * 实际开发中，根据业务需要进行处理，这里仅做示例。
				 */
				if (this.account.length < 5) {
				    uni.showToast({
				        icon: 'none',
				        title: '账号最短为 5 个字符'
				    });
				    return;
				}
				if (this.password.length < 6) {
				    uni.showToast({
				        icon: 'none',
				        title: '密码最短为 6 个字符'
				    });
				    return;
				}
			}
		}
	}
</script>

<style>
	.center{
		 background-color: #efeff4;
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
	
	.oauth-row {
	    display: flex;
	    flex-direction: row;
	    justify-content: center;
	    position: absolute;
	    top: 0;
	    left: 0;
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
	/* 原生组件模式下需要注意组件外部样式 */
	m-input {
		width: 100%;
		min-height: 100%;
		display: flex;
	}
	
</style>
