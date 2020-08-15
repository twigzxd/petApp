<template>
	<view class="jc-back-home">
		<scroll-view scroll-y scroll-with-animation :scroll-top="distance_top" @scroll="scroll">
			<slot></slot>
			<view class="back-home">
				<view class="top box" v-show="is_show" @tap="goTop">
					<text class="iconfont icon-huidingbu text-44 text-4d"></text>
				</view>
				<navigator :url="url" hover-class="none">
					<view class="home box">
						<text class="iconfont icon-zhuye text-48 text-ff"></text>
					</view>
				</navigator>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		name:'jc-back-home',
		data() {
			return {
				distance_top:0,
				old: {
					distance_top: 0
				},
				is_show:false
			}
		},
		props:{
			scrollTop:{ //超过多少是显示
				type: [Number, String],
				default: '500'
			},
			url:{ // 地址
				type: String,
				default: ''
			}
		},
		methods: {
			scroll(e){
				this.old.distance_top = e.detail.scrollTop;
				if(e.detail.scrollTop>this.scrollTop){
					this.is_show=true;
				}else{
					this.is_show=false;
				}
			},
			goTop(e) {
				this.distance_top = this.old.distance_top;
				this.$nextTick(()=>{
					this.distance_top = 0
				})
			}
		}
	}
</script>

<style scoped>
	scroll-view{
		position: fixed;
		top: 0;
		bottom: 0;
		width: 100%;
	}
	.height1000{
		height: 3000upx;
	}
	.back-home{
		position: fixed;
		bottom: 140upx;
		right: 30upx;
	}
	.box{
		display: flex;
		justify-content: center;
		align-items: center;
		width: 80upx;
		height: 80upx;
		border-radius: 50%;
	}
	.top{
		background: #fff;
		border: 2upx solid #e6e6e6;
	}
	.home{
		margin-top: 20upx;
		background:linear-gradient(90deg,#F10101 0%,#FF4C16 100%);
	}
</style>
