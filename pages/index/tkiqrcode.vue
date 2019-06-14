<template>
	<view class="content ">
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
				<view class="cu-form-group margin-top">
					<input placeholder="请输入要生成内容" maxlength=20  v-model="val"></input>
				</view>
				图片大小<slider :value="size" max=500 min=0 @change="sliderChange" show-value />
				<button @click="make">生成二维码</button>
				<button @click="clear">清除</button>
				<button @click="save">保存</button>
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
				  'iconSize':40,
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
				console.log('value 发生变化：' + e.detail.value)
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
