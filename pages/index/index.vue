<template>
	<view class="content">
		<cu-custom bgColor="bg-gradual-pink" ><block slot="content">主页</block></cu-custom>
		<view>
			<text class="title">{{title}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello nui-vue我来了'
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
