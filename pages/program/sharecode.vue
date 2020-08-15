<template>
	<div class='index'>
		<div class='contain' :class="info.distribution_bg_image ? 'distribution_bg_image' : 'FFFF'">
			<image class="bg_img" :src="info.distribution_bg_image" wx:if="info.distribution_bg_image"></image>
			<image class="headimg" :src="info.headimgurl" mode=""></image>
			<div class="wecatname">{{info.nickname}}</div>
			<image class="code" :src="info.my_code" mode=""></image>
			<div class='wecaht'>微信扫码注册</div>
			<div class='partmen'>双方都可获得惊喜优惠券哦</div>
		</div>
	</div>
</template>

<script>
	const app=getApp();
	export default {
	    name:'Cart',
	    data(){
	        return{
	          info:''
	        }
	    },
		onShow() {
			app.$vm.getData({
				url:'Home/getMyQrCodeData',
				that:this,
				data:{
					url:'sss'
				},
				loading:1
			}).then(res=>{
				if(res.code==1){
					this.info = res.data
				}
				
			})
		}
	}		
</script>
<style>
	page{
	 background:rgba(0,0,0,0.67);
	}
</style>
<style scoped>
	.index{
		
	}
	.bg_img{
		 position: absolute;
		  z-index: -1;
		  top: 0;
		  left: 0;
		  width: 100%;
		  height: 100%;
	}
	.contain{
		margin: 0 35upx;
		/* background: #FFFFFF; */
		padding: 68upx 90upx;
		border-radius:20upx;
		position: absolute;
		left: 0;
		right: 0;
		top: 100upx;
		display: flex;
		align-items: center;
		flex-direction: column;
	}
	.FFFF{
		background: #FFFFFF;
	}
	.distribution_bg_image{
		background:'';
	}
	.headimg{
		width:150upx;
		height:150upx;
		border-radius: 50%;
	}
	.wecatname{
		height:56upx;
		font-size:50upx;
		font-family:Arial-BoldMT,Arial;
		font-weight:normal;
		color:rgba(26,26,26,1);
		line-height:58upx;
		margin-bottom: 42upx;
	}
	.code{
		width: 482upx;
		height: 482upx;
		margin-bottom: 43upx;
	}
	.wecaht{
		height:56upx;
		font-size:40upx;
		font-family:PingFangSC-Medium,PingFang SC;
		font-weight:500;
		color:rgba(26,26,26,1);
		line-height:56upx;
		margin-bottom: 8upx;
		
	}
	.partmen{
		height:42upx;
		font-size:30upx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:rgba(179,179,179,1);
		line-height:42upx;
	}
</style>
