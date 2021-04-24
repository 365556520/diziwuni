<template>
	<view class="content ">
		<web-view :webview-styles="webviewStyles" :src="url"></web-view>
	</view>
</template>

<script>
	export default {
		mounted(){
			
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
