<template>
	<view class="index">
		<!-- #ifdef APP-PLUS -->
		<view class="status_bar">
			<view class="top_view"></view>
		</view>
		<!-- #endif -->
		<view class="top">
			<view class="logo"><image src="../../static/images/leftlogo.png" mode=""></image></view>
			<view class="flex__between__center  header">
				<navigator url="./search" hover-class="none">
					<view class="flex align-center search__item">
						<text class="fs_28 c_b3 jcicon jcicon-sousuo1"></text>
						<text class="fs_28 c_b3 ml_10">{{renders.search_content}}</text>
					</view>
				</navigator>
			</view>
		</view>

        <view class="swiper-box">
			<swiper class="swiperx" indicator-dots="true" autoplay="true" circular="true" indicator-active-color="#ffffff">
				<swiper-item v-for="(item,index) in renders.carousel" :key="index">
					<image :src="item.image" @click="getDetails(item.link_url)"></image>
				</swiper-item>
			</swiper>
        </view>
		<view class="unitcate">
			<image :src="renders.ad_cate[0].image" @click="go(1)" mode=""></image>
			<image :src="renders.ad_cate[1].image" @click="go(2)" mode=""></image>
		</view>
        <view class="category-box">
			<swiper :style="renders.category[0].length<6?'height:200rpx':'height:420rpx'">
				<swiper-item class="flex wrap" v-for="(item,index) in renders.category" :key="index">
					<navigator class="flex__between align-center column category__item" hover-class="none" v-for="(item1,index1) in item" :key="index1" 
					:url="index1==0?'/pages/mall/sort':'./list?second_category_id='+item1.id">
					<!-- './list?first_category_id='+item1.id+'&second_category_id=0' -->
						<img :src="item1.cover_img" alt="">
						<span class="fs_14 c_4d">{{item1.name}}</span>
					</navigator>
				</swiper-item>
			</swiper>
        </view>
		<!-- 广告 -->
        <div class="advert-box">
			<view @tap="getDetails(renders.ad_position_one[0].link_url)">
				<div class="ad_position_one">
					<img :src="renders.ad_position_one[0].image" alt="">
				</div>
			</view>
            <!-- 多个广告图 -->
            <div v-if="renders.ad_position_two.length==1">
				<view  @tap="getDetails(renders.ad_position_two[0].link_url)">
					<div class="img-box--one img-big">
						<img :src="renders.ad_position_two[0].image" alt="">
					</div>
				</view>
            </div>
            <div v-else-if="renders.ad_position_two.length==2">
                <div class="flex__between img-box--two img-middle">
					<view  @tap="getDetails(renders.ad_position_two[0].link_url)">
						<div>
							<img :src="renders.ad_position_two[0].image" alt="">
						</div>
					</view>
					<view  @tap="getDetails(renders.ad_position_two[1].link_url)">
						<div>
							<img :src="renders.ad_position_two[1].image" alt="">
						</div>
					</view>
                </div>
            </div>
			
            <div v-else>
                <div class="flex__between img-box--three">
					<view  @tap="getDetails(renders.ad_position_two[0].link_url)">
						<div class="img-middle">
							<img :src="renders.ad_position_two[0].image" alt="">
						</div>
					</view>
                    <div class="flex__null__between img-small">
						<view  @tap="getDetails(renders.ad_position_two[1].link_url)">
							<div>
								<img :src="renders.ad_position_two[1].image" alt="">
							</div>
						</view>
						<view  @tap="getDetails(renders.ad_position_two[2].link_url)">
							<div>
								<img :src="renders.ad_position_two[2].image" alt="">
							</div>
						</view>
                    </div>
                </div>
            </div>
        </div>
        <!-- 商品列表 -->
        <view class="sale-box">
            <view class="sale__title">
                <text class="fs_40 c_1a fw_500">精选商品</text>
                <text class="fs_24 c_b3" style="margin-left: 12upx;">精挑细选的好物带回家</text>
            </view>
            <view class="flex__between wrap">
				<navigator v-for="(item,index) in list" :key="index" :url="'./detail?id='+item.id" hover-class="none">
					<view class="sale__item">
						<image :src="item.cover_img"></image>
						<view class="flex__null__between sale__info">
							<view class="fs_28 c_1a lh_40 ellipsis_two">{{item.name}}</view>
							<view class="mt_10 lh_40">
								<text class="fs_26 " style="color: #989BF9;">¥</text>
								<text class="fs_30 " style="color: #989BF9;">{{item.price}}</text>
								<text class="fs_24 c_80 ml_10">已售{{item.sales}}</text>
							</view>
						</view>
					</view>
				</navigator>
            </view>
        </view>
		<uni-load-more :status="load_status"></uni-load-more>
		<!-- 浮层 -->
		<view class="modal" v-if="is_exit_coupon==1">
			<view class="coupons">
				<view class="hello">您好！初次见面</view>
				<view class="give">
					送您几张优惠券随便花花吧～
				</view>
				<view class="outer">
					<view class="ticket" v-for="(item,index) in coupon_list" :key='index'>
						<view class="moneys">
							<view>￥</view>
							<view>{{item.price}}</view>
						</view>
						<view style="flex: 1;margin-left: 20upx; color: ;">
							<view class="shopname">{{item.name}}</view>
							<view class="alls">· {{item.brief}}</view>
							<view class="useful">{{item.start_time}}~{{item.end_time}}</view>
						</view>
					</view>
				</view>
				<view class="closed icon-cha1 iconfont" @click="hidden"></view>
			</view>
		</view>
    </view>
</template>

<script>
	import {uniLoadMore} from '@dcloudio/uni-ui'
	const app=getApp();
	export default {
		data(){
			return{
				create_time:'',
				renders:{
					ad_position_one:[{}],
					ad_position_two:[{}]
				},
				list:[],
				page:1,
				load_status: 'more',
				is_exit_coupon:'',
				coupon_list:'',
			}
		},
		components: {uniLoadMore},
		onLoad() {
			app.$vm.getData({
				url:'home/getIndexData',
				that: this,
				data: {},
				loading: 1
			}).then(res=>{
				this.renders=res.data;
			});
			this.loadList(1);
		},  
		onReachBottom(){
			this.loadList(2);
		},
		methods:{
			go(type){
				uni.navigateTo({
					url:'./list?type='+type
				})
			},
			hidden(){
				this.is_exit_coupon=''
				console.log(this.is_exit_coupon)
			},
			//广告位跳转
			getDetails(url) {
				if (url.indexOf("http") != -1) {
					uni.navigateTo({
						'url': '/pages/webView?url=' + url
					})
				} else {
					uni.navigateTo({
						'url': url
					})
				}
			},
			// 加载商品
			loadList(page){
				this.load_status='loading';
				app.$vm.getList({
					url:'home/getIndexList',
					that: this,
					data: {},
					loading: 1,
					page
				}).then(res=>{
					if(res.code==1&&res.data.data_list.current_page==res.data.data_list.last_page||!res.data.data_list.total){
						this.load_status='noMore';
					}
				});
			}
		},onShow() {
			app.$vm.getData({
				url:'Home/getRegisterCoupon',
				that: this,
				data: {},
				loading: 1,
			}).then(res=>{
				if(res.code==1){
					this.is_exit_coupon=res.data.is_exit_coupon
					console.log(this.is_exit_coupon)
					if(res.data.coupon_list.length>0){
						this.coupon_list=res.data.coupon_list
					}
				}
			})
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
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: #fff;
		padding: 30upx 30upx 18upx ;
	}
	.logo{
		width: 270upx;
		height: 40upx;
	}
	.logo image{
		width: 100%;
		height: 40upx;
	}
	.header{
		height: 60upx;
		background: #fff;
	}
	.swiperx {
		height: 300upx;
	}
	.unitcate{
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 30upx;
		background: #FFFFFF;
	}
	.unitcate image{
		width: 330upx;
		height: 221upx;
		display: block;
	}
.search__item{
    /* width: 690upx; */
    height: 60upx;
	border-radius:33upx;
}
.swiper-box{
    padding: 10upx 30upx;
    background: #fff;
}
.swiper-box image{
    width:690upx;
    height:300upx;
    border-radius: 10upx;
}
.category-box{
    background: #fff;
}
.category-box swiper{
	/* height: 420upx; */
}
.category-box swiper-item{
	/* padding-bottom: 70upx; */
}
.category-box image{
    width: 90upx;
    height: 90upx;
    border-radius: 50%;
}
.category__item{
    width: 150upx;
    height: 140upx;
    margin-top: 30upx;
}
.category__item:nth-child(5n+1){
    margin-left: 0;
} 
/* 广告 */
.advert-box{
    margin-top: 15upx;
    padding: 15upx 30upx;
    background: #fff;
} 
.ad_position_one img{
    width: 690upx;
    height: 214upx;
}
/* 多类型广告 */
.img-box--one,.img-box--two,.img-box--three{
    margin-top: 15upx;
}
.img-big img{
    width: 690upx;
    height: 214upx;
}
.img-middle img{
    width: 340upx;
    height: 370upx;
}
.img-small img{
    width: 340upx;
    height: 180upx;
}
/* 商品 */
.sale-box{
    padding: 0 24upx;
}
.sale__title{
    padding: 40upx 0 0;
}
.sale__item{
    width: 340upx;
    margin-top: 20upx;
    background: #fff;
    border-radius: 10upx;
}
.sale__item image{
    width: 340upx;
    height: 340upx;
    border-radius: 10upx 10upx 0 0;
}
.sale__info{
	height: 180upx;
    padding: 20upx 10upx;
}
/* 独特颜色 */
.member-box{
    width: 60upx;
    height: 30upx;
    margin-left: 10upx;
    background: #1a1a1a;
    border-radius:5upx;
    line-height: 30upx;
    text-align: center;
}
.member-box span{
    color: #FCCC00;
    font-size: 18upx;
}
.modal{
	background:#646466;
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	display: flex;
	align-items: center;
	justify-content: center;
}
.coupons{
	width:600upx;
	/* height:420upx; */
	background:linear-gradient(90deg,rgba(208,164,245,1) 0%,rgba(255,175,220,1) 100%);
	border-radius:20upx;
	display: flex;
	align-items: center;
	flex-direction: column;
	position: relative;
}
.outer{
	height:500upx;
	overflow-y: scroll;
}
.hello{
	height:81upx;
	font-size:58upx;
	font-family:PingFangSC-Semibold,PingFang SC;
	font-weight:600;
	color:rgba(255,255,255,1);
	line-height:81upx;
	margin-top: 64upx;
}
.give{
	height:45upx;
	font-size:32upx;
	font-family:PingFangSC-Thin,PingFang SC;
	font-weight:100;
	color:rgba(255,255,255,1);
	line-height:45upx;
	margin-top: 5upx;
	margin-bottom: 32upx;
}
.ticket{
	width:520upx;
	padding: 25upx 0upx ;
	/* height:140upx; */
	background:rgba(255,255,255,1);
	margin-bottom: 15upx;
	display: flex;
	align-content: center;
	justify-content: center;
}
.moneys{
	display: flex;
	padding: 0 40upx;
	color: #F889CE;
	border-right: 1upx dotted #E6E6E6;
}
.moneys view:nth-child(1){
	height:28upx;
	font-size:24upx;
	font-family:DINAlternate-Bold,DINAlternate;
	font-weight:bold;
	color:rgba(248,137,206,1);
	line-height:28upx;
}
.moneys view:nth-child(2){
	height:73upx;
	font-size:56upx;
	font-family:DINAlternate-Bold,DINAlternate;
	font-weight:bold;
	color:rgba(248,137,206,1);
	line-height:73upx;
}
.shopname{
	height:40upx;
	font-size:28upx;
	font-family:PingFangSC-Regular,PingFang SC;
	font-weight:400;
	color:rgba(26,26,26,1);
	line-height:40upx;
	margin-bottom: 10upx;
}
.alls{
	height:28upx;
	font-size:20upx;
	font-family:PingFangSC-Regular,PingFang SC;
	font-weight:400;
	color:rgba(152,152,152,1);
	line-height:28upx;
}
.useful{
	height:28upx;
	font-size:20upx;
	font-family:PingFangSC-Regular,PingFang SC;
	font-weight:400;
	color:rgba(152,152,152,1);
	line-height:28upx;
}
	.closed{
		font-size: 24upx;
		color: #FFFFFF;
		position: absolute;
		bottom: -70upx;
		display: flex;
		border: 1upx solid #FFFFFF;
		border-radius: 50%;
		width: 50upx;
		height: 50upx;
		line-height:50upx;
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
