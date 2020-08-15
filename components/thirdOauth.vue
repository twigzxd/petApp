<template>
	<view>
		<view class="flex justify-center align-center">
			<view class="border"></view>
			<view class="text-24 text-b3 margin-lr-20">第三方登录方式</view>
			<view class="border"></view>
		</view>

		<view class="flex justify-center margin-top-20 margin-bottom-30">
			<view class="third_list flex justify-center align-center" @click="login('weixin')">
				<image src="/static/app-plus/weixin.png"></image>
			</view>
			<view class="third_list flex justify-center align-center" @click="login('qq')">
				<image src="/static/app-plus/qq.png"></image>
			</view>
			<view class="third_list flex justify-center align-center" @click="login('alipay')">
				<image src="/static/app-plus/zhifubao.png"></image>
			</view>
			<!-- v-if="appleObject" -->
			<view class="third_list flex justify-center align-center"  @click="login('apple')">
				<image class="third_list-image" src="/static/app-plus/apple.png"></image>
			</view>
		</view>
	</view>
</template>

<script>
	const plug = uni.requireNativePlugin("Html5app-AlipayAuth");
	export default {
		props: {
			url: {
				type: String,
				default: ""
			}
		},
		data() {
			return {
				plugObject: false,
				qqObject: false,
				weixinOject: false,
				appleObject: false
			}
		},
		created() {
			if (typeof plug === 'undefined') {
				this.plugObject = false
			} else {
				this.plugObject = true;
			}
			let that = this;
			uni.getProvider({
				service: 'oauth',
				success: function(res) {
					if (~res.provider.indexOf('qq')) {
						that.qqObject = true;
					}
					if (~res.provider.indexOf('weixin')) {
						that.weixinOject = true;
					}
					let info = uni.getSystemInfoSync();
					if (~res.provider.indexOf('apple') && info.platform == 'ios') {
						that.appleObject = true;
					}
				}
			});
		},
		methods: {
			login: function(type) {
				let that = this;
				switch (type) {
					case 'weixin':
						this.uniAppLogin('weixin', that);
						break;
					case 'qq':
						this.uniAppLogin('qq', that);
						break;
					case 'apple':
						this.uniAppLogin('apple', that);
						break;
					case 'alipay':
						this.alipay();
						break;
					default:
						this.request.alert('暂不支持该第三方登录');
						break;
				}

			},
			uniAppLogin: function(type, that) {
				uni.login({
					provider: type,
					success: function(loginRes) {
						uni.getUserInfo({
							provider: type,
							lang: "zh_CN",
							success: function(result) {
								that.request.getData("Register/thirdLogin", {
									data: {
										user_info: JSON.stringify(result.userInfo),
										provide: type
									},
									loading: 1
								}).then(res => {
									if (res.code === 1) {
										if (res.data.user_id === 0) {
											uni.navigateTo({
												url: "/pages/register/bind?provide_id=" + res.data.provide_id + "&provide=" + type
											})
										} else {
											uni.setStorageSync('user_id', res.data.user_id);
											uni.navigateBack({
												delta: 1
											})
										}
									}
								})
							},
							fail: function(result) {
								console.log(result)
							}
						})
					},
					fail: function(res) {
						that.request.alert('授权失败');
					}
				})
			},
			alipay: function() {
				let that = this;
				this.request.getData('Basic/getAliAppId', {
					data: {},
					loading: 1
				}).then(res => {
					if (res.code == 1) {
						plug.login({
							"appid": res.data.appid,
							"urlscheme": "alipaydemo123"
						}, ret => {
							if (ret.code === "0") { // 授权成功
								let auth_code = ret.result.auth_code;
								that.request.getData('Basic/checkAliPayUserInfo', {
									data: {
										'auth_code': auth_code
									},
									loading: 1
								}).then(res => {
									if (res.code === 1) {
										if (res.data.user_id === 0) {
											uni.navigateTo({
												url: "/pages/register/bind?provide_id=" + res.data.id + "&provide=alipay"
											})
										} else {
											uni.setStorageSync('user_id', res.data.user_id);
											uni.navigateBack({
												delta: 1
											})
										}
									}
								})
							} else if (ret.code === "1") { //授权取消

							} else {

							}
						}, res => {
							console.log(res);
						});

					}
				})
			}
		}
	}
</script>

<style>
	.border {
		width: 95upx;
		height: 1upx;
		border-top: 1upx solid #E6E6E6;
	}

	.third_list {
		width: 80rpx;
		height: 80upx;
		border-radius: 50%;
		border: 1upx solid #E6E6E6;
	}

	.third_list image {
		width: 40upx;
		height: 40upx;
	}

	.third_list:not(:first-child) {
		margin-left: 80upx;
	}
</style>
