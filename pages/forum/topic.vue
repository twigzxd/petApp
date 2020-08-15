<template>
	<view>
		<!-- #ifdef APP-PLUS -->
		<view class="status_bar">
			<view class="top_view"></view>
		</view>
		<!-- #endif -->
		<!-- pubuliu -->
		<!-- //最外层容器 -->
		<view class="container top"> 
			<view class="item bg_ff" v-for="(item,index) in list" :key="index">
				 <!-- @error="error" -->
				<video v-if="item.is_has_video==1" :src="item.video_url" autoplay @statechange="statechange" style="width: 100%;" @click="toDetail(item.id)"></video>
				<image v-if="item.is_has_video==0"  class="topic_img" mode="widthFix" :src='item.cover_img' @click="toDetail(item.id)"></image>
				<view class="line-35 mt_15 fs_20 c_1a p_lr_20 ellipsis_two"  @click="toDetail(item.id)">{{item.name}}</view>
				<view class="line-30 mt_15 c_topic fs_20 p_lr_20 flex">
					<view class="flex" v-for="(item2,index2) in item.caterelation" :key="index2">
						<view class="label_items" v-for="(item3,index4) in item2.cate" :key="index3">#{{item3.name}}#</view>
					</view>
				</view>
				<view class="flex__between p_lr_20">
					<view class="flex mt_25" @click="toHomepage(item.user_id)">
						<image class="header_img" :src="item.avatar"></image>
						<view class="ml_10 fs_20 c_4d">{{item.nickname}}</view>
					</view>
					<view class="ta_c">
						<text @click="Praise(item.praise_count,item.id,index)" class="iconfont" :class="item.praise_count?'c_pur icon-gouzhua':'c_f5 icon-claws'"></text>
						<view class="fs_16 c_b2 p_re_3">{{item.praise_num}}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
const app=getApp();
export default {
    name:'List',
    data(){
        return{
			list:[],
			loads:{
				category_id:'',//标签ID
				keyword:'',//关键字搜索
				type:0,//0正常列表 1关注列表
				info_id:''//用户suer_,d，44个人主页话题时传
			}
        }
    },
    methods:{
		// toTopic(id){
		// 	uni.navigateTo({
		// 		url:"./topic"
		// 	})
		// },
		toDetail(id){
			uni.navigateTo({
				url:"./detail?id="+id
			})
		},
		toHomepage(id){
			// let id = e.currentTarget.id;
			uni.navigateTo({
				url:"./homepage?id="+id
			})
		},
        // 加载商品
        loadList(page){
        	app.$vm.getList({
        		url:'News/getNewsList',
        		that: this,
        		data: this.loads,
        		loading: 1,
        		page
        	});
        },
		Praise(flag,id,index){
			if(flag){//点赞了（取消点赞
				app.$vm.getData({
					url: 'News/RemoveNewsPraise',
					that: this,
					data: {news_id: id},
					loading: 1
				}).then(res => {
					if (res.code == 1) {
						uni.showToast({title: res.message,icon: 'none'});
						this.list[index].praise_count = 0;
						this.list[index].praise_num -= 1;
					} else {
						uni.showToast({title: res.message,icon: 'none'});
					}
				});
			}else{//未点赞（点赞操作
				app.$vm.getData({
					url: 'News/newsPraise',
					that: this,
					data: {news_id: id},
					loading: 1
				}).then(res => {
					if (res.code == 1) {
						uni.showToast({title: res.message,icon: 'none'});
						this.list[index].praise_count = 1;
						this.list[index].praise_num += 1;
					} else {
						uni.showToast({title: res.message,icon: 'none'});
					}
				});
			}
		}
    },
	onReachBottom(){
		this.loadList(2);
	},
    onLoad(options){
		// console.log(options);
		this.loads.category_id = options.id
        this.loadList(1);
    },
    onHide(){
        
    }
}
</script>
<style scoped>
	.top{
		/* padding: 30upx 30upx 18upx ; */
	}
	.nav_item{
		
	}
	.gap{
		margin: 13upx 35upx;
		width: 1upx;
		height: 30upx;
		background-color: #E6E6E6;
	}
	.nav_item:first-child{
		
	}
	.container {
	    column-count: 2;
	    column-gap: 20upx;
		margin: 15upx;
	}
	.p_lr_20{
		padding-left:20upx;
		padding-right: 20upx;
	}
	.item{
	    break-inside: avoid;
		padding-bottom: 20upx;
		margin-bottom: 20upx;
		overflow: hidden;
	}
	.item .topic_img{
		width:350upx;
	}
	.line-35{
		line-height:35upx;
	}
	.line-30{
		line-height:30upx;
	}
	.c_topic{
		color: #989BF9;
	}
	.header_img{
		width: 32upx;
		height: 32upx;
		border-radius: 32upx;
	}
	.fs_16{
		font-size: 16upx;
	}
	.p_re_3{
		position: relative;
		left: -3upx;
	}
	.label_items{
		margin-right: 5upx;
	}
</style>


