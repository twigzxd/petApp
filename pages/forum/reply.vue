<template>
	<view class="container">
		<view class="bg_ff shadow flex">
			<image class="head no_shrink" :src="info.avatar" @click="toHomepage(info.user_id)"></image>
			<view class="ml_20 flex_1">
				<view class="fs_26 c_66 line-35" @click="toHomepage(info.user_id)">{{info.nickname}}</view>
				<view class="mt_15 line-40 fs_28 c_1a">{{info.content}}</view>
				<view class="flex__between mt_25">
					<text class="fs_20">{{info.create_time}}</text>
					<text class="iconfont icon-huifu"></text>
				</view>
			</view>
		</view>
		<view v-for="(item,index) in list" :key="index" class="flex list_item mt_20 p_lr_30">
			<image class="head no_shrink" :src="item.avatar" @click="toHomepage(item.user_id)"></image>
			<view class="ml_20 pb_20 bb_ed flex_1">
				<view class="fs_26 c_66 line-35" @click="toHomepage(item.user_id)">{{item.nickname}}</view>
				<view class="mt_15 line-40 fs_28 c_1a">{{item.content}}</view>
				<view class="flex__between mt_25">
					<text class="fs_20">{{item.create_time}}</text>
					<text class="iconfont icon-huifu"></text>
				</view>
			</view>
		</view>
		<view class="footer">
			<input
			  name="search" 
			  type='text' 
			  confirm-type="search" 
			  @confirm="bindConfirm"  
			  v-model="content"
			  bindinput='bindinput' class="comment_input" placeholder="回复评论…" />
			<!-- <input type="text" class="comment_input" placeholder="回复评论…" /> -->
		</view>
	</view>
</template>

<script>
	import {uniLoadMore} from '@dcloudio/uni-ui'
	const app=getApp();
	export default {
		data(){
			return{
				active:0,
				list:[],
				info:{},
				id:''
			}
		},
		methods:{
			// 加载商品
			loadList(page){
				app.$vm.getList({
					url:'News/getReviewReplayList',
					that: this,
					data: {review_id:this.id},
					loading: 1,
					page
				}).then(res => {
					console.log(this.list);
				});
			},
			// 评论
			bindConfirm(){
				app.$vm.getData({
					url: 'News/review',
					that: this,
					data: {news_id: this.info.news_id,content:this.content,pid:this.id},
					loading: 1
				}).then(res => {
					if (res.code == 1) {
						this.loadList(1);
						this.content = '';
					}
				})
			},
			toHomepage(id){
			  // let id = e.currentTarget.id;
			  uni.navigateTo({
				url:"./homepage?id="+id
			  })
			},
		},
		onLoad(options){
			this.id = options.id;
			app.$vm.getData({
				url: 'News/getReviewDetail',
				that: this,
				data: {
					review_id: options.id,
				},
				loading: 1
			}).then(res => {
				if (res.code == 1) {
					this.info = res.data;
				} else {
					uni.showToast({
						title: res.message,
						icon: 'none'
					})
				}  
			});
			this.loadList(1);
		},
		onReachBottom(){
			this.loadList(2);
		}
	}
</script>

<style scoped>
	.container{
		padding-bottom: 120upx;
	}
	.shadow{
		padding:65upx 30upx 22upx;
		box-shadow:inset 0px 15px 10px -15px rgba(0,0,0,0.1);
	}
	.head{
		width: 70upx;
		height: 70upx;
		border-radius: 50%;
	}
	.bb_ed{
		border-bottom: 1upx solid #ededed;
	}
	.ect{
		margin: 0upx 5upx;
	}
	.c_989BF9{
		color: #989BF9;
	}
	.footer{
		width: 100%;
		padding: 16upx 30upx;
		position: fixed;
		/* box-shadow:0px 15px 5px -15px rgba(0,0,0,0.1); */
		box-shadow:0px 15px 5px -15px red;
		background-color: #fff;
		bottom: 0upx;
	}
	.footer iconfont{
		font-size: 40upx;
		color: #1A1A1A;
	}
	.fs_44.iconfont{
		font-size: 44upx;
	}
	.fs_22.iconfont{
		font-size: 22upx;
	}
	.list_item{
		
	}
	.footer{
		width: 100%;
		padding: 16upx 30upx;
		position: fixed;
		box-shadow:0px 15px 5px -15px rgba(0,0,0,0.1);
		background-color: #fff;
		bottom: 0upx;
	}
	.comment_input{
		height:65upx;
		line-height: 65upx;
		background:rgba(250,250,250,1);
		border-radius:33upx;
		padding: 0px 30upx;
	}
</style>
