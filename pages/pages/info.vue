<template>
	<view class="content">
		<view class="rili">
			<yu-calendar :priceList="priceList" bgColor="#ec706b" color="#fff" @click="rili" @add="add">
		</yu-calendar>
		</view>
		
		<view v-if="inptshow"> 
			<view class="cu-form-group margin-top">
				<view class="title">标题</view>
				<input placeholder="请输入标题" name="title" type="text"  v-model="inpt.title"></input>
			</view>
			<view class="cu-form-group align-start">
				<textarea maxlength="-1"   placeholder="请输入备忘内容" name="content" v-model="inpt.content"></textarea>
			</view>
			<view class="cu-form-group">
				<view class="title">是否设置提醒(默认现在时间不提醒)</view>
				<switch @change="SwitchA" :class="switchA?'checked':''" :checked="switchA?true:false"></switch>
			</view>
			<view v-if="switchA">
				<view class="cu-form-group">
					<view class="title">日期选择</view>
					<picker mode="date" :value="inpt.date" start="1980-01-01" end="2035-01-01" @change="DateChange">
						<view class="picker">
							{{inpt.date}}
						</view>
					</picker>
				</view>
				<view class="cu-form-group">
					<view class="title">时间选择</view>
					<picker mode="time" :value="inpt.time" start="00:00" end="23:5" @change="TimeChange">
						<view class="picker">
							{{inpt.time}}
						</view>
					</picker>
				</view>
			</view>
			<view  class="padding flex flex-direction">
				<button class="cu-btn bg-red margin-tb-sm lg"  @click="inout()">添加备忘</button>
			</view>
		</view>
		<view v-if="datashow">
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
				isdate:'',
				inptshow:false,
				datashow:true,
				switchA:false,
				inpt:{
					time: '12:01',
					date: '2018-12-25',
					title:'',
					content:''
				}
			};
		},
		onLoad() {

		},
		onReady() { //第一次挂时候用 官方建议使用 uni-app 的 onReady代替 vue 的 mounted
			this.rili();
		},
		methods: {
			rili(e) {
				this.isdate=e;
				console.log(e);
			},
			//添加备忘录
			add(){
				this.inptshow=this.inptshow?false:true;//切换显示添加备忘录
				this.datashow=this.inptshow?false:true;//显示备忘录不显示内容
			},
			//是否设置提醒
			SwitchA(e) {
				this.switchA = e.detail.value
			},
			//选择时间
			TimeChange(e) {
				this.inpt.time = e.detail.value
			},
			//选择日期
			DateChange(e) {
				this.inpt.date = e.detail.value
			},
			//提交备忘录
			inout(){
				
				this.inptshow=false;
				this.datashow=true;
			}
		},
	}
</script>

<style>
	.content{
		height: 100%;
		overflow: hidden;
	}
	.rili{
		text-align:center;
	}
</style>
