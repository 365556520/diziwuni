<template>
	<view class="content">
		<cu-custom bgColor="bg-gradual-pink" ><block slot="content">主页</block></cu-custom>
		<view>
			  <map id='mymap' style="width: 100%; height: 800upx;" :latitude="latitude" :longitude="longitude"  scale=13>
               </map>
		</view>
	</view>
</template>

<script>
	export default {
		mounted(){
			this.getmap();
		
			 console.log('地图缩放级别'+this.mapobj.includePoints);
		},
		data() {
			return {
				title: 'Hello nui-vue我来了',
				latitude:33.28,
				longitude:111.48,
				mapobj:'',
				map:''
			}
		},
		onLoad() {

		},
		methods: {
			getmap(){
				this.mapobj = uni.createMapContext('mymap',this);
				
			}
		}
	}
</script>

<style>
	.content {
		text-align: center;
		height: 400upx;
	}

	.logo {
		height: 200upx;
		width: 200upx;
		margin-top: 200upx;
	}

	.title {
		font-size: 20upx;
		color: #8f8f94;
	}
</style>
