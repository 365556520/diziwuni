<template>
	<view class="content ">
		<form>
			<view class="cu-form-group margin-top">
				<view class="title">用户名 </view>
				<input placeholder="必须是数字和字母" maxlength=20 name="name" @blur='verify("name",rinput.name)' v-model="rinput.name"></input>
			</view>
			<view class="cu-form-group ">
				<view class="title">账 号 </view>
				<input placeholder="必须是数字和字母" maxlength=20 name="username" @blur='verify("username",rinput.username)' v-model="rinput.username"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">密 码 </view>
				<input placeholder="必须是数字和字母" name="password" maxlength=20 type="password" @blur='verify("password",rinput.password)'  v-model="rinput.password"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">确认密码</view>
				<input placeholder="和密码一致" name="c_password" maxlength=20 type="password" @blur='verify("c_password",rinput.c_password)'  v-model="rinput.c_password"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">电子邮箱</view>
				<input placeholder="如:1234@qq.com" name="email" @blur='verify("email",rinput.email)' v-model="rinput.email"></input>
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
			<view class="cu-form-group">
				<move-verify @result='verifyResult'></move-verify>
			</view>
			<view class="padding flex flex-direction">
				<button class="cu-btn bg-red margin-tb-sm lg" @click="register()">确 认</button>
			</view>
		</form>
		
	</view>
</template>

<script>
	/* 考虑到安全因素这个页面放弃不用了 */
	import {mapState,mapMutations,mapGetters} from 'vuex'; //mapState数据计算简化模式mapMutations方法的简化模式写法如下
	import moveVerify from "@/components/helang-moveVerify/helang-moveVerify.vue"//滑动验证插件
	export default {
		components: {
			"move-verify":moveVerify
		},
		data() {
			return {
				isFlag:false,//滑动插件
				rinput:{
					'name':'',
					'username':'',
					'password':'',
					'c_password':'',
					'email':'',
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
			/* 校验成功的回调函数 */
			verifyResult(){
				this.isFlag=true;
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
					case 'c_password':
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
				let this_ =this;
				if(this.info.code){
					if(this.isFlag){
						let data = {
						    name:this.rinput.name,
						    username:this.rinput.username,
						    password:this.rinput.password,
						    c_password:this.rinput.c_password,
						    email:this.rinput.email,
						}
						this.$api.post('/api/register',data).then((res)=>{
							let userData=JSON.parse(res.data);//把json转换数组
							if(res.statusCode==200){
								this_.setToken(userData.data.token);//把token保存到vuex里面
								//获取用户信息
								this_.getuserdata(this_.userToken);
								uni.switchTab({
									url:'/pages/pages/my'
								});
							}
							console.log('数据请求成功');
						}).catch((err)=>{
						    console.log('数据请求失败',err );
						})	
					}else{
						uni.showToast({
						    title: '请滑动验证',
							icon:'none',
							mask: true
						});
					}
				}else{
					uni.showToast({
					    title: this.info.mess,
						icon:'none',
						mask: true
					});
				}
			},
			//获取用户信息
			getuserdata(token){
				console.log('获取用户信息的token', token);
				if(this.userToken!=''){
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
