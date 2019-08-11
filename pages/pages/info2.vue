<template>
	<view>
		<view class="VerticalBox">
			<scroll-view class="VerticalNav nav" scroll-y scroll-with-animation :scroll-top="verticalNavTop" style="height:calc(100vh - 200upx)">
				<view class="cu-item" :class="index==tabCur?'text-green cur':''" v-for="(item,index) in list" :key="index" @tap="TabSelect"
				 :data-id="index">
					{{item.cate_name}}
				</view>
			</scroll-view>
			<scroll-view class="VerticalMain" scroll-y scroll-with-animation style="height:calc(100vh - 200upx)"
			 :scroll-into-view="'main-'+mainCur" @scroll="VerticalMain">
				<view class="padding-top padding-lr" v-for="(item,index) in list" :key="index" :id="'main-'+index">
					<view class="cu-bar solid-bottom bg-white">
						<view class="action">
							<text class="cuIcon-title text-green"></text>{{item.cate_name}}
						</view>
					</view>
					<view class="menu-avatar">
						<view class="cu-card case no-card">
							<view class="cu-item shadow">
								<view class="image">
									<image src="https://ossweb-img.qq.com/images/lol/web201310/skin/big10006.jpg"
									 mode="widthFix"></image>
									<view class="cu-tag bg-blue">史诗</view>
									<view class="cu-bar bg-shadeBottom"> <text class="text-cut">我已天理为凭，踏入这片荒芜，不再受凡人的枷锁遏制。我已天理为凭，踏入这片荒芜，不再受凡人的枷锁遏制。</text></view>
								</view>
								<view class="cu-list menu-avatar">
									<view class="cu-item">
										<view class="cu-avatar round lg" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big10006.jpg);"></view>
										<view class="content flex-sub">s
											<view class="text-grey">正义天使 凯尔</view>
											<view class="text-gray text-sm flex justify-between">
												十天前
												<view class="text-gray text-sm">
													<text class="cuIcon-attentionfill margin-lr-xs"></text> 10
													<text class="cuIcon-appreciatefill margin-lr-xs"></text> 20
													<text class="cuIcon-messagefill margin-lr-xs"></text> 30
												</view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
				tabCur: 0,
				mainCur: 0,
				verticalNavTop: 0,
				load: true
			};
		},
		onLoad() {
			uni.showLoading({
				title: '加载中...',
				mask: true
			});
			let list = [{}];
			//获取文章分类
			this.$api.test('/api/getCategorys').then((res)=>{
				let v = JSON.parse(res.data);
				if (v.code=="200"){
					let tabList = v.data;
					tabList.forEach(item=>{
						item.newsList = [];
						item.loadMoreStatus = 0;  //加载更多 0加载前，1加载中，2没有更多了
						item.refreshing = 0;
					})
					this.list = tabList;
					this.listCur = list[0];
					this.loadNewsList('add');
					console.log('看看', this.tabBars)
				}
			   // this.res = '请求结果 : ' + JSON.stringify(res);
			}).catch((err)=>{
				console.log('数据请求失败', err);
			})
			console.log(this.list);
		},
		onReady() {
			uni.hideLoading()
		},
		methods: {
			TabSelect(e) {
				console.log('侧石');
				this.tabCur = e.currentTarget.dataset.id;
				this.mainCur = e.currentTarget.dataset.id;
				this.verticalNavTop = (e.currentTarget.dataset.id - 1) * 50
			},
			VerticalMain(e) {
				// #ifdef MP-ALIPAY
				   return false  //支付宝小程序暂时不支持双向联动 
				// #endif
				let that = this;
				let tabHeight = 0;
				if (this.load) {
					for (let i = 0; i < this.list.length; i++) {
						let view = uni.createSelectorQuery().select("#main-" + this.list[i].id);
						view.fields({
							size: true
						}, data => {
							this.list[i].top = tabHeight;
							tabHeight = tabHeight + data.height;
							this.list[i].bottom = tabHeight;
						}).exec();
					}
					this.load = false
				}
				let scrollTop = e.detail.scrollTop + 10;
				for (let i = 0; i < this.list.length; i++) {
					if (scrollTop > this.list[i].top && scrollTop < this.list[i].bottom) {
						this.verticalNavTop = (this.list[i].id - 1) * 50
						this.tabCur = this.list[i].id
						console.log(scrollTop)
						return false
					}
				}
			}
		},
	}
</script>

<style>
	.fixed {
		position: fixed;
		z-index: 99;
	}

	.VerticalNav.nav {
		width: 200upx;
		white-space: initial;
	}

	.VerticalNav.nav .cu-item {
		width: 100%;
		text-align: center;
		background-color: #fff;
		margin: 0;
		border: none;
		height: 50px;
		position: relative;
	}
	.VerticalNav.nav .cu-item.cur {
		background-color: #f1f1f1;
	}
	.VerticalNav.nav .cu-item.cur::after {
		content: "";
		width: 8upx;
		height: 30upx;
		border-radius: 10upx 0 0 10upx;
		position: absolute;
		background-color: currentColor;
		top: 0;
		right: 0upx;
		bottom: 0;
		margin: auto;
	}
	.VerticalBox {
		display: flex;
	}
	.VerticalMain {
		background-color: #f1f1f1;
		flex: 1;
	}
</style>
