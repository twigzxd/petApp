<template>
	<view>
		<view class="topic">发布话题</view>
		<view class="li_item" v-for="(item,index) in list" :key='index'>
			<view class="top">
				<image class="headimg" :src="item.news.avatar" mode=""></image>
				<view class="top_right">
					<view>{{item.news.nickname}}</view>
					<view>{{item.news.time}}</view>
				</view>
			</view>
			<view class="content">{{item.news.content}}</view>
			<view class="imgboxs" v-if="item.news.is_has_video==1">
				<video :src="item.news.video_url" controls></video>
				<image v-for="(item,index) in item.news.img_path" :key='index'  :src="item" mode=""></image>
				<view style="clear:both"></view>
			</view>
			<view class="imgbox" v-else>
				<image v-for="(item,index) in item.news.img_path" :key='index'  :src="item" mode=""></image>
				<view style="clear:both"></view>
			</view>
			<view class="func">
				<view class="zan" v-if="item.news.praise_is==0"  @click="zan(item.news.id)">
					<view class="iconfont icon-claws"></view>
					<view style="font-size:22upx;">{{item.news.praise_count}}</view>
				</view>
				<view class="zan" v-else @click="canzan(item.news.id)">
					<view class="iconfont icon-gouzhua"></view>
					<view style="font-size:22upx;">{{item.news.praise_count}}</view>
				</view>
				<view class="collect" v-if="item.news.collect_is==1" @click="cancollect(item.news.collect_id)">
					<view class="iconfont icon-keepsel"></view>
					<view style="font-size:22upx;">{{item.news.collect_count}}</view>
				</view>
				<view class="collect" v-else  @click="collect(item.news.id)">
					<view class="iconfont icon-shoucang"></view>
					<view style="font-size:22upx;">{{item.news.collect_count}}</view>
				</view>
				<view class="reply">
					<view class="iconfont icon-huifu" @click="go(item.news.id)"></view>
					<view style="font-size:22upx;">{{item.news.review_count}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	const app=getApp();
	export default {
	    name:'conpons',
	    data(){
	        return{
	          list:[],
	        }
	    },
		methods:{
			// 加载商品
			loadList(page){
				app.$vm.getList({
					url:'News/getCollectList',
					that: this,
					data: {},
					loading: 1,
					page
				});
			},
			go(id){
				uni.navigateTo({
					url:'/pages/forum/detail?id='+id
				})
			},
			collect(id){
				app.$vm.getData({
					url:'News/newsCollect',
					that: this,
					data: {
						news_id:id
					},
					loading: 1,
				}).then(res=>{
					if(res.code==1){
						uni.showToast({
							title:res.message,
							icon:'none'
						})
						this.loadList(1)
					}
				})
			},
			cancollect(id){
				app.$vm.getData({
					url:'News/collectCancel',
					that: this,
					data: {
						id_list:id
					},
					loading: 1,
				}).then(res=>{
					if(res.code==1){
						uni.showToast({
							title:res.message,
							icon:'none'
						})
						this.loadList(1)
					}
				})
			},
			zan(id){
				app.$vm.getData({
					url:'News/newsPraise',
					that: this,
					data: {
						news_id:id
					},
					loading: 1,
				}).then(res=>{
					if(res.code==1){
						uni.showToast({
							title:res.message,
							icon:'none'
						})
						this.loadList(1)
					}
				})
			},
			canzan(id){
				app.$vm.getData({
					url:'News/RemoveNewsPraise',
					that: this,
					data: {
						news_id:id
					},
					loading: 1,
				}).then(res=>{
					if(res.code==1){
						uni.showToast({
							title:res.message,
							icon:'none'
						})
						this.loadList(1)
					}
				})
			}
		},
		onShow() {
			this.loadList(1)
		},
		onReachBottom() {
			this.loadList(2)
		}
	}
</script>

<style>
	page{
		background: #FFFFFF;
	}
</style>
<style scoped>
	.topic{
		height:45upx;
		font-size:32upx;
		font-family:PingFangSC-Medium,PingFang SC;
		font-weight:500;
		color:rgba(26,26,26,1);
		line-height:45upx;
		margin:  25upx 30upx;
	}
	.li_item{
		margin: 0upx 30upx;
		padding: 23upx 0;
		border-bottom: 1upx solid #EDEDED;
	}
	.li_item .top{
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.li_item .headimg{
		width: 70upx;
		height: 70upx;
		border-radius: 50%;
		margin-right: 22upx;
		margin-left: 10upx;
	}
	.li_item .top_right{
		flex: 1;
	}
	.li_item .top_right view:nth-child(1){
		height:37upx;
		font-size:26upx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:rgba(102,102,102,1);
		line-height:37upx;
		margin-bottom: 2upx;
	}
	.li_item .top_right view:nth-child(2){
		height:38upx;
		font-size:22upx;
		font-family:Avenir-Roman,Avenir;
		font-weight:normal;
		color:rgba(164,169,179,1);
		line-height:38upx;
	}
	.content{
		margin: 17upx 0 30upx;
		height:40upx;
		font-size:28upx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:rgba(51,51,51,1);
		line-height:40upx;
	}
	.imgboxs video{
		width: 220upx;
		height: 220upx;
		float: left;
		margin-right: 15upx;
		margin-bottom: 15upx;
	}
	 .li_item .imgboxs image{
		width: 220upx;
		height: 220upx;
		display: block; 
		float: left;
		margin-right: 15upx;
		margin-bottom: 15upx;
	}
	.li_item .imgbox image{
		width: 220upx;
		margin-bottom: 15upx;
		height: 220upx;
		display: block; 
		float: left;
		margin-right: 15upx;
	}
	.li_item .imgbox image:nth-child(3n){
		margin-right: 0upx;
	}
	.li_item .imgboxs image:nth-child(3n){
		margin-right: 0upx;
	}
	.func{
		margin: 10upx 95upx ;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.zan, .collect ,.reply{
		font-size:22upx;
		font-family:Avenir-Roman,Avenir;
		font-weight:normal;
		color:rgba(26,26,26,1);
		display: flex;
		align-items: center;
	}
	.zan .icon-claws{
		font-size: 38upx;
		margin-right:2upx ;
	}
	.zan .icon-gouzhua{
		color: #989BF9;
		font-size: 38upx;
		margin-right:2upx ;
	}
	.icon-keepsel{
		color: #989BF9;
		font-size: 42upx;
		margin-right:2upx ;
	}
	.icon-shoucang{
		font-size: 42upx;
		margin-right:2upx ;
	}
	.icon-huifu{
		font-size: 42upx;
		margin-right:2upx ;
	}
</style>