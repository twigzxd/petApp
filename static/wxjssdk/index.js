import request from "static/base/request.js";
import config from "static/base/config.js";
var jweixin = require('jweixin-module')

// 获取jssdk配置参数
request.getData('Basic/getJsApiSignpackage', {
	data: {
		url: window.location.href.split('#')[0]
	}
}).then(res => {
	let data = res.data;
	jweixin.config({
		appId: data.signpackage.appid,
		timestamp: data.signpackage.timestamp,
		nonceStr: data.signpackage.noncestr,
		signature: data.signpackage.signature,
		jsApiList: [
			// 分享接口
			'onMenuShareWeibo',
			'updateAppMessageShareData',
			'onMenuShareAppMessage',
			'onMenuShareTimeline',
			'updateTimelineShareData',
			// 音频接口
			'startRecord',
			'stopRecord',
			'onVoiceRecordEnd',
			'playVoice',
			'pauseVoice',
			'stopVoice',
			'onVoicePlayEnd',
			'uploadVoice',
			'downloadVoice',
			// 图像接口
			'chooseImage',
			'previewImage',
			'uploadImage',
			'downloadImage',
			// 智能接口
			'translateVoice',
			// 设备信息
			'getNetworkType',
			// 地理位置
			'openLocation',
			'getLocation',
			// 界面操作
			'hideOptionMenu',
			'showOptionMenu',
			'hideMenuItems',
			'showMenuItems',
			'hideAllNonBaseMenuItem',
			'showAllNonBaseMenuItem',
			'closeWindow',
			// 微信扫一扫
			'scanQRCode',
			// 微信支付
			'chooseWXPay',
			// 微信小店
			'openProductSpecificView',
			// 微信卡券
			'addCard',
			'chooseCard',
			'openCard',
			'checkJsApi',
			'openAddress'
		]
	})
})

jweixin.getOpenid = function() {
	let getQueryString = function(name) {
		let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
		let r = window.location.search.substr(1).match(reg)
		if (r != null) {
			return unescape(r[2])
		} else {
			return null
		}
	}
	let openid = uni.getStorageSync('openid');
	let authExpireTime = uni.getStorageSync('authExpireTime');
	let jump_number = uni.getStorageSync('jump_number');
	if ((getQueryString('code') === null && !jump_number) || ((localStorage.authExpireTime < Date.parse(
			new Date()) / 1000 || !localStorage.authExpireTime) && !openid)) { // 没有授权 没有OPENID
		request.getData('Basic/wxLogin', {
			data: {
				url: encodeURIComponent(window.location.href)
			}
		}).then(res => {
			const data = res.data
			uni.setStorageSync('authExpireTime', Date.parse(new Date()) / 1000 + 60);
			if (!config.isTest) {
				window.location.href = data.redirect_url
			} else {
				window.location.href = window.location.href + '?code=test'
			}
		})
	} else if (!openid) {
		request.getDataNoMessage('Basic/getOpenidByCode', {
			data: {
				'provider': 'h5_weixin',
				'code': getQueryString('code'),
				'is_test': config.isTest,
				'test_openid': config.testOpenid
			}
		}).then(res => {
			if (res.code === 1) {
				uni.setStorageSync('openid', res.data.openid);
				uni.setStorageSync('jump_number', 1);
			}
		})
	}
}

export default jweixin;
