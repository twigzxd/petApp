<template>
	<view class="detail">
		<!-- #ifdef APP-PLUS -->
		<view class="status_bar">
			<view class="top_view"></view>
		</view>
		<!-- #endif -->
		<navigator open-type="navigateBack" class="back-box">
			<text class="iconfont icon-zuojiantou c_ff"></text>
		</navigator>
		<view class="swiper-box">
			<swiper indicator-dots="true" autoplay="true" circular="true" indicator-active-color="#ffffff">
				<swiper-item v-for="(item,index) in product.img_path" :key="index" @click="preImg(index)">
					<image :src="item"></image>
					<!-- <view class="numTitie">{{numNumber}}</view> -->
				</swiper-item>
			</swiper>
		</view>

		<!-- 商品信息 -->
		<view class="info-box">
			<p class="c_1a fs_34 lh_45 mt_20">{{product.name}}</p>
			<view class="mt_30 flex flex__between__center bb_ed pb_30">
				<view>
					<view class="fs_30 c_4d">{{product.work_time}}</view>
					<view class="fs_24 c_b3">营业时间</view>
				</view>
				<view>
					<view class="fs_30 c_4d mt_5">{{product.telephone}}</view>
					<view class="fs_24 c_b3 mt_5">联系电话</view>
				</view>
				<view class="icon_border ta_c" @click="makeCall()">
					<text class="iconfont c_3FDB99 icon-dianhua fs_44"></text>
				</view>
			</view>
			<view class="mt_30 lh_40 fs_26 c_4d" @click="openLocation()">
				<text class="iconfont icon-dingwei"></text>
				<text class="ml_10">{{product.address}}</text>
			</view>
		</view>

		<!-- 评价 modular-->
		<view class="mt_15 bg_ff pt_40 pb_20 p_lr_30" v-if="review.length">
			<!-- <view class="modular__title">
				<text class="fs_36 c_1a fw_500">商品评价</text>
				<text class="fs_30 c_80">（{{review_total}}）</text>
			</view> -->
			<view class="evaluate__item">
				<view class="flex item__header">
					<image :src="review[0].headimgurl" alt=""></image>
					<view class="flex__null__around ml_20 flex_1">
						<text class="fs_30 c_33 fw_bold">{{review[0].nickname}}</text>
						<view class="flex flex__between">
							<view>
								<text class="fs_24 c_1a">评分</text>
								<text v-for="(item2,index2) in 5" :key="index2" class="iconfont icon-iospaw fs_24 ml_10" :class="item2<review[0].star?'c_pur':'c_ed'"></text>
							</view>
							<text class="fs_24 c_98">{{review[0].create_time}}</text>
						</view>
					</view>
				</view>
				<p class="fs_30 c_1a mt_20 lh_40" v-if="review[0].content">{{review[0].content}}</p>
				<view class="flex wrap item__img mt_20" v-if="review[0].img_path.length">
					<image :src="item" alt="" v-for="(item,index) in review[0].img_path" :key="index" @click="previewImage(index)"></image>
				</view>
			</view>
			<navigator v-if="review.length" class="ta_c" :url="'./evaluateList?id='+product.id">
				<view v-if="review.length" class="ta_c modular__footer fs_28 c_1a">查看{{review_total}}条评论</view>
			</navigator>
			
		</view>
		
		<view v-else class="ta_c fs_28 c_1a bg_ff lh_100 mt_15">暂无评论</view>

		<!-- 详情 -->
		<view class="modular" v-if="product.description">
			<view class="modular__title">
				<text class="fs_36 c_1a fw_bold">详情</text>
			</view>
			<rich-text class="modular__content" :nodes="product.description"></rich-text>
		</view>

		<!-- 保障modal -->
		<view v-show="ensure_modal" class="ensure-box">
			<view class="layer" @click="ensure_modal=false"></view>
			<view class="ensure">
				<view class="ensure__content">
					<p class="flex__around fs_36 c_1a">服务保障</p>
					<view class="flex align-center ensure-item" v-for="(item,index) in attach" :key="index">
						<image :src="item.icon" alt=""></image>
						<view class="flex__null__between ensure-item__right">
							<text class="fs_28 c_4d">{{item.name}}</text>
							<text class="fs_22 c_b3">{{item.brief}}</text>
						</view>
					</view>
				</view>
				<button class="close-btn" @click="ensure_modal=false">关闭</button>
			</view>
		</view>
		<navigator class="footer ta_c fs_32 c_ff" :url="'./evaluate?id='+product.id">
			去评价
		</navigator>

		<!-- 置顶 -->
		<div class="back-top">
			<div class="flex__center__center menu__top" @click="goTop" v-show="scroll_check">
				<span class="jcicon jcicon-dingbu fs_40 c_main"></span>
			</div>
			<navigator url="/pages/mall/index" open-type="switchTab" hover-class="none">
				<div class="flex__center__center menu__bottom">
					<span class="jcicon jcicon-shouye fs_50 c_ff"></span>
				</div>
			</navigator>
		</div>
	</view>
</template>
<script>
	const app = getApp();
	export default {
		name: 'Detail',
		data() {
			return {
				screenHeight: 0,
				imgLength: 0,
				imgShow: false,
				numNumber:'',
				scroll_check: false, //置顶按钮
				is_top: {
					value: false
				},
				product: {
					img_path: []
				},
				review_total: 0,
				review: [],
				is_collect: 0,
				orders: {
					number: 1,
					settlement_type: 1,
					product_id: '',
					sku: ''
				},
				show: false, //规格modal
				sku_name: '请选择',
				sku_arr: [], //选中规格id数组
				
				id:'',
			}
		},
		methods: {
			//图片放大
			// swpierChange(e) {
			// 	console.log(e)
			// 	this.index = e.detail.current;
			// 	this.numNumber = e.detail.current + 1 + '/' + this.imgLength
			// },
			// 拨打电话
			makeCall(){
				uni.makePhoneCall({
					phoneNumber: this.product.telephone
				});
			},
			openLocation(){
				let that = this;
				// uni.authorize({
				// 	scope: 'scope.userLocation',
				// 	success() {
						uni.getLocation({
							type: 'wgs84', 
							success(res) {
								const latitude = res.latitude
								const longitude = res.longitude
								uni.openLocation({
									latitude: Number(that.product.lat),
									longitude: Number(that.product.lng),
									address:that.product.address,
									success: function () {
										console.log('success');
									}
								});
							}
						})
				// 	}
				// })
			},
			preImg(index) {
				if (this.imgShow) { //防止点击过快导致重复调用 
					return;
				}
				this.imgShow = true;
				setTimeout(() => {
					this.imgShow = false;
				}, 1000)
				setTimeout(() => {
					uni.previewImage({
						current: this.product.img_path[index],
						urls: this.product.img_path
					})
				}, 150)
			},
			// 分享
			share(){ 
				const _this=this;
				uni.share({
					provider: "weixin",
					scene: "WXSceneSession", 
					type: 0,
					href: 'www.baidu.com',
					title: _this.product.name,
					imageUrl: _this.product.img_path[0],
					success: function (res) {
						console.log("success:" + JSON.stringify(res));
					},
					fail: function (err) {
						console.log("fail:" + JSON.stringify(err));
					}
                });
			},
			// 置顶
			onPageScroll(e) {
				if (e.scrollTop > 1000) {
					this.scroll_check=true;
				} else {
					this.scroll_check=false;
				}
			},
			goTop() {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				});
			},
			// 收藏
			collect() {
				app.$vm.getData({
					url: 'Mall/submitCollect',
					that: this,
					data: {
						product_id: this.product.id,
						source: 1
					},
					loading: 1
				}).then(res => {
					uni.showToast({
						title: res.message,
						icon: 'none'
					});
					if (res.code == 1 && res.message == '收藏成功') {
						this.is_collect = 1;
					} else if (res.code == 1 && res.message == '取消收藏成功') {
						this.is_collect = 0;
					}
				})
			},
			
			
			// 对象深度克隆 
			cloneObj(obj) {
				let str, newobj = obj.constructor === Array ? [] : {};
				if (typeof obj !== 'object') {
					return;
				} else if (JSON) {
					str = JSON.stringify(obj), //序列化对象
						newobj = JSON.parse(str); //还原
				} else { //如果不支持以上方法
					for (let i in obj) {
						newobj[i] = typeof obj[i] === 'object' ? this.cloneObj(obj[i]) : obj[i];
					}
				}
				return newobj;
			},
			
			// 查看大图
			previewImage(index) {
				uni.previewImage({
					current: index,
					urls: this.review[0].img_path,
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
			}
		},
		onLoad(options) {
			this.id = options.id;	
		},
		onShow(){
			const _this=this;
			app.$vm.getData({
				url: 'Collage/getProductDetailData',
				that: this,
				data: {
					product_id: this.id,
				},
				loading: 1
			}).then(res => {
				if (res.code == 1) {
					this.orders.product_id = res.data.product.id;
					this.product_sku = res.data.product_sku;
					this.product = res.data.product;
					this.product_vic = this.cloneObj(res.data.product);
					
					this.imgLength = this.product.img_path.length;
					this.numNumber = "1/" + this.imgLength
					
					this.review_total = res.data.review_total;
					this.review = res.data.review;
					this.product.description = res.data.product.description.replace(/\<img/gi,
						'<img style="max-width:100%;height:auto" ');
				} else {
					uni.showToast({
						title: res.message,
						icon: 'none'
					})
				}
			});
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
	.back-box{
		position: fixed;
		top: 70upx;
		left: 30upx;
		z-index: 999;
		width: 50upx;
		height: 50upx;
		border-radius: 50%;
		text-align: center;
		line-height: 50upx;
		background: rgba(0,0,0,.5);
	}
	.swiper-box{
		width: 100%;
	}
	.numTitie{
		position: absolute;
		bottom:100upx;
		right:50upx;
		z-index: 100;
	}
	.swiper-box image {
		width: 750upx;
		height: 690upx;
	}

	.swiper-box swiper {
		width: 100%;
		height: 690upx;
	}

	.info-box {
		position: relative;
		padding: 25upx 30upx 25upx;
		background: #fff;
	}

	.publicity {
		height: 80upx;
		padding: 0 30upx;
		border-top: 2upx solid #e6e6e6;
		background: #fff;
	}

	.share-box {
		position: absolute;
		bottom: 25upx;
		right: 0;
		padding: 0 20upx;
		height: 40upx;
		line-height: 40upx;
		border-radius: 20upx 0 0 20upx;
		background: #f0f0f0;
	}

	/* 模块 */
	.modular {
		margin-top: 15upx;
		padding: 0 30upx 0;
		background: #fff;
		padding-bottom:30upx ;
	}

	.modular__title {
		padding: 30upx 0;
	}

	.modular__content {
		/* padding-bottom: 30upx; */
	}

	.evaluate__item {
		padding-bottom: 30upx;
	}

	.item__header image {
		width: 80upx;
		height: 80upx;
		border-radius: 50%;
	}

	.item__img image {
		width: 165upx;
		height: 165upx;
		margin: 10upx 0 0 10upx;
	}

	.item__img image:nth-child(4n+1) {
		margin-left: 0;
	}

	.item__reply {
		padding: 10upx 20upx;
		background: #f5f5f5;
		border-radius: 10upx;
	}

	.modular__footer {
		height: 60upx;
		line-height: 60upx;
		padding: 0upx 40upx;
		border-radius:30px;
		border:1px solid rgba(230,230,230,1);
		margin-top: 22upx;
		display: inline-block;
		/* border-top: 2upx solid #e6e6e6; */
	}

	.null-box {
		border-top: 2upx solid #e6e6e6;
		height: 90upx;
	}

	/* modal */
	.layer {
		position: fixed;
		top: 0;
		bottom: 0;
		width: 100%;
		background: rgba(0, 0, 0, 0.6);
		z-index: 2;
	}

	.ensure {
		position: fixed;
		bottom: 0;
		width: 100%;
		height: auto;
		z-index: 3;
		background: #fff;
	}

	.ensure__content {
		padding: 30upx;
	}

	.ensure-item {
		height: 130upx;
		border-top: 2upx solid #e6e6e6;
	}

	.ensure-item:nth-child(2) {
		border: 0;
	}

	.ensure-item image {
		width: 60upx;
		height: 60upx;
		border-radius: 50%;
	}

	.ensure-item__right {
		height: 60upx;
		margin-left: 20upx;
	}

	.close-btn {
		width: 100%;
		height: 98upx;
		background: #F93A42;
		color: #fff;
		font-size: 32upx;
	}

	.footer {
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 98upx;
		line-height: 98upx;
		z-index: 1;
		background:linear-gradient(90deg,rgba(208,164,245,1) 0%,rgba(255,175,220,1) 100%);
		box-shadow:0upx 6upx 8upx 0upx rgba(204,132,255,0.24);
	}

	.footer__left {
		width: 100%;
		padding: 0 30upx;
		background: #fff;
		border-top: 2upx solid #e6e6e6;
	}

	.footer__right button:first-child {
		width: 280upx;
		height: 98upx;
		background: #F93A42;
		font-size: 32upx;
		color: #fff;
		line-height: 98upx;
	}

	.footer__right button:last-child {
		width: 260upx;
		height: 98upx;
		background: #1a1a1a;
		font-size: 32upx;
		color: #fff;
		line-height: 98upx;
	}

	/* 规格model */
	.model {
		position: fixed;
		bottom: 0;
		z-index: 3;
		width: 100%;
		background: #fff;
	}

	.model__info {
		display: flex;
		padding: 30upx 30upx 0;
	}

	.model__info image {
		display: block;
		width: 220upx;
		height: 220upx;
		margin-top: -60upx;
		border: 2upx solid #E6E6E6;
		border-radius: 10upx;
		background: #fff;
	}

	.model__info__right {
		width: 440upx;
		margin-left: 30upx;
	}

	.size-table {
		width: 120upx;
		height: 30upx;
		background: #1a1a1a;
		line-height: 30upx;
	}

	.model__spec-box {
		max-height: 700upx;
		padding: 0 30upx;
		margin: 10upx 0;
		overflow: auto;
	}

	.model__spec {
		padding: 30upx 0;
		border-bottom: 2upx solid #e6e6e6;
	}

	.model__spec__item {
		min-width: 60upx;
		margin: 20upx 20upx 0 0;
		padding: 0 20upx;
		height: 60upx;
		line-height: 56upx;
		text-align: center;
		font-size: 26upx;
		color: #989898;
		border: 2upx solid #CBCBCB;
		border-radius: 6upx;
	}

	.active {
		color: #F93A42;
		border: 2upx solid #F93A42;
	}

	.actives {
		background: #e8e8e8;
		color: #c8c9cc;
		border: none;
	}

	.model__num {
		height: 120upx;
	}

	/* 计步器 */
	.stepper_components {
		display: flex;
		justify-content: space-between;
		width: 200upx;
		border: 2upx solid #e6e6e6;
	}

	.stepper_components .count {
		width: 66upx;
		height: 60upx;
		line-height: 60upx;
		text-align: center;
	}

	.stepper_components .count--big {
		width: 85upx;
		height: 60upx;
		border-right: 2upx solid #e6e6e6;
		border-left: 2upx solid #e6e6e6;
		text-align: center;
	}

	.model__footer button {
		width: 100%;
		height: 98upx;
		line-height: 98upx;
		font-size: 32upx;
		background: #F93A42;
		color: #fff;
	}

	/* 置顶 */
	.back-top {
		position: fixed;
		right: 10upx;
		bottom: 140upx;
	}

	.menu__top {
		width: 80upx;
		height: 80upx;
		border-radius: 50%;
		background: #fff;
		box-shadow: 0px 5upx 13upx 0px rgba(191, 191, 191, 0.5);
	}

	.menu__bottom {
		width: 80upx;
		height: 80upx;
		margin-top: 20upx;
		border-radius: 50%;
		background: rgba(0, 0, 0, 0.6);
		box-shadow: 0px 5upx 13upx 0px rgba(191, 191, 191, 0.5);
	}
	.icon_border{
		width:90upx;
		height:90upx;
		line-height: 90upx;
		background:rgba(255,255,255,1);
		box-shadow:0upx 2upx 50upx 0upx rgba(0,0,0,0.04);
		border:1upx solid rgba(237,237,237,1);
		border-radius: 50%;
	}
	.icon_border .iconfont{
		font-size: 44upx!important;
	}
	.iconfont.fs_24{
		font-size: 36upx!important;
		position: relative;
		top: 2upx;
	}
	.width-100p{
		width: 100%;
	}
</style>
