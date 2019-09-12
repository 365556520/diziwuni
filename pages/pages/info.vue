<template>
	<view class="content">
		<view class="rili">
			<yu-calendar :priceList="prices" bgColor="#ec706b" color="#fff" @click="rili" @add="add">
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
			<view v-for="(item,index) in priceList" :key="index">
				<uni-collapse @change="change">
				    <uni-collapse-item :title=item.price open="true" :show-animation="true" ref="add">
				        <view style="padding: 30upx;">
							<view class="cu-card case no-card" >
								<view class="cu-item shadow">
									<view class="text-content">
										<u-parse :content="item.data" /> <!-- //内容解析 -->
									</view>
									<view class="text-gray text-sm text-right padding">
										{{item.time}}
									</view>
								</view>
							</view>
						</view>
				    </uni-collapse-item>
				</uni-collapse>
			</view>
		</view>
	</view>
</template>

<script>
	import {mapState,mapMutations} from 'vuex'; //mapState数据计算简化模式mapMutations方法的简化模式写法如下
	import yuCalendar from "@/components/yu-calendar/yu-calendar.vue"
	import uParse from '@/components/gaoyia-parse/parse.vue'; //解析html富文本
	import uniCollapse from '@/components/uni-collapse/uni-collapse/uni-collapse.vue'  //折叠块
	import uniCollapseItem from '@/components/uni-collapse/uni-collapse-item/uni-collapse-item.vue'//折叠块
	//import uniList from '@/components/uni-collapse/uni-list/uni-list.vue' //折叠块列表 这没用到
	//import uniListItem from '@/components/uni-collapse/uni-list-item/uni-list-item.vue' //折叠块列表
	export default {
		components: {
			yuCalendar,uParse,uniCollapse,uniCollapseItem
		},
		data() {
			return {
				date: new Date(), //获取系统日期
				priceList: [],
				prices: [],
				inptshow: false,
				datashow: true,
				switchA: false,
				textshow: true,
				inpt: {
					time: '12:01',
					date: '2018-12-25',
					title: '',
					content: ''
				},
				isdate:'',//点击获取当前时间
				year:'', //年
				month:''//月
				
			};
		},
		computed:{//数据计算
		  ...mapState(['userToken']),
		},
		onLoad() {
      
		},
		onReady() { //第一次挂时候用 官方建议使用 uni-app 的 onReady代替 vue 的 mounted
			this.gettoday();//获取时间
			this.getMonthNote(this.year,this.month);
			this.getDayNote(this.inpt.date);
		},
		methods: {
			//用vuex里面的方法
			...mapMutations(['ifLogin']),
			//点击某天
			rili(e) {
				this.getDayNote(e.date);
			},
			//添加备忘录
			add(e) {
				this.ifLogin(500);//判断是否登录
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
			},
			gettoday(){
				this.year = this.date.getFullYear(); //年
				this.month = this.date.getMonth() + 1; //月份
				let day = this.date.getDate(); //日
				let hour = this.date.getHours(); //时
				let minute = this.date.getMinutes(); //分
				let second = this.date.getDate(); //秒
				this.inpt.date = this.year + '-' + this.month + '-' + day;
				this.inpt.time = hour + ':' + minute;
			},
			//获取单月有备份的日期
			getMonthNote(year,month){
				if(this.userToken!=""){
					this.$api.postToken('/api/getMonthNote/'+year+'/'+month,this.userToken).then((res)=>{
						let v = JSON.parse(res.data);
						this.prices = [];
						let mon = new Array;
						if(v.code == 200){
							let tabList = v.data;
							tabList.forEach(item=>{
								item.date = item.date.substring(0,item.date.indexOf(' ')); //找到空格位置然后从头截取到空格位置
								if(mon.indexOf(item.date) ==-1){
									mon.push(item.date);
									item.price = '备忘'; //找到空格位置然后从头截取到空格位置
									this.prices.push(item); //问题vue这样添加数据视图没有刷新数据 
								}
							})
						}
		
						console.log('月备忘录', this.prices);
					}).catch((err)=>{
					   console.log('数据请求失败', err);
					   return false;
					})
				}else{
					this.ifLogin(500);//判断是否登录
				}
			},
			//获取单日数据
			getDayNote(date){
				if(this.userToken!=""){
					this.$api.postToken('/api/getNote/'+date,this.userToken).then((res)=>{
						let v = JSON.parse(res.data);
						this.priceList = []
						if(v.code == 200){
							let tabList = v.data;
							tabList.forEach(item=>{
								item.time = item.date.substring(item.date.indexOf(' '),item.date.length); //先截取时分秒
								item.date = item.date.substring(0,item.date.indexOf(' ')); //找到空格位置然后从头截取到空格位置
								this.isdate = item.date;
								this.priceList.push(item);
							})
						}
						console.log('备忘录',this.priceList);
					}).catch((err)=>{
					   console.log('数据请求失败', err);
					   return false;
					})
				}else{
					this.ifLogin(500);//判断是否登录
				}
			},
			
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
