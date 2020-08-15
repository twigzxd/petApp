import request from "static/base/request.js";

let pushObject = function() {
	this.sendBindCliendId = 5 // 发送clientid绑定user_id 时间单位:秒(s)
};

pushObject.prototype.init = function() {
	var info = plus.push.getClientInfo();
	if (info.clientid != "null") {
		bindClientid(info.clientid);
	}
	//设置程序是否将消息显示在系统消息中心
	plus.push.setAutoNotification(true);
	plus.push.addEventListener('click', _handlePush);
	plus.push.addEventListener('receive', _handlePush);
}

let push = new pushObject();

//发送绑定类型信息,若当前用户不存在,每5秒发送一次
function bindClientid(client_id) {
	let user_id = uni.getStorageSync('user_id');
	if (user_id) {
		request.getDataNoMessage('Push/bindClientId', {
			data: {
				client_id: client_id
			}
		}).then(res => {}, res => {
			bindClientid(client_id);
		})
	} else {
		setTimeout(function() {
			bindClientid(cliend_id);
		}, push.sendBindCliendId * 1000);
	}
}

function _handlePush(message) {
	console.log(message)
	let payload = message.payload;
	if (payload.type == 'jump') {
		uni.navigateTo({
			url: payload.data
		})
	}
	// TODO
};

export default push;
