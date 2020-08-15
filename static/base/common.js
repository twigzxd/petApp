let commonObject = function() {}
import request from "static/base/request.js";
import config from "static/base/config.js";

/**
 * 验证 必填项
 * @param {String} data 
 * @param {String} message 提示信息
 */
commonObject.prototype.isMust = function(data, message) {
	for (let value in data) {
		if ((data[value] === "" || typeof(data[value]) == "undefined") && message.hasOwnProperty(value)) {
			throw new Error(message[value])
		}
	}
	return true;
}

/**
 * 验证 是否合法IP地址
 * @param {String} value
 */
commonObject.prototype.validateIp = function(value) {
	if (value == '' || value == undefined || value == null) {
		return true;;
	} else {
		const reg =
			/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
		if ((!reg.test(value)) && value != '') {
			throw new Error('请输入正确的IP地址');
		} else {
			return true;;
		}
	}
}


/**
 * 验证 是否手机号码或者固话
 * @param {String} value
 */
commonObject.prototype.validatePhoneTwo = function(value) {
	const reg = /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/;;
	if (value == '' || value == undefined || value == null) {
		return true;;
	} else {
		if ((!reg.test(value)) && value != '') {
			throw new Error('请输入正确的电话号码或者固话号码');
		} else {
			return true;;
		}
	}
}


/**
 * 验证 是否固话
 * @param {String} value
 */
commonObject.prototype.validateTelphone = function(value) {
	const reg = /0\d{2,3}-\d{7,8}/;
	if (value == '' || value == undefined || value == null) {
		return true;;
	} else {
		if ((!reg.test(value)) && value != '') {
			throw new Error('请输入正确的固定电话');
		} else {
			return true;;
		}
	}
}


/**
 * 验证 是否手机号码
 * @param {String} value
 */
commonObject.prototype.validatePhone = function(value) {
	const reg = /^[1][3-9][0-9]{9}$/;
	if (value == '' || value == undefined || value == null) {
		return true;
	} else {
		if ((!reg.test(value)) && value != '') {
			throw new Error('请输入正确的电话号码')
		} else {
			return true;
		}
	}
}


/**
 * 验证 是否身份证号码
 * @param {String} value
 */
commonObject.prototype.validateIdNo = function(value) {
	const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
	if (value == '' || value == undefined || value == null) {
		return true;;
	} else {
		if ((!reg.test(value)) && value != '') {
			throw new Error('请输入正确的身份证号码');
		} else {
			return true;;
		}
	}
}


/**
 * 验证 是否邮箱
 * @param {String} value
 */
commonObject.prototype.validateEMail = function(value) {
	const reg = /^([a-zA-Z0-9]+[-_\.]?)+@[a-zA-Z0-9]+\.[a-z]+$/;
	if (value == '' || value == undefined || value == null) {
		return true;;
	} else {
		if (!reg.test(value)) {
			throw new Error('请输入正确的邮箱');
		} else {
			return true;;
		}
	}
}


/**
 * 验证 合法url
 * @param {String} value
 */
commonObject.prototype.validateURL = function(url) {
	const urlregex =
		/^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
	return urlregex.test(url);
}


/**
 * 验证 验证内容是否包含英文数字以及下划线
 * @param {String} value
 */
commonObject.prototype.isPassword = function(value) {
	const reg = /^[_a-zA-Z0-9]+$/;
	if (value == '' || value == undefined || value == null) {
		return true;;
	} else {
		if (!reg.test(value)) {
			throw new Error('仅由英文字母，数字以及下划线组成');
		} else {
			return true;;
		}
	}
}


/**
 * 验证 自动检验数值的范围
 * @param {String} value
 */
commonObject.prototype.checkMax20000 = function(value) {
	if (value == '' || value == undefined || value == null) {
		return true;;
	} else if (!Number(value)) {
		throw new Error('请输入[1,20000]之间的数字');
	} else if (value < 1 || value > 20000) {
		throw new Error('请输入[1,20000]之间的数字');
	} else {
		return true;;
	}
}


/**
 * 验证 验证是否1 - 99 之间
 * @param {String} value
 */
commonObject.prototype.isOneToNinetyNine = function(value) {
	if (!value) {
		throw new Error('输入不可以为空');
	}
	setTimeout(() => {
		if (!Number(value)) {
			throw new Error('请输入正整数');
		} else {
			const re = /^[1-9][0-9]{0,1}$/;
			const rsCheck = re.test(value);
			if (!rsCheck) {
				throw new Error('请输入正整数，值为【1,99】');
			} else {
				return true;;
			}
		}
	}, 0);
}


/**
 * 验证 验证是否整数
 * @param {String} value
 */
commonObject.prototype.isInteger = function(value) {
	if (!value) {
		throw new Error('输入不可以为空');
	}
	setTimeout(() => {
		if (!Number(value)) {
			throw new Error('请输入正整数');
		} else {
			const re = /^[0-9]*[1-9][0-9]*$/;
			const rsCheck = re.test(value);
			if (!rsCheck) {
				throw new Error('请输入正整数');
			} else {
				return true;;
			}
		}
	}, 0);
}


/**
 * 验证 验证是否整数, 非必填
 * @param {String} value
 */
commonObject.prototype.isIntegerNotMust = function(value) {
	if (!value) {
		return true;;
	}
	setTimeout(() => {
		if (!Number(value)) {
			throw new Error('请输入正整数');
		} else {
			const re = /^[0-9]*[1-9][0-9]*$/;
			const rsCheck = re.test(value);
			if (!rsCheck) {
				throw new Error('请输入正整数');
			} else {
				return true;;
			}
		}
	}, 1000);
}

/**
 * 验证 是否是[0 - 1] 的小数
 * @param {String} value
 */
commonObject.prototype.isDecimal = function(value) {
	if (!value) {
		throw new Error('输入不可以为空');
	}
	setTimeout(() => {
		if (!Number(value)) {
			throw new Error('请输入[0,1]之间的数字');
		} else {
			if (value < 0 || value > 1) {
				throw new Error('请输入[0,1]之间的数字');
			} else {
				return true;;
			}
		}
	}, 100);
}

/**
 * 验证 验证是否是[1 - 10] 的小数, 即不可以等于0
 * @param {String} value
 */
commonObject.prototype.isBtnOneToTen = function(value) {
	if (typeof value == 'undefined') {
		throw new Error('输入不可以为空');
	}
	setTimeout(() => {
		if (!Number(value)) {
			throw new Error('请输入正整数，值为[1,10]');
		} else {
			if (!(value == '1' || value == '2' || value == '3' || value == '4' || value == '5' || value == '6' || value ==
					'7' || value == '8' || value == '9' || value == '10')) {
				throw new Error('请输入正整数，值为[1,10]');
			} else {
				return true;;
			}
		}
	}, 100);
}

/**
 * 验证 验证是否是[1 - 100] 的小数, 即不可以等于0
 * @param {String} value
 */
commonObject.prototype.isBtnOneToHundred = function(value) {
	if (!value) {
		throw new Error('输入不可以为空');
	}
	setTimeout(() => {
		if (!Number(value)) {
			throw new Error('请输入整数，值为[1,100]');
		} else {
			if (value < 1 || value > 100) {
				throw new Error('请输入整数，值为[1,100]');
			} else {
				return true;;
			}
		}
	}, 100);
}

/**
 * 验证 验证是否是[0 - 100] 的小数
 * @param {String} value
 */
commonObject.prototype.isBtnZeroToHundred = function(value) {
	if (!value) {
		throw new Error('输入不可以为空');
	}
	setTimeout(() => {
		if (!Number(value)) {
			throw new Error('请输入[1,100]之间的数字');
		} else {
			if (value < 0 || value > 100) {
				throw new Error('请输入[1,100]之间的数字');
			} else {
				return true;;
			}
		}
	}, 100);
}

/**
 * 验证 端口是否在[0, 65535] 之间
 * @param {String} value
 */
commonObject.prototype.isPort = function(value) {
	if (!value) {
		throw new Error('输入不可以为空');
	}
	setTimeout(() => {
		if (value == '' || typeof(value) == undefined) {
			throw new Error('请输入端口值');
		} else {
			const re = /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;
			const rsCheck = re.test(value);
			if (!rsCheck) {
				throw new Error('请输入在[0-65535]之间的端口值');
			} else {
				return true;;
			}
		}
	}, 100);
}

/**
 * 验证 小写字母
 * @param {Object} val
 */
commonObject.prototype.validateLowerCase = function(val) {
	const reg = /^[a-z]+$/;
	return reg.test(val);
}

/**
 * 验证 两位小数验证
 * @param {String} value
 */
commonObject.prototype.validateValidity = function(value) {
	if (!/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(value)) {
		throw new Error('最多两位小数！！！');
	} else {
		return true;;
	}
};

/**
 * 验证 是否大写字母
 * @param {String} value
 */
commonObject.prototype.validateUpperCase = function(val) {
	const reg = /^[A-Z]+$/;
	return reg.test(val);
}

/**
 * 验证 是否大小写字母
 * @param {String} value
 */
commonObject.prototype.validatAlphabets = function(val) {
	const reg = /^[A-Za-z]+$/;
	return reg.test(val);
}

/**
 * 验证 密码校验
 * @param {String} value
 */
commonObject.prototype.validatePsdReg = function(value) {
	if (!value) {
		throw new Error('请输入密码')
	}
	if (!/^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$)([^\u4e00-\u9fa5\s]){6,20}$/.test(value)) {
		throw new Error('请输入6-20位英文字母、数字或者符号（除空格），且字母、数字和标点符号至少包含两种')
	} else {
		return true;
	}
}

/**
 * 验证 中文校验
 * @param {String} value
 */
commonObject.prototype.validateContacts = function(value) {
	if (!value) {
		throw new Error('请输入中文')
	}
	if (!/^[\u0391-\uFFE5A-Za-z]+$/.test(value)) {
		throw new Error('不可输入特殊字符')
	} else {
		return true;
	}
}

/**
 * 验证 账号校验
 * @param {String} value
 */
commonObject.prototype.validateCode = function(value) {
	if (!value) {
		throw new Error('请输入账号')
	}
	if (!/^(?![0-9]*$)(?![a-zA-Z]*$)[a-zA-Z0-9]{6,20}$/.test(value)) {
		throw new Error('账号必须为6-20位字母和数字组合')
	} else {
		return true;
	}
}

/**
 * 验证 纯数字校验
 * @param {String} value
 */
commonObject.prototype.validateNumber = function(value) {
	let numberReg = /^\d+$|^\d+[.]?\d+$/
	if (value !== '') {
		if (!numberReg.test(value)) {
			throw new Error('请输入数字')
		} else {
			return true;
		}
	} else {
		throw new Error('请输入值')
	}
}

/**
 * 验证 最多一位小数
 * @param {String} value
 */
commonObject.prototype.onePoint = function(value) {
	if (!/^[0-9]+([.]{1}[0-9]{1})?$/.test(value)) {
		throw new Error('最多一位小数！！！');
	} else {
		return true;;
	}
};

/**
 * 验证 获取手机验证码
 */
commonObject.prototype.getCode = function(that, type = 1) {
	let mobile_phone = that.mobile_phone;
	let time = setInterval(function() {
		that.message--;
		if (that.message <= 0) {
			that.message = 60;
			clearInterval(time)
		}
	}, 1000)
	request.getData("Basic/getCode", {
		data: {
			mobile_phone: mobile_phone,
			type: type
		}
	}).then(res => {
		if (res.code != 1) {
			that.request.alert(res.message).then(() => {
				that.message = 60;
				clearInterval(time);
			});
		}

	})
}

/**
 * 上传图片
 */
commonObject.prototype.upload = function(path, that, array = []) {
	return new Promise((resolve, reject) => {
		if (path.length > 0) {
			let filePaht = path.shift();
			uni.uploadFile({
				url: config.host + config.entry + "Upload/Upload", //仅为示例，非真实的接口地址
				filePath: filePaht,
				name: 'file',
				success: (uploadFileRes) => {
					if (uploadFileRes.statusCode === 200) {
						array.push(JSON.parse(uploadFileRes.data).data.url);
						that.upload(path, that, array).then(res => {
							resolve(res);
						}, res => {
							reject(res);
						});
					} else {
						reject('上传失败，接口报错');
					}
				},
				fail(res) {
					reject(res);
				}
			});
		} else {
			resolve(array);
		}
	})
}

/**
 * 选择图片
 */
commonObject.prototype.chooseImage = function(count, sourceType = ['album', 'camera'], sizeType = ['original',
	'compressed'
]) {
	return new Promise((resolve, reject) => {
		let that = this;
		uni.showLoading({
			mask: true,
			title: '加载中'
		})
		uni.chooseImage({
			count: count, //默认9
			sizeType: sizeType,
			//可以指定是原图还是压缩图，默认二者都有
			sourceType: sourceType,
			//从相册选择
			success: function(res) {
				that.upload(res.tempFilePaths, that).then(res => {
					uni.hideLoading();
					resolve(res)
				}, res => {
					uni.hideLoading();
					reject(res);
				});
			}
		});
	})
}

/**
 * 加载中
 */
commonObject.prototype.showLoading = function() {
	uni.showLoading({
		mask: true,
		title: "加载中"
	})
}

/**
 * 取消记载中
 */
commonObject.prototype.hideLoading = function() {
	uni.hideLoading();
}

/**
 * 根据字段名 二维对象排序
 * @param {Object} object 二维对象数据
 * @param {string} file_name 二维对象中字段名
 */
commonObject.prototype.sortByFileName = function(array, file_name) {
	let len = array.length,
		gap = parseInt(len / 2),
		i, j, tmp, result = [];
	// 复制数组
	result = this.shallowCopy(array);
	while (gap > 0) {
		for (i = gap; i < len; i++) {
			tmp = result[i];
			j = i - gap;
			while (j >= 0 && tmp[file_name] > result[j][file_name]) {
				result[j + gap] = result[j];
				j = j - gap;
			}
			result[j + gap] = tmp;
		}
		gap = parseInt(gap / 2);
	}
	return result;
}
/**
 * 深度拷贝二维数组
 * @param {Object} src
 */
commonObject.prototype.shallowCopy = function(obj) {
	let out = [],
		i = 0,
		len = obj.length;
	for (; i < len; i++) {
		if (obj[i] instanceof Array) {
			out[i] = deepcopy(obj[i]);
		} else out[i] = obj[i];
	}
	return out;
}

/**
 * 判断时间戳是否是当前时间
 * @param {int} date 秒级时间戳
 */
commonObject.prototype.isToday = function(date) {
	var d = new Date(parseInt(date) * 1000);
	var todaysDate = new Date();
	if (d.setHours(0, 0, 0, 0) == todaysDate.setHours(0, 0, 0, 0)) {
		return true;
	} else {
		return false;
	}
}

/**
 * 格式化日期
 * @param {Object} thisDate 时间对象
 * @param {Object} fmt 格式 例: "yyyy-MM-dd hh:mm:ss"
 */
commonObject.prototype.dateFormat = function(thisDate, fmt) {
	var o = {
		"M+": thisDate.getMonth() + 1,
		"d+": thisDate.getDate(),
		"h+": thisDate.getHours(),
		"m+": thisDate.getMinutes(),
		"s+": thisDate.getSeconds(),
		"q+": Math.floor((thisDate.getMonth() + 3) / 3),
		"S": thisDate.getMilliseconds()
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (thisDate.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}

/**
 * 判断是否需要登录
 */
commonObject.prototype.judgeIsNeedLogin = function() {
	return new Promise((resolve, reject) => {
		let user_id = uni.getStorageSync('user_id');
		if (!user_id) {
			uni.navigateTo({
				url: "/pages/register/index"
			})
			reject();
		}
		resolve();
	})
}

let common = new commonObject();
export default common
