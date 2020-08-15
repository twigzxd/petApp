<template>
	<view id="accountIndex">
		<view class="header">
			<view>
				<text>{{allData.money_my}}</text>
				<text>账户金币</text>
			</view>
			<view>
				<text @tap="jump('/pages/account/rechargeRecord')">充值</text>
				<text @tap="jump('/pages/account/cash?user_id=1')">提现</text>
			</view>
		</view>
		<view class="list">
			<view>
				<text>邀请码</text>
				<text>{{allData.code}}</text>
			</view>
			<view @tap="jump('/pages/account/subordinate')">
				<text>我的下级</text>
			</view>
			<view @tap="jump('/pages/account/goldCoin?index=0')">
				<text>我的金币</text>
			</view>
			<view @tap="jump('/pages/account/explain')">
				<text>会员说明</text>
			</view>
			<view @tap="jump('/pages/mall/detail?id='+allData.product_id)" v-if="allData.product_id">
				<text>原点复购</text>
			</view>
		</view>
	</view>
</template>

<script>
	const app=getApp();
	export default{
		data(){
			return{
				allData:[],//数据数组方式
				
			}
		},
		onShow() {
			const that = this
			that.getResult()
		},
		methods:{
			jump(url){
				uni.navigateTo({
					url:url
				})
			},
			//数据
			getResult(){
				const that = this
				app.$vm.getData({
					url:'Distribution/getMyData',
					data:{},
					loading:1,
				}).then(res=>{
					// console.log(res)
					//传的参数
					if(res.code == 1){ 
						that.allData = res.data
						// console.log(that.allData)
					}else{
						uni.showModal({
							content: res.message,
							icon:'none',
						});
					}
				})
			}
		}
	}
</script>
<style>
	page{
		background: #fff;
	}
</style>
<style lang="less" scoped>
	#accountIndex{
		width:100%;
		height:100%;
		//头部
		.header{
			margin: 22upx 30upx 27upx 30upx;
			height:163upx;
			background: #333;
			border-radius: 10upx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			&>view:nth-child(1){
				margin-left: 49upx;
				&>text{
					display: block;
					line-height: 1;
				}
				&>text:nth-child(1){
					color: #fff;
					font-size: 60upx;
					font-weight: bold
				}
				&>text:nth-child(2){
					margin-top: 8upx;
					color: #fff;
					font-size: 24upx;
					font-weight: Regular
				}
			}
			&>view:nth-child(2){
				margin-right: 41upx;
				&>text{
					display: block;
					line-height: 1;
					color: #fff;
					font-size: 26upx;
					font-weight: Regular;
					width:160upx;
					height:50upx;
					border-radius: 25upx;
					border:1upx solid #fff;
					line-height: 50upx;
					text-align: center;
					
				}
	
				&>text:nth-child(2){
					margin-top: 20upx;
				}
			}
		}
		.list{
			width:100%;
			height:100%;
			&>view{
				margin: 0 30upx;
				height: 99upx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				border-bottom:1upx solid #e6e6e6;
				&>text{
					margin-left: 20upx;
					color: #4d4d4d;
					font-size: 30upx;
					font-weight:Regular; 
				}
			}
			&>view:nth-child(1){
				&>text:nth-child(2){
					text-align: right;
					margin-right: 30upx;
				}
			}
		}
	}
</style>
