/**
 * 请求封装
 */

import config from 'static/base/config.js';

let requestObject = function(config) {
	this.host = config.host
	this.entry = config.entry
}




requestObject.prototype.fetchPost = function(url, data) {
	return new Promise((resolve, reject) => {
		uni.request({
			method: 'POST',
			url: this.host + this.entry + url,
			data: data,
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			dataType: 'json',
			success: function(res) {
				resolve(res.data)
			},
			fail: function(res) {
				reject(res)
			}
		})
	})
}


requestObject.prototype.getData = function(url, initial = {}) {
	return new Promise((resolve, reject) => {
		let that = this;
		if (initial.hasOwnProperty('loading') && initial.loading === 1) {
			uni.showLoading({
				title: '加载中',
				mask: true
			})
		}
		if (!initial.hasOwnProperty('data')) {
			initial.data = {};
		}
		initial.data.user_id = uni.getStorageSync('user_id') || '';
		// #ifdef APP-PLUS
		initial.data.uuid = uni.getStorageSync('uuid');
		// #endif
		this.fetchPost(url, initial.data).then(res => {
			if (initial.hasOwnProperty('loading') && initial.loading === 1) {
				uni.hideLoading();
			}
			if (res.code === 1) {
				resolve(res);
			} else {
				this.alert(res.message).then(() => {
					resolve(res);
				});
				resolve(res);
			}

		}).catch(res => {
			uni.showModal({
				title: '',
				content: '网络出错，请稍后重试',
				showCancel: false,
				cancelText: '',
				confirmText: '确定',
				success: res => {},
				fail: () => {},
				complete: () => {}
			});
			reject(res);
		})
	});
}


requestObject.prototype.getDataNoMessage = function(url, initial = {}) {
	return new Promise((resolve, reject) => {
		let that = this;
		if (initial.hasOwnProperty('loading') && initial.loading === 1) {
			uni.showLoading({
				title: '加载中',
				mask: true
			})
		}
		if (!initial.hasOwnProperty('data')) {
			initial.data = {};
		}
		initial.data.user_id = uni.getStorageSync('user_id') || '';
		// #ifdef APP-PLUS
		initial.data.uuid = uni.getStorageSync('uuid');
		// #endif
		this.fetchPost(url, initial.data).then(res => {
			if (initial.hasOwnProperty('loading') && initial.loading === 1) {
				uni.hideLoading();
			}
			resolve(res);
		}).catch(res => {
			uni.showModal({
				title: '',
				content: '网络出错，请稍后重试',
				showCancel: false,
				cancelText: '',
				confirmText: '确定',
				success: res => {},
				fail: () => {},
				complete: () => {}
			});
			reject(res);
		})
	});
}

// getList
//page=1时，自动清空列表加载第1页 page!=1时，加载下一页
requestObject.prototype.getList = function(initial) {
	return new Promise((resolve, reject) => {
		initial.that.load_status = 'loading'
		if (initial.loading) {
			uni.showLoading({
				title: '加载中',
				mask: true
			});
		}

		//请求数据
		initial.data.user_id = uni.getStorageSync('user_id') || '';
		// #ifdef APP-PLUS
		initial.data.uuid = uni.getStorageSync('uuid');
		// #endif

		//判断当前加载页数
		if (initial.page != 1) {
			initial.page = initial.that.page + 1;
		} else {
			initial.page = 1;
			initial.that.list = [];
		}
		initial.data.page = initial.page;

		this.fetchPost(initial.url, initial.data, initial.loading).then(res => {
			if (initial.loading) {
				uni.hideLoading();
			}
			if (res.code == 1) {
				resolve(res);
				if (initial.page == 1) {
					initial.that.list = [];
				}
				let data_list = res.data.data_list; //返回数据里面的列表数据
				if (data_list.current_page == data_list.last_page || !data_list.total) {
					initial.that.load_status='nodata';
				} else {
					initial.that.load_status='finished';
				}
				if (data_list.data.length) {
					let list = initial.that.list;
					list = list.concat(data_list.data);
					initial.that.list = list;
					initial.that.page = initial.page;
				}
			}else{
				initial.that.load_status='hasError';
			}
		}).catch(res => {
			reject(res)
		});
	})
}
// 获取列表-只有上拉
requestObject.prototype.getUpLists = function(initial) {
	return new Promise((resolve, reject) => {
		if (initial.load_status) {
			initial.that.load_status = 'loading'
		}
		if (initial.loading) {
			uni.showLoading({
				title: '加载中',
				mask: true
			});
		}

		//请求数据
		initial.data.user_id = uni.getStorageSync('user_id');

		//判断当前加载页数
		if (initial.page != 1) {
			initial.page = initial.that.page + 1;
		} else {
			initial.page = 1;
			initial.that.list = [];
		}
		initial.data.page = initial.page;

		this.fetchPost(initial.url, initial.data, initial.loading).then(res => {
			if (initial.loading) {
				uni.hideLoading();
			}
			if (res.code == 1) {
				resolve(res);
				if (initial.page == 1) {
					initial.that.list = [];
				}
				let data_list = res.data.data_list; //返回数据里面的列表数据
				if (initial.load_status) {
					if (data_list.current_page == data_list.last_page || !data_list.total) {
						initial.that.load_status = 'noMore';
					} else {
						initial.that.load_status = 'more';
					}
				}
				if (data_list.data.length) {
					let list = initial.that.list;
					// 不同处（聊天记录倒序）
					list = data_list.data.concat(list);
					initial.that.list = list;
					initial.that.page = initial.page;
				}
			}
		}).catch(res => {
			reject(res)
		});
	})
}


// 提示
requestObject.prototype.toast = function(message) {
	uni.showToast({
		title: message,
		icon: 'none',
		mask: true
	})
}

requestObject.prototype.showModel = function(title, content = '', showCancel = false, cancelText = "", confirmText =
	"",
	cancelColor =
	"#000000") {
	return new Promise((resolve, reject) => {
		uni.showModal({
			title: title,
			content: content,
			showCancel: showCancel,
			cancelText: cancelText,
			cancelColor: cancelColor,
			confirmText: confirmText,
			success(res) {
				resolve(res)
			},
			fail(res) {
				reject(res)
			}
		})
	})
}

requestObject.prototype.alert = function(content) {
	return new Promise((resolve, reject) => {
		this.showModel("", content, false, "", "确定").then((res) => {
			resolve(res)
		}).then((res) => {
			reject(res)
		})
	})
}

requestObject.prototype.confirm = function(content, cancelText = "取消", confirmText = "确定") {
	return new Promise((resolve, reject) => {
		this.showModel("", content, true, cancelText, confirmText).then((res) => {
			resolve(res)
		}).then((res) => {
			reject(res)
		})
	})
}

let request = new requestObject(config);
export default request;
