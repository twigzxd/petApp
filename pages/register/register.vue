<template>
	<view>
		<form @submit="formSubmit" @reset="formReset">
			<view class="padding-left-30 border-bottom-ee">
				<view class="cu-form-group margin-top">
					<view class="title">手机号</view>
					<input placeholder="请输入绑定手机号" type="number" placeholder-class="text-b3" name="mobile_phone" v-model="mobile_phone"></input>
				</view>

				<view class="cu-form-group">
					<view class="title">验证码</view>
					<input placeholder="请输入验证码" type="number" placeholder-class="text-b3" name="code"></input>
					<view @click="getCode" v-if="message === 60">获取验证码</view>
					<view v-else>{{message}}s</view>
				</view>
				<view class="cu-form-group">
					<view class="title">新密码</view>
					<input placeholder="请输入新密码" type="text" placeholder-class="text-b3" name="password"></input>
				</view>

				<view class="cu-form-group">
					<view class="title">确认密码</view>
					<input placeholder="请再次输入新密码" type="text" placeholder-class="text-b3" name="confirm_password"></input>
				</view>
			</view>
			<button class='submit-button margin-top-100' form-type="submit">注册</button>

			<view class="bottom">
				<view class="text-20 flex solid-bottom padding justify-center align-end">
					<view class="text-98">登录即代表您已同意</view>
					<view class="text-4B8" @click="goAgreement">《隐私协议》</view>
				</view>
			</view>
		</form>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				mobile_phone: '', //手机号
				message: 60, //倒计时
			}
		},
		onLoad() {},
		// #ifdef APP-PLUS|H5
		onNavigationBarButtonTap(index) {
			uni.navigateBack({
				delta: 2
			})
		},
		// #endif
		methods: {
			//获取手机验证码
			getCode: function() {
				this.common.getCode(this);
			},
			//跳转隐私协议
			goAgreement: function() {
				uni.navigateTo({
					url: "/pages/register/agreement?hierarchy=3"
				})
			},
			formSubmit: function(e) {
				let data = e.detail.value;
				if (data.mobile_phone === "") {
					this.request.alert('请输入手机号');
					return false;
				}
				if (data.code === "") {
					this.request.alert("请输入验证码");
					return false;
				}
				if (data.password === "") {
					this.request.alert("请输入新密码");
					return false;
				}
				if (data.confirm_password === "") {
					this.request.alert("请再次输入新密码");
					return false;
				}
				this.request.getData('Register/newUserRegister', {
					data: data,
					loading: 1,
				}).then(res => {
					if (res.code === 1) {
						this.request.alert(res.message).then(() => {
							uni.redirectTo({
								url: "/pages/register/index"
							})
						})
					}
				})
			},
		}
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
	
	.cu-form-group{
		padding-left: 0;
	}

	.submit-button {
		width: calc(100vw - 60upx);
		margin-left: 30upx;
		height: 90upx;
		color: #FFFFFF;
		border-radius: 10upx;
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
