<template>
	<view class="order">
		<navigator url="../address/index" hover-class="none">
			<view class="flex__between__center header">
				<view class="flex__column" v-if="orders.linkman">
					<text class="fs_34 c_1a lh_50">{{orders.linkman}}&emsp;{{orders.mobile_phone}}</text>
					<text class="fs_28 c_80 lh_40">{{orders.country}}{{orders.province}}{{orders.city}}{{orders.address}}</text>
				</view>
				<text v-else class="fs_28 c_ 80 lh_40">请选择地址</text>
				<text class="jcicon jcicon-jiantouarrow487 fs_26 c_98"></text>
			</view>
		</navigator>
		<view class="sale-box">
			<view class="flex sale__item" v-for="(item,index) in cart_product" :key="index">
				<image :src="item.cover_img" alt=""></image>
				<view class="flex__null__around sale__item__right">
					<text class="fs_26 c_1a lh_36 ellipsis_two">{{item.name}}</text>
					<text class="fs_22 c_98" v-if="item.product_sku">规格: {{item.product_sku_name}}</text>
					<view class="flex__between">
						<text class="fs_30 c_98b"><text class="fs_22">¥</text>{{item.price}}</text>
						<text class="fs_26 c_80">x{{item.number}}</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 附带信息 -->
		<view class="modular-box">
			<view class="flex__between__center modular__item">
				<text class="fs_28 c_1a">商品合计</text>
				<text class="fs_30 c_98b"><text class="fs_22">¥</text>{{goods_amount}}</text>
			</view>
			<view class="flex__between__center modular__item">
				<text class="fs_28 c_1a">运费</text>
				<text class="fs_28 c_4d" v-if="freight">{{freight}}</text>
				<text class="fs_28 c_4d" v-else>{{freight_name}}</text>
			</view>
			<view class="flex__between__center modular__item">
				<text class="fs_28 c_1a">优惠券</text>
				<view class="lh_40" @click="selectCoupon">
					<text class="fs_30 " v-if="my_coupon_id" style="color: #4D4D4D;">-<text class="fs_22">¥</text>{{coupon_money}}</text>
					<text class="fs_30 " v-else style="color: #4D4D4D;">请选择优惠券</text>
					<text class="jcicon jcicon-jiantouarrow487 fs_26 c_98"></text>
				</view>
			</view>
			<view class="flex__between__center modular__item">
				<text class="fs_28 c_1a">备注</text>
				<input type="text" v-model="orders.remark" class="fs_28 c_4d" />
			</view>
		</view>
		<!-- 支付方式 -->
		<view class="modular-box" @click="picker_show=true">
			<view class="flex__between__center modular__item">
				<text class="fs_28 c_1a">支付方式</text>
				<picker @change="setPayway" :value="way_index" :range="pay_way" range-key="name">
					<view class="lh_40">
						<text class="fs_28 c_4d">{{pay_way[way_index].name}}</text>
						<text class="jcicon jcicon-jiantouarrow487 fs_26 c_98"></text>
					</view>
				</picker>
			</view>
		</view>
		<!-- 底部操作栏 -->
		<view class="flex__between__center footer">
			<view>
				<text class="fs_28 c_4d">实付：</text>
				<text class="c_98b fs_24">¥</text>
				<text class="c_98b fs_30">{{pay_goods_amount}}</text>
			</view>
			<view class="cancel" @click="pay">去付款</view>
		</view>
	</view>
</template>
<script>
	const app = getApp();
	export default {
		data() {
			return {
				coupon: {},
				way_index: 0, //支付方式
				cart_product: [],
				pay_goods_amount: 0,
				goods_amount: 0,
				pay_way: [{}],
				freight_name: '',
				freight: '',
				my_coupon_id: '',
				coupon_money: '',
				orders: {
					// user_id: 32, //
					source: 1, //来源（非必填,1-微信公众号 2-小程序 默认为小程序）
					settlement_type: 1, //结算方式（必填 1：购物车结算 2：立即购买）
					product_id: '', //立即购买商品ID（当 settlement_type = 2 时 必填）
					linkman: '', //联系人（必填）
					mobile_phone: '', //联系电话（必填）
					country: '',
					province: '', //省（必填）
					city: '', //市（必填）
					// area: '', //区（必填）
					address: '', //详细地址（必填）
					address_id: '',
					number: '', //立即购买商品数量（当 settlement_type = 2 时 必填）
					sku: '', //立即购买商品SKU编码（当 settlement_type = 2 且商品你开启规格时 必填）
					my_coupon_id: '', //用户优惠券ID（非必填）
					pay_way: 2, //支付方式ID（必填 1--微信支付 2--支付宝）
					form_id: '', //表单ID（当pay_way = 2 时 必填）
					remark: '', //备注（非必填）
				}
			}
		},
		methods: {
			// 付款
			pay() {
				if (!this.orders.address_id) {
					uni.showToast({
						title: '请选择地址',
						icon: 'none'
					});
					return;
				}
				app.$vm.getData({
					url: 'home/submitOrder',
					that: this,
					data: this.orders,
					loading: 1
				}).then(res => {
					if (res.code == 1) {
						if (this.orders.pay_way == 1) {
							let order_info = {
								appid: res.data.pay_parameters.appid,
								noncestr: res.data.pay_parameters.noncestr,
								package: res.data.pay_parameters.package,
								partnerid: res.data.pay_parameters.partnerid,
								prepayid: res.data.pay_parameters.prepayid,
								timestamp: parseInt(res.data.pay_parameters.timestamp),
								sign: res.data.pay_parameters.sign
							}
							let orderInfo = JSON.stringify(order_info)
							console.log(orderInfo);
							// ???orderInfo还是order_info
							uni.requestPayment({
								provider: 'wxpay',
								orderInfo: orderInfo, //微信、支付宝订单数据
								success: function(res) {
									uni.showToast({
										title: '支付成功',
										icon: 'none'
									});
									
									uni.redirectTo({
										url: '/pages/mall/myOrder?index=0'
									})
								},
								fail: function(err) {
									uni.showModal({
										content: '付款失败',
										showCancel: false,
									})
									uni.redirectTo({
										url: '/pages/mall/myOrder?index=0'
									})
									console.log('fail:' + JSON.stringify(err));
								}
							});
						} else {
							// console.log(res.data)
							// let pay_p = {
							// 	appid: res.data.pay_parameters.appid,
							// 	noncestr: res.data.pay_parameters.noncestr,
							// 	package: res.data.pay_parameters.package,
							// 	partnerid: res.data.pay_parameters.partnerid,
							// 	prepayid: res.data.pay_parameters.prepayid,
							// 	timestamp: parseInt(res.data.pay_parameters.timestamp),
							// 	sign: res.data.pay_parameters.sign
							// }
							let payp = JSON.stringify(res.data.pay_parameters)
							console.log(payp)
							// console.log(res.data.pay_parameters)
							uni.requestPayment({
								provider: 'alipay',
								orderInfo:payp, //微信、支付宝订单数据
								success: function(res) {
									uni.showToast({
										title: '支付成功',
										icon: 'none'
									});
									console.log('success:' + JSON.stringify(res));
									uni.redirectTo({
										url: '/pages/mall/myOrder?index=0'
									})
								},
								fail: function(err) {
									uni.showModal({
										content: '付款失败',
										showCancel: false,
									})
									uni.redirectTo({
										url: '/pages/mall/myOrder?index=0'
									})
									console.log('fail:' + JSON.stringify(err));
								}
							});
						}

						
					} else {
						uni.showToast({
							title: res.message,
							icon: 'none'
						});
					}
				})
			},
			selectCoupon() {
				uni.navigateTo({
					url: '../program/coupons?money=' + this.goods_amount,
				})
			},
			// 支付方式
			setPayway(event) {
				let index = event.detail.value;
				this.way_index = index;
				this.orders.pay_way = this.pay_way[index].id;
			},
			// 获取地址
			getAddress(id) {
				app.$vm.getData({
					url: 'Address/getAddressData',
					that: this,
					data: {
						id: id
					},
					loading: 1
				}).then(res => {
					console.log(res.data)
					this.orders.province = res.data.province;
					this.orders.city = res.data.city;
					// this.orders.area=res.data.area;
					this.orders.province = res.data.country;
					this.orders.address = res.data.address;
					this.orders.linkman = res.data.linkman;
					this.orders.mobile_phone = res.data.mobile_phone;
					this.orders.address_id = res.data.id;
					// console.log(this.orders)
				})
			}
		},
		onLoad(option) {
			this.orders.settlement_type = option.settlement_type;
			this.orders.product_id = option.product_id;
			this.orders.number = option.number;
			this.orders.sku = option.sku;
			app.$vm.getData({
				url: 'home/getOrderReady',
				that: this,
				data: {
					// user_id: 32,
					settlement_type: this.orders.settlement_type,
					product_id: this.orders.product_id,
					number: this.orders.number,
					sku: this.orders.sku,
				},
				loading: 1
			}).then(res => {
				// 计算优惠券
				this.goods_amount = res.data.goods_amount;
				this.pay_goods_amount = this.goods_amount;
				this.cart_product = res.data.cart_product;
				this.freight = res.data.freight;
				this.freight_name = res.data.freight_name;
				// 默认地址
				this.orders.province = res.data.default_address.province;
				// this.orders.province=res.data.default_address.country;
				this.orders.city = res.data.default_address.city;
				// this.orders.area=res.data.default_address.area;
				this.orders.address = res.data.default_address.address;
				this.orders.linkman = res.data.default_address.linkman;
				this.orders.mobile_phone = res.data.default_address.mobile_phone;
				this.orders.address_id = res.data.default_address.id;
				console.log(res.data.default_address)
				this.pay_way = res.data.pay_way;
				this.orders.pay_way = res.data.pay_way[0].id;
				// 算运费的金额
				if (this.freight) {
					let money = Number(this.pay_goods_amount) + Number(this.freight);
					this.pay_goods_amount = money.toFixed(2);
				}
			})
		},
		onShow() {
			var my_coupon_id = uni.getStorageSync('my_coupon_id')
			var coupon_money = uni.getStorageSync('coupon_money') || 0
			this.my_coupon_id = my_coupon_id,
				this.coupon_money = coupon_money.toFixed(2)
			if (my_coupon_id) {
				this.pay_goods_amount = Number(this.pay_goods_amount) + Number(this.freight) - Number(this.coupon_money);
				this.orders.my_coupon_id = my_coupon_id
				if (this.pay_goods_amount <= 0) {
					this.pay_goods_amount = 0.01
				}
			} else {
				this.pay_goods_amount = Number(this.pay_goods_amount) + Number(this.freight);
			}
			if (app.globalData.address_id) {
				// 通过id获取地址
				this.getAddress(app.globalData.address_id);
			}
		},
		onUnload() {
			app.globalData.address_id = '';
			uni.removeStorageSync('my_coupon_id')
			uni.removeStorageSync('coupon_money')
		},
		onHide() {
			app.globalData.address_id = '';
			uni.removeStorageSync('my_coupon_id')
			uni.removeStorageSync('coupon_money')
		}
	}
</script>
<style scoped>
	.c_98b {
		color: #989BF9;
	}

	.header {
		padding: 30upx;
		background: #fff;
	}

	.sale-box {
		padding: 0 30upx 30upx;
		margin-top: 15upx;
		background: #fff;
		overflow: hidden;
	}

	.sale__item {
		margin-top: 30upx;
	}

	.sale__item:last-child {
		border: 0;
	}

	.sale__item image {
		width: 180upx;
		height: 180upx;
		border-radius: 10upx;
	}

	.sale__item__right {
		width: 480upx;
		margin-left: 30upx;
	}

	/* info */
	.modular-box {
		padding: 0 30upx;
		margin-top: 15upx;
		background: #fff;
	}

	.modular__item {
		height: 100upx;
		border-bottom: 2upx solid #e6e6e6;
	}

	.modular__item:last-child {
		border: 0;
	}

	.modular__item input {
		width: 500upx;
		text-align: right;
	}

	/* footer */
	.footer {
		position: fixed;
		width: 100%;
		bottom: 0;
		padding-left: 30upx;
		height: 98upx;
		background: #fff;
	}

	.footer__left {
		padding: 0 30upx;
	}

	.cancel {
		width: 250upx;
		height: 98upx;
		background: #989BF9;
		color: #fff;
		font-size: 32upx;
		line-height: 98upx;
		text-align: center;
	}

	/* modal */
	.picker-box {
		position: fixed;
		top: 0;
		bottom: 0;
		width: 100%;
		z-index: 1;
	}

	.layer {
		position: absolute;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.6);
		z-index: 1;
	}

	.van-picker {
		position: absolute;
		bottom: 0;
		width: 100%;
		z-index: 2;
	}
</style>
