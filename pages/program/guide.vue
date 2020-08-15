<template>
	<view class="content col-m-12 col-12">
		<image :src='load_img'  @click='to(load_img_url)'></image>
		<view class='count' @click='jump()'>
			<view class="long"></view>
			<view class="circle"></view>
			<view class="text">跳过{{timer}}s</view>
		</view>
	</view>
</template>


<script>
	const app = getApp()
	export default {
		data() {
			return { 
				timer: 3,
				time: '',
				// startImg:'',
				load_img:'',
				load_img_url:'',
			}
		},
		onLoad() {
		},
		onShow() {
			this.time = setInterval(this.timeChange, 1000);
			this.getReuslt()
			this.user_id=uni.getStorageSync('user_id')
		},
		methods: {
			jump() {
				if(!this.user_id){
					uni.reLaunch({
						url:"/pages/program/messagelogin"
					})
				}else{
					uni.switchTab({
						url:'/pages/store/index'
					})
				}
				
				clearInterval(this.time);
			},
			to(url){
				if(url){
					if (url.indexOf("http") != -1) {
						uni.navigateTo({
							'url': '/pages/webView?url=' + url
						})
						clearInterval(this.time);
					} else {
						uni.navigateTo({
							url: url
						})
						clearInterval(this.time);
					}
				}
			},
			timeChange() {
				if (this.timer <= 0) {
					clearInterval(this.time);
					if(this.timer==0&&!this.user_id){
						uni.reLaunch({
							url:"/pages/program/messagelogin"
						})
					}else if(this.timer==0&&this.user_id){
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
					url:'Home/getConfig',
					that:this,
					data:{
						param:1
					},
					loading:1
				}).then(res=>{
					if(res.code==1){
						this.load_img = res.data.load_img,
						this.load_img_url =res.data.load_img_url
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
		width: 154upx;
		height: 60upx;
		top: 99upx;
		right: 30upx;
		background:linear-gradient(180deg,rgba(171,174,255,1) 0%,rgba(152,155,249,1) 100%);
		text-align: center;
		line-height: 60upx;
		font-size: 24upx;
		color: #fff;
		border-radius: 26upx;
		display: flex;
		align-content: center;
		justify-content: center;
	}
	.long{
		width:25upx;
		height:6upx;
		background:rgba(255,255,255,1);
		border-radius:2upx;
		position: absolute;
		top: 7upx;
		left: 32upx;
	}
	.circle{
		width:6upx;
		height:6upx;
		background:rgba(255,255,255,1);
		border-radius: 50%;
		top: 7upx;
		left: 62upx;
		position: absolute;
	}
</style>

