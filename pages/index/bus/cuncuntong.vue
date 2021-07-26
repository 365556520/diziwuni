<template>
	<view class="content">
		<cu-custom bgColor="bg-gradual-pink" :isBack="true"><block slot="content">村村通</block></cu-custom>
	
	<!-- 行驶历程图 -->
		<view class="cu-bar bg-white solid-bottom margin-top bianju">
			<view class="action text-xsl"  v-if="daycarData.list">
				<text class="cuIcon-titles text-orange "></text>
				<text v-text="carUserDara.carName+'车辆'+daycarData.list['0'].name+'的行驶里程'"> </text>
			</view>
			<view class="action">
				<button class="cu-btn round shadow bg-cyan sm" @tap='getdaycardata' :disabled="daycarDataButton">
					<text class="cuIcon-refresh"></text>刷新
				</button>
				
			</view>
		</view>
		
		<view class="cu-card article no-card" >
			<!-- strat 车辆当日里程信息 -->
			<view class="padding-xs flex align-center" v-show="showDaycarData">
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
			<!-- end 车辆当日里程信息 -->
		
			<view class="cu-bar bg-white solid-bottom margin-top bianju">
				<view class="action text-xsl" >
					<text class="cuIcon-titles text-orange "></text>
					<text >里程查询</text>
				</view>
				
				<view class="action">
					<view class="cu-form-group ">
						<view class="title">选择月份</view>
						<picker mode="date" :value="startDate" fields="month" start="2021-01" :end="endDate" @change="startDateChange" :disabled="isdisabled">
							<view class="picker">
								{{startDate}}
							</view>
						</picker>
					</view>
				</view>
			</view>
			<view class=" margin-top ">
				<view class="content margin-top" v-if="showdangyue">
						<view class="cu-bar bg-white solid-bottom">
							<view class="action">
								<text class="cuIcon-title text-red"></text>
								<text  class="text-blue text-bold ">{{showStartDate[0]+'年'+showStartDate[1]+"日"}}的总里程:{{monthzong}}</text>
							</view>
						</view>
						<!-- 开启滚动条，需要开启拖动功能，即:ontouch="true" ，微信小程序需要开启canvas2d，否则会很卡，开启2d需要指定canvasId -->
						<view class="charts-box" style="height: 500upx;">
						  <qiun-data-charts 
							type="column"
							canvasId="scrollcolumnid"
							:opts="{enableScroll:true,xAxis:{scrollShow:true,itemCount:6,disableGrid:true}}" 
							:ontouch="true" :canvas2d="true" 
							:chartData="cartDatayue"
							/>
						</view>
				</view>
				<!-- 提示语 -->
				<view class="text-box margin-top"  style="margin: 10upx;">
					<text space="emsp" class="text-orange">{{texts}}</text>
				</view>
				<!-- start 加model -->
				<view class="cu-load load-modal" v-if="loadModal">
					 <view class="cuIcon-emoji"></view>
			<!-- 		<image src="/static/logo.png" mode="aspectFit"></image> -->
					<view class="gray-text">加载中...</view>
				</view>
				<!-- end 加model -->	
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
			this.getdaycardata();
		},
		components: {
			"carId":''
		},
		data() {
			return {
				TabCur: 0,
				scrollLeft: 0,
				date: '',
				today:'',//今天时间
				startDate:'', //开始查询月份
				endDate:'',//查询时间选项限制
				showStartDate:'', //格式显示日期数组
				mileage:80, //默认每天形式里程里程
				daycarData:{},//当天车辆里程信息
				showDaycarData:false, //显示当天信息面板
				daycarDataButton:false,//刷新按钮的禁止
				monthcarData:{},//当月车辆里程信息
				monthzong:'',//当月车辆总里程
				showdangyue:false,//显示当月面板
				isdisabled:false,//日期选择开关
				loadModal: false,//加载modal开关
				texts:'   选择月份可以查询整月的里程信息！注意：选择月份后需等10秒',
				timeoutID:'', //定时器ID
				cartDatayue:{
					"categories": [
						
					],
					"series": [
						{
							"name": "里程",
							"data": [
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
				//获取选择日期限制最后时间
				this.endDate = this.date.date==1?this.date.year + '-' + this.date.month-1>10?this.date.month:'0'+this.date.month:this.date.year + '-' + newmonth;
			},
			//首次进入页面
			getdaycardata(){
				//判断用户是否是村村通车辆用户
				if(this.userdata.user.parmission.includes('cuncuntong')&&this.userdata.user.parmission.includes('api.user')){
					this.loadModal = true; //开启加载
					//	this.getCarData("豫RD29256");//获取车辆数据
						this.getxinxi(this.carUserDara.carId,'today',this.today,this.today); //获取当前车辆状态的信息
						setTimeout(()=>{//延迟2秒显示当车辆数据
							this.loadModal = false; //关闭加载
							this.showDaycarData = true;  //显示当车辆数据
							this.daycarDataButton=true; //禁止刷新按钮
						},1000);
						setTimeout(()=>{this.daycarDataButton=false},10000);
				}else{
					//console.log('我是keyu或者是村账号',);
						uni.showToast({
							title: "你不是村村通驾驶员用户！",
							icon: 'none',
							mask: true
						});
					
				}
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
									}else if(type == "month"){//月数据
										this.monthcarData = data;
										this.setcartDatayue();//格式化数据存到缓存里面							
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
			//选择日期
			startDateChange(e) { //月份选择
				this.startDate = e.detail.value //显示日期
				this.loadModal = true; //开启加载
				this.showStartDate =this.startDate.split('-'); //字符串切割成数组
				let isStorage = true; 
				let tdym = this.date.year + '-0' + this.date.month; //当前的日期
				if(e.detail.value != tdym){ //判断选择的月份是否是当前岳峰如果不是就从缓存读取
					try {	//从缓存中读取数据
					   const value = uni.getStorageSync(this.startDate); 
					   const monthzongv = uni.getStorageSync(this.startDate+'zong'); 
					   if(value!=''){
						  this.cartDatayue = value;
						  isStorage = false; 
						  console.log('从缓存读取数据');
					   }
					   if(monthzongv!=''){
						   this.monthzong = monthzongv; 
						     isStorage = false; 
					   }
					} catch (e) {
						 console.log('读取缓存错误', e);
						 isStorage = true;
					    // error
					}
				}
				if(!this.isdisabled){
					this.setIsdisabled(true);
					//定时器
					this.timeoutID = setInterval(() => {
						this.setIsdisabled(false);
					}, 2000);//延迟后执行
				}
				//服务读取数据
				if(isStorage){ //如果缓存读取失败就从新从服务器获取数据
					var lastDay= new Date(this.showStartDate[0],this.showStartDate[1],0).getDate();//获取这个月的最后一天
					let startTime = this.showStartDate[0]+this.showStartDate[1]+"01"; //开始查询时间
					let entTime = this.showStartDate[0]+this.showStartDate[1]+lastDay; //最后查询时间
					this.getxinxi(this.carUserDara.carId,'month',startTime,entTime); //获取当前车辆状态的信息
					 console.log('从服务器读取数据');
				}	
				setTimeout(()=>{//延迟2秒显示前月图表
					this.loadModal = false; //关闭加载
					this.showdangyue = true;  //显示图表
				},1000);
			},
			//设置选择日期是否禁止   
			setIsdisabled(isdisabled){	
				this.isdisabled = isdisabled; 
				//关闭定时器
				clearInterval(this.timeoutID);
			},
			//清空月图表数据
			clearcartDatayue(){  //清空图表数据
				if(this.cartDatayue.categories.length !=0||this.cartDatayue.series[0].data.length!=0){
					this.cartDatayue.categories = [];
					this.cartDatayue.series[0].data = [];
				};
			},
			//图表数据格式存到缓存里面
			setcartDatayue(){
				this.clearcartDatayue();
				for (var i=0;i<this.monthcarData.list.length;i++) {
					var day = i+1;
					//判断日期如果时间超过今天就退出 判断查询的时间是不是现在这个月的并且
					if(this.showStartDate[1]==this.date.month&&day>=this.date.date){
						break;		
					}
					this.cartDatayue.categories.push(day+"日");
					this.cartDatayue.series[0].data[i] = this.monthcarData.list[i].mile;	
				}
				//总里程
				this.monthzong = this.monthcarData.mile;
				 //把当月数据存储本地
				 try {
				     uni.setStorageSync(this.startDate,this.cartDatayue);
					 uni.setStorageSync(this.startDate+'zong',this.monthcarData.mile);//存储总里程数
				 } catch (e) {
				     // error
					 console.log('本地存储错误', err);
				 }
			}
		}
	}
</script>

<style>
	.content {
	
	}
	
	.charts-box {
	  width: 100%;
	  height: 100%;
	}
	.bianju {
		margin: 5px;
	}
</style>
