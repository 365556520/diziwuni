<template>
	<view class="calendar-content-active" >
		<view class="example-info">
			<view>{{ timeData.year + '年' + timeData.month + '月' + timeData.date + '日 （' + timeData.lunar.astro + ')' }}</view>
			<view>
				农历 :{{ timeData.lunar.gzYear + '年' + timeData.lunar.gzMonth + '月' + timeData.lunar.gzDay + '日 (' + timeData.lunar.Animal + '年)' }}
				{{ timeData.lunar.IMonthCn + timeData.lunar.IDayCn }} {{ timeData.lunar.isTerm ? timeData.lunar.Term : '' }}
			</view>
		</view>
		<view class="example-title"><span @click="add">{{ inptshow ? '写日记' : '日记内容' }}</span></view>
		<view>
			<uni-calendar 
				:insert="insert"
				:lunar="lunar" 
				:date='date'
				:selected='selected'
				@change="change"
			 />
			<view :class="{'calendar-active': infoShow}" class="calendar-box">
			 	<view v-if="timeData.lunar" class="calendar-info-header">
			 		<text class="calendar-title">{{ inptshow ? '日记内容' : '写日记' }}</text>
			 		<text @click="retract">{{ infoShow ? '收起' : '展开' }}</text>
				</view>
			 	<view v-if="timeData.lunar" class="calendar-info">
					<!-- 备忘录start -->
					<view  v-if="inptshow">
						<view class="cu-timeline" v-if="priceList.length != 0">
							<!-- <view class="cu-time">{{timeData.month + '月' + timeData.date + '日'}}</view> -->
							<view class="cu-item"  v-for="(item,index) in priceList" :key="index">
								<view class="content">
									<view class="cu-capsule radius">
										<view class="cu-tag bg-cyan">时间</view>
										<view class="cu-tag line-cyan">{{item.time}}</view>
									</view>
									<view class="margin-top">
										<!-- <view>{{item.price}}</view> -->
										<u-parse :content="item.data" /> <!-- //内容解析 -->
									</view>
								</view>
							</view>
						</view>
						<view v-else>
							日记帮助我们珍藏那些美好的回忆，岁月流逝，当我们翻开日记的时候，往日就会重现。那些美好的事物与岁月总是能让我们欣然一笑。
						</view>
					</view>
						<!-- 备忘录end -->
					<!-- 写日记 -->
					<view v-if="!inptshow">
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
								<picker mode="time" :value="inpt.time" start="00:00:00" end="23:59:59" @change="TimeChange">
									<view class="picker">
										{{inpt.time}}
									</view>
								</picker>
							</view>
						</view>
						
						<view class="padding flex flex-direction">
							<button class="cu-btn bg-red margin-tb-sm lg" @click="addnote()">上传日记</button>
						</view>
					</view>
					<!-- 写日记end -->
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uParse from '@/components/gaoyia-parse/parse.vue'; //解析html富文本
	import uniCalendar from '@/components/uni-calendar/uni-calendar.vue'
	
	import {mapState,mapMutations} from 'vuex'; //mapState数据计算简化模式mapMutations方法的简化模式写法如下
	export default {
		components: {
			uniCalendar,uParse
		},
		data() {
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
			return {
				date:'',//今天时间
				lunar:false,
				insert:true,
				infoShow: false, //日记内容显示面板
				inptshow:true,//添加和显示内容切换
				today:'',
				year:'',
				month:'', 
				onedate:'',//当前日
				selected:[
					{
						date: '2019-9-15',
						info: '签到',
						data: {
							custom: '自定义信息',
							name: '自定义消息头',
						},
					},
				],
				priceList: [], //当天所有时间
				timeData: {
					clockinfo: '',
					date: '',
					fulldate: '',
					lunar: '',
					month: '',
					range: '',
					year: ''
				},
				inpt: {
					time: '12:00:00',
					date: getDate(new Date(), 0),
					title: '今天的日记',
					content: ''
				},
				switchA: false,
			}
		},
		computed:{//数据计算
		  ...mapState(['userToken']),
		},
		watch: {
			date() { //监听日期
				this.infoShow = true;//日记内容显示面板
				this.inptshow = true;//切换日记内容
				this.getMonthNote(this.year,this.month);
			},
			onedate(){ //监听当前日的变化
				this.getDayNote(this.date);
			}
		},
		onLoad() {
	
		},
		methods: {
			//用vuex里面的方法
			...mapMutations(['ifLogin']),
			//是否设置提醒
			SwitchA(e) {
				this.switchA = e.detail.value
			},
			//选择时间
			TimeChange(e) {
				this.inpt.time = e.detail.value+':00'
			},
			//选择日期
			DateChange(e) {
				this.inpt.date = e.detail.value
			},
			add(){
				this.ifLogin(500);//判断是否登录
				this.infoShow = true;
				this.inptshow = this.inptshow ? false : true; //切换显示写日记
			},
			//写日记
			addnote() {
				this.ifLogin(500);//判断是否登录
				if(this.userToken!=""){
					if(this.inpt.content!=''){
						 let data =  {
							 data:{
								'title':this.inpt.title,//日记标题
								'content':this.inpt.content, //内容
							}
						 };
						 if(this.switchA){ //如果不自定义时间就不加时间
							  data.data.created_at = this.inpt.date+' '+this.inpt.time;
						 }
						this.$api.postToken('/api/addNote',this.userToken,data).then((response) => {
							 let data = JSON.parse(response.data);
							 if(data.code == '200'){
								 this.inpt.content = ''; //清空输入框
								 uni.showToast({
									 title: data.msg,
									 icon: 'none',
									 mask: true
								 });
							 }else{
								 uni.showToast({
									 title: data.msg,
									 icon: 'none',
									 mask: true
								 });
							 }
							 console.log(data);
						 }).catch((error) =>{
							 console.log(error);
						 });
					}else {
						  uni.showToast({
							 title: "日记不能为空",
							 icon: 'none',
							 mask: true
						 });
					}
				}
				
			},
			//获取单月有备份的日期
			getMonthNote(year,month){
				console.log(this.today);
				if(this.userToken!=""){ //判断是否登录
					this.$api.postToken('/api/getMonthNote/'+year+'/'+month,this.userToken).then((res)=>{
						let v = JSON.parse(res.data);
						let mon = new Array;
						if(v.code == 200){
							let tabList = v.data;
							let i = 0;
							tabList.forEach(item=>{
								if(item){
									item.date = item.date.substring(0,item.date.indexOf(' ')); //找到空格位置然后从头截取到空格位置
									if(mon.indexOf(item.date) ==-1){
										mon.push(item.date);
										item.info = '日记'; //找到空格位置然后从头截取到空格位置
										this.$set(this.selected,i,item) //给prices赋值
										i++;				
									}
								}
							})
						}
						console.log('月备忘录', this.selected);
					}).catch((err)=>{
					   console.log('数据请求失败', err);
					   return false;
					})
				}
			},
		    //获取单日数据
		    getDayNote(date){
		    	if(this.userToken!=""){//判断是否登录
		    		this.$api.postToken('/api/getNote/'+date,this.userToken).then((res)=>{
		    			let v = JSON.parse(res.data);
		    			this.priceList = []
		    			if(v.code == 200){
		    				let tabList = v.data;
		    				tabList.forEach(item=>{
								if(item){
									item.time = item.date.substring(item.date.indexOf(' '),item.date.length); //先截取时分秒
									item.date = item.date.substring(0,item.date.indexOf(' ')); //找到空格位置然后从头截取到空格位置
									this.isdate = item.date;
									this.priceList.push(item);
								}
		    				})
		    			}
		    			console.log('单日备忘录',this.priceList);
		    		}).catch((err)=>{
		    		   console.log('数据请求失败', err);
		    		   return false;
		    		})
		    	}
		    },
			//收起面板
			retract() {
				this.infoShow = !this.infoShow
			},
			//收起最大化
			remaxShow() {
				this.maxShow = !this.maxShow
			},
			change(e) {
				this.year=e.year;
				this.month=e.month;
				this.onedate= e.date; //获取当前点击时间
				this.date=e.fulldate;  //获取时间
				this.timeData = e;
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
		transform: translateY(500upx);
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
		height: 500upx;
		padding: 30upx 30upx;
	}
</style>