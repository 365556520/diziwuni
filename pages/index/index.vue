<template>
	<view class="content">
		<view>
			<text class="title" @click="goto()">{{title}}</text>
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
			goto(){
				uni.navigateTo({
					url: '/pages/page/page?id=1&name=uniapp'
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
		font-size: 36upx;
		color: #8f8f94;
	}
</style>
