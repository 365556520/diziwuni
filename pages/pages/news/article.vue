<template>
	<view class="content">
		<cu-custom bgColor="bg-gradual-pink" :isBack="true"><block slot="backText">返回</block><block slot="content">{{detailData.title}}</block></cu-custom>
		<scroll-view class="scroll" scroll-y>
			<view class="scroll-content">
				<view class="introduce-section">
					<text class="title">{{detailData.title}}</text>
					<view class="introduce">
						<text>{{detailData.author}}</text>
						<text>{{articledata.view}}阅读</text>
						<text>{{detailData.time}}</text>
					</view>
					<u-parse :content="articledata.content"  />
					<view class="actions" v-show="loading === false">
						<view class="action-item">
							<text class="yticon icon-dianzan-ash"></text>
							<text>75</text>
						</view>
						<view class="action-item">
							<text class="yticon icon-dianzan-ash reverse"></text>
							<text>6</text>
						</view>
						<view class="action-item">
							<text class="yticon icon-fenxiang2"></text>
							<text>分享</text>
						</view>
						<view class="action-item">
							<text class="yticon icon-shoucang active"></text>
							<text>收藏</text>
						</view>
					</view>
				</view>
				<view class="container" v-show="loading === false">	
					<!-- 评论 -->
					<view class="s-header">
						<text class="tit">网友评论</text>
					</view>
					<view class="evalution">
						<view  v-for="(item, index) in evaList" :key="index"
							class="eva-item"
						>
							<view class="eva-right">
					
								<view class="zan-box" @click="huifus(item.get_from_uid.id,item.get_from_uid.name)">
									 回复
								</view>
								<view class="content"><u-parse :content="item.to_uid?item.get_from_uid.name+'  回复  '+item.get_to_uid.name+': '+item.content:item.get_from_uid.name+': '+item.content"/></view>
								<view>{{item.created_at}} </view>
							</view>
						</view>
					</view>
				</view>
				<!-- 加载图标 -->
				<mixLoading class="mix-loading" v-if="loading"></mixLoading>
			</view>
		</scroll-view>
		
		<view class="bottom">
			<view class="input-box">
				<text class="yticon icon-huifu"><text @click="qingchu()">{{inputcomments.to_name==''?'':' 回复: '+inputcomments.to_name+':'}} </text></text>
				<input 
					class="input"
					type="text" 
					placeholder="点评一下把.." 
					placeholder-style="color:#adb1b9;"
					v-model="inputcomments.commentscontent"
				/>
			</view>
			<text class="confirm-btn" @click="submit()">提交</text>
		</view>
	</view>
</template>

<script>
	import {mapState} from 'vuex'; //mapState数据计算简化模式mapMutations方法的简化模式写法如下
	import mixLoading from '@/components/mix-news/mix-loading/mix-loading';
	import uParse from '@/components/gaoyia-parse/parse.vue'; //解析html富文本
	export default {
		components: {
			mixLoading,uParse
		},
		data() {
			return {
				loading: true,
				detailData: {},
				articledata:{},
				evaList: [],
				inputcomments:{
				    commentscontent:'',//回复内容
				    to_name:'',
				    to_uid:'',
				},
			}
		},
		computed:{//数据计算
		    ...mapState(['userToken']),
		},
		onLoad(options){
			this.detailData = JSON.parse(options.data);
			this.getarticle(this.detailData.id);
			console.log(this.detailData );
			this.loadEvaList(this.detailData.id);
		},
		methods: {
			  //获取该文章所有评论
			async loadEvaList(id){
			    this.$api.test('/api/getComments/' + id).then((res) => {
					let data = JSON.parse(res.data);
			        if (data.code == '200') {
			            this.evaList = data.data;
			            console.log('文章评论',this.evaList);
						this.loading=false;
			        }
			    }).catch((err) => {
			         console.log('数据请求失败', err);
					 return false;
			    });
			},
			//获取文章详细内容
			getarticle(id){
				//获取文章分类
				this.$api.test('/api/getArticlesContent/'+id).then((res)=>{
					let article = JSON.parse(res.data);
					if(article.code=='200'){
						this.articledata = article.data;
						/* this.articledata.content = '<div>'+ this.articledata.content +'</div>'; */
						this.loading=false;
						console.log('文章详情',this.articledata)
					}
				}).catch((err)=>{
				    console.log('数据请求失败', err);
					return false;
				})
			},
			huifus(id,name){
				this.inputcomments.to_name = name;
				this.inputcomments.to_uid = id;
			},
			qingchu(){
				this.inputcomments.to_name = '';
				this.inputcomments.to_uid = '';
			},
			submit(){
				 if(this.userToken!=""){
					if(this.inputcomments.commentscontent!=''){
					     let data =  {
							 data:{
					             'topic_id':this.detailData.id,//文章id
					             'content':this.inputcomments.commentscontent, //恢复内容
					             'to_uid':this.inputcomments.to_uid, //恢复目标id
							}
					     }
					     this.$api.postToken('/api/inputComments',this.userToken,data).then((response) => {
							 let data = JSON.parse(response.data);
					         if(data.code == '200'){
					             this.inputcomments.commentscontent = ''; //清空输入框
					             this.inputcomments.to_uid='';
					             this.inputcomments.to_name='';
					             this.loadEvaList(this.detailData.id);
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
						     title: "评论失败!不能发送空评论",
						     icon: 'none',
						     mask: true
						 });
					 }
				 }else{
					 uni.showToast({
					     title: "请登录账号",
					     icon: 'none',
					     mask: true
					 });
					 setTimeout(function () {
						uni.navigateTo({
							url: '/pages/pages/auth/login'
						});		
					}, 1000);
				 }
			}
		}
	}
</script>

<style lang="scss">
	page{
		height: 100%;
	}
	.content{
		display: flex;
		flex-direction: column;
		height: 100%;
	}
	.video-wrapper{
		height: 422upx;
		
		.video{
			width: 100%;
			height: 100%;
		}
	}
	.scroll{
		flex: 1;
		position: relative;
		background-color: #f8f8f8;
		height: 0;
	}
	.scroll-content{
		display: flex;
		flex-direction: column;
	}
	/* 简介 */
	.introduce-section{
		display: flex;
		flex-direction: column;
		padding: 20upx 30upx;
		background: #fff;
		line-height: 1.5;
		
		.title{
			font-size: 36upx;
			color: #303133;
			margin-bottom: 16upx;
		}
		.introduce{
			display: flex;
			font-size: 26upx;
			color: #909399;
			text{
				margin-right: 16upx;
			}
		}
	}
	/* 点赞等操作 */
	.actions{
		display: flex;
		justify-content: space-around;
		align-items: center;
		line-height: 1.3;
		padding: 10upx 40upx 20upx;
	
		.action-item{
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			font-size: 24upx;
			color: #999;
		}
		.yticon{
			display: flex;
			align-items: center;
			justify-content: center;
			width: 60upx;
			height: 60upx;
			font-size: 52upx;
			
			&.reverse{
				position: relative;
				top: 6upx;
				transform: scaleY(-1);
			}
			&.active{
				color: #ec706b;
			}
		}
		.icon-fenxiang2{
			font-weight: bold;
			font-size: 36upx;
		}
		.icon-shoucang{
			font-size: 44upx;
		}
	}

	.s-header{
		padding: 20upx 30upx;
		font-size: 30upx;
		color: #303133;
		background: #fff;
		margin-top: 16upx;
		
		&:before{
			content: '';
			width: 0;
			height: 40upx;
			margin-right: 24upx;
			border-left: 6upx solid #ec706b;
		}
	}
	/* 推荐列表 */
	.rec-section{
		background-color: #fff;
		.rec-item{
			display: flex;
			padding: 20upx 30upx;
			position: relative;
			&:after{
				content: '';
				position: absolute;
				left: 30upx;
				right: 0;
				bottom: 0;
				height: 0;
				border-bottom: 1px solid #eee;
				transform: scaleY(50%);
			}
		}
		.left{
			flex: 1;
			padding-right: 10upx;
			overflow: hidden;
			position: relative;
			padding-bottom: 52upx;
			.title{
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
				font-size: 32upx;
				color: #303133;
				line-height: 44upx;
			}
			.bot{
				position: absolute;
				left: 0;
				bottom: 4upx;
				font-size: 26upx;
				color: #909399;
			}
			.time{
				margin-left: 20upx;
			}
		}
		.right{
			width: 220upx;
			height: 140upx;
			flex-shrink: 0;
			position: relative;
			.img{
				width: 100%;
				height: 100%;
			}
			
		}
	}
	/* 评论 */
	.evalution{
		display:flex;
		flex-direction:column;
		background: #fff;
		padding: 20upx 0;
	}
	
	.eva-item{
		display:flex;
		padding: 20upx 30upx;
		position: relative;
		image{
			width: 60upx;
			height: 60upx;
			border-radius: 50px;
			flex-shrink: 0;
			margin-right: 24upx;
		}
		&:after{
			content: '';
			position: absolute;
			left: 30upx;
			bottom: 0;
			right: 0;
			height: 0;
			border-bottom: 1px solid #eee;
			transform: translateY(50%);
		}
		&:last-child:after{
			border: 0;
		}
	}
	.eva-right{
		display:flex;
		flex-direction:column;
		flex: 1;
		font-size: 26upx;
		color: #909399;
		position:relative;
		.zan-box{
			display:flex;
			align-items:base-line;
			position:absolute;
			top: 10upx;
			right: 10upx;
			.yticon{
				margin-left: 8upx; 
			}
		}
		.content{
			font-size: 28upx;
			color: #333;
			padding-top:20upx;
		}
	}
	
	/* 底部 */
	.bottom{
		flex-shrink: 0;
		display: flex;
		align-items: center;
		height: 90upx;
		padding: 0 30upx;
		box-shadow: 0 -1px 3px rgba(0,0,0,.04); 
		position: relative;
		z-index: 1;
		
		.input-box{
			display: flex;
			align-items: center;
			flex: 1;
			height: 60upx;
			background: #f2f3f3;
			border-radius: 100px;
			padding-left: 30upx;
			
			.icon-huifu{
				font-size: 28upx;
				color: #909399;
			}
			.input{
				padding: 0 20upx;
				font-size: 28upx;
				color: #303133;
			}
		}
		.confirm-btn{
			font-size: 30upx;
			padding-left: 20upx;
			color: #0d9fff;
		}
	}
</style>
