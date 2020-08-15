<template>
	<view id="rechargeRecord">
		<view class="header">
			<view>
				<text>账户金币</text>
				<text>{{allData.money}}</text>
			</view>
			<view @tap="jump('/pages/account/goldCoin?index=0')">明细</view>
		</view>

		<view class="money">
			<view>充值金额</view>
			<view>
				<text class="iconfont icon-jinbi" style="font-size: 48upx;"></text>
				<input type="number" v-model="money" placeholder="请输入金额" placeholder-style="color:#CBCBCB" @focus="card_id=''">
			</view>
		</view>
		<view style="width: 100%;height: 15upx;background:#F5F5F5;"></view>
		<view class="content">
			<view class="contentList">
				<view v-for="(item,index) in allDataList" :key="index" @tap="choice(index)" :class="card_id == item.id ? 'active' : ''">
					<text>{{item.price}}</text>
					<text>赠送¥{{item.give_money}}</text>
				</view>
			</view>
			<view class="confirm" @tap="recharge(1)" hover-class="confirm-hover">微信支付</view>
			<view class="confirm_1" @tap="recharge(2)" hover-class="confirm-hover">支付宝充值</view>
			<view class="title" v-if="allData.recharge_notice">
				<view>{{allData.recharge_notice}}</view>
			</view>
		</view>
	</view>
</template>


<script>
	const app = getApp();
	export default {
		data() {
			return {
				money: '', //充值金额
				allData: [],
				allDataList: [],
				payParam: [],
				card_id: ''
			}
		},
		onShow() {
			this.money = ""
			this.getResult()
		},
		methods: {
			//选择充值金额
			choice(index) {
				this.money=this.allDataList[index].price;
				this.card_id=this.allDataList[index].id;
			},
			//数据
			getResult() {
				app.$vm.getData({
					url: 'Money/getWithdrawData',
					data: {},
					loading: 1,
				}).then(res => {
					//传的参数
					if (res.code == 1) {
						this.allData = res.data
						this.allDataList = res.data.money_card
						if(res.data.money_card.length){
							this.card_id=res.data.money_card[0].id
							this.money=res.data.money_card[0].price
						}
					}
				})
			},
			//充值按钮
			recharge(pay_way) {
				const that = this
				if (that.money != "") {
					app.$vm.getData({
						url: 'Money/moneyPay',
						data: {
							card_id:this.card_id,
							pay_way,
							money: this.money,
						}
					}).then(res => {
						if (res.code == 1) {
							if(pay_way==1){
								var order_info={
									appid: res.data.pay_parameters.appid,
									noncestr: res.data.pay_parameters.noncestr,
									package: res.data.pay_parameters.package,
									partnerid: res.data.pay_parameters.partnerid,  
									prepayid: res.data.pay_parameters.prepayid,
									timestamp: parseInt(res.data.pay_parameters.timestamp),
									sign: res.data.pay_parameters.sign,
								}
							}else{
								var order_info=res.data.pay_parameters;
							}
							this.pay({
								pay_way,
								order_info
							})
						} else {
							uni.showModal({  
								content: res.message,
								showCancel: false,
							})
						}
					})
				}else{
					uni.showToast({
						title:'充值金额有误',
						icon: 'none'
					})
				}

			},
			jump(url) {
				uni.navigateTo({
					url: url
				})
			}
		}

	}
</script>

<style>
	page {
		background: #fff;
	}
</style>
<style lang="less" scoped>
	#rechargeRecord {
		width: 100%;
		height: 100%;

		.header {
			width: 100%;
			height: 220upx;
			background: #515E6A;
			display: flex;
			justify-content: space-between;

			&>view:nth-child(1) {
				margin-left: 41upx;
				line-height: 1;

				&>text:nth-child(1) {
					display: block;
					padding-top: 49upx;
					color: #fff;
					font-size: 30upx;
					font-weight: Regular;
					font-family: "常规体";
					margin-bottom: 12upx;
				}

				&>text:nth-child(2) {
					display: block;
					height: 90upx;
					line-height: 90upx;
					color: #fff;
					font-size: 66upx;
					font-weight: Heavy;
					font-family: "Avenir Heavy";
				}
			}

			&>view:nth-child(2) {
				padding-top: 49upx;
				margin-right: 41upx;
				color: #fff;
				font-size: 30upx;
				font-weight: Regular;
				font-family: "常规体";
			}
		}

		//
		.money {
			width: 100%;
			height: 200upx;
			background: #fff;

			&>view:nth-child(1) {
				line-height: 1;
				padding-top: 34upx;
				margin-left: 39upx;
				color: #1A1A1A;
				font-size: 30upx;
				font-weight: Regular;
				font-family: "常规体";
				margin-bottom: 50upx;
			}

			&>view:nth-child(2) {
				height: 54upx;
				margin-left: 39upx;
				color: #1A1A1A;
				font-size: 36upx;
				font-weight: Regular;
				font-family: "常规体";
				display: flex;
				align-items: center;

				&>text {
					margin-right: 20upx;
				}

				&>input {
					width: 100%;
					height: 100%;
				}
			}
		}

		.content {
			width: 100%;
			height: 100%;

			.contentList {
				margin: 0 39upx;
				height: 100%;
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;

				&>view {
					width: 48%;
					border: 2upx solid #E6E6E6;
					border-radius: 10upx;
					margin-top: 20upx;
					padding: 20upx;
					background: #FFFFFF;

					&>text {
						display: block;
						line-height: 1;
					}

					&>text:nth-child(1) {
						font-size: 36upx;
						color: #1A1A1A;
						font-weight: Regular;
						font-family: "常规体";
					}

					&>text:nth-child(2) {
						font-size: 24upx;
						height: 33upx;
						line-height: 33upx;
						color: #808080;
						font-weight: Regular;
						font-family: "常规体";
					}
				}

				.active {
					background: #F5F5F5;
					border-color: #2E2E2E;
				}
			}
		}

		//充值按钮
		.confirm {
			height: 90upx;
			background: #07c160;
			font-size: 32upx;
			color: #fff;
			font-weight: Medium;
			font-family: "中黑体";
			text-align: center;
			line-height: 90upx;
			border-radius: 10upx;
			margin: 34upx 40upx 32upx 40upx;
			// letter-spacing:10upx;字间距
		}
		.confirm_1{
			height: 90upx;
			background: #1191f4;
			font-size: 32upx;
			color: #fff;
			font-weight: Medium;
			font-family: "中黑体";
			text-align: center;
			line-height: 90upx;
			border-radius: 10upx;
			margin: 0 40upx 32upx 40upx;
			// letter-spacing:10upx;字间距
		}
		.title {
			margin: 0 40upx;
			height: 100%;
			background: #FFF7F8;
			border: 1upx solid #FBEFC7;
			padding-bottom: 20upx;

			&>view {
				margin: 18upx 26upx 4upx 27upx;
				color: #808080;
				font-size: 26upx;
				font-weight: Regular;
				font-family: "常规体";
				line-height: 1.5;
			}
		}

	}
</style>

