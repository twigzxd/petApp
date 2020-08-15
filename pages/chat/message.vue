<template>
	<view>
		<!-- #ifdef H5 -->
		<scroll-view id="scrollview" @scroll="to_bottom=''" :scroll-into-view="to_bottom" scroll-y="true" class="scroll-view"
		 scroll-x="false" @scrolltoupper="getList(2)" :scroll-top="scrollTop" :style="{height:'calc(100vh - var(--window-top) - '+ (bottom_input_height + bottom_handel_height) + 'px)'}">
			<!-- #endif -->
			<!-- #ifndef H5 -->
			<scroll-view id="scrollview" @scroll="to_bottom=''" :scroll-into-view="to_bottom" scroll-y="true" class="scroll-view"
			 scroll-x="false" @scrolltoupper="getList(2)" :scroll-top="scrollTop" :style="{height:'calc(100vh - '+ (bottom_input_height + bottom_handel_height) + 'px)'}">
				<!-- #endif -->
				<view v-for="(item,index) in list" :key="index" :class="{mine:item.from_id != friend_id}" class="message-list text-28">
					<view class="time text-22 " v-if="item.show_time != ''">{{item.show_time}}</view>
					<view class="content">
						<image class="avatar" :src="item.avatar"></image>
						<!-- 文本 -->
						<view v-if="item.type === 1" :class="{mine_text:item.from_id != friend_id,text:item.from_id == friend_id}">
							{{item.content}}
						</view>
						<!-- 语音 -->
						<view v-if="item.type === 2">

						</view>
						<!-- 图片 -->
						<view v-if="item.type === 3" class="image">
							<image :src="item.content" mode="widthFix" lazy-load="true" @click="previewImage(item.content)"></image>
						</view>
					</view>
				</view>
				<view id="bottom" class="message-list bottom-height"></view>
			</scroll-view>

			<view class="bottom-input" :style="{height:bottom_input_height+'px',alignItems: is_text_or_voice === 'text'?'flex-end':'center'
			,bottom:bottom_handel_height+'px'}">
				<!-- 键盘按钮 -->
				<text v-if="is_text_or_voice === 'text'" @click="changeTextVoice('voice')" class="keyboard iconfont icon-jianpan"></text>
				<!-- 语音按钮 -->
				<image v-if="is_text_or_voice === 'voice' && is_need_voice === true" class="microphone" @click="changeTextVoice('text')"
				 src="/static/microphone.png"></image>
				<!-- 文本框 -->
				<textarea v-model="content" v-if="is_text_or_voice === 'text'" maxlength="-1" fixed="true" @linechange="textAreaChangeLine"
				 :style="{height:textareaHighet+'px'}"></textarea>
				<!-- 语音 -->
				<view class="voice" v-if="is_text_or_voice === 'voice'" :style="{background:voice_style[voice_status]['background']}">{{voice_style[voice_status]['text']}}</view>
				<!-- 表情按钮 -->
				<image v-if="is_need_emoji === true" class="smil" src="/static/smil.png"></image>
				<!-- 加号按钮 -->
				<image v-if="content === ''" @click="showOrHideSendPicture" class="plus" src="/static/plus.png"></image>
				<!-- 发送按钮 -->
				<view v-if="content !== ''" @click="sendTextMessage" class="send-message text-26">发送</view>
			</view>

			<view class="send-picture" v-if="send_picture">
				<view>
					<view class="margin-right-20" @click="sendPicture('album')">
						<view class="picture-bg">
							<text class="iconfont icon-tupian2 text-40"></text>
						</view>
						<view class="picture-text">相册</view>
					</view>
					<view class="margin-left-20" @click="sendPicture('camera')">
						<view class="picture-bg">
							<text class="iconfont icon-xiangji text-50"></text>
						</view>
						<view class="picture-text">拍摄</view>
					</view>
				</view>
			</view>
	</view>
</template>

<script>
	import chat from "static/base/chat.js";
	export default {
		data() {
			return {
				friend_id: 0, //好友ID
				bottom_input_height: 50, //输入框所在横条高度
				bottom_handel_height: 0, //输入框下部，表情，选择图片所在高度
				scrollTop: 0,
				to_bottom: '',
				list: [], //聊天信息
				style: { //计算scroll高度
					pageHeight: 0,
					contentViewHeight: 0,
					footViewHeight: 90,
					mitemHeight: 0
				},
				content: "", //输入内容
				is_text_or_voice: 'text', // 是文本输入还是语音
				is_need_voice: true, // 是否需要语音
				is_need_emoji: false, // 是否需要emoji
				textareaHighet: 30, //输入文本框高度
				voice_style: [{ // 语音按钮样式
						background: 'rgba(255,255,255,1)',
						text: '按住 说话'
					},
					{
						background: 'rgba(204,204,204,1)',
						text: '松开 说话'
					},
				],
				voice_status: 0, //0：初始状态  1：按住状态
				send_picture: false, //是否发送图片显示
				vip_info: {}, //当前用户信息
			}
		},
		onLoad(option) {
			let that = this;
			this.common.judgeIsNeedLogin().then(() => {
				if (option.hasOwnProperty('friend_id')) {
					this.friend_id = option.friend_id;
				}
				//设置标题为好友名称
				if (option.hasOwnProperty('nickname')) {
					uni.setNavigationBarTitle({
						title: option.nickname
					})
				}

				//获取用户
				this.request.getData('Chat/getUserInfo').then(res => {
					that.vip_info = res.data.vip_info;
				})
				const res = uni.getSystemInfoSync();
				this.style.pageHeight = res.windowHeight;
				this.style.contentViewHeight = res.windowHeight - uni.getSystemInfoSync().screenWidth / 750 * (100); //像素
				this.getList(1);
			});
		},
		onShow() {
			//发送websocket消息已读
			this.sendMessageRead();
			//监听websocket数据
			this.onMessage();
		},
		onUnload() {
			//触发全局websocket监听
			uni.$emit('checkWebsocketOnMessage')
		},
		methods: {
			/**
			 * 获取数据，首次加载和上拉加载
			 * @param {int} page 1：首次加载 >1：上拉加载
			 */
			getList: function(page) {
				let that = this;
				let first_message_time = this.list.hasOwnProperty(0) ? this.list[0]['create_time'] : 0;
				this.request.getUpLists({
					url: "chat/getFriendChatList",
					data: {
						friend_id: this.friend_id,
						show_time: first_message_time
					},
					that: this,
					is_loading: true,
					page: page
				}).then(res => {
					if (page === 1) {
						this.listHandel();
						this.reachBottom();
					}
				})
			},
			/**
			 * 下滑到底部
			 */
			reachBottom: function() {
				var that = this;
				setTimeout(() => {
					this.to_bottom = 'bottom';
					var query = uni.createSelectorQuery();
					query.selectAll('.message-list').boundingClientRect();
					query.select('#scrollview').boundingClientRect();
					query.exec(function(res) {
						that.style.mitemHeight = 0;
						res[0].forEach(function(rect) {
							that.style.mitemHeight = that.style.mitemHeight + rect.height + 20;
						});
						setTimeout(() => {
							if (that.style.mitemHeight > that.style.contentViewHeight) {
								that.scrollTop = that.style.mitemHeight - that.style.contentViewHeight + 300;
							}
						}, 100)
					});
				}, 100)
			},
			/**
			 * 聊天消息数据整理
			 */
			listHandel: function() {
				let create_time = 0;
				let list = this.list;
				for (let i = 0; i < list.length; i++) {
					if (create_time != 0 && list.hasOwnProperty(i - 1) && (list[i]['create_time'] - list[i - 1]['create_time'] < 5 *
							60)) {
						list[i]['show_time'] = '';
					} else {
						list[i]['show_time'] = this.showTimeHandel(list[i]['create_time']);
						create_time = list[i]['create_time'];
					}
				}
				this.list = list;
			},
			/**
			 * 展示时间格式规整
			 * @param {int} create_time 秒级时间戳
			 */
			showTimeHandel: function(create_time) {
				let show_time = new Date(parseInt(create_time) * 1000)
				return this.common.isToday(create_time) ? this.common.dateFormat(show_time, 'hh:mm') :
					this.common.dateFormat(show_time, 'MM月dd日 hh:mm');
			},
			/**
			 * 输入文本框行高发生变化
			 * @param {Object} e
			 */
			textAreaChangeLine: function(e) {
				let line = 4;
				if (e.detail.lineCount <= 4) {
					line = e.detail.lineCount;
				}

				if (e.detail.lineCount == 1) {
					this.bottom_input_height = 50;
				} else {
					this.bottom_input_height = 50 + (line - 1) * 30;
				}
				this.textareaHighet = line * 30;
				this.reachBottom();
			},
			/**
			 * 选择是输入文字还是语音
			 * @param {string} e voice：语音  text：文本
			 */
			changeTextVoice: function(e) {
				if (e === 'voice' && this.is_need_voice === true) {
					this.is_text_or_voice = e;
				} else if (e === 'text') {
					this.is_text_or_voice = e;
				}
			},
			/**
			 * 图片预览
			 * @param {string} image_url 预览图片地址
			 */
			previewImage: function(image_url) {
				let urls = [];
				let message_list = this.list;
				for (let pop in message_list) {
					if (message_list[pop]['type'] == 3) {
						urls.push(message_list[pop]['content']);
					}
				}
				uni.previewImage({
					current: urls.indexOf(image_url),
					urls: urls
				})
			},
			/**
			 * 展示或隐藏上传图片
			 */
			showOrHideSendPicture: function() {
				this.bottom_handel_height = this.send_picture === false ? 200 : 0;
				this.send_picture = !this.send_picture;
				this.reachBottom();
			},
			/**
			 * 发送文本信息
			 */
			sendTextMessage: function() {
				let content_lenth = this.content.length;
				if (content_lenth < 1 || content_lenth > 2000) {
					this.request.alert('发送字数要求在2000字以内');
					return false;
				}
				this.sendMessage(1, this.content);
			},
			/**
			 * 发送图片
			 * @param {string} type camera：照相机  album：图库
			 */
			sendPicture: function(type) {
				this.common.chooseImage(1, [type]).then(res => {
					this.sendMessage(3, res[0]);
					this.showOrHideSendPicture();
				})
			},
			/**
			 * 发送消息已读通知
			 */
			sendMessageRead: function() {
				this.websocket.sendMessage({
					type: 'message_read',
					data: '',
					to_user_id: this.friend_id
				});
			},
			/**
			 * websocket发送信息
			 * @param {string} type
			 * @param {string} content
			 * @return null
			 */
			sendMessage: function(type, content) {
				let data = {
					from_id: String(uni.getStorageSync('user_id')),
					to_id: String(this.friend_id),
					type: type,
					content: content,
					create_time: Date.parse(new Date()) / 1000,
					nickname: this.vip_info.nickname,
					avatar: this.vip_info.avatar,
				}
				this.websocket.sendMessage({
					type: 'chat_message',
					data: data,
					to_user_id: this.friend_id
				}).then(res => {
					this.content = '';
					this.list = this.list.concat([data]);
					this.listHandel();
					this.reachBottom();
					chat.chatContactToId(data);
				}, res => {
					this.request.alert('发送失败，请重试');
				});
			},
			/**
			 * 监听websocke数据
			 */
			onMessage: function() {
				let that = this;
				uni.onSocketMessage(function(res) {
					let data = JSON.parse(res.data);
					switch (data.type) {
						case "chat_message": // 发送的信息
							that.list = that.list.concat([data.data]);
							that.listHandel();
							that.reachBottom();
							that.sendMessageRead();
							break;
						default:
							break;
					}
				});
			}
		}
	}
</script>

<style>
	.scroll-view {
		background-color: #FFFFFF;
	}

	.time {
		margin-top: 20upx;
		width: cacl(100vw);
		text-align: center;
		color: rgba(179, 190, 201, 1);
	}

	.content {
		display: flex;
		justify-content: flex-start;
		margin-top: 40upx;
	}

	.content .avatar {
		width: 100upx;
		height: 100upx;
		border-radius: 10upx;
		margin: 0 20upx;
	}

	.content .text {
		margin-left: 15upx;
		padding: 20upx 20upx;
		line-height: 40upx;
		max-width: calc(100vw - 255upx);
		background: rgba(249, 249, 249, 1);
		border-radius: 10upx;
		position: relative;
		border: 1upx solid rgba(237, 237, 237, 1);
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.content .text::before {
		content: '';
		position: absolute;
		top: 40upx;
		left: -10upx;
		z-index: 99;
		border-bottom: 10upx solid transparent;
		border-right: 10upx solid rgba(237, 237, 237, 1);
		border-top: 10upx solid transparent;
	}

	.content .text::after {
		content: '';
		position: absolute;
		z-index: 999;
		top: 40upx;
		left: -8upx;
		border-bottom: 10upx solid transparent;
		border-right: 10upx solid rgba(249, 249, 249, 1);
		border-top: 10upx solid transparent;
	}

	.content .image {
		width: calc(50vw - 140upx);
		margin: 0 15upx;
	}

	.mine .content {
		flex-direction: row-reverse;
	}

	.mine_text {
		padding: 20upx 20upx;
		line-height: 40upx;
		max-width: calc(100vw - 260upx);
		background: rgba(78, 173, 254, 1);
		border-radius: 10upx;
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.mine_text::before {
		content: '';
		position: absolute;
		top: 40upx;
		right: -10upx;
		z-index: 99;
		border-bottom: 10upx solid transparent;
		border-left: 10upx solid rgba(78, 173, 254, 1);
		border-top: 10upx solid transparent;
	}

	.bottom-height {
		height: 50upx;
	}

	.bottom-input {
		position: fixed;
		width: calc(100vw);
		background: rgba(250, 250, 250, 1);
		border: 1px solid rgba(237, 237, 237, 1);
		display: flex;
		padding: 10px 10px;
	}

	.bottom-input .smil,
	.plus {
		width: 25px;
		height: 25px;
		margin-left: 10px;
	}

	.bottom-input .keyboard {
		font-size: 24px;
		margin-right: 10px;
	}

	.bottom-input .microphone {
		width: 20px;
		height: 25px;
		margin-right: 10px;
	}

	.bottom-input textarea {
		background-color: #FFFFFF;
		line-height: 30px;
		height: 30px;
		flex: 1;
		padding-left: 10px;
	}

	.bottom-input .send-message {
		width: 50px;
		height: 25px;
		color: #FFFFFF;
		background-color: rgba(78, 173, 254, 1);
		border-radius: 5px;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-left: 10px;
	}

	.bottom-input .voice {
		width: calc(100vw - 65px);
		height: 36px;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 10upx;
		flex: 1;
	}

	.send-picture {
		position: fixed;
		bottom: 0;
		height: 200px;
		width: calc(100vw);
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.send-picture>view {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.send-picture .picture-bg {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 60px;
		height: 60px;
		border-radius: 5px;
		background: #FFFFFF;
	}

	.send-picture .picture-text {
		width: 60px;
		text-align: center;
		margin-top: 10px;
	}
</style>
