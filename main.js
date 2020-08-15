import Vue from 'vue'
import App from './App'
import "./common/iconfont/iconfont.css";
import "./common/iconfonts/iconfont.css";
import "./common/iconfontsss/iconfont.css";
import "./common/iconfontssss/iconfont.css";
import "./common/chongniicon/iconfont.css";
Vue.config.productionTip = false
// let device_id = plus.device.uuid.split(',',1).toString();
// uni.setStorageSync('device_id',device_id);
App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()

// 支付
Vue.prototype.pay = function(initial) {
	const convert = {
		1: 'wxpay',
		2: 'alipay'
	};
	return new Promise((resolve, reject) => {
		uni.requestPayment({
			provider: convert[initial.pay_way],
			orderInfo: initial.order_info, //微信、支付宝订单数据
			success: function(res) {
				resolve(res);
				console.log('success:' + JSON.stringify(res));
			},
			fail: function(err) {
				reject(err);
				console.log('fail:' + JSON.stringify(err));
			}
		});
	})
}
