<template>
	<view class="content">
		<view class="cu-bar bg-white solid-bottom margin-top">
			<view class="action">
				<text class="cuIcon-titles text-orange "></text> 文章类卡片
			</view>
		
		</view>
		<view class="cu-card article no-card">
			<view class="cu-item shadow">
				<view class="title"><view class="text-cut">2021年全年行驶历程</view></view>
				<view class="content">
					
					<!-- 开启滚动条，需要开启拖动功能，即:ontouch="true" ，微信小程序需要开启canvas2d，否则会很卡，开启2d需要指定canvasId -->
					
					<view class="charts-box">
					  <qiun-data-charts 
					    type="column"
					    canvasId="scrollcolumnid"
						:opts="{enableScroll:true,xAxis:{scrollShow:true,itemCount:8,disableGrid:true}}" 
						:ontouch="true" :canvas2d="true" 
						:chartData="chartData"
						/>
					</view>
					
				</view>
			</view>
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
							"name": "里程",
							"data": [
								118,
								217,
								211,
								214,
								61,
								7990.25,
								181,
								217,
								121,
								214,
								61,
								1128
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
	.content {
	  background-color: #FFFFFF;
	  display: flex;
	  flex-direction: column;
	  flex: 1;
	}
	
	.charts-box {
	  width: 100%;
	  height: 300px;
	}
</style>
