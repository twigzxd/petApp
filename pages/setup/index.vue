<template>
	<view class="text-30">

		<view class="cu-form-group margin-top-30 border-bottom-ee border-top-ee" @click="goUserInfo">
			<view class="title">个人信息</view>
			<text class="iconfont icon-fanhui text-26 text-b3"></text>
		</view>

		<view class="border-bottom-ee border-top-ee margin-top-30 padding-left-10 bg-ff">
			<view class="cu-form-group" @click="goBindMobilePhone">
				<view class="title">绑定手机号</view>
				<view class="flex align-center">
					<view v-if="user_info.is_bind_mobile === 1" class="margin-right-20">{{user_info.mobile_phone}}
					</view>
					<view v-else class="margin-right-20 not_bind">未绑定</view>
					<text class="iconfont icon-fanhui text-26 text-b3"></text>
				</view>
			</view>

			<!-- #ifdef APP-PLUS -->
			<view v-if="user_info.is_bind_wechat === 1" class="cu-form-group" @click="relieveBind('weixin')">
				<view class="title">绑定微信</view>
				<view class="flex align-center">
					<view class="margin-right-20">{{user_info.wechat_nickname}}</view>
					<text class="iconfont icon-fanhui text-26 text-b3"></text>
				</view>
			</view>

			<view v-else class="cu-form-group" @click="uniAppLogin('weixin')">
				<view class="title">绑定微信</view>
				<view class="flex align-center">
					<view class="margin-right-20 not_bind">未绑定</view>
					<text class="iconfont icon-fanhui text-26 text-b3"></text>
				</view>
			</view>

			<view v-if="user_info.is_bind_alipay == 1" class="cu-form-group" @click="relieveBind('alipay')">
				<view class="title">绑定支付宝</view>
				<view class="flex align-center">
					<view class="margin-right-20">{{user_info.alipay_nickname}}</view>
					<text class="iconfont icon-fanhui text-26 text-b3"></text>
				</view>
			</view>

			<view v-else class="cu-form-group" @click="bindApliay">
				<view class="title">绑定支付宝</view>
				<view class="flex align-center">
					<view class="margin-right-20 not_bind">未绑定</view>
					<text class="iconfont icon-fanhui text-26 text-b3"></text>
				</view>
			</view>

			<view v-if="user_info.is_bind_qq == 1" class="cu-form-group border-bottom-ee" @click="relieveBind('qq')">
				<view class="title">绑定QQ</view>
				<view class="flex align-center justify-center">
					<view class="margin-right-20">{{user_info.qq_nickname}}</view>
					<text class="iconfont icon-fanhui text-26 text-b3"></text>
				</view>
			</view>

			<view v-else class="cu-form-group border-bottom-ee" @click="uniAppLogin('qq')">
				<view class="title">绑定QQ</view>
				<view class="flex align-center justify-center">
					<view class="margin-right-20 not_bind">未绑定</view>
					<text class="iconfont icon-fanhui text-26 text-b3"></text>
				</view>
			</view>
			<!-- #endif -->

		</view>


		<view class="border-bottom-ee border-top-ee margin-top-30 padding-left-10 bg-ff">
			<view class="cu-form-group">
				<view class="title">密码设置</view>
				<view class="flex align-center">
					<view class="margin-right-20 text-b3">修改密码</view>
					<text class="iconfont icon-fanhui text-26 text-b3"></text>
				</view>
			</view>

			<view class="cu-form-group" @click="clearStorage">
				<view class="title">清除缓存</view>
				<view class="flex align-center">
					<view class="margin-right-20 text-b3">{{currentSize}}</view>
					<text class="iconfont icon-fanhui text-26 text-b3"></text>
				</view>
			</view>

		</view>

		<view class='login-out text-32' @click="logOut">退出登录</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				user_info: {},
				currentSize: '0'
			}
		},
		onShow() {
			let that = this;
			this.common.judgeIsNeedLogin().then(() => {
				uni.getStorageInfo({
					success: function(res) {
						if (res.currentSize > 1024) {
							that.currentSize = parseFloat(res.currentSize / 1024).toFixed(2) + "M";
						} else {
							that.currentSize = res.currentSize + "KB";
						}
					}
				});
				this.getData(this);
			})
		},
		methods: {
			//获取数据
			getData: function(that) {
				that.request.getData('Setup/getUserBindInfo', {}).then(res => {
					if (res.code === 1) {
						that.user_info = res.data
					}
				})
			},
			//跳转个人信息
			goUserInfo: function() {
				uni.navigateTo({
					url: "/pages/setup/info"
				})
			},
			//跳转换绑手机或者首次绑定
			goBindMobilePhone: function() {
				let url = "/pages/register/bind?hierarchy=1" // 逻辑中无可能出现后续不在进行处理
				if (this.user_info.is_bind_mobile === 1) {
					url = "/pages/setup/changebindfirst"
				}
				uni.navigateTo({
					url: url
				})
			},
			//清除缓存
			clearStorage: function() {
				let that = this;
				this.request.confirm("是否要清除缓存").then(res => {
					if (res.confirm === true) {
						uni.clearStorageSync();
						that.request.alert('清除成功');
						that.limitSize = "0KB";
					}
				})
			},
			//退出登录
			logOut: function() {
				uni.removeStorageSync('user_id');
				uni.navigateBack({
					delta: 1
				})
			},
			// #ifdef APP-PLUS
			bindApliay: function() {
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
								that.request.getData('Setup/userBindAlipay', {
									data: {
										'auth_code': auth_code
									},
									loading: 1
								}).then(res => {
									if (res.code === 1) {
										that.getData(that);
									}
								})
							}
						}, res => {
							console.log(res);
						});
					}
				})
			},
			uniAppLogin: function(type) {
				let that = this;
				uni.login({
					provider: type,
					success: function(loginRes) {
						uni.getUserInfo({
							provider: type,
							lang: "zh_CN",
							success: function(result) {
								that.request.getData("Setup/thirdBind", {
									data: {
										user_info: JSON.stringify(result.userInfo),
										provide: type
									},
									loading: 1
								}).then(res => {
									if (res.code === 1) {
										that.user_info = res.data.user_info;
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


			//解除绑定
			relieveBind: function(provide) {
				let that = this;
				let name = '';
				switch (provide) {
					case 'weixin':
						name = '微信';
						break;
					case 'qq':
						name = 'QQ';
						break;
					case 'alipay':
						name = '支付宝'
					default:
						break;
				}
				that.request.confirm('是否取消绑定' + name).then(res => {
					if (res.confirm === true) {
						that.request.getData("Setup/relieveBind", {
							data: {
								provide: provide
							},
							loading: 1
						}).then(res => {
							if (res.code === 1) {
								that.getData(that);
							}
						})
					}
				})
			}
			// #endif
		}
	}
</script>

<style>
	.login-out {
		position: fixed;
		width: calc(100vw);
		bottom: 0;
		height: 90upx;
		line-height: 90upx;
		color: #FFFFFF;
		text-align: center;
		background-image: linear-gradient(to right, rgba(142, 98, 254, 1), rgba(107, 85, 254, 1));
	}

	.not_bind {
		color: #FD638B
	}
</style>
