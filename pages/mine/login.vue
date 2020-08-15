<template>
	<div ref="outerWrapper" class="login">
		<div class="header">
		  <img :src="register_logo" alt="">
		</div>
		<div class="flex__column content">
		  <input type="number" placeholder="手机号" v-model="mobile_phone">
		  <input type="password" placeholder="请输入密码" v-model="password">
		</div>
		<div class="footer">
		  <button @click="login">登陆</button>
		  <div class="flex__between footer__bottom">
			<div class="flex">
			  <span class="fs_26 c_b3">没有账号？</span>
			  <navigator url="./register">
				<span class="fs_26 c_main">立即注册</span>
			  </navigator>
			</div>
			<navigator url="./password">
				<span class="fs_26 c_main">忘记密码</span>
			</navigator>
		  </div>
		</div>
		
		<view class="flex__center text-box">
			<view class="flex__center__center checkbox__item">
				<text class="jcicon jcicon-dui c_1a fs_36" v-if="set_read" @click="set_read=!set_read"></text>
				<text class="jcicon jcicon-unselected c_80 fs_36" v-else @click="set_read=!set_read"></text>
			</view>
			<text class="fs_26 c_1a ml_10">勾选协议</text>
			<text class="fs_26 c_main text_underline" @click="read_show=!read_show">《用户使用协议》</text>
		</view>
		
		<view class="other-box">
			<text class="fs_28 c_1a">其他登录方式</text>
			<view class="other-box__bottom">
				<image src="../../static/images/wechat.png" mode="" @click="wechatLogin"></image>
			</view>
		</view>
		<view class="text-modal" v-show="read_show">
			<view class="text-modal__content">
				<text class="iconfont icon-ai54 fs_50 c_1a modal-close" @click="read_show=!read_show"></text>
				<rich-text class="modular__content" :nodes="read_text"></rich-text>
			</view>
		</view>
	</div>
</template>
<script>
const app=getApp();
export default {
    name: "Login",
    data() {
		return {
			logo_img: '',
			mobile_phone: '',
			password: '',
			register_logo: '',
			isCanScroll: false,
			set_read: true,
			read_text: '',
			read_show: false
		}
    },
    methods: {
		wechatLogin(){
			if(this.set_read){
				const _this=this;
				uni.getProvider({
					service: 'oauth',
					success: function (res) {
						if (~res.provider.indexOf('weixin')) {
							uni.login({
								provider: 'weixin',
								success: function (loginRes) {
									uni.getUserInfo({
										provider: 'weixin',
										success: function (infoRes) {
											app.$vm.getData({
												url:'Vip/wechat',
												that: _this,
												data: {
													openid: infoRes.userInfo.openId
												},
												loading: 1
											}).then(res=>{
												if(res.data.is_bind==1){
													uni.reLaunch({
														url:'/pages/mall/index'
													})
												}else{
													uni.navigateTo({
														url:'/pages/mine/register'
													})
												}
												uni.setStorageSync('user_id', res.data.user_id);
											})
										}
									});
								}
							});
						}
					}
				});
			}else{
				uni.showToast({
					title: '请阅读用户使用协议',
					icon: 'none'
				});
			}
		},
		login() {
			if (!this.mobile_phone) {
				uni.showToast({
					title: '请输入手机号',
					icon: 'none'
				});
				return;
			} else if (!this.password) {
				uni.showToast({
					title: '请输入密码',
					icon: 'none'
				});
				return;
			}
			if(this.set_read){
				app.$vm.getData({
					url:'Vip/login',
					that: this,
					data: {
						mobile_phone: this.mobile_phone,
						password: this.password
					},
					loading: 1
				}).then(res=>{
					if (res.code == 1) {
						uni.setStorageSync('user_id', res.data.user_id);
						uni.reLaunch({
							url:'/pages/mall/index'
						})
					} else {
						uni.showToast({
							title: res.message,
							icon: 'none'
						});
					}
				})
			}else{
				uni.showToast({
					title: '请阅读用户使用协议',
					icon: 'none'
				});
			}
		}
    },
    onLoad() {
		uni.setStorageSync('user_id', '');
		app.$vm.getData({
			url:'Vip/getRegisterLogo',
			that: this,
			data: {},
			loading: 1
		}).then(res=>{
			this.register_logo = res.data.register_logo;
		})
		app.$vm.getData({
			url:'/vip/getUse',
			that: this,
			data: {},
			loading: 1
		}).then(res=>{
			this.read_text = res.data;
		})
    }
  }
</script>
<style scoped>
	.text-modal{
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		z-index: 1;
		background: rgba(0,0,0,0.5);
		width: 100%;
	}
	.text-modal__content{
		position: absolute;
		top: 50upx;
		left: 50upx;
		bottom: 50upx;
		width: 650upx;
		padding: 30upx;
		background: #fff;
		border-radius: 10upx;
	}
	.modal-close{
		position: absolute;
		top:10upx;
		right: 10upx;
	}
  .login {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    padding: 0 75upx;
    background: #fff;
  }

  .header {
    margin-top: 80upx;
    text-align: center;
  }

  .header img {
    width: 200upx;
    height: 200upx;
  }

  .content {
    margin-top: 60upx;
  }

  .content input {
    height: 100upx;
    border-bottom: 2upx solid #e6e6e6;
    font-size: 28upx;
  }

  .footer {
    margin-top: 80upx;
  }

  .footer button {
    width: 600upx;
    height: 98upx;
	line-height: 98upx;
    border-radius: 10upx;
    background: #1A1A1A;
    font-size: 32upx;
    color: #fff;
  }

  .footer .footer__bottom {
    margin-top: 40upx;
  }
  .text-box{
	  margin-top: 40upx;
  }
  .other-box{
	  margin-top: 70upx;
	  text-align: center;
  }
  .other-box__bottom{
	  margin-top: 50upx;
  }
  .other-box__bottom image{
	  width: 110upx;
	  height: 110upx;
  }
</style>



