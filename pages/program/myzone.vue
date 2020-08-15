<template>
	<div>
		<!-- #ifdef APP-PLUS -->
		<view class="status_bar">
			<view class="top_view"></view>
		</view>
		<!-- #endif -->
		  <div class="header">
				<!-- <navigator open-type="navigateBack" class="back-box">
					<text class="iconfont icon-un-return-o fs_48"></text>
				</navigator> -->
				<div></div>
		        <span class="fs_32 ">个人中心</span>
				<navigator url="../mine/personal"  hover-class="none">
		        <div class="iconfont icon-shezhi fs_48"></div>
				</navigator>
		 </div>
		 <div class='contain'>
			 <div class='messagebox'>
				 <div class='left'>
					 <div class='name'>{{message.nickname}}</div>
					 <div class='phone'>{{message.mobile_phone}}</div>
				 </div>
				 <image class="image" :src="message.avatar" mode=""></image>
			 </div>
			<div class='fansbox'>
				<div class='left'>
					<div class='pink'>
						<div class='number'>{{message.follow}}</div>
						<div class='txt'>关注</div>
					</div>
					<div class='fans'>
						<div class='number'>{{message.fans}}</div>
						<div  class='txt'>粉丝</div>
					</div>
				</div>
				<navigator url="./sharecode">
					<div class='share'>分享<text class="icon-liwu iconfont"></text></div>
				</navigator>
			</div>
			<div class='concatbox'>
				<div class='left'>
					<image src="../../static/images/Joinus.png" mode=""></image>
					<div class='bot'>
						<div class='icon-icon-test iconfont'></div>
						<div>{{message.telephone}}</div>
					</div>
				</div>
				<div class='makecall' @click='call(message.telephone)'>拨号</div>
				<navigator url="./enter">
					<div class='shopin'>商家入驻</div>
				</navigator>
			</div>
		</div>
		<div class='cate1'>
			<!-- <navigator url="'/pages/forum/homepage?id='+localStorage.user_id"  hover-class="none"> -->
				<div class='item' @click="gomy">
					<image src="../../static/images/message.png" mode=""></image>
					<div>论坛主页</div>
				</div>
			<!-- </navigator> -->
			<navigator url="./collecttopic" hover-class="none">
				<div class='item'>
					<image src="../../static/images/v.png" mode=""></image>
					<div>收藏话题</div>
				</div>
			</navigator>
			<navigator url="../mall/myOrder" hover-class="none">
				<div class='item'>
					<image src="../../static/images/bag.png" mode=""></image>
					<div>我的订单</div>
				</div>
			</navigator>
			<navigator url="./mycoupons" hover-class="none">
				<div class='item'>
					<!-- <div class='iconfont icon-9'></div> -->
					<image class="youhui" src="../../static/images/youhui.png" mode=""></image>
					<div>优惠券</div>
				</div>
			</navigator>
		</div>
		<div class='cate'>
			<navigator url="../address/index" hover-class="none">
				<div class='item' >
					<image src="../../static/images/location.png" mode=""></image>
					<div>我的地址</div>
				</div>
			</navigator>
			<navigator url="../mall/collect" hover-class="none">
				<div class='item'>
					<image src="../../static/images/heart.png" mode=""></image>
					<div>我的收藏</div>
				</div>
			</navigator>
			<navigator url="../mall/myEvaluate" hover-class="none">
				<div class='item'>
					<image src="../../static/images/flower.png" mode=""></image>
					<div>我的评价</div>
				</div>
			</navigator>
			<navigator url="/pages/program/aboutus" hover-class="none">
				<div class='item'>
					<image src="../../static/images/people.png" mode=""></image>
					<div>关于我们</div>
				</div>
			</navigator>	
		</div>
		<div class='exitbox'>
			<div class='exit' @click='exit'>注销账户</div>
		</div>
		<div class='flex botbox'>
			<navigator url="./yhxy" hover-class="none">
				<div class='yhxy'> 用户协议</div>
			</navigator>
			<div class='sline'></div>
			<navigator url="./ysdeal"  hover-class="none">
				<div class='yszc'>隐私政策</div>
			</navigator>
		</div>
		<div class='bqsy'>
			版权所有：宠溺宠物
		</div>
	</div>
</template>

<script>
	const app=getApp();
	export default {
	    name:'Cart',
	    data(){
	        return{
	          message:'',
	        }
	    },
		onShow() {
			app.$vm.getData({
				url:'Register/getUserInfo',
				data:{
					
				},
				that:this,
				loading:1,
			}).then(res=>{
				if(res.code==1){
					this.message=res.data
				}
			})
		},
		methods:{
			call(phone){
				uni.makePhoneCall({
					phoneNumber:phone
				})
			},
			exit(){
				uni.navigateTo({
					url:'./exitaccount'
				})
			},
			gomy(){
				let id =uni.getStorageSync('user_id')
				uni.navigateTo({
					url:'/pages/forum/homepage?id='+id
				})
			}
		}
	}	
</script>
<style lang="scss" scoped>
	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
		background-color: #fff;
	}

	.top_view {
		height: var(--status-bar-height);
		width: 100%;
		position: fixed;
		background-color: #fff;
		top: 0;
		z-index: 999;
	}
</style>
<style>
	page{
		background: #FFFFFF;
	}
</style>
<style scoped>
	
	.youhui{
		width: 60upx !important;
		height:45upx !important;
	}
	.icon-9{
		font-size: 55upx;
		margin-bottom:21upx ;
		margin-top: -5upx;
		color: #989BF9;
	}
	.header{
	    position: fixed;
	    z-index: 2;
	    width: 100%;
	    padding: 30upx 30upx 20upx;
	    /* height:350upx; */
	    background:linear-gradient(193deg,rgba(248,243,249,1) 0%,rgba(234,241,247,1) 100%);
	    text-align: center;
	    line-height: 90upx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: #333333;
	}
	.back-box{
		color: #333333;
	}
	.contain{
		padding:150upx 40upx 0;
		background:linear-gradient(193deg,rgba(248,243,249,1) 0%,rgba(234,241,247,1) 100%);
	}
	.messagebox{
		display: flex;
		justify-content: space-between;
		margin-bottom: 30upx;
	}
	.messagebox .image{
		width: 150upx;
		height: 150upx;
		display: block;
		border-radius: 50%;
		margin-left: 30upx;
		margin-right: 10upx;
	}
	.messagebox .left{
		flex: 1;
	}
	.messagebox .left .name{
		height:56upx;
		font-size:50upx;
		font-family:Arial-BoldMT,Arial;
		font-weight:normal;
		color:rgba(26,26,26,1);
		line-height:58upx;
		margin-bottom: 16upx;
	}
	..messagebox .left .phone{
		height:30upx;
		font-size:26upx;
		font-family:ArialMT;
		color:rgba(115,119,128,1);
		line-height:31upx;
	}
	.fansbox{
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 50upx;
	}
	.fansbox .left{
		display: flex;
		flex: 1;
		align-items: center;
	}
	.pink{
		margin-right: 50upx;
	}
	.pink .number{
		height:31upx;
		font-size:30upx;
		font-family:Arial-BoldMT,Arial;
		font-weight:normal;
		color:rgba(26,26,26,1);
		line-height:31upx;
	}
	.fans .number{
		height:31upx;
		font-size:30upx;
		font-family:Arial-BoldMT,Arial;
		font-weight:normal;
		color:rgba(26,26,26,1);
		line-height:31upx;
	}
	.fans .txt{
		height:30upx;
		font-size:26upx;
		font-family:ArialMT;
		color:rgba(115,119,128,1);
		line-height:31upx;
	}
	.pink .txt{
		height:30upx;
		font-size:26upx;
		font-family:ArialMT;
		color:rgba(115,119,128,1);
		line-height:31upx;
	}
	.share{
		height:50upx;
		background:linear-gradient(180deg,rgba(255,87,104,1) 0%,rgba(255,116,83,1) 100%);
		border-radius:25upx;
		border:1upx solid rgba(241,1,1,1);
		color: #FFFFFF;
		line-height: 50upx;
		padding: 0 38upx;
		text-align: center;
		display: flex;
		align-items: center;
	}
	.share text{
		margin-left: 5upx;
		line-height: 58upx;
		font-size: 30upx;
	}
	.concatbox{
		background:linear-gradient(90deg,rgba(208,164,245,1) 0%,rgba(255,175,220,1) 100%);
		box-shadow:0px 6upx 8upx 0px rgba(204,132,255,0.24);
		border-radius:20upx 20upx 0upx 0upx;
		padding: 24upx 40upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.concatbox .left{
		flex: 1;
	}
	.concatbox .left image{
		width: 147upx;
		height: 31upx;
		margin-bottom: 19upx;
	}
	.concatbox .left .bot{
		display: flex;
		color: #FFFFFF;
		font-size: 32upx;
		align-items: center;
	}
	.concatbox .left .bot .icon-icon-test{
		margin-right: 8upx;
	}
	.makecall{
		width:109upx;
		height:50upx;
		background:rgba(245,245,245,1);
		border-radius:30upx;
		line-height: 50upx;
		text-align: center;
		font-size:24upx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:rgba(8,8,8,1);
		margin-right: 10upx;
	}
	.shopin{
		height:50upx;
		background:rgba(66,77,127,1);
		border-radius:30upx;
		font-size:24upx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:rgba(255,255,255,1);
		line-height:50upx;
		padding: 0 27upx;
	}
	.cate1{
		background:rgba(255,255,255,1);
		box-shadow:0upx -6upx 20upx 0upx rgba(0,0,0,0.05);
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 38upx 60upx;
	}
	.cate{
		background:rgba(255,255,255,1);
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 55upx 60upx 30upx;
	}
	.item{
		display: flex;
		align-items: center;
		flex-direction: column;
	}
	.item image{
		width: 46upx;
		height: 50upx;
		display: block;
		margin-bottom: 28upx;
	}
	.cate .item image{
		width: 70upx;
		height: 70upx;
		display: block;
		margin-bottom: 16upx;
	}
	.exitbox{
		padding: 20upx 45upx ;
		background: #FFFFFF;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.exit{
		height:90upx;
		background:rgba(247,247,247,1);
		border-radius:10upx;
		border:1upx solid rgba(237,237,237,1);
		line-height: 90upx;
		text-align: center;
		font-size:28upx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:rgba(102,102,102,1);
		line-height:90upx;
		width: 100%;
	}
	.botbox{
		padding: 10upx 263upx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: #FFFFFF;
	}
	.sline{
		width:1upx;
		height:17upx;
		background: #CCCCCC;
	}
	.yhxy{
		font-size:22upx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:rgba(204,204,204,1);
	}
	.yszc{
		font-size:22upx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:rgba(204,204,204,1);
		line-height:30upx;
	}
	.bqsy{
		height:60upx;
		font-size:22upx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:rgba(204,204,204,1);
		line-height:60upx;
		text-align: center;
		background: #FFFFFF;
	}
</style>
