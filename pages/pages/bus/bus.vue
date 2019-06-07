<template>
	<view class="content ">
		<form>
			<view class="cu-form-group margin-top">
				<view class="title">出发</view>
				<picker @change="PickerChangestart" :value="startindex" :range="start">
					<view class="picker">
						{{startindex>-1?start[startindex]:'请选择出发地'}}
					</view>
				</picker>
			</view>
				<view class="cu-form-group ">
				<view class="title">终点</view>
				<picker @change="PickerChangeend" :value="endindex" :range="end">
					<view class="picker">
						{{endindex>-1?end[endindex]:'请选择目的地'}}
					</view>
				</picker>
			</view>
		</form>
	</view>
</template>


<script>
	export default {
		mounted(){
		
		},
		data() {
			return {
				startindex: -1,
				start: ['喵喵喵', '汪汪汪', '哼唧哼唧'],
				endindex: -1,
				end: ['喵喵喵', '汪汪汪', '哼唧哼唧'],
			}
		},
		onLoad() {

		},
		methods: {
			PickerChangestart(e) {
				this.startindex = e.detail.value
			},
			PickerChangeend(e) {
				this.endindex = e.detail.value
			},
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
