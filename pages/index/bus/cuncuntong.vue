<template>
	<view class="content">
		<cu-custom bgColor="bg-gradual-pink" :isBack="true"><block slot="backText"></block><block slot="content">村村通</block></cu-custom>
	
	
	
	<!-- 行驶历程图 -->
		<view class="cu-bar bg-white solid-bottom margin-top bianju">
			<view class="action text-xsl"  v-if="daycarData.list">
				<text class="cuIcon-titles text-orange "></text>
				<text v-text="carUserDara.carName+'车辆'+daycarData.list['0'].name+'的行驶里程'"> </text>
			</view>
		</view>
		
		<view class="cu-card article no-card" >
			<view class="padding-xs flex align-center">
				
			 	<view class="flex-sub text-center"  v-if="daycarData.list"> <!-- 这里判断下daycarData.list就会不会报不存在的错误-->
					<view class=" text-xl padding">
						<text class="text-blue text-bold "></text>
					</view>
					<view class=" text-xsl ">
						<text :class="daycarData.list[0].mile>=mileage?'text-green':'text-red'">{{daycarData.list[0].mile}}km</text>
					</view>
					<view class=" text-xsl ">
							<text  :class="daycarData.list[0].mile>=mileage?'cuIcon-appreciatefill text-green':'cuIcon-warnfill text-red'"></text>
					</view>
					<view >{{daycarData.list[0].mile>=mileage?'今天的里程目标完成。':'今天的里程还没有完成,请继续加油!'}}</view>
				</view> 
			</view>
			
			<view class="cu-bar bg-white solid-bottom margin-top bianju">
				<view class="action text-xsl" >
					<text class="cuIcon-titles text-orange "></text>
					<text >里程查询</text>
				</view>
			</view>
			<view class=" margin-top ">
				<view class="cu-form-group ">
					<view class="title">选择月份</view>
					<picker mode="date" :value="startDate" fields="month" start="2021-01" end="2023-10" @change="startDateChange" :disabled="isdisabled">
						<view class="picker">
							{{startDate}}
						</view>
					</picker>
					
				</view>
		
			<view class="content margin-top" v-if="showdangyue">
					<view class="cu-bar bg-white solid-bottom">
						<view class="action">
							<text class="cuIcon-title text-red"></text>
							<text  class="text-blue text-bold ">{{showStartDate[0]+'年'+showStartDate[1]+"日"}}的总里程:{{monthcarData.mile}}</text>
						</view>
					</view>
					
					<!-- 开启滚动条，需要开启拖动功能，即:ontouch="true" ，微信小程序需要开启canvas2d，否则会很卡，开启2d需要指定canvasId -->
					<view class="charts-box">
					  <qiun-data-charts 
						type="column"
						canvasId="scrollcolumnid"
						:opts="{enableScroll:true,xAxis:{scrollShow:true,itemCount:6,disableGrid:true}}" 
						:ontouch="true" :canvas2d="true" 
						:chartData="chartDatayue"
						/>
					</view>
			</view>
				<view class="text-box" scroll-y="true">
					<text space="emsp" class="text-orange">{{texts}}</text>
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
			this.islogin();//判断用户登录
			this.getTime();//获取时间
		//	this.getCarData("豫RD29256");//获取车辆数据
			this.getxinxi(this.carUserDara.carId,'today',this.today,this.today); //获取当前车辆状态的信息
		},
		components: {
			"carId":''
		},
		data() {
			return {
				TabCur: 0,
				scrollLeft: 0,
				Date: '',
				today:'',//今天时间
				startDate:'', //开始查询月份
				showStartDate:'', //格式显示日期数组
				mileage:80, //默认每天形式里程里程
				daycarData:{},//当天车辆里程信息
				monthcarData:{},//当月车辆里程信息
				showdangyue:false,//显示当月面板
				isdisabled:false,//日期选择开关
				texts:'   请选择月份可以查询整月的里程信息！',
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
		    ...mapState(['userToken','userdata','dayikey','carUserDara']),
		},
		methods: {
			 //用vuex里面的方法
			...mapMutations([
				'getToken'
			]),
			//判断用户是否登录
			islogin(){
				if(!this.userdata.hasEnter){
					uni.redirectTo({
						url: '/pages/pages/auth/login'
					});
					 console.log('未登录');
				}
			},
			//获取今天日期
			getTime(){
				//获取当天时间
				 let nowDate = new Date()
				  this.date = {
				    year: nowDate.getFullYear(),
				    month: nowDate.getMonth() + 1,
				    date: nowDate.getDate()
				  }
				  const newmonth = this.date.month>10?this.date.month:'0'+this.date.month;
				  const day = this.date.date>10?this.date.date:'0'+this.date.date;
				this.today = this.date.year + '' + newmonth + '' + day;
				 this.startDate = this.date.year + '-' + newmonth; //获取当前时间默认开始时间
			},
			//获取信息当天里程carId 车辆id startTime开始时间，endTime结束时间
			getxinxi(carId,type,startTime,endTime){
				if(this.dayikey.sessionId!=""){
					// 查询所有车辆信息  "/get_car_list.jsp?teamId=&detail=false&userId=xxfhgj&loginType=user&loginWay=interface&loginLang=zh_CN&appDevId=&sessionId="+this.dayikey.sessionId;
					let url = "/get_gps_mile_day.jsp?carId="+carId+
					"&startDate="+ startTime+
					"&endDate="+ endTime+
					"&userId=xxfhgj&loginType=user&loginWay=android&loginLang=zh_CN&appDevId=&sessionId="+this.dayikey.sessionId
					if(this.userToken!=""){
						this.$api.dayinGet(url).then((res)=>{
							if(res.statusCode=='200'){
								let data = JSON.parse(res.data); //把json数据转换成obj
								if(data.rspCode == '1'){
									if(type === "today"){ //当天
										 this.daycarData = data;
									}else if(type == "month"){
										this.monthcarData = data;
									}
								}
								console.log('获取当天当前车辆信息', data);
							}
						}).catch((err)=>{
						    console.log('数据请求失败', err);
						})
					}
				}
			},
			startDateChange(e) { //月份选择
				if(!this.isdisabled){
					this.setIsdisabled(true);
				//	setInterval(this.setIsdisabled(false), 6000);//延迟后执行
				}
				this.startDate = e.detail.value
				this.showStartDate =this.startDate.split('-'); //字符串切割成数组
				var lastDay= new Date(this.showStartDate[0],this.showStartDate[1],0).getDate();//获取这个月的最后一天
				let startTime = this.showStartDate[0]+this.showStartDate[1]+"01"; //开始查询时间
				let entTime = this.showStartDate[0]+this.showStartDate[1]+lastDay; //最后查询时间
				this.getxinxi(this.carUserDara.carId,'month',startTime,entTime); //获取当前车辆状态的信息
				this.showdangyue = true;
		
			},
			//设置选择日期是否禁止   
			setIsdisabled(isdisabled){	//定时器有问题
				 console.log('ss');
				this.isdisabled = isdisabled; 
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
	.bianju {
		margin: 5px;
	}
</style>
