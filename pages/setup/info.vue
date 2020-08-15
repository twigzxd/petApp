<template>
	<view>
		<view class="cu-form-group ">
			<view class="title">头像</view>
			<view class="flex align-center" @click="chooseImage">
				<view class="margin-right-20" v-show="user_info.avatar !== ''">
					<image :src="user_info.avatar" class="image-avatar"></image>
				</view>
				<view class="margin-right-20" v-show="user_info.avatar === ''">
					<image src="/static/avatar.png" class="image-avatar"></image>
				</view>
				<text class="iconfont icon-fanhui text-26 text-b3"></text>
			</view>
		</view>

		<view class="cu-form-group ">
			<view class="title">昵称</view>
			<input placeholder="匿名" type="text" class="text-right" placeholder-class="text-b3" v-model="user_info.nickname"></input>
		</view>

		<view class="cu-form-group ">
			<view class="title">昵称</view>
			<view v-if="user_info.is_bind_mobile === 1">{{user_info.mobile_phone}}</view>
			<view v-else>未绑定</view>
		</view>

		<view class="cu-form-group ">
			<view class="title">性别</view>
			<picker @change="changeSex" :value="user_info.sex" :range="picker">
				<view class="picker">
					{{picker[user_info.sex]}}
				</view>
			</picker>
		</view>

		<view class="cu-form-group border-bottom-ee">
			<view class="title">生日</view>
			<picker mode="date" :value="user_info.birthday" start="1949-10-01" :end="now_time" @change="changeDate">
				<view class="picker">
					{{user_info.birthday}}
				</view>
			</picker>
		</view>

		<button class="submit-button margin-top-100" @click="formSubmit">保存</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				user_info: {},
				picker: ["请选择", "男", "女"],
				now_time: ""
			}
		},
		onLoad() {

			var day2 = new Date();
			this.now_time = day2.getFullYear() + "-" + (day2.getMonth() + 1) + "-" + day2.getDate();

			this.request.getData("Setup/getUserInfo", {}).then(res => {
				if (res.code == 1) {
					this.user_info = res.data
				} 
			})
		},
		methods: {
			//选择性别
			changeSex: function(e) {
				this.user_info.sex = e.detail.value
			},
			//选择生日
			changeDate: function(e) {
				this.user_info.birthday = e.detail.value
			},
			//上传图片
			chooseImage: function() {
				let that = this;
				this.common.chooseImage(1).then(res => {
					that.user_info.avatar = res[0];
				})
			},
			formSubmit: function() {
				this.request.getData('Setup/changeUserInfo', {
					data: this.user_info
				}).then(res => {
					this.request.alert(res.message).then(result => {
						if (res.code === 1) {
							uni.navigateBack({
								delta: 1
							})
						}
					})
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
		height: 140upx;
		margin-left: 30upx;
		padding-left: 0;
	}

	.image-avatar {
		width: 80upx;
		height: 80upx;
	}
</style>
