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
			<view class="padding flex flex-direction">
					<button class="cu-btn bg-red margin-tb-sm lg" @click="search"><text class="cuIcon-search"></text> 查询</button>
			</view>
		</form>
		<view  v-for="v in busdata" :key="v.id"  >
			<view class="solids-bottom padding-xs flex align-center">
				<view class="flex-sub text-center">
					<view class="padding"><text class="text-bold text-red">线路:{{v.buses_start}}→{{v.buses_midway}}→{{v.buses_end}} </text></view>
					<view class="solid-bottom text-sm padding" v-for="vl in v.get_buses" :key="vl.id"  >
						<view class="flex    ">
							<view class="flex-treble  padding-sm margin-xs radius text-orange">{{vl.buses_name}}</view>
							<view class="flex-treble  padding-sm margin-xs radius text-cyan"><text  @click="mymakePhoneCall(vl.buses_phone)">电话:{{vl.buses_phone}}</text></view>
						</view>
						<view class="flex    ">
							<view class="flex-treble  padding-sm margin-xs radius"> <text class="text-grey">发车时间:{{vl.buses_start_date}}</text> </view>
							<view class="flex-treble  padding-sm margin-xs radius"><text class="text-grey">返回时间:{{vl.buses_end_date}}</text>  </view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>


<script>
	export default {
		mounted(){
			this.getBuserR();
		},
		data() {
			return {
				startindex: -1,
				start: [],
				endindex: -1,
				end: [],
				//绑定输入框值
				filterable: {
				    start: '',
				    end: '',
				},
				busdata:[]
			}
		},
		onLoad() {

		},
		methods: {
			getBuserR(){
				//获班线数据
				this.$api.test('/api/getBusesRouteall').then((res)=>{
					let buesRoute =  JSON.parse(res.data);
					if(buesRoute.code == 200){
						 var name = buesRoute.data.buses_route_name; //班车线所有地名
						//转换为数组
						for (let i in name) {
						    this.start.push(name[i]); //属性
						    this.end.push(name[i]); //属性
						}
						console.log(this.end);
					}
				    console.log(buesRoute);
				}).catch((err)=>{
				    console.log('数据请求失败', err);
				})
			},
			PickerChangestart(e) {
				this.startindex = e.detail.value;
				this.filterable.start = this.start[this.startindex]; //获取起始地名
				 console.log(this.filterable.start);
			},
			PickerChangeend(e) {
				this.endindex = e.detail.value
				this.filterable.end = this.end[this.endindex];//获取目的地名
				 console.log(this.filterable.end);
			},
			  //点击查询
			search(){
				if(this.filterable.start != ''){
					let data  = {buses_start: this.filterable.start,buses_end: this.filterable.end}
					this.$api.test('/api/getBusesRouteId/',data).then((res) => {
						let bues =  JSON.parse(res.data);
						if(bues.code == 200){
							for (let i in bues.data) {  //去出没有班车的线路
								if(bues.data[i].get_buses.length !== 0){
									this.busdata.push(bues.data[i]);
								}
							}
						}
						console.log(this.busdata);
					}).catch((err)=>{
						console.log('数据请求失败', err);
					})
				}else{
					 uni.showToast({
					    title: "请输入选择起始地",
					    icon: 'none',
					    mask: true
					});
				}
			},
			mymakePhoneCall(data){
				//拨打电话
				uni.makePhoneCall({
					phoneNumber: data //仅为示例
				});
				console.log('电话', data);
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
