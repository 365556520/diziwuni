<template>
	<view class="content">
		<cu-custom bgColor="bg-gradual-pink" :isBack="true"><block slot="backText"></block><block slot="content">村村通</block></cu-custom>
	
	
	
	<!-- 行驶历程图 -->
		<view class="cu-bar bg-white solid-bottom margin-top">
			<view class="action">
				<text class="cuIcon-titles text-orange "></text> 豫R037TB车辆行驶历程
			</view>
		</view>
		<view class="cu-card article no-card" >
		
			<scroll-view scroll-x class="bg-white nav" scroll-with-animation :scroll-left="scrollLeft">
				<view class="flex text-center">
					<view class="cu-item flex-sub" :class="index==TabCur?'text-green cur':''" v-for="(item,index) in 2" :key="index" @tap="tabSelect" :data-id="index">
						<view v-show="index===0">年总历程</view>
						<view v-show="index===1">月总历程</view>
					</view>
				</view>
			</scroll-view>
				
			<view v-for="(item,index) in 2" :key="index" v-if="index==TabCur">
				<view class="cu-item shadow"  v-show="index===0">
					<view class="title"><view class="text-cut">2021年行驶历程</view></view>
					<view class="cu-form-group">
						<view class="title">日期选择</view>
						<picker mode="date" :value="date" start="2020" end="2021" @change="DateChange">
							<view class="picker">
								{{date}}
							</view>
						</picker>
					</view>
					<view class="content">
						<!-- 开启滚动条，需要开启拖动功能，即:ontouch="true" ，微信小程序需要开启canvas2d，否则会很卡，开启2d需要指定canvasId -->
						<view class="charts-box">
						  <qiun-data-charts 
							type="column"
							canvasId="scrollcolumnid"
							:opts="{enableScroll:true,xAxis:{scrollShow:true,itemCount:6,disableGrid:true}}" 
							:ontouch="true" :canvas2d="true" 
							:chartData="chartData"
							/>
						</view>
					</view>
				</view>
				
				<view class="cu-item shadow"  v-show="index===1">
					<view class="title"><view class="text-cut">2021年4月行驶历程</view></view>
					<view class="content">
						<!-- 开启滚动条，需要开启拖动功能，即:ontouch="true"，微信小程序需要开启canvas2d，否则会很卡，开启2d需要指定canvasId -->
						<view class="charts-box">
						  <qiun-data-charts 
							  type="line" 
							  canvasId="scrolllineid" 
							  :opts="{enableScroll:true,xAxis:{scrollShow:true,itemCount:8,disableGrid:true}}" 
							  :chartData="chartDatayue" 
							  :ontouch="true" 
							  :canvas2d="true"/>
						</view>
					</view>
				</view>

			</view>
			
		</view>
	<!-- 行驶历程图end -->
	</view>
</template>

<script>
	import {mapState,mapMutations} from 'vuex'; //mapState数据计算简化模式mapMutations方法的简化模式写法如下
	export default {
		mounted(){ //这个挂在第一次进入页面后运行一次
			this.getToken();  //从缓存中获取token和数据
			this.islogin();
			this.getxinxi();
		},
		components: {
			
		},
		data() {
			return {
				TabCur: 0,
				scrollLeft: 0,
				date: '2020',
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
				chartDatayue:{
					"categories": [
						"1日","2日","3日","4日","5日","6日","7日","8日","9日","10日",
						"11日","12日","13日","14日","15日","16日","17日","18日","19日","20日",
						"21日","22日","23日","24日","25日","26日","27日","28日","29日","30日","31日"
					],
					"series": [
						{
							"name": "里程",
							"data": [
								118,
								0,
								211,
								214,
								61,
								990.25,
								181,
								217,
								121,
								214,
								61,
								112,
								332,
								120
							]
						}
					]
				},
			}
		},
		onLoad: function (option) { //option为object类型，会序列化上个页面传递的参数
		},
		computed:{//数据计算
		    ...mapState(['userToken','userdata','dayikey']),
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
			},
			//获取信息
			getxinxi(){
				// 查询所有车辆信息  "/get_car_list.jsp?teamId=&detail=false&userId=xxfhgj&loginType=user&loginWay=interface&loginLang=zh_CN&appDevId=&sessionId="+this.dayikey.sessionId;
			//	let data = "/get_gps_mile_day.jsp?carId=12716&startDate=20200805&endDate=20200805&userId=xxfhgj&loginType=user&loginWay=android&loginLang=zh_CN&appDevId=&sessionId="+this.dayikey.sessionId
				let data =  "/search_car.jsp?plate=豫R037TB&video=false&userId=xxfhgj&loginType=user&loginWay=interface&loginLang=zh_CN&appDevId=&appId=android&sessionId="+this.dayikey.sessionId
				console.log('cesjoxoa', this.dayikey.sessionId);
				if(this.userToken!=""){
					this.$api.dayinGet(data).then((res)=>{
						if(res.statusCode=='200'){
							let user=JSON.parse(res.data);
						}
						alert('ceshi',JSON.parse(res.data));
					}).catch((err)=>{
					    console.log('数据请求失败', err);
					})
				}
			},
			//获取当前车辆信息
			getCarData(){
				let data =  "/search_car.jsp?plate=豫R037TB&video=false&userId=xxfhgj&loginType=user&loginWay=interface&loginLang=zh_CN&appDevId=&appId=android&sessionId="+this.dayikey.sessionId
			
			},
			tabSelect(e) {
				this.TabCur = e.currentTarget.dataset.id;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
			},
			DateChange(e) {
				this.date = e.detail.value
			},
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
