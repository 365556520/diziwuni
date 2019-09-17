<template>
	<view class="calendar-content-active" >
		<view class="example-info">日历组件可以查看日期，选择任意范围内的日期，打点操作。常用场景如：酒店日期预订、火车机票选择购买日期、上下班打卡等。</view>
		<view class="example-title">日历组件</view>
		<view>
			<uni-calendar 
				:insert="insert"
				:lunar="lunar" 
				:selected='selected'
				@change="change"
			 />
		</view>
	</view>
</template>

<script>
	import uniCalendar from '@/components/uni-calendar/uni-calendar.vue'
	import {mapState,mapMutations} from 'vuex'; //mapState数据计算简化模式mapMutations方法的简化模式写法如下
	export default {
		components: {
			uniCalendar
		},
		data() {
			return {
				lunar:false,
				insert:true,
				today:'',
				year:'',
				month:'',
				selected:[
					{
						date: '2019-9-15',
						info: '签到',
						data: {
							custom: '自定义信息',
							name: '自定义消息头',
						},
						
					},	
					{
						date: '2019-9-17',
						info: '签到',
						data: {
							custom: '自定义信息',
							name: '自定义消息头',
						},
						
					},	
				]
			}
			/**
			 * 时间计算
			 */
			function getDate(date, AddMonthCount = 0, AddDayCount = 0) {
				if (typeof date !== 'object') {
					date = date.replace(/-/g, '/')
				}
				let dd = new Date(date)
				dd.setMonth(dd.getMonth() + AddMonthCount) // 获取AddDayCount天后的日期
				dd.setDate(dd.getDate() + AddDayCount) // 获取AddDayCount天后的日期
				let y = dd.getFullYear()
				//let m = dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1 // 获取当前月份的日期，不足10补0
				let m = dd.getMonth() + 1 < 10 ?  (dd.getMonth() + 1) : dd.getMonth() + 1 // 获取当前月份的日期
				//let d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate() // 获取当前几号，不足10补0
				let d = dd.getDate() < 10 ?  dd.getDate() : dd.getDate() // 获取当前几号
				return y + '-' + m + '-' + d
			}
		},
		computed:{//数据计算
		  ...mapState(['userToken']),
		},
		watch: {
			month() {
				this.getMonthNote(this.year,this.month);
			},
			year() {
				this.getMonthNote(this.year,this.month);
			}
		},
		onLoad() {
		
		},
		methods: {
			//获取单月有备份的日期
			getMonthNote(year,month){
				console.log(this.today);
				if(this.userToken!=""){
					this.$api.postToken('/api/getMonthNote/'+year+'/'+month,this.userToken).then((res)=>{
						let v = JSON.parse(res.data);
						let mon = new Array;
						if(v.code == 200){
							let tabList = v.data;
							let i = 0;
							tabList.forEach(item=>{
								item.date = item.date.substring(0,item.date.indexOf(' ')); //找到空格位置然后从头截取到空格位置
								if(mon.indexOf(item.date) ==-1){
									mon.push(item.date);
									item.info = '备忘'; //找到空格位置然后从头截取到空格位置
									this.$set(this.selected,i,item) //给prices赋值
									i++;				
								}
							})
						}
					
						console.log('月备忘录', this.selected);
					}).catch((err)=>{
					   console.log('数据请求失败', err);
					   return false;
					})
				}else{
					this.ifLogin(500);//判断是否登录
				}
			},
		    change(e) {
				this.year=e.year;
				this.month=e.month;
		        console.log(e);	
		    }
		}
	}
</script>

<style>
	page {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		background-color: #efeff4
	}

	view {
		font-size: 28upx;
		line-height: inherit
	}

	.example {
		padding: 0 30upx 30upx
	}

	.example-title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 32upx;
		color: #464e52;
		padding: 30upx;
		margin-top: 20upx;
		position: relative;
		background-color: #fdfdfd
	}

	.example-title__after {
		position: relative;
		color: #031e3c
	}

	.example-title:after {
		content: '';
		position: absolute;
		left: 0;
		margin: auto;
		top: 0;
		bottom: 0;
		width: 10upx;
		height: 40upx;
		border-top-right-radius: 10upx;
		border-bottom-right-radius: 10upx;
		background-color: #031e3c
	}

	.example .example-title {
		margin: 40upx 0
	}

	.example-body {
		border-top: 1px #f5f5f5 solid;
		padding: 30upx;
		background: #fff
	}

	.example-info {
		padding: 30upx;
		color: #3b4144;
		background: #fff
	}

	.calendar-content {
		padding-bottom: 100upx;
		font-size: 26upx;
	}

	.calendar-content-active {
		padding-bottom: 450upx;
	}

	.calendar-tags-group {
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	.calendar-tags {
		width: 100%;
		box-sizing: border-box;
	}

	.calendar-tags-item {
		padding: 20upx 20upx;
		border: 1px rgba(0, 0, 0, 0.2) solid;
		color: #333;
		border-radius: 10upx;
		text-align: center;
		margin: 10upx;
		background: #f8f8f8;
	}

	.calendar-tags-item:active {
		background: #f8f8f8;
	}

	.checked .calendar-tags-item {
		background: rgb(0, 122, 255);
		color: #fff;
		border: 1px rgba(0, 0, 0, 0.1) solid;
	}

	.calendar-button {
		font-weight: bold;
		font-size: 32upx;
	}

	.calendar-button-groups {
		position: absolute;
		width: 100%;
		bottom: 0;
		display: flex;
	}

	.calendar-button-confirm {
		width: 50%;
		margin: 10upx;
		border: 1px #eee solid;
		font-size: 32upx;
	}

	.calendar-button-confirm:after {
		border: none;
	}

	.calendar-box {
		position: fixed;
		bottom: 0;
		background: #fff;
		color: #444;
		line-height: 1.5;
		width: 100%;
		transition: all 0.3s;
		transform: translateY(320upx);
		/* background: #f5f5f5; */
	}

	.calendar-active {
		transform: translateY(0);
	}

	.calendar-info-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20upx 30upx;
		padding-left: 0;
		border-top: 1px #eee solid;
		border-bottom: 1px #eee solid;
	}

	.calendar-title {
		/* height: 80upx; */
		font-weight: bold;
		color: #666;
		font-size: 32upx;
		border-left: 2px #0d9ebb solid;
		padding-left: 20upx;
		margin: 0 20upx;
	}

	.calendar-info {
		overflow-y: scroll;
		height: 260upx;
		padding: 30upx 30upx;
	}
</style>