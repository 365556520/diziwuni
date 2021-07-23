<template name="components">
	<view>
		<scroll-view scroll-y class="page">
			
			<!-- #ifndef H5  这里醋获取数据没获取到
			<view class="padding">
				<view class="text-left padding flex">
					<text class="text-black text-lg  flex-treble">{{baiduapidate[0].weather_data[0].date}}</text>
					<text class="text-purple text-lg  flex-sub  "  @click="getchooseLocation()">{{baiduapidate[0].currentCity}}</text>
				</view>
				<view class="text-left padding flex">
					<text class="text-df  flex-treble ">{{baiduapidate[0].weather_data[0].temperature}}</text>
					<text class="text-df  flex-treble ">{{baiduapidate[0].weather_data[0].weather}}</text>
					<text class="text-df  flex-treble ">空气质量:{{baiduapidate[0].pm25}}</text>
				</view>
				<view class="text-left padding"><text class="text-gray  flex-treble ">{{baiduapidate[0].index[0].des}}</text></view>
			</view>
			#endif -->			
			<view class="bg-img  flex align-center" style="background-image: url('/static/tu1.png');height: 500upx;">
				<view class="padding-xl text-white">
					<view class="padding-xs  text-bold" style="min-width: 550upx;">
						<swiper class="swiper" autoplay="true" interval="2000" duration="300" >
							<swiper-item v-for="(zimu,index) in zimus" :key="index">
								<view  class="text-xxl">
									{{zimu.ch}}
								</view>
								<view  class="padding-xs text-xl">
									{{zimu.en}}
								</view>
							</swiper-item>
						</swiper>	
					</view>
				</view>
			</view>
			<view class="action text-xl padding"></view>
			<view class="action text-xl padding">
				<view class="action text-xxl" >
					<text class="cuIcon-titles text-orange "></text>
					<text >便捷功能</text>
				</view>
			</view>
			<view class=" nav-list ">
				<view  hover-class='none' @click="isLogin(item)"   class="nav-li" navigateTo :class="'bg-'+item.color"
				 :style="[{animation: 'show ' + ((index+1)*0.2+1) + 's 1'}]" v-for="(item,index) in elements" :key="index">
					<view class="nav-title">{{item.title}}</view>
					<view class="nav-name">{{item.name}}</view>
					<text :class="'cuIcon-' + item.icon"></text>
				</view>
			</view>
			<view class="cu-tabbar-height"></view>
		</scroll-view>
	</view>
</template>

<script>
	import {mapState,mapMutations} from 'vuex'; //mapState数据计算简化模式mapMutations方法的简化模式写法如下
	export default {
		mounted(){ //这个挂在第一次进入页面后运行一次
			//#ifndef H5
			this.getLocation(); //获取位置
			//#endif
		},
		data() {
			return {
				elements: [{
						title: '公交站点',
						name: 'transit',
						route:'/pages/common/commonurl?url=http://m.diziw.cn/#/RouteBus&title=公交站点&backnav=pages/index/index',
						color: 'purple',
						icon: 'location',
						isLogin : false
					},
					{
						title: '班线查询 ',
						name: 'bus',
						route: '/pages/index/bus/bus',
						color: 'mauve',
						icon: 'search',
						isLogin : false
					},
					{
						title: '村村通',
						name: 'cuncuntong',
						route: '/pages/index/bus/cuncuntong',
						color: 'orange',
						icon: 'timefill',
						isLogin : true
					},
					{
						title: '生成二维码',
						name: 'QRcode',
						route: '/pages/index/tkiqrcode',
						color: 'pink',
						icon: 'list',
						isLogin : false
					},
					{
						title: '日记本',
						name:  'diary',
						route: '/pages/pages/info',
						color: 'cyan',
						icon: 'formfill',
						isLogin : false
					},
					{
						title: '关于',
						name: 'card',
						color: 'brown',
						icon: 'newsfill',
						isLogin : false
					},
				
				],
				cardCur: 0, 
				baiduapidate:[], //天气预报数据
				zimus:[
					{
						ch:'如果有一天',
						en:'If one day'
					},
					{
						ch:'你越来越沉默',
						en:'You are mo and more silent'
					},
					{
						ch:'越来越不想说话。',
						en:"And don't want to talk"
					},
					
					{
						ch:'这不是妥协',
						en:"It's not compromise"
					},
					{
						ch:'这不是懦弱',
						en:"It's not cowardice"
					},
					{
						ch:'这意味着看到了很多',
						en:"It means you're talking a lot of"
					},
				
					{
						ch:'看清了很多人',
						en:"You saw a lot of people"
					},
					{
						ch:'你越来越成熟了',
						en:"You are more and more mature"
					},	
				],
				location:{
					'longitude':111.47658599066436,
					'latitude':33.293153982273935
				},
			};
		},
		computed: {//数据计算
		    ...mapState(['userbaidumap','userToken','userdata']),
		},
		methods: {
			
			//用vuex里面的方法
			...mapMutations([
			    'setToken',
			    'setName',
				'getToken'
			]),
			  //获天气预报
			getWeatherForecast(){
				let this_ = this;
				console.log('2度：' + this.location.longitude);
				console.log('2：' + this.location.latitude);
				let url = "/telematics/v3/weather?location=" + this.location.longitude+','+this.location.latitude + "&output=json&ak=" + this_.userbaidumap.ak;
				//获取天气数据
				this_.$api.baiduapi(url).then((res)=>{
					let apidata =  JSON.parse(res.data);
					if(apidata.error == 0){
						this_.baiduapidate = apidata.results;
						this_.baiduapidate.date = apidata.date;
					}
				    console.log(this_.baiduapidate);
				}).catch((err)=>{
				    console.log('数据请求失败', err);
				})
			},
			//获取当前位置
			getLocation(){
				let this_ = this;
				uni.getLocation({
					type: 'wgs84',
					success: function (res) {
						this_.location.longitude = res.longitude;
						this_.location.latitude = res.latitude;
						console.log('当前位置的经度：' + res);
						console.log('当前位置的经度：' + this_.location.longitude);
						console.log('当前位置的纬度：' + this_.location.latitude);
						this_.getWeatherForecast(); //获取天气预报
					},
					fail: function (res) {
						//调用失败后从新选择地点
						this_.getWeatherForecast(); //获取天气预报
					}
				});
			},
			//更换位置位置
			getchooseLocation(){
				let this_ = this;
				uni.chooseLocation({
					success: function (res) {
						this_.location.longitude = res.longitude;
						this_.location.latitude = res.latitude;
						this_.getWeatherForecast();
						console.log('位置名称：' + res.name);
						console.log('详细地址：' + res.address);
						console.log('纬度：' + res.latitude);
						console.log('经度：' + res.longitude);
					}
				});
			},
			//判断菜单是否需要登录才能进入
			isLogin(datas){
				if(datas.isLogin){ //判断是否需要登录
					if(this.userdata.hasEnter){ //判断是否登录
					  uni.navigateTo({
					    	url: datas.route
					    });
					}else{
						uni.showToast({
							title: "未登录，请登录账号！",
							icon: 'none',
							mask: true
						});
					};
				}else{
					uni.navigateTo({
					    url: datas.route
					});
				}
			}
		}
}
</script>

<style>
	.nav-list {
		display: flex;
		flex-wrap: wrap;
		padding: 0px 40upx 0px;
		justify-content: space-between;
	}
	
	.nav-li {
		padding: 30upx;
		border-radius: 12upx;
		width: 45%;
		margin: 0 2.5% 40upx;
		/* background-image: url(https://cdn.nlark.com/yuque/0/2019/png/280374/1552996358352-assets/web-upload/cc3b1807-c684-4b83-8f80-80e5b8a6b975.png); */
		background-size: cover;
		background-position: center;
		position: relative;
		z-index: 1;
	}
	
	.nav-li::after {
		content: "";
		position: absolute;
		z-index: -1;
		background-color: inherit;
		width: 100%;
		height: 100%;
		left: 0;
		bottom: -10%;
		border-radius: 10upx;
		opacity: 0.2;
		transform: scale(0.9, 0.9);
	}
	
	.nav-li.cur {
		color: #fff;
		background: rgb(94, 185, 94);
		box-shadow: 4upx 4upx 6upx rgba(94, 185, 94, 0.4);
	}
	
	.nav-title {
		font-size: 32upx;
		font-weight: 300;
	}
	
	.nav-title::first-letter {
		font-size: 40upx;
		margin-right: 4upx;
	}
	
	.nav-name {
		font-size: 28upx;
		text-transform: Capitalize;
		margin-top: 20upx;
		position: relative;
	}
	
	.nav-name::before {
		content: "";
		position: absolute;
		display: block;
		width: 40upx;
		height: 6upx;
		background: #fff;
		bottom: 0;
		right: 0;
		opacity: 0.5;
	}
	
	.nav-name::after {
		content: "";
		position: absolute;
		display: block;
		width: 100upx;
		height: 1px;
		background: #fff;
		bottom: 0;
		right: 40upx;
		opacity: 0.3;
	}
	
	.nav-name::first-letter {
		font-weight: bold;
		font-size: 36upx;
		margin-right: 1px;
	}
	
	.nav-li text {
		position: absolute;
		right: 30upx;
		top: 30upx;
		font-size: 52upx;
		width: 60upx;
		height: 60upx;
		text-align: center;
		line-height: 60upx;
	}
	.text-light {
		font-weight: 300;
	}
	.page {
		height: 100vh;
	}
</style>
