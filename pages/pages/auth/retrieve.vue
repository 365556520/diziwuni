<template>
	<view class="content ">
		<form>
	
			<view class="cu-form-group">
				<view class="title">电子邮箱</view>
				<input placeholder="如:1234@qq.com" name="mail" @blur='verify(rinput.mail)' v-model="rinput.mail"></input>
			</view>
			<view class="padding flex flex-direction">
				<button class="cu-btn bg-red margin-tb-sm lg" @click="retrieve()">找回密码</button>
			</view>
		</form>	
	</view>
</template>

<script>
	
	export default {
		components: {
		},
		data() {
			return {
				rinput:{
					'username':'',
					'password':'',
					'rpassword':'',
					'mail':'',
					'phone':''
				},
				info:{
					mess:"请正确填写注册信息！",
					code:false
				}
			}
		},
		onLoad: function (option) { //option为object类型，会序列化上个页面传递的参数
			
		},
		computed:{//数据计算    
		},
		methods: {
			verify(v){
				var mail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/ //邮箱正则
				if (!mail.test(v)){
					uni.showToast({
						title: '邮箱格式错误!',
						icon:'none',
						mask: true
					});
					this.info.code = false;
					this.info.mess ='邮箱格式错误';
				}else{
					this.info.code = true;
				}
			},
			retrieve(){
				if(this.info.code){
					uni.showToast({
					    title: '验证成功开始注册',
						icon:'none',
						mask: true
					});
				}else{
					uni.showToast({
					    title: this.info.mess,
						icon:'none',
						mask: true
					});
				}
			},
		}
	}
</script>

<style>
	.content{

	}
	
	view,button, textarea, input{
		box-sizing: border-box;
	}
	button::after {
		border: none;
	}
	
</style>
