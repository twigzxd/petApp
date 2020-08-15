let websocketObject = function() {
	this.url = "wss://ym.jucheng01.net:9000" // 链接地址
	this.is_link = false //是否连接上
	this.error = 0
	this.message = '正常运行中'
	this.sendBindTime = 5 // 发送绑定类型信息,若当前用户未登录,多久一次进行再次发起绑定 时间单位:秒(s)
	this.is_normal_close = false // 是否是正常关闭链接
	this.timer = '' // 定时器ID
}


//发送消息
websocketObject.prototype.sendMessage = function(data) {

	return new Promise((resolve, reject) => {
		if (this.is_link === false) {
			reject({
				error: 102,
				message: 'websocket未连接'
			});
		}

		if (Object.prototype.toString.call(data) === '[Object Object]') {
			reject({
				error: 103,
				message: '数据格式不对,请传入对象',
			})
		}


		//判断数据类型
		if (!data.hasOwnProperty('type')) {
			reject({
				error: 103,
				message: '数据格式不对,请传入type属性(发送的消息类型)',
			})
		}
		if (!data.hasOwnProperty('data')) {
			reject({
				error: 103,
				message: '数据格式不对,请传入data属性(发送的数据包,自定义)',
			})
		}
		if (!data.hasOwnProperty('to_user_id')) {
			reject({
				error: 103,
				message: '数据格式不对,请传入to_user_id属性(发送给谁,用户的user_id)',
			})
		}

		uni.sendSocketMessage({
			data: JSON.stringify(data),
			success: function(res) {
				resolve(res);
			},
			fail: function(res) {
				reject(res);
			}
		})
	})
}

// 监听WebSocket接受到服务器的消息事件
websocketObject.prototype.onMessage = function() {
	return new Promise((resolve, reject) => {
		if (this.is_link === false) {
			reject({
				error: 102,
				message: 'websocket未连接'
			});
		}

		uni.onSocketMessage(function(res) {
			let data = JSON.parse(res.data);
			switch (data.type) {
				case 'ping': // 心跳类型,不进行返回
					break;
				default:
					resolve(data)
					break;
			}
		});
	})
}

// 监听WebSocket关闭
websocketObject.prototype.onClose = function() {
	return new Promise((resolve, reject) => {
		let that = this;
		if (this.is_link === false) {
			reject({
				error: 102,
				message: 'websocket未连接'
			});
		}

		uni.onSocketClose(function(res) {
			if (that.is_normal_close === false) { //非正常关闭
				errorMessage(104, 'wensocket连接断开')
			}
			that.is_link = false;
			if (that.timer) {
				clearInterval(that.timer);
			}
		});
	})
}

//主动关闭websocket
websocketObject.prototype.close = function() {
	return new Promise((resolve, reject) => {
		if (this.is_link === false) {
			reject({
				error: 102,
				message: 'websocket未连接'
			});
		}
		uni.closeSocket();
		this.is_normal_close = true;
	})
}

//进行链接
websocketObject.prototype.init = function() {
	let that = this;

	uni.connectSocket({
		url: this.url,
		complete: (res) => {}
	});

	uni.onSocketOpen(function(res) {
		that.is_link = true;
		that.error = 0;
		that.message = '正常运行中';
		that.is_normal_close = false;
		that.onClose();
		console.log('websocket连接成功');
		sendBindMessage();
		sendHeartBeat();
	});

	uni.onSocketError(function(res) {
		errorMessage(101, 'WebSocket连接打开失败，请检查！')
	})

}



let websocket = new websocketObject();

//发送绑定类型信息,若当前用户不存在,每5秒发送一次
function sendBindMessage() {
	let user_id = uni.getStorageSync('user_id');
	if (user_id) {
		websocket.sendMessage({
			type: 'clientBindUserId',
			data: {
				user_id: user_id
			},
			to_user_id: ""
		})
	} else {
		setTimeout(function() {
			sendBindMessage();
		}, websocket.sendBindTime * 1000);
	}
}

//发送心跳数据
function sendHeartBeat() {
	let timer = setInterval(function() {
		console.log(123);
		websocket.sendMessage({
			type: "checkHeartBeat",
			data: "",
			to_user_id: ""
		})
	}, 9000)
	websocket.timer = timer;
}

//打印错误信息
function errorMessage(error, message) {
	websocket.error = error;
	websocket.message = message;
	consoleErrMessage();
}

function consoleErrMessage() {
	console.log('websocket:', "{error:" + websocket.error + ",message:" + websocket.message + "}");
	setTimeout(function() {
		websocket.init();
	}, 3000);
}

function normalMessage() {
	websocket.error = 0;
	websocket.message = '正常运行中';
}


export default websocket
