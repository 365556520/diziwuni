<template>
	<view class="content">
		<view>
		
		</view>
	</view>
</template>

<script>
	export default {
		mounted(){ //这个挂在第一次进入页面后运行一次
		    this.getCategorys();
		},
		data() {
			return {
				title: '我是新闻'
			}
		},
		onLoad: function (option) { //option为object类型，会序列化上个页面传递的参数
			console.log(option.id); //打印出上个页面传递的参数。
			console.log(option.name); //打印出上个页面传递的参数。
		},
		methods: {
			getCategorys(){
				//获取文章分类
				this.$api.test('/api/getCategorys').then((res)=>{
                    console.log('数据请求成功', res)
                    uni.showToast({
                        title: '请求成功',
                        icon: 'success',
                        mask: true
                    });
                    this.res = '请求结果 : ' + JSON.stringify(res);
                }).catch((err)=>{
    
                    console.log('数据请求失败', err);
                })
				uni.request({
					url: '', //仅为示例，并非真实接口地址。
					
						success: (res) => {
							console.log(res.data);
					
						}
				});
				
			}
		}
	}
</script>

<style>
	.content {
		text-align: center;
		height: 400upx;
	}

	.logo {
		height: 200upx;
		width: 200upx;
		margin-top: 200upx;
	}

	.title {
		font-size: 36upx;
		color: #8f8f94;
	}
</style>
