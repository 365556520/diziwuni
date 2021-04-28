<template>
	<view class="content">
		<view class="charts-box">
		  <qiun-data-charts
		    type="column"
		    :chartData="chartData"
		    background="none"
		    :animation="false"
		    :ontouch="true"
		  />
		</view>
	</view>
</template>

<script>
	import {mapState,mapMutations} from 'vuex'; //mapState数据计算简化模式mapMutations方法的简化模式写法如下
	export default {
		mounted(){ //这个挂在第一次进入页面后运行一次
			this.getToken();  //从缓存中获取token和数据
			this.islogin();
		},
		components: {
			
		},
		data() {
			return {
				chartData:{
					"categories": [
						"1月",
						"2月",
						"3月",
						"4月",
						"5月",
						"6月",
						"7月",
						"8月",
						"9月",
						"10月",
						"11月",
						"12月"
					],
					"series": [
						{
							"name": "总里程",
							"data": [
								18,
								27,
								21,
								24,
								6,
								128,
								18,
								27,
								21,
								24,
								6,
								128
							]
						}
    ]
				},
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
				'getToken'
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
			//判断用户是否登录
			islogin(){
				if(!this.userdata.hasEnter){
					uni.redirectTo({
						url: '/pages/pages/auth/login'
					});
					 console.log('未登录');
				}
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
	.correlation {
		margin-top: 180upx;
	}
	.correlation-title{
		font-size: 26upx;
		color: #666666;
	}
	
	.charts-box{
	  width: 100%;
	  height:300px;
	}
</style>
