<template>
	<view class="content ">
		<view>
			<web-view :webview-styles="webviewStyles" :src="url"></web-view>
		</view>
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
                        color: '#FF3333'
                    }
                },
				url:'',
				title:''
			}
		},
		onLoad: function (option) { //获取升一个页面传送过来的url
			if(option.url!=''&&option.title){
				this.url= option.url;
				this.title= option.title;
				/* 动态设置页面标题 */
				uni.setNavigationBarTitle({
					title: this.title
				});
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
