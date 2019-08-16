<template>
	<view class="content">
		<view class="rili">
			<yu-calendar :priceList="priceList" bgColor="#ec706b" color="#fff" @click="rili" @add="add">
			</yu-calendar>
		</view>

		<view v-if="inptshow">
			<view class="cu-form-group margin-top">
				<view class="title">标题</view>
				<input placeholder="请输入标题最多10个字" name="title" type="text" maxlength="10" v-model="inpt.title"></input>
			</view>
			<view class="cu-form-group align-start">
				<textarea maxlength="1000" placeholder="请输入备忘内容最多1000个字" name="content" v-model="inpt.content"></textarea>
			</view>
			<view class="cu-form-group">
				<view class="title">是否设置时间(默认现在时间)</view>
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
					<picker mode="time" :value="inpt.time" start="00:00" end="23:59" @change="TimeChange">
						<view class="picker">
							{{inpt.time}}
						</view>
					</picker>
				</view>
			</view>
			<view class="padding flex flex-direction">
				<button class="cu-btn bg-red margin-tb-sm lg" @click="inout()">添加备忘</button>
			</view>
		</view>
		<view v-if="datashow">
			{{isdate}}
		</view>

	</view>
</template>

<script>
	import {mapMutations} from 'vuex'; //mapState数据计算简化模式mapMutations方法的简化模式写法如下
	import yuCalendar from "@/components/yu-calendar/yu-calendar.vue"
	export default {
		components: {
			yuCalendar
		},
		data() {
			return {
				priceList: [],
				isdate: '',
				inptshow: false,
				datashow: true,
				switchA: false,
				textshow: true,
				inpt: {
					time: '12:01',
					date: '2018-12-25',
					title: '',
					content: ''
				}
			};
		},
		computed:{//数据计算
		},
		onLoad() {
      
		},
		onReady() { //第一次挂时候用 官方建议使用 uni-app 的 onReady代替 vue 的 mounted
		
		},
		methods: {
			//用vuex里面的方法
			...mapMutations(['ifLogin']),
			rili(e) {
				this.isdate = e;
			},
			//添加备忘录
			add(e) {
				     this.getMonthNote(new Date());
				this.ifLogin(500);//判断是否登录
				let year = e.getFullYear(); //年
				let month = e.getMonth() + 1; //月份
				let day = e.getDate(); //日
				let hour = e.getHours(); //时
				let minute = e.getMinutes(); //分
				let second = e.getDate(); //秒
				this.inpt.date = year + '-' + month + '-' + day;
				this.inpt.time = hour + ':' + minute;
				console.log(e.toUTCString());
				this.inptshow = this.inptshow ? false : true; //切换显示添加备忘录
				this.datashow = this.inptshow ? false : true; //显示备忘录不显示内容
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
			inout() {
				this.ifLogin(500);//判断是否登录
				this.inptshow = false;
				this.datashow = true;
			}
			
		},
	}
</script>

<style>
	.content {
		height: 100%;
		overflow: hidden;
	}

	.rili {
		text-align: center;
	}
</style>
