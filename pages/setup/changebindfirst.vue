<template>
	<view>
		<view class="border-bottom-ee">
			<view class="cu-form-group ">
				<view class="title">国家/地区</view>
				<view>中国(+86)</view>
			</view>

			<view class="cu-form-group">
				<view class="title">手机号码</view>
				<view class="flex align-center justify-center">
					<view class="margin-right-10">{{mobile_phone}}</view>
					<view class="bind-text">已绑定</view>
				</view>
			</view>
		</view>

		<button class="submit-button margin-top-100" @click="goSecond">去更换</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				mobile_phone: ""
			}
		},
		onLoad() {
			let that = this;
			this.request.getData('Setup/getBindMobilePhone', {}).then(res => {
				if (res.code === 1) {
					that.mobile_phone = res.data.mobile_phone;
				}
			})
		},
		methods: {
			//跳转第二步
			goSecond: function() {
				uni.navigateTo({
					url: "/pages/setup/changebindsecond?mobile_phone=" + this.mobile_phone
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
