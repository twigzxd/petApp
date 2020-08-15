<template>
	<view class="container">
		<!-- 头部 -->
		<view class="ta_c info bb_ed">
			<image class="main_header" :src='info.avatar'></image>
			<view class="lh_45 mt_15 fs_36 c_00">{{info.nickname}}</view>
			<view class="c_b3 fs_24 lh_40 mt_15 align-center">
				<text>{{info.sex}}</text>
				<text class="gap"></text>
				<text>{{info.age}}<text v-if="info.age!='未知'">岁</text></text>
			</view>
			<view class="flex__around__center mt_50">
				<view @click="toFollow(1)">
					<view class="c_00 fs_28">{{all.follow}}</view>
					<view class="c_b3 fs_28">关注</view>
				</view>
				<view @click="toFollow(2)">
					<view class="c_00 fs_28">{{all.fans}}</view>
					<view class="c_b3 fs_28">粉丝</view>
				</view>
				<view>
					<view class="c_00 fs_28">{{all.new_count}}</view>
					<view class="c_b3 fs_28">话题</view>
				</view>
			</view>
			 <!-- v-if="id!=localStorage.getItem('user_id')" -->
			<button class="ta_c mt_50 fs_28" style="display: inline-block;" @click="memberInter()" :class="all.is_follow==0||all.is_follow==2?'colors_btn c_ff':'grey_btn c_98'">{{all.is_follow==1||all.is_follow==3?'已关注':'+关注'}}</button>
		</view>
		<!-- 发布的话题 -->
		<view class="">
			<view class="mt_30 c_1a lh_45 fw_bold fs_32 p_lr_30">发布的话题</view>
			<view class="mt_25 bb_ed p_lr_30" v-for="(item,index) in list" :key="index">
				<view class="flex align-center">
					<image class="little_header" :src='item.avatar'></image>
					<view class="ml_20">
						<view class="c_66 fs_26">{{item.nickname}}</view>
						<view class="c_A4A9B3 fs_22 mt_5">{{item.create_time}}</view>
					</view>
				</view>
				<view class="mt_25 lh_40">{{item.content}}</view>
				<view class="mt_30 flex wrap">
					 <!-- style="width: 100%; " -->
					<video v-if="item.is_has_video==1" :src="item.video_url" autoplay @statechange="statechange" style="width: 220upx;height: 220upx;" class="show_img"></video>
					<image class="show_img" v-for="(item2,index2) in item.img_path" :src="item2" @click="previewImage(index,index2)"></image>
					<!-- <image class="show_img" src="../../static/images/a1.jpg"></image>p
					<image class="show_img" src="../../static/images/a1.jpg"></image>
					<image class="show_img" src="../../static/images/a1.jpg"></image> -->
				</view>
				<view class="flex__around__center align-center lh_60">
					<view class="align-center" @click="Praise(item.praise_count,item.id,index)">
						<text class="iconfont" :class="item.praise_count?'c_pur icon-gouzhua':'c_f5 icon-claws'"></text>
						<text class="ml_10 fs_22 c_1a">{{item.praise_num}}</text>
					</view>
					<view class="align-center"  @click="Collect(item.collect_is,item.id,index)">
						<text class="iconfont fs_36" :class="item.collect_is?'c_pur icon-xingxing':'c_f5 icon-shoucang'"></text>
						<text class="ml_10 fs_22 c_1a">{{item.collect_count}}</text>
					</view>
					<view class="align-center" @click="toDetail(item.id)">
						<text class="iconfont icon-huifu"></text>
						<text class="ml_10 fs_22 c_1a">{{item.review_count}}</text>
					</view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import {uiniLoadMore} from '@dcloudio/uni-ui'
	const app=getApp();
	export default {
		data(){
			return{
				all:{},
				info:{},
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
			// 查看大图
			previewImage(index,index2) {
				uni.previewImage({
					current: index2,
					urls: this.list[index].img_path,
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏'],
						success: function(res) {
							console.log('选中了第' + (res.tapIndex + 1) + '个按钮');
						},
						fail: function(res) {
							console.log(res.errMsg);
						}
					}
				});
			},
			toFollow(type){
				uni.navigateTo({
					url:'./myfollow?type='+type+'&info_id='+this.loads.info_id
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
			// 关注与取关
			memberInter(){
				// console.log(this.info);
				// return false;
				// 0互相不关注 1我关注了她 2他关注了我 3互关
				if(this.all.is_follow==0||this.all.is_follow==2){//加关注
					app.$vm.getData({
						url: 'News/memberInter',
						that: this,
						data: {info_id:this.loads.info_id},
						loading: 1
					}).then(res => {
						if (res.code == 1) {
							uni.showToast({title: res.message,icon: 'none'})
							this.loadDetail();
						} else {
							uni.showToast({title: res.message,icon: 'none'})
						}  
					});
				}else{//取消关注
					app.$vm.getData({
						url: 'News/removememberInter',
						that: this,
						data: {info_id:this.loads.info_id},
						loading: 1
					}).then(res => {
						if (res.code == 1) { 
							uni.showToast({title: res.message,icon: 'none'})
							this.loadDetail();
						} else {
							uni.showToast({title: res.message,icon: 'none'})
						}  
					});
				}
			},
			// 点赞
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
			},
			// 收藏
			Collect(flag,id,index){ 
				if(flag){//收藏了（取消收藏
					app.$vm.getData({
						url: 'News/collectCancel',
						that: this,
						data: {news_id: id},
						loading: 1
					}).then(res => {
						if (res.code == 1) {
							uni.showToast({title: res.message,icon: 'none'});
							this.list[index].collect_is = 0;
							this.list[index].collect_count -= 1;
						} else {
							uni.showToast({title: res.message,icon: 'none'});
						}
					});
				}else{//未收藏（收藏操作
					app.$vm.getData({
						url: 'News/newsCollect',
						that: this,
						data: {news_id: id},
						loading: 1
					}).then(res => {
						if (res.code == 1) {
							uni.showToast({title: res.message,icon: 'none'});
							this.list[index].collect_is = 1;
							this.list[index].collect_count += 1;
						} else {
							uni.showToast({title: res.message,icon: 'none'});
						}
					});
				}
			},
			// 评论
			toDetail(id){
				console.log(id);
				uni.navigateTo({
					url:"./detail?id="+id
				})
			},
			loadDetail(){
				app.$vm.getData({
					url: 'News/getMemberInfo',
					that: this,
					data: {
						info_id: this.loads.info_id,
					},
					loading: 1
				}).then(res => {
					if (res.code == 1) {
						this.info = res.data.info;
						this.all = res.data;
					} else {
						uni.showToast({
							title: res.message,
							icon: 'none'
						})
					}
				});
			}
		},
		onLoad(options){
			this.loads.info_id = options.id;
			this.loadDetail();
			this.loadList(1);
		},
		onReachBottom(){
			this.loadList(2);
		},
	}
</script>

<style scoped>
	.container{
		background-color: #fff;
		min-height: 100vh;
	}
	.info{
		padding: 50upx 30upx 45upx;
	}
	.main_header{
		width: 170upx;
		height: 170upx;
		border-radius: 50%;
	}
	.gap{
		width: 1upx;
		height: 20upx;
		background-color: #b3b3b3;
		margin: 0upx 10upx;
	}
	.c_A4A9B3{
		color: #A4A9B3;
	}
	.little_header{
		width:70upx;
		height:70upx;
		border-radius: 50%;
	}
	.show_img{
		width: 220upx;
		height: 220upx;
		margin-right: 15upx;
		margin-bottom: 20upx;
	}
	.wrap .show_img:nth-child(3n){
		margin-right: 0upx;
	}
	.lh_60 .iconfont{
		font-size: 42upx;
		position: relative;
		top:7upx;
	}
	.iconfont.fs_44{
		font-size: 44upx;
	}	
	.iconfont.fs_36{
		font-size: 36upx;
	}
</style>