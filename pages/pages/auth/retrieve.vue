<template>
	<view class="content ">
		<!-- #ifdef H5 || APP-PLUS -->
				<cu-custom bgColor="bg-gradual-pink" :isBack="true"><block slot="content">修改密码</block></cu-custom>
		<!-- #endif -->

		<view class="bg-white padding">
			<view class="cu-steps" >
				<view class="cu-item" :class="index>num?'':'text-blue'" v-for="(item,index) in numList" :key="index">
					<text class="num" :class="index==4?'err':''" :data-index="index + 1"></text> {{item.name}}
				</view>
			</view>
			</br>
			<view class="cu-steps" v-if='num == 0'>
				<view class="cu-form-group" >
					<view class="title">账号</view>
					<input placeholder="请填写注册时的账号" name="username" @blur='verify("username",rinput.username)' v-model="rinput.username"></input>
				</view>
			</view>
			<view class="cu-steps" v-if='num == 1'>
				<view class="cu-form-group">
					<view class="title">电子邮箱</view>
					<input placeholder="请填写注册时的邮箱" name="email" @blur='verify("email",rinput.email)' v-model="rinput.email"></input>
				</view>
			</view>
			<view class="flex solid-bottom padding justify-center"  v-if='num > 1'>
				<view class="cu-steps">
					<view class=" padding-sm margin-xs radius"><h1 style="color: #39B54A;">{{resetEmailmess}}</h1></view>
				</view>
			</view>
			<view class="action" v-if="nextshow">
				<button class=" bg-green shadow" @tap="NumSteps">{{btname}}</button>
			</view>
		</view>
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
					'email':'',
					'phone':''
				},
				isemail:'',//通过填写的账号获取邮箱 然后拿这个邮箱和后面填写的邮箱对比
				info:{
					mess:"请正确填写注册信息！",
					code:false
				},
				numList: [{
					name: '账号'
				}, {
					name: '邮箱'
				}, {
					name: '发送'
				}, {
					name: '结果'
				},],
				num: 0,
				nextshow:true,//下一步按钮的显示
				resetEmailmess:'' ,//邮件发送成功消息
				btname:'下一步'
			}
		},
		onLoad: function (option) { //option为object类型，会序列化上个页面传递的参数
			
		},
		computed:{//数据计算    
		},
		methods: {
			NumSteps() {
				if(this.info.code){
					if(this.num == 0){
						//访问api查看账号是否存在！并获取该账号邮箱 赋给isemail
						//验证成功后认证格式在复原
						this.info.code = false;
						let data = {
						    lname:'username',
						    data:this.rinput.username,
						}
						this.isUserData(data,0); //查看用户是否存在
					}else if(this.num == 1){
						let data = {
						    lname:'email',
						    data:this.rinput.email,
						}
						this.isUserData(data,1); //查看邮箱是否存在
					}else if(this.num == 2){
						this.resetEmailmess = '正在发送中...';	
						//发送找回密码
						let resetEmail = {
							email:this.rinput.email,
						}
						this.$api.post('/api/resetEmail',resetEmail).then((res)=>{
							let data=JSON.parse(res.data);
							this.resetEmailmess = data.message;	
							this.num = this.numList.length
							this.nextshow=false;
							console.log(data);
						}).catch((err)=>{
							uni.showToast({
								title: '数据不存在',
								icon:'none',
								mask: true
							});
							console.log('数据请求失败', err);
						})
					}
					
				}else{
					uni.showToast({
					    title: this.info.mess,
						icon:'none',
						mask: true
					});
				}
								
			},
			isUserData(datas,isnum){
				//查询用户和邮箱是否存在
				this.$api.post('/api/isUser',datas).then((res)=>{
					let data=JSON.parse(res.data);
					if(data.code==401){
						uni.showToast({
							title:data.message,
							icon:'none',
							mask: true
						});
						this.num = isnum;
					}else{
						this.num= this.num == this.numList.length - 1 ? 0 : this.num + 1;
						if(this.num == 2){
							this.btname="发送邮件找回密码";
						}
					}
					console.log(data);
				}).catch((err)=>{
					let data = JSON.parse(err.data);
					uni.showToast({
					    title: '数据不存在',
						icon:'none',
					    mask: true
					});
				    console.log('数据请求失败', data);
				})
			},
			verify(inputname,v){
				var email = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/ //邮箱正则
				var phone = /^1[3456789]\d{9}$/   //手机号码正则
				var username = /^[a-zA-Z0-9]{2,15}$/ //账号字母加数字正则 2-15位
				var password = /^[a-zA-Z0-9]{6,15}$/  //密码字母加数字正则 6-15位
				switch(inputname){
					case 'username':
						if (!username.test(v)){
							uni.showToast({
							    title: '账号必须数字和字母6-15位！',
								icon:'none',
								mask: true
							});
							this.info.code = false;
							this.info.mess ='账号必须数字和字母6-15位！';
						}else{
							this.info.code = true;
						}
					break;
					case 'email':
						if (!email.test(v)){
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
					break;
				}
			}
			
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
