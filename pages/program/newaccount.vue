<template>
	<view>
			<view class="item">
				<view class="phone">手机号</view>
				<view class="areacode">+39</view>
				<view class="line"></view>
				<input type="number" maxlength="11" v-model="mobile_phone" placeholder="请输入手机号" placeholder-class="place"/>
			</view>
			<view class="item">
				<view class="checkcode">验证码</view>
				<input type="text" v-model="code" placeholder="请输入验证码" placeholder-class="place"/>
				<view class="get" @click="getCode" v-if="check_get">{{text}}</view>
				<view class="get" v-else>{{number}}</view>
			</view>
			<view class="item">
				<view class="checkcode">新密码</view>
				<input type="text" v-model="password" placeholder="请输入新密码" placeholder-class="place"/>
			</view>
			<view class="item">
				<view class="password">确认密码</view>
				<input type="text" v-model="confirm_password" placeholder="请再次输入新密码" placeholder-class="place"/>
			</view>
			<view class="btn"  @click="reg">
				注册
			</view>
			<view class="tips">登录即代表您已同意 <text class="deal" @click="deal">《隐私协议》</text></view>
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
			reg(){
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
					url:'Register/newUserRegister',
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
			deal(){
				uni.navigateTo({
					url:'./ysdeal'
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
	.btn{
		/* width:690px; */
		margin: 99upx 30upx 0;
		height:90upx;
		background:linear-gradient(90deg,rgba(208,164,245,1) 0%,rgba(255,175,220,1) 100%);
		box-shadow:0upx 6upx 8upx 0upx rgba(204,132,255,0.24);
		border-radius:45upx;
		text-align: center;
		line-height: 90upx;
		font-size: 32upx;
		color: #FFFFFF;
	}
	.tips{
		position: fixed;
		bottom: 30upx;
		margin: 0 225upx;
		height:28upx;
		font-size:20upx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:rgba(152,152,152,1);
		line-height:28upx;
	}
	.deal{
		/* width:120px; */
		height:28upx;
		font-size:20upx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:rgba(75,129,184,1);
		line-height:28upx;
	}
</style>
