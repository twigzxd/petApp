<template>
	<view>
		<scroll-view :scroll-y="modalName==null" class="page" :class="modalName!=null?'show':''">
			<view class="cu-list menu-avatar">
				<view class="cu-item" :class="modalName=='move-box-'+ index?'move-cur':''" v-for="(item,index) in chat_contact"
				 :key="index" @touchstart="ListTouchStart" @touchmove="ListTouchMove" @touchend="ListTouchEnd" :data-target="'move-box-' + index"
				 @click="toMessage(item.friend_id,item.nickname)">
					<view class="cu-avatar radius lg image-view">
						<img class=" cu-avatar radius lg" :src="item.avatar" />
						<view v-if="item.is_read != 1" class="cu-tag round sm image-red-circul"></view>
					</view>
					<view class="content">
						<view class="text-grey">{{item.nickname}}</view>
						<view class="text-gray text-cut text-sm">{{item.content}}</view>
					</view>
					<view class="action">
						<view class="time_color text-xs">{{item.show_time}}</view>
						<view class="cu-tag round bg-ff sm"></view>
					</view>
					<view class="move">
						<!-- <view class="bg-grey">置顶</view> -->
						<view class="bg-red" @tap.stop.prevent="deleteContact(index)">删除</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	const app = getApp();
	export default {
		data() {
			return {
				chat_contact: app.globalData.chat_contact, // 聊天联系人列表
				modalName: null,
				listTouchStart: 0
			}
		},
		onLoad() {
			this.common.judgeIsNeedLogin();
		},
		onShow() {
			let that = this;
			uni.$on('chageContactUpdate', function(data) {
				that.changeContact(app.globalData.chat_contact)
			})
		},
		methods: {
			changeContact(data) {
				this.chat_contact = data;
			},
			// ListTouch触摸开始
			ListTouchStart(e) {
				this.listTouchStart = e.touches[0].pageX
			},
			// ListTouch计算方向
			ListTouchMove(e) {
				this.listTouchDirection = e.touches[0].pageX - this.listTouchStart > 0 ? 'right' : 'left'
			},

			// ListTouch计算滚动
			ListTouchEnd(e) {
				if (this.listTouchDirection == 'left') {
					this.modalName = e.currentTarget.dataset.target
				} else {
					this.modalName = null
				}
				this.listTouchDirection = null
			},
			// 删除聊天记录
			deleteContact: function(index) {
				let that = this;
				this.request.confirm('是否确定删除?').then(res => {
					if (res.confirm) {

						this.request.getData('Chat/deleteContact', {
							data: {
								friend_id: that.chat_contact[index]['friend_id']
							}
						}).then(res => {
							if (res.code === 1) {
								app.globalData.chat_contact.splice(index, 1);
								uni.$emit('chageContactUpdate')
							}
						})
					}
				})
			},
			//跳转聊天页面
			toMessage: function(friend_id, nickname) {
				uni.navigateTo({
					url: "/pages/chat/message?friend_id=" + friend_id + "&nickname=" + nickname
				})
			}
		}
	}
</script>

<style>
	.move-cur {
		transform: translateX(-100upx) !important;
	}

	.time_color {
		color: #B8BECC;
	}


	.move {
		width: 100upx !important;
	}

	.cu-list.menu-avatar>.cu-item .action {
		width: 115upx !important;
	}

	.image-view {
		position: relative;
	}

	.image-red-circul {
		position: absolute;
		right: -10upx;
		top: -10upx;
		background-color: rgba(241, 1, 1, 1) !important;
	}

	.cu-list.menu-avatar>.cu-item .action {
		text-align: right !important;
		margin-right: 15upx;
	}
</style>
