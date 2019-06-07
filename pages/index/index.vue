<template name="components">
	<view>
		<scroll-view scroll-y class="page">
			<swiper class="screen-swiper" :class="dotStyle?'square-dot':'round-dot'" :indicator-dots="true" :circular="true"
			 :autoplay="true" interval="5000" duration="500">
				<swiper-item v-for="(item,index) in swiperList" :key="index">
					<image :src="item.url" mode="aspectFill" v-if="item.type=='image'"></image>
					<video :src="item.url" autoplay loop muted :show-play-btn="false" :controls="false" objectFit="cover" v-if="item.type=='video'"></video>
				</swiper-item>
			</swiper>
			
			<!-- #ifndef H5 -->
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
			<!-- #endif -->
			<!-- #ifdef H5 -->
			<view class="padding">
				<view class="text-left padding">这是h5空的地方还没想好弄啥</view>
			</view>
			<!-- #endif -->
			
			<view class="nav-list">
				<navigator hover-class='none' :url="item.route" class="nav-li" navigateTo :class="'bg-'+item.color"
				 :style="[{animation: 'show ' + ((index+1)*0.2+1) + 's 1'}]" v-for="(item,index) in elements" :key="index">
					<view class="nav-title">{{item.title}}</view>
					<view class="nav-name">{{item.name}}</view>
					<text :class="'cuIcon-' + item.icon"></text>
				</navigator>
			</view>
			<view class="cu-tabbar-height"></view>
		</scroll-view>
	</view>
</template>

<script>
	import {mapState} from 'vuex'; //mapState数据计算简化模式mapMutations方法的简化模式写法如下
	export default {
		mounted(){ //这个挂在第一次进入页面后运行一次
			this.getLocation(); //获取位置
		},
		data() {
			return {
				elements: [{
						title: '公交站点',
						name: 'busroute',
						route: '/pages/pages/bus/busroute',
						color: 'purple',
						icon: 'location'
					},
					{
						title: '班线查询 ',
						name: 'bus',
						route: '/pages/pages/bus/bus',
						color: 'mauve',
						icon: 'search'
					},
					{
						title: '列表',
						name: 'list',
						color: 'pink',
						icon: 'list'
					},
					{
						title: '卡片',
						name: 'card',
						color: 'brown',
						icon: 'newsfill'
					},
					{
						title: '表单',
						name: 'form',
						color: 'red',
						icon: 'formfill'
					},
					{
						title: '时间轴',
						name: 'timeline',
						color: 'orange',
						icon: 'timefill'
					},
				
				],
				cardCur: 0, 
				swiperList: [
					{
						id: 0,
						type: 'image',
						url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84000.jpg'
					}, {
						id: 1,
						type: 'image',
						url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big37006.jpg',
					}, {
						id: 2,
						type: 'image',
						url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big39000.jpg'
					}, {
						id: 3,
						type: 'image',
						url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg'
					}, {
						id: 4,
						type: 'image',
						url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big25011.jpg'
					}, {
						id: 5,
						type: 'image',
						url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big21016.jpg'
					}, {
						id: 6,
						type: 'image',
						url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big99008.jpg'
					},
				],
				dotStyle: true, //轮播图的样式
				baiduapidate:[
					
				], //天气预报数据
				location:{
					'longitude':112.47658599066436,
					'latitude':33.293153982273935
				}
			};
		},
		computed: {//数据计算
		    ...mapState(['userbaidumap']),
		},
		methods: {
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
						this_.getWeatherForecast(); //获取天气预报
						console.log('当前位置的经度：' + this_.location.longitude);
						console.log('当前位置的纬度：' + this_.location.latitude);
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
		background-image: url(https://cdn.nlark.com/yuque/0/2019/png/280374/1552996358352-assets/web-upload/cc3b1807-c684-4b83-8f80-80e5b8a6b975.png);
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
