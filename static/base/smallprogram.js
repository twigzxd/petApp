import config from "static/base/config.js";
import request from "static/base/request.js";

let smallProgramObject = function(config) {
	this.isTest = config.isTest
	this.testOpenid = config.testOpenid
}


smallProgramObject.prototype.getOpenid = function() {
	return new Promise((resolve, reject) => {
		uni.getProvider({
			service: 'oauth',
			success: function(res) {
				if (~res.provider.indexOf('qq')) { // qq登录
					uni.login({
						provider: 'qq',
						success: function(loginRes) {
							console.log(JSON.stringify(loginRes));
						}
					});
				}
				if (~res.provider.indexOf('weixin')) { //微信小程序登录
					uni.login({
						provider: 'weixin',
						success: function(loginRes) {
							getUserId('weixin', loginRes.code);
						}
					})
				}
			}
		});
	});
}

function getUserId(provider, code) {
	return new Promise((resolve, reject) => {
		request.getData('Basic/getOpenidByCode', {
			data: {
				'provider': provider,
				'code': code,
				'is_test': config.isTest,
				'test_openid': config.testOpenid
			},
			loading: 1
		}).then(res => {
			uni.setStorageSync('openid', res.data.openid);
		}, err => {
			console.log(err)
		})
	})
}


let smallProgram = new smallProgramObject(config);
export default smallProgram
