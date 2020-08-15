<template>
	<view>
		<form @submit="bindFinish">
			<view class="border-bottom-ee">
				<view class="cu-form-group margin-top">
					<input placeholder="请输入手机号" type="number" placeholder-class="text-b3" name="mobile_phone" v-model="mobile_phone"></input>
				</view>

				<view class="cu-form-group">
					<input placeholder="请输入验证码" type="number" placeholder-class="text-b3" name="code"></input>
					<view @click="getCode" v-if="message === 60">获取验证码</view>
					<view v-else>{{message}}s</view>
				</view>
			</view>

			<button class="submit-button margin-top-100" form-type="submit">完成</button>
		</form>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				mobile_phone: "",
				message: 60,
				code: "",
			}
		},
		onLoad() {
			let that = this;
		},
		methods: {
			//获取验证码
			getCode: function() {
				this.common.getCode(this, 2);
			},
			//绑定新手机号
			bindFinish: function(e) {
				let data = e.detail.value;
				try {
					this.common.isMust(data, {
						'mobile_phone': '请输入手机号',
						'code': '请输入验证码'
					})
					this.common.validatePhone(data.mobile_phone)
				} catch (e) {
					this.request.alert(e.message)
					return false;
				}
				this.request.getData("Setup/userBindNewMobilePhone", {
					data: data
				}).then(res => {
					if (res.code === 1) {
						uni.navigateBack({
							delta: 3
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
