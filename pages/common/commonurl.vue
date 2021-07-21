<template>
	<view class="content ">
		<cu-custom bgColor="bg-gradual-pink" :isBack="true" ><block slot="content" :v-text="title"></block></cu-custom>
		<web-view v-if="!loadModal" :webview-styles="webviewStyles" :src="url" ></web-view>
		
		<!-- start 加model -->
			<view class="cu-load load-modal" v-if="loadModal">
				 <view class="cuIcon-emoji"></view>
		<!-- 		<image src="/static/logo.png" mode="aspectFit"></image> -->
				<view class="gray-text">加载中...</view>
			</view>
			<!-- end 加model -->	
	</view>
</template>

<script>
	export default {
		mounted(){
			this.showloadModal();
		},
		data() {
			return {
				webviewStyles: {
                    progress: {
                        color: '#aaaaff'
                    }
                },
				url:'',
				title:'',
				backnav:1,
				loadModal:false
			}
		},
		onLoad: function (option) { //获取升一个页面传送过来的url
			if(option.url!=''&&option.title){
				this.url= option.url;
				this.title= option.title;
				this.backnav=option.backnav;
				/* 动态设置页面标题 */
				uni.setNavigationBarTitle({
					title: this.title
				});
			}else{
				uni.navigateBack();
			}
		}, 
		onBackPress(options) { //原生态导航返回按钮监听
			if(this.backnav!=1){
				console.log(this.backnav);
				//let url = '../../'+this.backnav;
				uni.redirectTo({
				    url:'../../'.this.backnav,
				})
			}else{
				uni.navigateBack();
			}
		},
		methods: {
			showloadModal(){
				this.loadModal = true;
				setTimeout(()=>{//延迟2秒显示前月图表
					this.loadModal = false; //关闭加载
				},3000);
			}
		}
	}
</script>

<style>
	.content {
	
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
