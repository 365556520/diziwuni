<template>
	<view class="content">
		<!--
		* 广告组件
		* timedown 倒计时时间
		* imageUrl 背景图
		* url 跳转链接
		*  -->
		<!-- #ifndef MP -->
	<!-- 	<mix-advert 
			ref="mixAdvert" 
			:timedown="8" 
			imageUrl="/static/advert.jpg"
			:url="advertNavUrl"
		></mix-advert> -->
		<!-- #endif -->
		
		<!-- 顶部选项卡 -->
		<scroll-view id="nav-bar" class="nav-bar" scroll-x scroll-with-animation :scroll-left="scrollLeft">
			<view 
				v-for="(item,index) in tabBars" :key="item.id"
				class="nav-item"
				:class="{current: index === tabCurrentIndex}"
				:id="'tab'+index"
				@click="changeTab(index)"
			>{{item.cate_name}}</view>
		</scroll-view>
		
		<!-- 下拉刷新组件 -->
		<mix-pulldown-refresh ref="mixPulldownRefresh" class="panel-content" :top="90" @refresh="onPulldownReresh" @setEnableScroll="setEnableScroll">
			<!-- 内容部分 -->
			<swiper 
					id="swiper"
					class="swiper-box" 
					:duration="300" 
					:current="tabCurrentIndex" 
					@change="changeTab"
				>
				<swiper-item v-for="tabItem in tabBars" :key="tabItem.id">
					<scroll-view 
							class="panel-scroll-box" 
							:scroll-y="enableScroll" 
							@scrolltolower="loadMore"
							>
							<!-- 
								* 新闻列表 
								* 和nvue的区别只是需要把uni标签转为weex标签而已
								* class 和 style的绑定限制了一些语法，其他并没有不同
							-->
							<view v-for="(item, index) in tabItem.newsList" :key="index" class="news-item" @click="navToDetails(item)">
								<!-- 根据图片是否存在和个数设置标题 <!-- 'img-list-single' 设置图片列 'img-wrapper-single'设置打图片- ->-->
								<text :class="['title',item.thumb=='null'?'':item.thumb.length==1?'title1':'title2' ]">{{item.title}}</text> 
								<view v-if="item.thumb!='null'" :class="['img-list', 'img-list'+item.thumb.length]">
									<view 
										v-for="(imgItem, imgIndex) in item.thumb" :key="imgIndex"
										:class="['img-wrapper', 'img-wrapper'+item.thumb.length]"
									>
										<image class="img"  :src="imgItem"></image>
									</view>
								</view>
								<!-- 空图片占位 --><!-- 根据图片是否存在和个数设置底部内容 -->
								<view :class="['bot',item.thumb=='null'?'':item.thumb.length==1?'bot1':'bot2']">
									<text class="author">{{item.get_user.name}}</text>
									<text class="time">{{item.created_at}}</text>
								</view>
							</view>
							<!-- 上滑加载更多组件 -->
							<mix-load-more :status="tabItem.loadMoreStatus"></mix-load-more>
					</scroll-view>
				</swiper-item>
			</swiper>
		</mix-pulldown-refresh>
	</view>
</template>

<script>
	import mixPulldownRefresh from '@/components/mix-news/mix-pulldown-refresh/mix-pulldown-refresh';
	import mixLoadMore from '@/components/mix-news/mix-load-more/mix-load-more';
	let windowWidth = 0, scrollTimer = false, tabBar;
	export default {
		components: {
			mixPulldownRefresh,
			mixLoadMore
		},
		data() {
			return {
				tabCurrentIndex: 0, //当前选项卡索引
				scrollLeft: 0, //顶部选项卡左滑距离
				enableScroll: true,
				tabBars: [], //文章分类数据
			}
		},
		computed: {
			advertNavUrl(){
				let data = {
					title: '测试跳转新闻详情',
					author: '测试作者',
					time: '2019-04-26 21:21'
				}
				return `/pages/details/details?data=${JSON.stringify(data)}`;
			} 
		},
		async onLoad() {
			// 获取屏幕宽度
			windowWidth = uni.getSystemInfoSync().windowWidth;
			this.loadTabbars();
		},
		onReady(){
			/**
			 * 启动页广告 使用文档（滑稽）
			 * 1. 引入组件并注册 
			 * 		import mixAdvert from '@/components/mix-advert/vue/mix-advert';
			 *      components: {mixAdvert},
					 <!-- #ifndef MP -->
						<mix-advert 
							ref="mixAdvert" 
							:timedown="8" 
							imageUrl="/static/advert.jpg"
							:url="advertNavUrl"
						></mix-advert>
					<!-- #endif -->
			 * 	2. 调用组件的initAdvert()方法进行初始化
			 * 
			 *  初始化的时机应该是在splash关闭时，否则会造成在app端广告显示了数秒后首屏才渲染出来
			 */
			// #ifndef MP
		/* 	this.$refs.mixAdvert.initAdvert(); */
			// #endif
		},
		methods: {
			/**
			 * 数据处理方法在vue和nvue中通用，可以直接用mixin混合
			 * 这里直接写的
			 * mixin使用方法看index.nuve
			 */
			//获取分类
			loadTabbars(){
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
						this.tabBars = tabList;
						this.loadNewsList('add');
						console.log('看看', this.tabBars)
					}
				   // this.res = '请求结果 : ' + JSON.stringify(res);
				}).catch((err)=>{
				    console.log('数据请求失败', err);
				})
			},
			//新闻列表
			loadNewsList(type){
				let tabItem = this.tabBars[this.tabCurrentIndex];
				//type add 加载更多 refresh下拉刷
				if(type === 'add'){
					if(tabItem.loadMoreStatus === 2){
						return;
					}
					tabItem.loadMoreStatus = 1;
				}
				// #ifdef APP-PLUS
				else if(type === 'refresh'){
					tabItem.refreshing = true;
				}
				// #endif
				//获取文章列表
				this.$api.test('/api/getArticles',{
						limit:'20', //每页10个数据
						page:'1', //当前页数默认第一页
						reload:'', //搜索内容
						ifs:'', //搜索的列名
						category_id:tabItem.id,//分类id
						articles_ids:tabItem.id //分类id数组
				}).then((res)=>{
					let data = JSON.parse(res.data);
					if(data.code == "200"){
						console.log('数据请求成功', data.msg)
						let list = data.data.data //获取数据
						for (var i in list){    //把文章中的图片json格式转换成数组
							if(list[i].thumb!='null'){
							    list[i].thumb = JSON.parse(list[i].thumb);
							}
						}
						
				/* 		list.sort((a,b)=>{
							return Math.random() > .5 ? -1 : 1; //静态数据打乱顺序
						}) */
						if(type === 'refresh'){
							tabItem.newsList = []; //刷新前清空数组
						}
						list.forEach(item=>{
							tabItem.newsList.push(item);
						})
						console.log('数据请求成功', list)
						//下拉刷新 关闭刷新动画
						if(type === 'refresh'){
							this.$refs.mixPulldownRefresh && this.$refs.mixPulldownRefresh.endPulldownRefresh();
							// #ifdef APP-PLUS
							tabItem.refreshing = false;
							// #endif
							tabItem.loadMoreStatus = 0;
						}
						//上滑加载 处理状态
						if(type === 'add'){
							tabItem.loadMoreStatus = tabItem.newsList.length > 40 ? 2: 0;
						}
					}
				   // this.res = '请求结果 : ' + JSON.stringify(res);
				}).catch((err)=>{
					console.log('数据请求失败', err);
				})
			},
			//新闻详情
			navToDetails(item){
				let data = {
					id: item.id,
					title: item.title,
					author: item.get_user.name,
					time: item.created_at
				}
				//在本目录所以路径直接文件名
				let url = 'article?data='+JSON.stringify(data)
				uni.navigateTo({
					url: url
				})
			},	
			//下拉刷新
			onPulldownReresh(){
				this.loadNewsList('refresh');
			},
			//上滑加载
			loadMore(){
				this.loadNewsList('add');
			},
			//设置scroll-view是否允许滚动，在小程序里下拉刷新时避免列表可以滑动
			setEnableScroll(enable){
				if(this.enableScroll !== enable){
					this.enableScroll = enable;
				}
			},
			//tab切换
			async changeTab(e){
				
				if(scrollTimer){
					//多次切换只执行最后一次
					clearTimeout(scrollTimer);
					scrollTimer = false;
				}
				let index = e;
				//e=number为点击切换，e=object为swiper滑动切换
				if(typeof e === 'object'){
					index = e.detail.current
				}
				if(typeof tabBar !== 'object'){
					tabBar = await this.getElSize("nav-bar")
				}
				//计算宽度相关
				let tabBarScrollLeft = tabBar.scrollLeft;
				let width = 0; 
				let nowWidth = 0;
				//获取可滑动总宽度
				for (let i = 0; i <= index; i++) {
					let result = await this.getElSize('tab' + i);
					width += result.width;
					if(i === index){
						nowWidth = result.width;
					}
				}
				if(typeof e === 'number'){
					//点击切换时先切换再滚动tabbar，避免同时切换视觉错位
					this.tabCurrentIndex = index; 
				}
				//延迟300ms,等待swiper动画结束再修改tabbar
				scrollTimer = setTimeout(()=>{
					if (width - nowWidth/2 > windowWidth / 2) {
						//如果当前项越过中心点，将其放在屏幕中心
						this.scrollLeft = width - nowWidth/2 - windowWidth / 2;
					}else{
						this.scrollLeft = 0;
					}
					if(typeof e === 'object'){
						this.tabCurrentIndex = index; 
					}
					this.tabCurrentIndex = index; 
					
					
					//第一次切换tab，动画结束后需要加载数据
					let tabItem = this.tabBars[this.tabCurrentIndex];
					if(this.tabCurrentIndex !== 0 && tabItem.loaded !== true){
						this.loadNewsList('add');
						tabItem.loaded = true;
					}
				}, 300)
				
			},
			//获得元素的size
			getElSize(id) { 
				return new Promise((res, rej) => {
					let el = uni.createSelectorQuery().select('#' + id);
					el.fields({
						size: true,
						scrollOffset: true,
						rect: true
					}, (data) => {
						res(data);
					}).exec();
				});
			},
		}
	}
</script>

<style lang='scss'>
	page, .content{
		height: 100%;
		overflow: hidden;
	}

	/* 顶部tabbar */
	.nav-bar{
		position: relative;
		z-index: 10;
		height: 90upx;
		white-space: nowrap;
		box-shadow: 0 2upx 8upx rgba(0,0,0,.06);
		background-color: #fff;
		.nav-item{
			display: inline-block;
			width: 150upx;
			height: 90upx;
			text-align: center;
			line-height: 90upx;
			font-size: 30upx;
			color: #303133;
			position: relative;
			&:after{
				content: '';
				width: 0;
				height: 0;
				border-bottom: 4upx solid #007aff;
				position: absolute;
				left: 50%;
				bottom: 0;
				transform: translateX(-50%);
				transition: .3s;
			}
		}
		.current{
			color: #007aff;
			&:after{
				width: 50%;
			}
		}
	}

	.swiper-box{
		height: 100%;
	}

	.panel-scroll-box{
		height: 100%;
		
		.panel-item{
			background: #fff;
			padding: 30px 0;
			border-bottom: 2px solid #000;
		}
	}
	
	/**
	 * 新闻列表 直接拿的nvue样式修改，,
	 * 一共需要修改不到10行代码, 另外px需要直接修改为upx，只有单位不一样，计算都是一样的
	 * 吐槽：难道不能在编译的时候把nuve中的upx转为px? 这样就不用修改单位了
	 */
	.video-wrapper{
		width: 100%;
		height: 440upx;
		.video{
			width: 100%;
		}
	}
	
	view{
		display:flex;
		flex-direction: column;
	}
	.img{
		width: 100%;
		height: 100%;
	}
	.news-item{
		position:relative;
	}
	/* 修改结束 */
	
	/* 新闻列表  emmm 仅供参考 */
	.news-item{
		width: 750upx;
		padding: 24upx 30upx;
		border-bottom-width: 1px;
		border-color: #eee;
		background-color: #fff;
	}
	.title{
		font-size: 32upx;
		color: #303133;
		line-height: 46upx;
	}
	.bot{
		flex-direction: row;
	}
	.author{
		font-size: 26upx;
		color: #aaa;
	}
	.time{
		font-size: 26upx;
		color: #aaa;
		margin-left: 20upx;
	}
	.img-list{
		flex-shrink: 0;
		flex-direction: row;
		background-color: #fff;
		width: 220upx;
		height: 140upx;
	}
	.img-wrapper{
		flex: 1;
		flex-direction: row;
		height: 140upx;
		position: relative;
		overflow: hidden;
	}
	.img{
		flex: 1;
	}
	.img-empty{
		height: 20upx;
	}
	
	/* 图在左 */
	.img-list1{
		position:absolute;
		left: 30upx;
		top: 24upx;
	}
	.title1{
		padding-left: 240upx; 
	}
	.bot1{
		padding-left: 240upx; 
		margin-top: 20upx;
	}
	/* 图在右 */
	.img-list2{
		position:absolute;
		right: 30upx;
		top: 24upx;
	}
	.title2{
		padding-right: 210upx; 
	}
	.bot2{
		margin-top: 20upx;
	}
	/* 底部3图 */
	.img-list3{
		width: 700upx;
		margin: 16upx 0upx;
	}
	.img-wrapper3{
		margin-right: 4upx;
	}
	/* 底部大图 */
	.img-list-single{
		width: 690upx;
		height: 240upx;
		margin: 16upx 0upx;
	}
	.img-wrapper-single{
		height: 240upx;
		margin-right: 0upx;
	}
	
	.video-tip{
		position: absolute;
		left: 0;
		top: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		background-color: rgba(0,0,0,.3);
	}
	.video-tip-icon{
		width: 60upx;
		height:60upx; 
	}
</style>