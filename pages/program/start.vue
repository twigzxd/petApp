<template>
		<view class="content col-m-12 col-12">
			<image :src='startImg' ></image>
			<view class="nowopen" >立即开启</view>
		</view>
</template>

<script>
	const app = getApp()
	export default {
		data() {
			return {
				timer:3,
				time: '',
				startImg:''
			}
		},
		onLoad() {
			this.time = setInterval(this.timeChange, 1000);
		},
		onShow() {
			this.getReuslt()
		},
		methods: {
			to() {
				uni.reLaunch({
					url:"/pages/program/messagelogin"
				})
				clearInterval(this.time);
			},
			timeChange() {
				if (this.timer <= 0) {
					clearInterval(this.time);
					if(this.timer==0){
						uni.reLaunch({
							url:"/pages/program/guide"
						})
					}
				} else {
					this.timer--;
				}
			},
			getReuslt(){
				app.$vm.getData({
					url:'home/getConfig',
					that:this,
					data:{
						param:0
					},
					loading:1
				}).then(res=>{
					if(res.code==1){
						this.startImg = res.data.advert_img
					}
					
				})
			}
			
		}
	}
</script>

<style>
	page{
		/* background:linear-gradient(224deg,rgba(244,231,255,1) 0%,rgba(242,247,255,1) 100%); */
		width: 100%;
		height: 100%;
	}
</style>
<style scoped>
/* 	 .logo{
		 width:160upx;
		 height:160upx;
		 background:rgba(179,181,248,1);
		 border-radius:40upx;
		 margin: 292upx 295upx 46upx;
	 } */
	 .content {
	 	overflow: hidden;
	 	position: relative;
	 	width: 100%;
	 	height: 100%;
	 }
	 
	 .content>image {
	 	width: 100%;
	 	height: 100%;
	 }
	 .nowopen{
		 font-size:30upx;
		 font-family:PingFangSC-Regular,PingFang SC;
		 font-weight:400;
		 color:rgba(255,255,255,1);
		 line-height:90upx;
		 padding: 0 70upx;
		 position: absolute;
		 left: 50%;
		 transform: translate(-50%);
		 bottom: 239upx;
		 z-index: 99;
		 height:90upx;
		 background:linear-gradient(90deg,rgba(208,164,245,1) 0%,rgba(255,175,220,1) 100%);
		 box-shadow:0upx 6upx 8upx 0upx rgba(204,132,255,0.24);
		 border-radius:50upx;
	 }
</style>
