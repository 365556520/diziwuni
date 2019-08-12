<template>
	<view class="content">
		<yu-calendar :priceList="priceList" bgColor="#ec706b" color="#fff" @click="rili" @add="add">
		</yu-calendar>
		<view>

			{{isdate}}
		</view>
	</view>
</template>

<script>
	import yuCalendar from "@/components/yu-calendar/yu-calendar.vue"
	export default {
		components: {
		        yuCalendar
		 },
		data() {
			return {
				priceList:[{'date':'2019-08-01','price':'￥100','data':'asdg'}],
				isdate:''
			};
		},
		onLoad() {

		},
		onReady() {

		},
		methods: {
			rili(e) {
				this.isdate=e;
				console.log(e);
			},
			add(e){
				uni.showModal({
				    title: '添加备忘录',
				    content: '这是一个模态弹窗',
				    success: function (res) {
				        if (res.confirm) {
				            console.log('用户点击确定');
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			}
		},
	}
</script>

<style>
	.content{
		height: 100%;
		text-align:center;
		overflow: hidden;
	}
</style>
