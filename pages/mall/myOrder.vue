<template>
	<div class="my-order">
		<!-- 选项卡 -->
		<div class="flex__around__center nav">
			<div class="flex align-center nav__item" :class="loads.index==index?'active':''" v-for="(item,index) in nav_list"
			 :key="index" @click="setIndex(item.status)">
				<span class="fs_30" :class="loads.index==index?'c_1a fw_500':'c_66'">{{item.text}}</span>
			</div>
		</div>
		<div class='nodata' v-if='list.length==0'>暂无数据~</div>
		<div class="list" v-if='list.length>0'>
			<div class="list__item" v-for="(item,index) in list" :key="index">
				<div class="flex__between list__item__header">
					<span class="fs_26 c_66">交易单号：{{item.order_number}}</span>
					<span class="fs_28" :class="item.status==1||item.status==2||item.status==3||item.status==4||item.status==6?'c98b':'c_b3'">{{item.status_name}}</span>
				</div>
				<navigator :url="'./orderDetail?id='+item.id">
					<div class="item-box">
						<div class="flex item" v-for="(item1,index1) in item.order_product" :key="index1">
							<img :src="item1.product_cover_img" alt="">
							<div class="flex__null__around item__right">
								<span class="fs_26 c_1a lh_36 ellipsis_two">{{item1.product_name}}</span>
								<span class="fs_22 c_98" v-if="item1.product_sku_name">规格: {{item1.product_sku_name}}</span>
								<div class="flex__between">
									<span class="fs_30 c98b"><span class="fs_22">¥</span>{{item1.product_price}}</span>
									<span class="fs_26 c_80">x{{item1.number}}</span>
								</div>
							</div>
						</div>
					</div>
				</navigator>
				<div class="list__item__footer">
					<div class="flex__end__center list__item__footer__top">
						<span class="fs_24 c_4d">共{{item.product_count}}件商品&emsp;合计：</span>
						<span class="fs_30 c98b"><span class="fs_22">¥</span>{{item.total_price}}</span>
					</div>
					<div class="flex__end__center list__item__footer__bottom" v-if="item.status!=6">
						<button class="hollow-btn" v-if="item.status==1" @click="cancel(item.id)">取消订单</button>
						<button class="hollow-btn" v-if="item.status==4||item.status==5||item.status==7||item.status==8" @click="del(item.id)">删除订单</button>
						<!-- <button class="hollow-btn" v-if="item.status==4||item.status==5||item.status==7||item.status==8" @click="call(item.phone)">联系商家</button> -->
						<button class="hollow-btn" v-if="item.status==3||item.status==4||item.status==5" @click="call(item.service_phone)">联系商家</button>
						<!-- <navigator :url="'/pages/mall/Logistics?id='+item.id" hover-class="none">
							<button class="hollow-btn" v-if="item.status==3||item.status==4||item.status==5">查看物流</button>
						</navigator> -->
						<button class="hollow-btn" v-if="item.status==2" @click="refund(item.id)">申请退款</button>
						<navigator :url="'./evaluate?id='+item.id" v-if="item.status==4" hover-class="none">
							<button class="solid-btn bg_98b">评价</button>
						</navigator>
						<button class="solid-btn bg_98b" v-if="item.status==3" @click="harvest(item.id)">确认收货</button>
						<button class="solid-btn bg_98b" v-if="item.status==1" @click="pay(item.id)">支付</button>
						<button class="solid-btn bg_98b" v-if="item.status==2" @click="remind(item.id)">提醒发货</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	const app = getApp();
	export default {
		name: "MyOrder",
		data() {
			return {
				refresh: true, //刷新组件用
				list: [],
				loads: {
					index: 0
				},
				nav_list: [{
						text: '全部',
						status: 0
					},
					{
						text: '待支付',
						status: 1
					},
					{
						text: '待发货',
						status: 2
					},
					{
						text: '待收货',
						status: 3
					},
					{
						text: '待评价',
						status: 4
					}
				]
			}
		},
		methods: {
			setIndex(index) {
				this.loads.index = index;
				this.loadList(1);
			},
			loadList(page) {
				app.$vm.getList({
					url: 'home/getMyOrderList',
					that: this,
					data: this.loads,
					loading: 1,
					page
				});
			},
			// 打电话
			call(phone) {
				uni.makePhoneCall({
					phoneNumber: phone
				})
			},
			// 提醒发货
			remind(id) {
				app.$vm.getData({
					url: 'home/submitRemind',
					that: this,
					data: {
						order_id: id
					},
					loading: 1
				}).then(res => {
					uni.showModal({
						content: res.message,
						showCancel: false
					});
				})
			},
			// 取消订单
			cancel(id) {
				const _this = this;
				uni.showModal({
					content: '确认取消该订单？',
					success(modal_res) {
						if (modal_res.confirm) {
							app.$vm.getData({
								url: 'home/cancelOrder',
								that: _this,
								data: {
									order_id: id
								},
								loading: 1
							}).then(res => {
								uni.showModal({
									content: res.message,
									showCancel: false,
									success() {
										_this.loadList(1);
									}
								});
							})
						}
					}
				})
			},
			// 申请退款
			refund(id) {
				const _this = this;
				uni.showModal({
					content: '确认申请退款该订单？',
					success(modal_res) {
						if (modal_res.confirm) {
							app.$vm.getData({
								url: 'home/submitRefund',
								that: _this,
								data: {
									order_id: id
								},
								loading: 1
							}).then(res => {
								uni.showModal({
									content: res.message,
									showCancel: false,
									success() {
										_this.loadList(1);
									}
								});
							})
						}
					}
				})
			},
			// 删除订单
			del(id) {
				const _this = this;
				uni.showModal({
					content: '确认删除该订单？',
					success(modal_res) {
						if (modal_res.confirm) {
							app.$vm.getData({
								url: 'home/submitDeleteOrder',
								that: _this,
								data: {
									order_id: id
								},
								loading: 1
							}).then(res => {
								uni.showModal({
									content: res.message,
									showCancel: false,
									success() {
										_this.loadList(1);
									}
								});
							})
						}
					}
				})
			},
			// 确认收货
			harvest(id) {
				const _this = this;
				uni.showModal({
					content: '确认收货？',
					success(modal_res) {
						if (modal_res.confirm) {
							app.$vm.getData({
								url: 'home/confirmOrder',
								that: _this,
								data: {
									order_id: id
								},
								loading: 1
							}).then(res => {
								if (res.code == 1) {
									uni.showModal({
										content: res.message,
										showCancel: false,
										success() {
											_this.loadList(1);
										}
									});
								} else if (res.code == 401) {
									uni.showModal({
										content: res.message,
										showCancel: false,
										success() {
											uni.navigateTo({
												url: '/pages/mine/personal'
											})
										}
									});
								} else if (res.code == 402) {
									uni.showToast({
										title: res.message,
										icon: 'none'
									});
								}
							})
						}
					}
				})
			},
			// 支付
			pay(id) {
				app.$vm.getData({
					url: 'home/payOrder',
					that: this,
					data: {
						order_id: id
					},
					loading: 1
				}).then(res => {
					console.log(res.data)
					if (res.code == 1) {
						let order_info = {
							appid: res.data.pay_parameters.appid,
							noncestr: res.data.pay_parameters.noncestr,
							package: res.data.pay_parameters.package,
							partnerid: res.data.pay_parameters.partnerid,
							prepayid: res.data.pay_parameters.prepayid,
							timestamp: parseInt(res.data.pay_parameters.timestamp),
							sign: res.data.pay_parameters.sign
						}
						let orderInfo = JSON.stringify(res.data.pay_parameters)
						console.log(orderInfo)  
						uni.requestPayment({
							provider: 'wxpay',
							orderInfo: orderInfo, //微信、支付宝订单数据
							success: function(res) {
								uni.showToast({
									title: '支付成功',
									icon: 'none'
								});
								console.log('success:' + JSON.stringify(res));
								this.loadList(1);
							},
							fail: function(err) {
								uni.showModal({
									content: '付款失败',
									showCancel: false,
								})
								this.loadList(1);
								console.log('fail:' + JSON.stringify(err));
							}
						});
					} else {
						uni.showModal({
							content: res.message,
							showCancel: false
						});
					}
				})
			}
		},
		onReachBottom() {
			this.loadList(2);
			console.log(this.list)
		},
		onLoad(options) {
			this.loads.index = options.index || 0;
			
		},
		onShow() {
			this.loadList(1);
		}
	}
</script>
<style scoped>
	.nodata {
		margin-top: 100upx;
		text-align: center;
		color: #969896;
		font-size: 34upx;

	}

	.c98b {
		color: #989BF9;
	}

	.bg_98b {
		background: #989BF9;
	}

	.nav {
		position: fixed;
		top: 0;
		width: 100%;
		height: 90upx;
		z-index: 1;
		background: #fff;
	}

	.nav__item.active {
		height: 90upx;
		border-bottom: 6upx solid rgba(152, 155, 249, 1);
	}

	.list {
		padding: 90upx 20upx 0;
	}

	.list__item {
		margin-top: 15upx;
		padding: 30upx 20upx 0;
		background: #fff;
		border-radius: 10upx;
	}

	.item-box {
		padding: 15upx 0 30upx;
		border-bottom: 2upx solid #e6e6e6;
	}

	.item {
		margin-top: 30upx;
	}

	.item:last-child {
		border: 0;
	}

	.item img {
		width: 180upx;
		height: 180upx;
		border-radius: 10upx;
	}

	.item__right {
		width: 460upx;
		margin-left: 30upx;
	}

	.list__item__footer__top {
		height: 90upx;
	}

	.list__item__footer__bottom {
		padding-bottom: 30upx;
	}

	.list__item button {
		width: 160upx;
		height: 60upx;
		border-radius: 30upx;
		margin-left: 10upx;
		line-height: 60upx;
	}

	.list__item .hollow-btn {
		background: none;
		border: 2upx solid #e6e6e6;
		font-size: 26upx;
		color: #808080;
	}

	.list__item .solid-btn {
		/* background: #1a1a1a; */
		font-size: 26upx;
		color: #fff;
	}
</style>
