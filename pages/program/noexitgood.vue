<template>
	<div>
		<div class="nothing-box ">
			<div class="headers">
				<navigator open-type="navigateBack" class="backbox">
					<text class="iconfont icon-zuojiantou c_1a"></text>
				</navigator>
			    <span class="fs_32 c_1a">商品不存在</span>
			</div>
		    <div class="flex__center__around" style='margin-top: 152upx;'>
		        <img class='cartnull' src="@/static/images/noexits.png" alt="">
		        <p class="fs_32 c_4d mt_30" style='margin-top: 120upx;'>给主子的购物车竟然是空的～</p>
				<view class="goindex" @click="goindex">再帮主子挑挑</view>
		    </div>
		</div>
	</div>
</template>

<script>
	const app=getApp();
	export default {
	    name:'Cart',
	    data(){
	        return{
	          
	        }
	    },
		methods:{
			goindex(){
				uni.reLaunch({
					url:'../mall/index'
				})
			}
		}
	}		
</script>

<style scoped>
	.nothing-box{
	    position: fixed;
	    top: 0;
	    bottom: 0;
	    width: 100%;
	    background: #E9ECF1;
	}
	.nothing-box .cartnull{
	  width: 330upx;
	  height: 339upx;
	}
	.headers{
		position: relative;
		z-index: 2;
		width: 100%;
		height: 90upx;
		padding: 0 30upx;
		/* height:350upx; */
		background:#E9ECF1;
		text-align: center;
		line-height: 90upx;
		display: flex;
		padding-top: 50upx;
		padding-bottom: 20upx;
		align-items: center;
		justify-content: center;
	}
	.backbox{
		position: absolute;
		left: 20upx;
		top: 18upx;
	}
	.goindex{
		width:280upx;
		height:80upx;
		background:linear-gradient(90deg,rgba(208,164,245,1) 0%,rgba(255,175,220,1) 100%);
		border-radius:40upx;
		line-height: 80upx;
		text-align: center;
		font-size:26upx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:rgba(255,255,255,1);
		margin-top: 75upx;
	}
</style>
