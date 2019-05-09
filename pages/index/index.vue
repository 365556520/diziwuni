<template>
	<view class="content">
		<view>
			<text class="title" @click="goto('/pages/page/page?id=1&name=传递过去的参数')">{{title}}</text>
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
			goto(url){
				uni.navigateTo({
					url: url
				});
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
