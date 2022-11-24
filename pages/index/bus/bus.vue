<template>
	<view class="content ">
		<!-- #ifdef H5 || APP-PLUS -->
				<cu-custom bgColor="bg-gradual-pink" :isBack="true"><block slot="content">线路查询</block></cu-custom>
		<!-- #endif -->
		
		<scroll-view scroll-x class="bg-red nav text-center">
			<view class="cu-item " :class="TabCur==0?'text-white cur':''"   @tap="tabSelect" :data-id="0">
				村村通公交
			</view>
			<view class="cu-item " :class="TabCur==1?'text-white cur':''"  @tap="tabSelect" :data-id="1">
				城乡联营公交
			</view>
		</scroll-view>
		<view   v-if="TabCur==0" class=" padding margin ">
			<div v-for="vr in cuncuntongbusdata " :key="vr.id">
				<view class="solids-bottom padding-xs flex align-center">
					<view class="flex-sub" >
						<view class="padding">
						<text class="text-bold text-red  text-center">
							{{vr.get_buses_route.buses_start}}-{{vr.get_buses_route.buses_end}}
						</text>
						</view>
						<view class="solid-bottom text-sm padding"  >
							<view class="flex  ">
								<text class="text-bold text-red">
								中途经过：{{vr.get_buses_route.buses_midway}}
								</text>
								
							</view>
							<view class="flex  ">
								<view class="flex-treble padding-sm   margin-xs radius text-orange ">车号：{{vr.buses_name}}</view>
								<view class="flex-treble  padding-sm margin-xs radius text-cyan"><text  @click="mymakePhoneCall('{{vr.buses_phone}}')">电话:{{vr.buses_phone}}</text></view>
							</view>
								<view class="flex-treble   margin-xs radius"> <text class="text-grey">发车时间:{{vr.buses_start_date}}</text> </view>
				
						</view>
					</view>
				</view>
			</div>
			
		</view>
		<view   v-if="TabCur==1" class=" padding margin text-center">
			<!-- 班车 -->
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
			<!-- 班车end -->
		</view>
	
	</view>
</template>
<script>
	export default {
		mounted(){
			this.getBuserR();
			this.getBusergetBusercuncuntong();
		},
		data() {
			return {
				TabCur: 0,
				startindex: -1,
				start: [],
				endindex: -1,
				end: [],
				//绑定输入框值
				filterable: {
				    start: '',
				    end: '',
				},
				busdata:[],
				cuncuntongbusdata:[],
			}
		},
		onLoad() {

		},
		methods: {
			getBusergetBusercuncuntong(){
		
				this.$api.test('/api/getBusesAll/村村通公交').then((res) => {
					let bues =  JSON.parse(res.data); 
					console.log('所有数据',bues);		
					if(bues.code == 200){
						this.cuncuntongbusdata = bues.data;
						uni.showToast({
							title:bues.msg,
							icon: 'none',
							mask: true
						});
					}
					if(bues.code == 400){
						uni.showToast({
						    title:bues.msg,
						    icon: 'none',
						    mask: true
						});
					}
					
				}).catch((err)=>{
					console.log('数据请求失败', err);
				})
			},
			getBuserR(){
				//获班线数据
				this.$api.test('/api/getBusesRouteall').then((res)=>{
					let buesRoute =  JSON.parse(res.data);
					if(buesRoute.code == 200){
						 let name = buesRoute.data.buses_route_name; //班车线所有地名
						//转换为数组
						for (let i in name) {
						    this.start.push(name[i]); //属性
						    this.end.push(name[i]); //属性
						}
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
				if(this.filterable.start != ''&&this.filterable.end!= ''){
					let data  = {buses_start: this.filterable.start,buses_end: this.filterable.end}
					this.$api.test('/api/getBusesRouteId/',data).then((res) => {
						let bues =  JSON.parse(res.data); 
						if(bues.code == 200){
							if(bues.data.length!=0){
								this.busdata = []; //清空以前数据从新添加
								for (let i in bues.data) {  //去出没有班车的线路
									if(bues.data[i].get_buses.length !== 0){
										this.busdata.push(bues.data[i]);
									}
								}
							}else{
								uni.showToast({
								    title:'没有查到班次',
								    icon: 'none',
								    mask: true
								});
							}
							console.log('服务器得到数据',this.busdata);
						}
						if(bues.code == 400){
							uni.showToast({
							    title:bues.msg,
							    icon: 'none',
							    mask: true
							});
						}
						//输入框复原
						this.filterable.end = '';
						this.filterable.start= '';
						this.startindex = -1;
						this.endindex = -1;
						
					}).catch((err)=>{
						console.log('数据请求失败', err);
					})
				}else{
					 uni.showToast({
					    title: "起始地和终点不能为空",
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
			},
			//导航控制
			tabSelect(e) {
				this.TabCur = e.currentTarget.dataset.id;
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