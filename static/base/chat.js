import request from "static/base/request.js";
import common from "static/base/common.js";
let chatObject = function() {}

chatObject.prototype.init = function(websocketObject) {
	this.getContactList();
	this.onMessage(websocketObject);
}

/**
 * 死循环直到用户登录获取用户聊天列表
 */
chatObject.prototype.getContactList = function() {
	let user_id = uni.getStorageSync('user_id');
	let that = this;
	if (user_id) {
		request.getData('Chat/getUserFriendList', {
			data: {
				user_id: user_id
			},
			loading: 2
		}).then(res => {
			let data = chatContactHandel(res.data);
			getApp().globalData.chat_contact = data;
			uni.$emit('chageContactUpdate')
		}, res => {
			that.getContactList();
		})
	} else {
		setTimeout(function() {
			that.getContactList();
		}, 1500)
	}
}

/**
 * 监听websocket更新聊天列表数据
 * @param {Object} websocketObject
 */
chatObject.prototype.onMessage = function(websocketObject) {
	let that = this;
	if (websocketObject.is_link == false) {
		setTimeout(function() {
			that.onMessage(websocketObject);
		}, 100)
	} else {
		uni.onSocketError(function(res) {
			console.log('WebSocket连接打开失败，请检查！');
		});

		uni.onSocketMessage(function(res) {
			let data = JSON.parse(res.data);
			let chat_contact = getApp().globalData.chat_contact
			switch (data.type) {
				case 'message_read': //被通知信息已读
					for (let prop in chat_contact) {
						if (chat_contact[prop]['friend_id'] == data.data.user_id) {
							chat_contact[prop]['is_read'] = 1;
						}
					}
					getApp().globalData.chat_contact = chat_contact;
					uni.$emit('chageContactUpdate')
					break;
				case 'chat_message': //发送消息
					let is_exit = 2;
					for (let prop in chat_contact) {
						if (chat_contact[prop]['friend_id'] == data.data.from_id) {
							chat_contact[prop]['is_read'] = 2;
							chat_contact[prop]['type'] = data.data.type;
							chat_contact[prop]['content'] = changeContentByType(data.data.type, data.data.content);
							chat_contact[prop]['last_time'] = data.data.create_time;
							is_exit = 1;
						}
					}
					// 暂时不存在直接聊天成为好友
					// if (is_exit == 2) {
					// 	chat_contact = chat_contact.concat([{
					// 		friend_id: data.data.from_id,
					// 		user_id: data.data.to_id,
					// 		is_read: data.data.is_read,
					// 		last_time: data.data.create_time,
					// 		nickname: data.data.nickname,
					// 		avatar: data.data.avatar,
					// 		type: data.data.type,
					// 		content: changeContentByType(data.data.type, data.data.content),
					// 	}]);
					// }
					chat_contact = chatContactHandel(chat_contact);
					getApp().globalData.chat_contact = chat_contact;
					uni.$emit('chageContactUpdate')

					//全局监听,走此处表示未在聊天页面,有未读消息,进行消息通知
					request.getDataNoMessage('Push/chatMessagePush', {
						data: {
							from_id: data.data.from_id,
							to_id: data.data.to_id
						}
					})
				default:
					break;
			}
		});
	}
}

chatObject.prototype.chatContactToId = function(data) {
	let chat_contact = getApp().globalData.chat_contact;
	for (let prop in chat_contact) {
		if (chat_contact[prop]['friend_id'] == data.to_id) {
			chat_contact[prop]['type'] = data.type;
			chat_contact[prop]['content'] = changeContentByType(data.type, data.content);
			chat_contact[prop]['last_time'] = data.create_time;
		}
	}
	chat_contact = chatContactHandel(chat_contact);
	getApp().globalData.chat_contact = chat_contact;
	uni.$emit('chageContactUpdate')
}


/**
 * 聊天列表好友数据处理
 * @param {Object} data
 */
function chatContactHandel(data) {
	data = common.sortByFileName(data, 'last_time');
	for (let prop in data) {
		data[prop]['show_time'] = changeShowTime(data[prop]['last_time']);
	}

	return data;
}

/**
 * 格式化时间 满足项目要求 
 * @param {int} last_time
 */
function changeShowTime(last_time) {
	var handel_time = new Date(parseInt(last_time * 1000));
	if (common.isToday(last_time)) {
		return common.dateFormat(handel_time, 'hh:mm')
	} else {
		return common.dateFormat(handel_time, 'MM月dd日')
	}
}

/**
 * 根据类型返回
 * @param {Object} type
 * @param {Object} content
 */
function changeContentByType(type, content) {
	switch (type) {
		case 1: //文字类型
			return content;
			break;
		case 2: //语音类型
			return "[语音]";
			break;
		case 3: //图片类型
			return "[图片]";
			break;
		default:
			return content;
			break;
	}
}

let chat = new chatObject();
export default chat;
