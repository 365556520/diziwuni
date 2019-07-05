<template>
	<view class="content ">
		<form>
			<view class="cu-form-group margin-top">
				<view class="title">账 号 </view>
				<input placeholder="必须是数字和字母" maxlength=20 name="username" @blur='verify("username",rinput.username)' v-model="rinput.username"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">密 码 </view>
				<input placeholder="必须是数字和字母" name="password" maxlength=20 type="password" @blur='verify("password",rinput.password)'  v-model="rinput.password"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">确认密码</view>
				<input placeholder="和密码一致" name="rpassword" maxlength=20 type="password" @blur='verify("rpassword",rinput.rpassword)'  v-model="rinput.rpassword"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">电子邮箱</view>
				<input placeholder="如:1234@qq.com" name="mail" @blur='verify("mail",rinput.mail)' v-model="rinput.mail"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">手机号码</view>
				<input placeholder="13565487894" name="phone"  @blur='verify("phone",rinput.phone)' v-model="rinput.phone"></input>
				<view class="cu-capsule radius">
					<view class='cu-tag bg-blue '>
						+86
					</view>
					<view class="cu-tag line-blue">
						中国大陆
					</view>
				</view>
			</view>
			<view class="padding flex flex-direction">
				<button class="cu-btn bg-red margin-tb-sm lg" @click="register()">确 认</button>
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
		    ...mapState(['userToken','userdata']),
		},
		methods: {
			 //用vuex里面的方法
			...mapMutations([
			    'setToken',
			    'setName'
				
			]),
			verify(inputname,v){
				var mail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/ //邮箱正则
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
					case 'password':
						if (!password.test(v)){
							uni.showToast({
							    title: '密码必须数字和字母6-15位！',
								icon:'none',
								mask: true
							});
							this.info.code = false;
							this.info.mess ='账号必须数字和字母6-15位！';
						}else{
							this.info.code = true;
						}
					break;
					case 'rpassword':
						if (this.rinput.password != v){
							uni.showToast({
							    title: '确认密码和密码不一样！',
								icon:'none',
								mask: true
							});
							this.info.code = false;
							this.info.mess ='确认密码和密码不一样！';
						}else{
							this.info.code = true;
						}
					break;
					case 'mail':
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
					break;
					case 'phone':
						if (!phone.test(v)){
							uni.showToast({
							    title: '手机号码不正确!',
								icon:'none',
								mask: true
							});
							this.info.code = false;
							this.info.mess ='手机号码不正确!'
						}else{
							this.info.code = true;
						}
					break;
				}
			},
			register(){
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
			login(){
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
					    mask: true,
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
	
	view,button, textarea, input{
		box-sizing: border-box;
	}
	button::after {
		border: none;
	}
	
</style>
