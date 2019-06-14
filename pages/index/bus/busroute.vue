<template>
	<view class="content ">
		<view>
			<web-view :webview-styles="webviewStyles" src="http://m.diziw.cn/#/RouteBus"></web-view>
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
                }
			}
		},
		onLoad() {

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
