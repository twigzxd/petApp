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

			<view class="flex  justify-center confirm-text margin-top-100">
				<view>确认后,将用新密码进行登录</view>
			</view>

			<button class='submit-button' form-type="submit">确定</button>
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
				this.request.getData('Register/userForgetPassword', {
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

	.cu-form-group {
		padding-left: 0;
	}

	.confirm-text {
		width: calc(100vw);
		color: #989898;
		font-size: 24upx;
		margin-bottom: 30upx;
	}
</style>
