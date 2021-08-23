<template>
	<view class="content ">
		<!-- #ifdef H5 || APP-PLUS -->
					<cu-custom bgColor="bg-gradual-pink" :isBack="true"><block slot="content">生成二维码</block></cu-custom>
		<!-- #endif -->

			<view class="qrimg">
				<tki-qrcode
				ref="qrcode"
				:val="val"
				:size="size"
				:unit="unit"
				:icon="icon"
				:iconSize="iconsize"
				:lv="lv" 
				:onval="onval"
				:loadMake="loadMake"
				:usingComponents="usingComponents"
				:showLoading="showLoading"
				:loadingText="loadingText"
				@result="qrR"
				  :show="show"/>
				<view class="uni-title">图片大小</view><slider :value="size" max=600 min=200 @change="sliderChange" show-value />
				<view class="cu-form-group margin-top">
					<input placeholder="请输入要生成内容"   v-model="val"></input>
				</view>
				<view class="padding flex flex-direction">
					<button class="cu-btn bg-blue margin-tb-sm lg" @click="selectIcon">选择二维码图标</button> 
					<button class="cu-btn bg-blue margin-tb-sm lg" @click="make">生成二维码</button>
					<button class="cu-btn bg-blue margin-tb-sm lg" @click="save">保存</button>
					<button class="cu-btn bg-red margin-tb-sm lg" @click="clear">清除</button>
				</view>
			</view>
	</view>
</template>
<script>
	import tkiQrcode from "@/components/tki-qrcode/tki-qrcode.vue"
	export default {
		components:{tkiQrcode},
		mounted(){
			
		},
		data() {
			return {
				'size':200,
				'unit':'upx',
				'show':true,
				 'val':'',
				  'icon':'',
				  'iconsize':20,
				  'lv':3,
				  'onval':false,
				  'loadMake':false,
				  'usingComponents':true,
				  'showLoading':true,
				  'loadingText':'二维码生成中',
			}
		},
		onLoad() {
					
			
		},
		methods: {
			make(){
				  this.$refs.qrcode._makeCode()
			},	
			save(){
				  this.$refs.qrcode._saveCode()
			},
			clear(){
				  this.$refs.qrcode._clearCode()
			},
			qrR(v){
				console.log(v);
			},
			sliderChange(e) {
				 this.size=e.detail.value;
				 this.iconsize = e.detail.value/12;
				console.log('value 发生变化：' + e.detail.value)
			},
			selectIcon() {
				let that = this
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: function (res) {
						that.icon = res.tempFilePaths[0]
						setTimeout(() => {
							that.make()
						}, 100);
						 console.log(that.icon);
					}
				});
			}
		}
	}
</script>

<style>
	.content {
		height: 400upx;
	}
	
</style>
