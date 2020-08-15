<template>
	<view class="index">
		<!-- #ifdef APP-PLUS -->
		<view class="status_bar">
			<view class="top_view"></view>
		</view>
		<!-- #endif -->
        <view class="flex__between search-box header top">
			<image src="/static/images/leftlogo.png" class="store_logo mt_10"></image>
			<view class="search_input">
				<navigator url="./list" hover-class="none">
					<view class="flex align-center search__item">
						<text class="fs_28 c_b3 jcicon jcicon-sousuo1"></text>
						<text class="fs_28 c_b3 ml_10">请输入关键字搜索</text>
					</view>
				</navigator>
			</view>
        </view>
        <view class="swiper-box">
			<swiper indicator-dots="true" autoplay="true" circular="true" indicator-active-color="#ffffff">
				<swiper-item v-for="(item,index) in renders.carousel" :key="index">
					<image :src="item.image" @click="getDetails(item.link_url)"></image>
				</swiper-item>
			</swiper>
        </view>
		<!-- 滑动分类 -->
        <view class="category-box">
			<swiper indicator-dots="true" indicator-active-color="#2e2e2e" :style="renders.category[0].length<6?'height:200rpx':'height:420rpx'">
				<swiper-item class="flex wrap" v-for="(item,index) in renders.category" :key="index">
					<navigator class="flex__between align-center column category__item" hover-class="none" v-for="(item1,index1) in item" :key="index1" 
					:url="'./list?first_category_id='+item1.id+'&second_category_id=0'">
					<!-- index1==0?'/pages/mall/prepare': -->
						<img :src="item1.cover_img" alt="">
						<span class="fs_14 c_4d">{{item1.name}}</span>
					</navigator>
				</swiper-item>
			</swiper>
        </view>
		<!-- 下拉分类 -->
		<view class="flex__between lh_40 c_33 bg_ff select_cate fs_28">
			<picker @change="setSort" :value="sort_list" :range="sort_list" range-key="name">
				<view class="lh_40">
					<span class="fs_30" :class="loads.style==0?'c_4d':'c_33'">{{loads.style==0?'默认':sort_list[sort_index].name}}</span>
					<span class="fs_30 jcicon jcicon-xiala2" :class="loads.category_id!=4?'c_33':'c_4d'"></span>
				</view>
			</picker>
			<picker @change="setSort2" :value="sort_list2" :range="sort_list2" range-key="name">
				<view class="lh_40">
					<span class="fs_30" :class="loads.score==0?'c_4d':'c_33'">{{loads.score==0?'星级':sort_list2[sort_index2].name}}</span>
					<span class="fs_30 jcicon jcicon-xiala2" :class="loads.score!=6?'c_33':'c_4d'"></span>
				</view>
			</picker>
			<view @click="changeStyle()">离我最近</view>
		</view>
        <!-- 商品列表 -->
        <view class="bg_ff ">
            <view class="flex__between wrap row-box">
				<navigator class="width-100p" v-for="(item,index) in list" :key="index" :url="'./detail?id='+item.id" hover-class="none">
					<view class="flex row__item">
						<img :src="item.cover_img" alt="">
						<view class="flex__null__around row__info">
							<text class="fs_30 c_1a lh_40 ellipsis_two" style="height:80upx;">{{item.name}}</text>
							<view class="flex__between c_66" style="font-size: 24upx;">
								<view class="flex__between fs_24">
								<text class="mr_5 no-shrink">评分</text>
								<text v-for="(item2,index2) in 5" :key="index2" class="iconfont icon-iospaw fs_34 ml_10" :class="item2<item.score?'c_pur':'c_ed'"></text></view>
								<view class="fs_24 no-shrink">距我{{item.distance||0}}km</view>
							</view>
						</view>
					</view>
				</navigator>
            </view>
        </view>
		<uni-load-more :status="load_status"></uni-load-more>
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
					category:[]
				},
				list:[],
				page:1,
				load_status: 'more',
				sort_index: 0,
				sort_list:[
				{id:2,name:'推荐'},
				{id:3,name:'上架时间'}],
				sort_index2: 0,
				sort_list2:[{ id:1,name:'一星'},
				{id:2,name:'二星'},
				{id:3,name:'三星'},{id:4,name:'四星'},{id:5,name:'五星'}],
				// loads:{category_id:'',score:1,lat:'39.623561',lng:'112.562356',keywords:'',style:0},
				loads:{category_id:'',score:'',lat:'',lng:'',keywords:'',style:''},
			}
		},
		components: {uniLoadMore},
		onLoad() {
			app.$vm.getData({
				url:'Collage/getIndexData',
				that: this,
				data: {},
				loading: 1
			}).then(res=>{
				let arr = [];
				for (var i = 0, j = res.data.category.length; i < j; i += 10) {
				    arr.push(res.data.category.slice(i, i + 10));
				}
				this.renders=res.data;
				this.renders.category = arr;
			});
			this.getLocation();
		},  
		onReachBottom(){
			this.loadList(2);
		},
		methods:{
			getLocation(){
				let that = this;
				uni.getLocation({
					type: 'wgs84', 
					success(res) {
						const latitude = res.latitude
						const longitude = res.longitude
						uni.setStorageSync('lat',res.latitude);
						uni.setStorageSync('lng',res.longitude);
						that.loads.lat = res.latitude;
						that.loads.lng = res.longitude;
						that.loadList(1);
					}
				})
			},
			//广告位跳转
			getDetails(url) {
				// if (url.indexOf("http") != -1) {
				// 	uni.navigateTo({
				// 		'url': '/pages/webView?url=' + url
				// 	})
				// } else {
					uni.navigateTo({
						'url': url
					})
				// }
			},
			// 排序方式()
			setSort(e){
				let index=e.detail.value;
			    this.sort_index=index;
			    this.loads.style=this.sort_list[index].id;
				this.loadList(1);
			},
			// 星级
			setSort2(e){
				let index=e.detail.value;
			    this.sort_index2=index;
			    this.loads.score=this.sort_list2[index].id;
				this.loadList(1);
			},
			// 离我最近
			changeStyle(){
				this.loads.style=1;
				this.loadList(1);
			},
			// 加载商品
			loadList(page){
				this.load_status='loading';
				app.$vm.getList({
					url:'Collage/getIndexList',
					that: this,
					data: this.loads,
					loading: 1,
					page
				}).then(res=>{
					if(res.code==1&&res.data.data_list.current_page==res.data.data_list.last_page||!res.data.data_list.total){
						this.load_status='noMore';
					}
				});
			}
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
	.store_logo{
		width: 270rpx;
		height:40upx;
	}
	.search_input{
		width: 300rpx;
		height:60upx;
		line-hright:60upx;
	}
</style>
<style scoped>
	.top{
		padding: 30upx 30upx 18upx ;
	}
	swiper {
		height: 300upx;
	}
.search__item{
    width: 302rpx;
    height: 60upx;
	border-radius: 33upx;
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
	height: 420upx;
}
.category-box swiper-item{
	padding-bottom: 70upx;
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
/* 商品 */
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
    width: 240upx;
    height: 180upx;
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

/* mine */
.bg_ff{
	background-color: #FFFFFF;
}
.select_cate{
	padding: 0upx 30upx;
}

/* 一行一个 */
.row-box{
	overflow: hidden;
	padding: 0 30upx 30upx;
	background: #fff;
}
.row__item{
	margin-top: 30upx;
}
.row__item img{
	width: 240upx;
	height: 180upx;
	border-radius: 10upx;
}
.row__info{
	flex: 1;
	margin-left: 30upx;
}
.iconfont.fs_34{
	font-size: 36upx!important;
	/* position: relative;
	top: 2upx; */
}
.width-100p{
	width: 100%;
}
.c_pur{
	color: #F889CE;
}
.c_ed{
	color: #ededed;
}
.ml_10{
	margin-left: 10upx;
}
.mr_5{
	margin-right: 5upx;
}
.no-shrink{
	flex-shrink: 0;
}
/* .c_main{
	color: ;
} */
</style>
