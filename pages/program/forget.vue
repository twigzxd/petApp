<template>
	<view>
			<view class="item">
				<view class="phone">手机号</view>
				<view class="areacode">+39</view>
				<view class="line"></view>
				<input type="number" v-model="mobile_phone"  placeholder="请输入绑定手机号" placeholder-class="place"/>
			</view>
			<view class="item">
				<view class="checkcode">验证码</view>
				<input type="number" v-model="code" placeholder="请输入验证码" placeholder-class="place"/>
				<view class="get" @click="getCode" v-if="check_get">{{text}}</view>
				<view class="get" v-else>{{number}}</view>
			</view>
			<view class="item">
				<view class="checkcode">新密码</view>
				<input type="text"  v-model="password" maxlength="16" placeholder="请输入新密码" placeholder-class="place"/>
			</view>
			<view class="item">
				<view class="password">确认密码</view>
				<input type="text" v-model="confirm_password" maxlength="16" placeholder="请再次输入新密码" placeholder-class="place"/>
			</view>
			<view class="tips">确认后,将用新密码进行登录</view>
			<view class="btn" @click="forget">
				确认
			</view>
	</view>
</template>
<script>
	const app = getApp();
	export default{
		data(){
			return{
				text:'获取验证码',
				code:'',
				number:'60s',
				check_get:true,
				mobile_phone:'',
				password:'',
				confirm_password:'',
			}
		},
		methods:{
			getCode() {
			    if (this.mobile_phone && this.check_get) {
					app.$vm.getData({
						url:'Basic/getCode',
						that: this,
						data: {
							mobile_phone: this.mobile_phone,
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
			        if (!this.mobile_phone) {
						uni.showToast({
							title:'请输入正确的手机号',
							icon: 'none'
						})
			        }
			    }
			},
			forget(){
				if (!this.mobile_phone) {
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
				if (!this.password) {
					uni.showToast({
						title:'请输入密码',
						icon: 'none'
					})
					return false
				}
				if (!this.confirm_password) {
					uni.showToast({
						title:'请输入再次输入密码',
						icon: 'none'
					})
					return false
				}
				app.$vm.getData({
					url:'Register/userForgetPassword',
					loading:1,
					that: this,
					data:{
						mobile_phone:this.mobile_phone,
						code:this.code,
						password:this.password,
						confirm_password:this.confirm_password
					}
				}).then(res=>{
					if(res.code==1){
						uni.showToast({
							title:res.message,
							icon:'none'
						})
						uni.reLaunch({
							url:'./accountlogin'
						})
					}else{
						uni.showToast({
							title:res.message,
							icon:'none'
						})
					}
				})
			},
		}
	}
</script>
<style >
	page{
		background: #FFFFFF;
	}
</style>
<style scoped>
	.item{
		display: flex;
		align-items: center;
		margin: 0 0 0 30upx;
		border-bottom: 1upx solid #EDEDED;
		padding: 20upx 0;
	}
	.item input{
		flex: 1;
	}
	.phone{
		/* width:112upx; */
		height:40upx;
		font-size:28upx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:rgba(26,26,26,1);
		line-height:40upx;
		margin-right: 40upx;
	}
	.areacode{
		height:40upx;
		font-size:28upx;
		font-family:PingFangSC-Semibold,PingFang SC;
		font-weight:600;
		color:rgba(26,26,26,1);
		line-height:40upx;
	}
	.line{
		width:1upx;
		height:30upx;
		background: #B3B3B3;
		margin: 0 20upx;
	}
	.place{
		/* width:224px; */
		height:40upx;
		font-size:28upx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:rgba(179,179,179,1);
		line-height:40upx;
	}
	.checkcode{
		/* width:84px; */
		height:40upx;
		font-size:28upx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:rgba(26,26,26,1);
		line-height:40upx;
		margin-right: 54upx;
	}
	.get{
		/* width:140px; */
		height:40upx;
		font-size:28upx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:rgba(26,26,26,1);
		line-height:40upx;
		margin-right: 30upx;
	}
	.password{
		/* width:112px; */
		height:40upx;
		font-size:28upx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:rgba(26,26,26,1);
		line-height:40upx;
		margin-right:26upx;
	}
	.tips{
		margin: 95upx 227upx 39upx;
		/* width:295px; */
		height:33upx;
		font-size:24upx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:rgba(152,152,152,1);
		line-height:33upx;
	}
	.btn{
		/* width:690px; */
		margin: 0 30upx;
		height:90upx;
		background:linear-gradient(90deg,rgba(208,164,245,1) 0%,rgba(255,175,220,1) 100%);
		box-shadow:0upx 6upx 8upx 0upx rgba(204,132,255,0.24);
		border-radius:45upx;
		text-align: center;
		line-height: 90upx;
		font-size: 32upx;
		color: #FFFFFF;
	}
</style>
