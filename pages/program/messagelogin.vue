<template>
	<view>
		<view class="logintxt">登录以使用更多服务</view>
		<view class="box">
			<view class="li_item">
				<view class="icon-icon-test iconfont"></view>
				<view class="number">+39</view>
				<view class="line"></view>
				<input type="number" v-model="phone" placeholder="请输入手机号" maxlength="11" placeholder-style="color:#B3B3B3;font-size:28upx;line-height:34upx"/>
			</view>
			<view class="li_item">
				<view class="icon-icon-test1 iconfont"></view>
				<input type="number" v-model="code" placeholder="请输入验证码" maxlength="11" placeholder-style="color:#B3B3B3;font-size:28upx;line-height:34upx"/>
				<view class="get" @click="getCode" v-if="check_get">{{text}}</view>
				<view class="get" v-else>{{number}}</view>
			</view>
		</view>
		<view class="login" @click="login">
			登录
		</view>
		<view class="funtion">
			<view class="account" @click="accountlogin">账号密码登录</view>
			<view class="new" @click="newreg">新用户注册</view>
		</view>
		<view class="threelogin">
			<view class="hline"></view>
			 <!-- @click="logins('weixin')" -->
			<view class="threetxt">第三方登录方式</view>
			<view class="hline"></view>
		</view>
		<view class="flex align-center add-login">
			<view class="wechat" @click="logins('weixin')">
				 <!-- @click="wechat" -->
				<view class="wechatlogo iconfont icon-guquanzixun-icon_huabanfuben"></view>
			</view>
			<view class="third_list flex justify-center align-center" v-if="appleObject" @click="logins('apple')">
				<img class="third_list-image" src="../../static/app-plus/apple.png" />
			</view>
		</view>
		<view class="tips">未注册的手机号验证后自动注册,登录即代表您已同意<text class="deal" @click="deal">《隐私协议》</text></view>
	</view>
</template>

<script>
	const app = getApp();
	export default{
		data(){
			return{
				text:'获取验证码',
				phone:'',
				code:'',
				number:'60s',
				check_get:true,
				uuid:'',
				
				appleObject:false//是否苹果登录
			}
		},
		methods:{
			accountlogin(){
				uni.reLaunch({
					url:'./accountlogin'
				})
			},
			newreg(){
				uni.navigateTo({
					url:'./newaccount'
				})
			},
			deal(){
				uni.navigateTo({
					url:'./ysdeal'
				})
			},
			wechat(){
				
			},
			getCode() {
			    if (this.phone && this.check_get) {
					app.$vm.getData({
						url:'Basic/getCode',
						that: this,
						data: {
							mobile_phone: this.phone,
						},
						loading: 1
					}).then(res=>{
			            if (res.code==1) {
			                this.check_get=false;
			                this.code_text='重新获取';
			                this.number= '60s';
			                var times = 60;
			                const interval = setInterval(()=>{
			                    times--;
			                    if (times) {
			                        this.number=times + 's';
			                    } else {
			                        clearInterval(interval);
			                        this.number='';
			                        this.check_get=true;
			                        this.code_text='重发验证码';
			                    }
			                }, 1000);
			            } else {
							uni.showToast({
								title:res.message,
								icon: 'none'
							})
			            }
			        });
			    } else {
			        if (!this.phone) {
						uni.showToast({
							title:'请输入正确的手机号',
							icon: 'none'
						})
			        }
			    }
			},
			login(){
				if (!this.phone) {
					uni.showToast({
						title:'请输入手机号',
						icon: 'none'
					})
					return false
				}
				if (!this.code) {
					uni.showToast({
						title:'请输入验证码',
						icon: 'none'
					})
					return false
				}
				app.$vm.getData({
					url:'Register/login',
					that: this,
					data: {
						type:1,
						mobile_phone: this.phone,
						code:this.code,
						provide:'app_plus',
						uuid:this.uuid,
					},
					loading: 1
				}).then(res=>{
					uni.setStorageSync('user_id',res.data.user_id)
					if(res.code==1){
						uni.showToast({
							title:res.message
						})
						uni.switchTab({
							url:"/pages/store/index"
						})
					}else{
						uni.showToast({
							title:res.message
						})
					}
				})
			},
			logins(type) {
				let that = this;
				switch (type) {
					case 'weixin':
						this.uniAppLogin('weixin', that);
						break;
					case 'qq':
						this.uniAppLogin('qq', that);
						break;
					case 'apple':
						this.uniAppLogin('apple', that);
						break;
					case 'alipay':
						this.alipay();
						break;
					default:
						uni.showToast({
							title:'暂不支持该第三方登录',
							icon:'none'
						})
						break;
				}
			
			},
			uniAppLogin: function(type, that) {
				uni.login({
					provider: type,
					success: function(loginRes) {
						uni.getUserInfo({
							provider: type,
							lang: "zh_CN",
							success: function(result) {
								app.$vm.getData({
									url:"Register/thirdLogin",
									data: {
										user_info: JSON.stringify(result.userInfo),
										provide: type
									},
									that:that,
									loading:1
								}).then(res => {
									if (res.code === 1) {
										
										uni.setStorageSync('user_id', res.data.user_id);
										var provide_id =res.data.provide_id
										app.$vm.getData({
											url:"Setup/getUserBindInfo",
											data: {},
											that:that,
											loading:1
										}).then(res=>{
											if(res.code==1){
												if(res.data.is_bind_mobile==1){
													uni.switchTab({
														url:"/pages/store/index"
													})
												}
											}else{
												uni.navigateTo({
														url: "./firstbind?type=1&provide_id=" + provide_id + "&provide=" + type
												})
											}
										})
										// if (res.data.user_id === 0) {
										// 	uni.navigateTo({
										// 		url: "/pages/register/bind?provide_id=" + res.data.provide_id + "&provide=" + type
										// 	})
										// } else {
											// uni.setStorageSync('isLogin', true);
											// uni.navigateBack({
											// 	delta: 1
											// })
										// }
									}
								})
							},
							fail: function(result) {
								console.log(result)
							}
						})
					},
					fail: function(res) {
						uni.showToast({
							title:'授权失败',
							icon:'none'
						})
						
					}
				})
			},
		},
		onLoad() {
			this.uuid = uni.getStorageSync('device_id');
			
		},
		created(){
			let that = this;
			uni.getProvider({
				service: 'oauth',
				success: function(res) {
					let info = uni.getSystemInfoSync();
					console.log(res.provider);
					console.log(info.platform);
					// ~res.provider.indexOf('apple') && 
					if (~res.provider.indexOf('apple') && info.platform == 'ios') {
						that.appleObject = true;
					}
				}
			});
		}
	}
</script>
<style>
	page{
		background: #FFFFFF;
		padding-bottom: 0upx;
	}
</style>
<style scoped>
	.logintxt{
		width:450upx;
		height:70upx;
		font-size:50upx;
		font-family:PingFangSC-Medium,PingFang SC;
		font-weight:500;
		color:rgba(26,26,26,1);
		line-height:70upx;
		margin: 90upx 0  120upx 95upx;
	}
	.box{
		margin: 0 95upx;
	}
	.icon-icon-test{
		color: #1A1A1A;
		font-size: 34upx;
		margin-right:25upx;
	}
	.icon-icon-test1{
		color: #1A1A1A;
		font-size: 34upx;
		margin-right:15upx;
	}
	.li_item{
		display: flex;
		align-items: center;
		line-height: 34upx;
		padding:  25upx 0;
		border-bottom: 1upx solid #EDEDED;
		margin-bottom: 12upx;
	}
	.li_item input{
		display: flex;
		flex: 1;
	}
	.number{
		height:34upx;
		font-size:28upx;
		font-family:PingFangSC-Semibold,PingFang SC;
		font-weight:600;
		color:rgba(26,26,26,1);
		line-height:34upx;
	}
	.line{
		height:30upx;
		width: 1upx;
		background:#B3B3B3;
		margin: 0 22upx;
	}
	.get{
		width:140upx;
		height:34upx;
		font-size:28upx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:rgba(26,26,26,1);
		line-height:34upx;
		text-align: center;
	}
	.login{
		/* width:560upx; */
		height:98upx;
		background:linear-gradient(90deg,rgba(208,164,245,1),rgba(255,175,220,1));
		box-shadow:0px 6upx 8upx 0upx rgba(204,132,255,0.24);
		border-radius:49upx;
		margin: 60upx 95upx 45upx;
		line-height: 98upx;
		text-align: center;
		color: #FFFFFF;
	}
	.funtion{
		margin: 0 95upx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.account{
		/* width:156upx; */
		height:37upx;
		font-size:26upx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:rgba(102,102,102,1);
		line-height:37upx;
	}
	.new{
		width:130upx;
		height:37upx;
		font-size:26upx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:rgba(102,102,102,1);
		line-height:37upx;
	}
	.threelogin{
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: 200upx 130upx 34upx;
		
	}
	.hline{
		width:95upx;
		height:1upx;
		background: #EDEDED;
	}
	.threetxt{
		/* width:168px; */
		height:33upx;
		font-size:24upx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:rgba(179,179,179,1);
		line-height:33upx;
	}
	.wechat{
		/* margin: 0 335upx; */
		width:80upx;
		height:80upx;
		background:rgba(255,255,255,1);
		border:1upx solid rgba(230,230,230,1);
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		
	}
	.wechatlogo{
		font-size: 40upx;
		color: #59CE57;
	}
	.tips{
		height:28upx;
		font-size:20upx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:rgba(152,152,152,1);
		line-height:28upx;
		margin: 60upx 82upx 0;
	}
	.deal{
		height:28upx;
		font-size:20upx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:rgba(75,129,184,1);
		line-height:28upx;
	}
	.third_list {
		width: 80rpx;
		height: 80upx;
		border-radius: 50%;
		border: 1upx solid #E6E6E6;
		margin-left: 30upx;
	}
	
	.third_list image {
		width: 40upx;
		height: 40upx;
		margin-left: calc(50% - 20upx);
	}
	.add-login{
		width: 100%;
		justify-content: center;
	}
	
</style>
