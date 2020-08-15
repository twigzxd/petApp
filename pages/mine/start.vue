<template>
	<view class="content col-m-12 col-12">
		<image src='../../static/images/a2.jpg'></image>
		<!-- <view class='count' @click='jump()'>跳过{{timer}}s</view> -->
	</view>
</template>


<script>
	const app = getApp()
	export default {
		data() {
			return {
				timer: 3,
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
			jump() {
				// uni.switchTab({
				// 	url:"/pages/mall/index"
				// })
				uni.switchTab({
					url:"/pages/store/index"
				})
			},
			timeChange() {
				if (this.timer <= 0) {
					clearInterval(this.time);
					if(this.timer==0){
						// uni.switchTab({
						// 	url:"/pages/mall/index"
						// })
						uni.switchTab({
							url:"/pages/store/index"
						})
					}
				} else {
					this.timer--;
				}
			},
			getReuslt(){
				app.$vm.getData({
					url:'mall/getadvert',
					that:this,
					data:{},
					loading:1
				}).then(res=>{
					if(res.code==1){
						this.startImg = res.data.advert
					}
					
				})
			}
			
		}
	}
</script>
<style>
	page{
		width: 100%;
		height: 100%;
	}
</style>
<style scoped>
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

	.count {
		position: absolute;
		width: 120upx;
		height: 46upx;
		top: 30upx;
		right: 30upx;
		background-color: rgba(0, 0, 0, .2);
		text-align: center;
		line-height: 46upx;
		font-size: 24upx;
		color: #fff;
		border-radius: 26upx;
	}
</style>

