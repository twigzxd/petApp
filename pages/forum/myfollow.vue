<template>
	<view class="container">
		<view class="p_lr_30 item flex__between align-center" v-for="(item,index) in list" :key="index">
			<view class="flex align-center">
				<image :src="item.avatar" class="img_70"></image>
				<view class="c_1a fs_28">{{item.nickname}}</view>
			</view>
			<!-- // 0互相不关注 1我关注了她 2他关注了我 3互关 -->
			<button class="fs_26" @click="memberInter(item.id,item.follow,index)" :class="item.follow==0||item.follow==2?'colors_btn c_ff':'grey_btn c_98'">{{item.follow==1?'已关注':item.follow==3?'互相关注':'+关注'}}</button>
		</view>
	</view>
</template>

<script>
	import {uniLoadMore} from '@dcloudio/uni-ui'
	const app=getApp();
	export default {
		data(){
			return{
				list:[],
				loads:{
					info_id:'',
					type:''
				}
			}
		},
		methods:{
			loadList(page){
				app.$vm.getList({
					url:'News/followList',
					that: this,
					data: this.loads,
					loading: 1,
					page
				});
			},
			// 关注与取关
			memberInter(id,follow,index){
				// 0互相不关注 1我关注了她 2他关注了我 3互关
				if(follow==0||follow==2){//加关注
					app.$vm.getData({
						url: 'News/memberInter',
						that: this,
						data: {info_id:id},
						loading: 1
					}).then(res => {
						if (res.code == 1) {
							uni.showToast({title: res.message,icon: 'none'})
							this.list[index].follow = res.data.is_follow
							// this.loadList(1);
						} else {
							uni.showToast({title: res.message,icon: 'none'})
						}  
					});
				}else{//取消关注
					app.$vm.getData({
						url: 'News/removememberInter',
						that: this,
						data: {info_id:id},
						loading: 1
					}).then(res => {
						if (res.code == 1) { 
							uni.showToast({title: res.message,icon: 'none'})
							this.list[index].follow = res.data.is_follow
						} else {
							uni.showToast({title: res.message,icon: 'none'})
						}  
					});
				}
			},
		},
		onLoad(options){
			console.log(options);
			this.loads.type = options.type;
			this.loads.info_id = options.info_id;
			this.loadList(1);
		}
	}
</script>

<style scoped>
	.container{
		background-color: #fff;
		min-height: 100vh;
	}
	.item{
		height: 140upx;
		height: 140upx;
		border-bottom: 1upx solid #EDEDED;
	}
	/* .item:last-child{
		border-bottom-width: 0upx;
	} */
	.colors_btn{
		width: 140upx;
	}
	.img_70{
		width: 70upx;
		height: 70upx;
		border-radius: 50%;
		margin-right: 25upx;
		flex-shrink: 0;
	}
</style>
