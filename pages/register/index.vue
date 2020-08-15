<template>
	<view class="body padding-top-80 padding-lr-45">
		<view class="flex padding justify-center margin-bottom-40">
			<text class="text-bold text-50">登录以使用更多服务</text>
		</view>
		<view class="flex solid-bottom padding justify-start align-end">
			<text class="iconfont icon-icon-test1 text-34"></text>
			<input class="margin-left-20 flex-sub" v-model="mobile_phone" placeholder="请输入手机号" name="mobile_phone" type="number"
			 placeholder-class="text-b3 text-28" />
		</view>

		<view class="flex solid-bottom padding justify-start align-end" v-show="type === 1">
			<text class="iconfont icon-icon-test text-34"></text>
			<input class="margin-left-20 flex-sub" v-model="code" placeholder="请输入验证码" name="code" type="number"
			 placeholder-class="text-b3 text-28" />
			<view @click="getCode" v-if="message === 60">获取验证码</view>
			<view v-else>{{message}}s</view>
		</view>

		<view class="flex solid-bottom padding justify-start align-end" v-show="type === 2">
			<text class="iconfont icon-icon-test2 text-34"></text>
			<input class="margin-left-20 flex-sub" v-model="password" placeholder="请输入密码" name="password" type="password" v-show="is_show_password === false"
			 placeholder-class="text-b3 text-28" />
			<input class="margin-left-20 flex-sub" v-model="password" placeholder="请输入密码" name="password" type="text" v-show="is_show_password !== false"
			 placeholder-class="text-b3 text-28" />
			<text class="iconfont icon-yanjing1 text-34 padding-lr-10" @click="showHidePassword" v-show="is_show_password !== false"></text>
			<text class="iconfont icon-biyan text-34 padding-lr-10" @click="showHidePassword" v-show="is_show_password === false"></text>
			<view class="border-left-e6 margin-left-10 padding-left-10" @click="forgetPassword">忘记密码</view>
		</view>

		<!-- #ifdef APP-PLUS|H5  -->
		<view @click="login" class="margin-top-80 radius-50 flex justify-center align-end text-32 text-ff line-100" :class="{'not_login':!can_login,'login':can_login}">
			登录
		</view>
		<!-- #endif  -->
		<!-- #ifdef MP-WEIXIN  -->
		<button open-type="getUserInfo" @getuserinfo="login" withCredentials="true" class="margin-top-80 radius-50 flex justify-center align-end text-32 text-ff line-100"
		 :class="{'not_login':!can_login,'login':can_login}">
			登录
		</button>
		<!-- #endif  -->

		<view class="flex padding justify-between text-66 margin-top-30">
			<view @click="changeLoginType" v-show="type === 1">账号密码登录</view>
			<view @click="changeLoginType" v-show="type === 2">验证码登录</view>
			<view @click="goRegister">立即注册</view>
		</view>


		<view class="bottom">

			<!-- #ifdef APP-PLUS  -->
			<third-oauth></third-oauth>
			<!-- #endif  -->

			<view class="text-20 flex solid-bottom padding justify-center align-end">
				<view class="text-98">未注册的手机号验证后自动注册,登录即代表您已同意</view>
				<view class="text-4B8" @click="goAgreement">《隐私协议》</view>
			</view>
		</view>
	</view>
</template>

<script>
	// #ifdef APP-PLUS
	import third_oauth from "../../components/thirdOauth.vue";
	// #endif
	export default {
		data() {
			return {
				mobile_phone: "", //手机号
				code: "", //验证码
				password: "", //密码
				is_show_password: false, //是否显示密码
				type: 1, //1：手机验证码登录 2：账号登录
				message: 60, //
				can_login: false, // 默认不能点击登录
			}
		},
		watch: {
			mobile_phone(newValue, oldValue) {
				if (newValue !== "" && this.code !== '' && this.type == 1) {
					this.can_login = true;
				} else if (newValue !== "" && this.password !== '' && this.type == 2) {

				} else {
					this.can_login = false;
				}
			},
			code(newValue, oldValue) {
				if (newValue !== "" && this.mobile_phone !== '' && this.type == 1) {
					this.can_login = true;
				} else {
					this.can_login = false;
				}
			},
			password(newValue, oldValue) {
				if (newValue !== "" && this.mobile_phone !== '' && this.type == 2) {
					this.can_login = true;
				} else {
					this.can_login = false;
				}
			}
		},
		onShow() {
			let user_id = uni.getStorageInfoSync('user_id');
			if (!user_id) {
				uni.navigateBack({
					delta: 1
				})
			}
		},
		methods: {
			//获取手机验证码
			getCode: function() {
				this.common.getCode(this);
			},
			//切换登录方式
			changeLoginType: function() {
				if (this.type === 1) {
					this.type = 2;
					this.password = "";
					this.can_login = false;
				} else {
					this.type = 1;
					this.code = "";
					this.can_login = false;
				}
			},
			// 显示隐藏密码
			showHidePassword: function() {
				if (this.is_show_password) {
					this.is_show_password = false;
				} else {
					this.is_show_password = true;
				}
			},

			//登录
			login: function() {
				let data = {};
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				data.type = this.type;
				if (this.mobile_phone === "") {
					uni.hideLoading();
					this.request.alert("请输入手机号")
					return false;
				}
				data.mobile_phone = this.mobile_phone;
				if (this.type === 1) { // 短信登录
					if (this.code === "") {
						uni.hideLoading();
						this.request.alert("请输入验证码");
						return false;
					}
					data.code = this.code;
				} else if (this.type === 2) { //账号登录
					if (this.password === "") {
						uni.hideLoading();
						this.request.alert('请输入密码');
						return false;
					}
					data.password = this.password;
				} else {
					uni.hideLoading();
					this.request.alert('暂无改登录方式');
					return false;
				}

				let that = this;
				this.dataHandel(data).then(res => {
					that.request.getData('Register/login', {
						data: res,
						loading: 1
					}).then(res => {
						if (res.code !== 1) {
							this.request.alert(res.message);
						} else {
							uni.setStorageSync('user_id', res.data.user_id);
							uni.navigateBack({
								delta: 1
							})
						}
					})
				})
			},
			//数据预处理
			dataHandel: function(data) {
				return new Promise((resolve, reject) => {
					let attach = {};
					// #ifdef APP-PLUS
					data.provide = "app_plus";
					resolve(data)
					// #endif

					// #ifdef H5
					if (this.isWeixin === false) {
						data.provide = "h5";
					} else {
						data.provide = "h5_weixin";
						attach.openid = uni.getStorageSync('openid');
						data.attach = JSON.stringify(attach);
					}
					resolve(data)
					// #endif

					// #ifdef MP-WEIXIN
					wx.getUserInfo({
						lang: 'zh_CN',
						success: function(res) {
							var userInfo = res.userInfo
							var attach = {};
							attach.nickName = userInfo.nickName;
							attach.avatarUrl = userInfo.avatarUrl;
							attach.gender = userInfo.gender;
							attach.province = userInfo.province;
							attach.city = userInfo.city;
							attach.country = userInfo.country;
							attach.openid = uni.getStorageSync('openid');
							attach.encryptedData = res.encryptedData;
							attach.iv = res.iv;
							attach.signature = res.signature;
							attach.rawData = res.rawData;
							data.provide = 'mp_weixin';
							data.attach = JSON.stringify(attach);
							resolve(data);
						},
						fail: res => {
							// 获取失败的去引导用户授权 
							reject(res)
						}
					})
					// #endif

					// #ifdef MP-ALIPAY
					data.provide = 'mp_alipay'
					resolve(data)
					// #endif

					// #ifdef MP-BAIDU
					data.provide = 'mp_baidu'
					resolve(data)
					// #endif

					// #ifdef MP-QQ
					data.provide = 'mp_qq'
					resolve(data)
					// #endif

					// #ifdef MP-TOUTIAO
					data.provide = 'mp_toutiao'
					resolve(data)
					// #endif
				})
			},
			//跳转隐私协议
			goAgreement: function() {
				uni.navigateTo({
					url: "/pages/register/agreement"
				})
			},
			//跳转注册页面
			goRegister: function() {
				uni.navigateTo({
					url: "/pages/register/register"
				})
			},
			//忘记密码
			forgetPassword: function() {
				uni.navigateTo({
					url: "/pages/register/forget"
				})
			}
		},
		// #ifdef APP-PLUS|H5
		onNavigationBarButtonTap(index) {
			uni.navigateBack({
				delta: 1
			})
		},
		// #endif
		// #ifdef APP-PLUS
		components: {
			'third-oauth': third_oauth
		},
		// #endif
	}
</script>

<style>
	page {
		background: #FFFFFF !important;

		/* #ifdef MP */
		height: calc(100vh);
		/* #endif */

		/* #ifdef H5|APP-PLUS */
		height: calc(100vh - var(--window-top));
		/* #endif */
	}


	.solid-bottom::after {
		border-bottom: 1upx solid #E6E6E6 !important;
	}

	.not_login {
		background-color: rgba(114, 87, 253, 0.2);
	}

	.login {
		background-color: rgba(142, 98, 254, 1);
		background-image: linear-gradient(to right, rgba(142, 98, 254, 1), rgba(107, 85, 254, 1));
	}

	.bottom {
		position: fixed;
		bottom: 0;
		left: 0;
		width: calc(100vw);
	}

	.text-4B8 {
		color: #4B81B8;
	}
</style>
