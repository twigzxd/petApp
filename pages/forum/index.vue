<template>
	<view>
		<!-- #ifdef APP-PLUS -->
		<view class="status_bar">
			<view class="top_view"></view>
		</view>
		<!-- #endif -->
		<view class="flex__between align-center top">
			<text class="iconfont icon-search flex__end self-end" @click="toSearch"></text>
			<view class="flex__center__center nav ta_c">
				<!-- -->
				<view class="nav_item" :class="active==0?'fs_40 c_1a fw_bold':'fs_34 c_66'"  @click="changeActive(0)">热门</view>
				<view class="gap"></view>
				<view class="nav_item" :class="active==1?'fs_40 c_1a fw_bold':'fs_34 c_66'"  @click="changeActive(1)">关注</view>	
			</view>
			<view class="add_btn ta_c" @click="addRelease()"><text class="c_ff iconfont icon-jiahao fs_40"></text></view>
		</view>
	
		<!-- pubuliu -->
		<!-- //最外层容器 -->
		<view class="page_no_data" v-if="list.length==0"></view>
		<view class="container" v-if="list.length!=0"> 
			<view class="item bg_ff" v-for="(item,index) in list" :key="index" style="z-index:2!important;">
				<!--   -->
				<video v-if="item.is_has_video==1&&item.video_url" :src="item.video_url" autoplay @statechange="statechange" style="width: 100%;" @click="toDetail" v-bind:id="item.id"></video>
				<image v-if="item.is_has_video==0&&item.cover_img"  class="topic_img" mode="widthFix" :src='item.cover_img' @click="toDetail" v-bind:id="item.id"></image>
				<view class="line-35 mt_15 fs_20 c_1a p_lr_20 ellipsis_two" :class="!item.cover_img&&!item.video_url?'padding-top-20':''" @click="toDetail" v-bind:id="item.id">{{item.name}}</view>
				<view class="line-30 mt_15 c_topic fs_20 p_lr_20 flex">
					<view class="flex" v-for="(item2,index2) in item.caterelation" :key="index2">
						<view class="label_items" v-for="(item3,index4) in item2.cate" :key="index3"  @click="toTopic" v-bind:id="item3.id">#{{item3.name}}#</view>
					</view>
				</view>
				<view class="flex__between p_lr_20">
					<view class="flex mt_25" @click="toHomepage" v-bind:id="item.user_id">
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
            active:0,
			list:[],
			loads:{
				category_id:'',//标签ID
				keyword:'',//关键字搜索
				type:0,//0正常列表 1关注列表
				info_id:''//用户suer_,d，44个人主页话题时传
			},
        }
    },
    methods:{
		toSearch(){
			uni.navigateTo({
				url:"./pages/mall/search"
			})
		},
		changeActive(index){
			this.active = index;
			this.loads.type = index;
			this.loadList(1);
		},
		toTopic(e){
			console.log(e.target);
			uni.navigateTo({
				url:"./topic?id="+e.target.id
			})
		},
		toDetail(e){
			uni.navigateTo({
				url:"./detail?id="+e.target.id
			})
		},
		toHomepage(e){
			let id = e.currentTarget.id;
			uni.navigateTo({
				url:"./homepage?id="+id
			})
		},
		addRelease(){
			uni.navigateTo({
				url:"./release"
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
        	}).then(res => {
				if (res.code == 1) {
					uni.stopPullDownRefresh();
				}
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
    onShow(){
        this.loadList(1); 
    },
    onHide(){
        
    },
	onPullDownRefresh(){
		this.loadList(1);
	}
}
</script>
<style lang="scss" scoped>
	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
		background-color: #fff;
	}
	
	.top_view {
		height: var(--status-bar-height);
		width: 100%;
		position: fixed;
		background-color: #fff;
		top: 0;
		z-index: 999;
	}
</style>
<style scoped>
	.top{
		padding: 30upx 30upx 18upx ;
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
	.add_btn{
		/* position: fixed;
		bottom: 25upx;
		right: 12upx; */
		width:60upx;
		height:60upx;
		line-height:60upx;
		border-radius: 50%;
		background:linear-gradient(47deg,rgba(208,164,245,1) 0%,rgba(255,175,220,1) 100%);
		box-shadow:0px 6upx 8upx 0upx rgba(204,132,255,0.24);
	}
	.fs_40.iconfont{
		font-size: 40upx;
	}
	.icon-search{
		/* display: inline;
		float: right;
		position: relative;
		top: -66upx;
		right: 35upx; */
	}	
	.page_no_data{
		width:100%;
		height: 90upx;
		line-height: 90upx;
		text-align: center;
		color: #b3b3b3;
		font-size: 26upx;
		margin-top:10upx;
	}
	.page_no_data:after{
		content:'暂无数据~'
	}
	.padding-top-20{
		padding-top: 20upx;
	}
</style>
