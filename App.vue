<script>
	import {mapMutations} from 'vuex'; //mapState数据计算简化模式mapMutations方法的简化模式写法如下
	import Vue from 'vue'
	export default {
		mounted(){ //这个挂在第一次进入页面后运行一次
		    this.getToken(); //获取token
			this.getwifi();//检查网络
		},
		methods: {
			//用vuex里面的方法
			...mapMutations([
			    'getToken'
			]), 
			getwifi(){
				uni.getNetworkType({
				    success: function (res) {
						if(res.networkType=='none'){
							uni.showToast({
								title: '迪子网:连接网络失败，请检查网络！',
								icon:'none',
								mask: true,
								 duration: 5000
							});
						}
				        console.log(res.networkType);
				    }
				});
			}
		},
		onLaunch: function() {
			console.log('App Launch')
			uni.getSystemInfo({
				success: function(e) {
					// #ifndef MP
					Vue.prototype.StatusBar = e.statusBarHeight;
					if (e.platform == 'android') {
						Vue.prototype.CustomBar = e.statusBarHeight + 50;
					} else {
						Vue.prototype.CustomBar = e.statusBarHeight + 45;
					};
					// #endif
			
					// #ifdef MP-WEIXIN
					Vue.prototype.StatusBar = e.statusBarHeight;
					let custom = wx.getMenuButtonBoundingClientRect();
					Vue.prototype.Custom = custom;
					Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
					// #endif		
			
					// #ifdef MP-ALIPAY
					Vue.prototype.StatusBar = e.statusBarHeight;
					Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
					// #endif
				}
			})
			
			Vue.prototype.ColorList = [{
					title: '嫣红',
					name: 'red',
					color: '#e54d42'
				},
				{
					title: '桔橙',
					name: 'orange',
					color: '#f37b1d'
				},
				{
					title: '明黄',
					name: 'yellow',
					color: '#fbbd08'
				},
				{
					title: '橄榄',
					name: 'olive',
					color: '#8dc63f'
				},
				{
					title: '森绿',
					name: 'green',
					color: '#39b54a'
				},
				{
					title: '天青',
					name: 'cyan',
					color: '#1cbbb4'
				},
				{
					title: '海蓝',
					name: 'blue',
					color: '#0081ff'
				},
				{
					title: '姹紫',
					name: 'purple',
					color: '#6739b6'
				},
				{
					title: '木槿',
					name: 'mauve',
					color: '#9c26b0'
				},
				{
					title: '桃粉',
					name: 'pink',
					color: '#e03997'
				},
				{
					title: '棕褐',
					name: 'brown',
					color: '#a5673f'
				},
				{
					title: '玄灰',
					name: 'grey',
					color: '#8799a3'
				},
				{
					title: '草灰',
					name: 'gray',
					color: '#aaaaaa'
				},
				{
					title: '墨黑',
					name: 'black',
					color: '#333333'
				},
				{
					title: '雅白',
					name: 'white',
					color: '#ffffff'
				},
			]
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	@import "components/colorui/main.css";
	@import "components/colorui/icon.css";
	@keyframes show {
		0% {
			transform: translateY(-50px);
		}
	
		60% {
			transform: translateY(40upx);
		}
	
		100% {
			transform: translateY(0px);
		}
	}
	
	@-webkit-keyframes show {
		0% {
			transform: translateY(-50px);
		}
	
		60% {
			transform: translateY(40upx);
		}
	
		100% {
			transform: translateY(0px);
		}
	}
	/*每个页面公共css */
	@font-face {
		font-family: yticon;
		font-weight: normal;
		font-style: normal;
		src: url('https://at.alicdn.com/t/font_1078604_3mrhac2o3oi.ttf') format('truetype');
	}
	
	.yticon {
		font-family: "yticon" !important;
		font-size: 16px;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}
	
	.icon-huifu:before {
	  content: "\e68b";
	}
	
	.icon-comment:before {
	  content: "\e64f";
	}
	
	.icon-dianzan-ash:before {
	  content: "\e617";
	}
	
	.icon-iconfontshanchu1:before {
		content: "\e619";
	}
	
	.icon-iconfontweixin:before {
		content: "\e611";
	}
	
	.icon-shang:before {
		content: "\e624";
	}
	
	.icon-shouye:before {
		content: "\e626";
	}
	
	.icon-shanchu4:before {
		content: "\e622";
	}
	
	.icon-xiaoxi:before {
		content: "\e618";
	}
	
	.icon-jiantour-copy:before {
		content: "\e600";
	}
	
	.icon-fenxiang2:before {
		content: "\e61e";
	}
	
	.icon-pingjia:before {
		content: "\e67b";
	}
	
	.icon-daifukuan:before {
		content: "\e68f";
	}
	
	.icon-pinglun-copy:before {
		content: "\e612";
	}
	
	.icon-shoucang:before {
		content: "\e645";
	}
	
	.icon-xuanzhong2:before {
		content: "\e62f";
	}
	
	.icon-icon-test:before {
		content: "\e60c";
	}
	
	.icon-bianji:before {
		content: "\e646";
	}
	
	.icon-zuoshang:before {
		content: "\e613";
	}
	
	.icon-jia2:before {
		content: "\e60a";
	}
	
	.icon-sousuo:before {
		content: "\e7ce";
	}
	
	.icon-arrow-fine-up:before {
		content: "\e601";
	}
	
	.icon-hot:before {
		content: "\e60e";
	}
	
	.icon-lishijilu:before {
		content: "\e6b9";
	}
	
	.icon-xiatubiao--copy:before {
		content: "\e608";
	}
	
	.icon-shoucang_xuanzhongzhuangtai:before {
		content: "\e6a9";
	}
	
	.icon-jia1:before {
		content: "\e61c";
	}
	
	.icon-bangzhu1:before {
		content: "\e63d";
	}
	
	.icon-arrow-left-bottom:before {
		content: "\e602";
	}
	
	.icon-arrow-right-bottom:before {
		content: "\e603";
	}
	
	.icon-arrow-left-top:before {
		content: "\e604";
	}
	
	.icon-icon--:before {
		content: "\e744";
	}
	
	.icon-zuojiantou-up:before {
		content: "\e605";
	}
	
	.icon-xia:before {
		content: "\e62d";
	}
	
	.icon--jianhao:before {
		content: "\e60b";
	}
	
	.icon-Group-:before {
		content: "\e688";
	}
	
	.icon-you:before {
		content: "\e606";
	}
	
	.icon-forward:before {
		content: "\e607";
	}
	
	.icon-tuijian:before {
		content: "\e610";
	}
	
	.icon-bangzhu:before {
		content: "\e679";
	}
	
	.icon-share:before {
		content: "\e656";
	}
	
	.icon-shezhi1:before {
		content: "\e61d";
	}
	
	.icon-fork:before {
		content: "\e61b";
	}
	
	.icon-iLinkapp-:before {
		content: "\e654";
	}
	
	.icon-saomiao:before {
		content: "\e60d";
	}
	
	.icon-shezhi:before {
		content: "\e60f";
	}
	
	.icon-shouhoutuikuan:before {
		content: "\e631";
	}
	
	.icon-gouwuche:before {
		content: "\e609";
	}
	
	.icon-dizhi:before {
		content: "\e614";
	}
	
	.icon-xingxing:before {
		content: "\e70b";
	}
	
	.icon-zuanshi:before {
		content: "\e615";
	}
	
	.icon-zuo:before {
		content: "\e63c";
	}
	
	.icon-shoucang2:before {
		content: "\e62e";
	}
	
	.icon-yishouhuo:before {
		content: "\e71a";
	}
	view,
	scroll-view,
	swiper,
	swiper-item,
	cover-view,
	cover-image,
	icon,
	text,
	rich-text,
	progress,
	button,
	checkbox,
	form,
	input,
	label,
	radio,
	slider,
	switch,
	textarea,
	navigator,
	audio,
	camera,
	image,
	video {
		box-sizing: border-box;
	}
</style>
