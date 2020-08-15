<template>
	<view>
		<form @submit="goThird">
			<view class="border-bottom-ee">
				<view class="text-40 margin-top-80 margin-left-30">验证码将发送至{{mobile_phone}}</view>
				<view class="text-26 text-98 margin-top-10 margin-left-30">请验证你的手机号以进行下一步操作</view>

				<view class="cu-form-group margin-top-80">
					<input placeholder="请输入验证码" type="number" placeholder-class="text-b3" name="code"></input>
					<view @click="getCode" v-if="message === 60">获取验证码</view>
					<view v-else>{{message}}s</view>
				</view>
			</view>

			<view class="margin-top-100 text-24 text-98 text-center">验证码将发送至{{mobile_phone}}</view>
			<button class="submit-button margin-top-20" form-type="submit">下一步</button>
		</form>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				mobile_phone: "",
				message: 60
			}
		},
		onLoad(options) {
			if (options.hasOwnProperty('mobile_phone')) {
				this.mobile_phone = options.mobile_phone;
			}
		},
		methods: {
			//获取验证码 
			getCode: function() {
				let that = this;
				let mobile_phone = that.mobile_phone;
				let time = setInterval(function() {
					that.message--;
					if (that.message <= 0) {
						that.message = 60;
						clearInterval(time)
					}
				}, 1000)
				that.request.getData("Setup/getBindMobilePhoneCode", {}).then(res => {
					if (res.code != 1) {
						that.request.alert(res.message).then(() => {
							that.message = 60;
							clearInterval(time);
						});
					}

				})
			},
			//验证 验证码是否通过
			goThird: function(e) {
				let data = e.detail.value

				try {
					this.common.isMust(data, {
						'code': '请输入验证码'
					});
				} catch (e) {
					this.request.alert(e.message);
					return false;
				}

				this.request.getData("Setup/checkBindMobilePhoneCode", {
					data: data
				}).then(res => {
					if (res.code === 1) {
						uni.navigateTo({
							url: "/pages/setup/changebindthird"
						})
					} 
				})
			}
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
		margin-left: 30upx;
		padding-left: 0;
	}

	.bind-text {
		color: #6E56FE;
	}
</style>
