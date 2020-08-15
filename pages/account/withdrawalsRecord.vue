<template>
	<view id="withdrawalsRecord">
		<view v-for="(item,index) in list" :key="index">
			<view>
				<text>{{item.name}}</text>
				<text>{{item.create_time}}</text>
			</view>
			<view>¥{{item.money}}</view>
		</view>
	</view>
</template>

<script>
	const app=getApp();
	export default{
		data(){
			return{
				list:[],//数据数组方式
				page:1
			}
		},
		onShow(){
			this.getResult(1)
		},
		onReachBottom(){
			this.getResult(2);	
		},
		
		methods:{
			//数据
			getResult(page){
				app.$vm.getList({
					url:'Distribution/getWithdrawLogList',
					that:this,
					data:{},
					loading:1,
					page,
				})
			}
		}
	}
</script>

<style>
	page{
		background: #F5F5F5;
	}
</style>
<style lang="less" scoped>
	#withdrawalsRecord{
		width:100%;
		height: 100%;
		&>view{
			width:100%;
			height: 139upx;
			background: #fff;
			border-bottom:1upx solid #E5E5E5;
			display: flex;
			align-items: center;
			justify-content: space-between;
			&>view:nth-child(1){
				margin-left: 28upx;
				line-height: 1;
				&>text:nth-child(1){
					display: block;
					height: 40upx;
					color: #333333;
					font-weight:Medium;
					font-family: "常规体";
					font-size: 28upx;
					margin-bottom: 9upx;
					line-height: 40upx;
				}
				&>text:nth-child(2){
					display: block;
					height: 33upx;
					line-height: 33upx;
					color: #999999;
					font-weight:Medium;
					font-family: "常规体";
					font-size: 24upx;
				}
				
			}
			&>view:nth-child(2){
				margin-right: 26upx;
				font-size: 28upx;
				font-weight:Medium;
				font-family: "Avenir Medium";
				color: #333333;
			}
		}
		&>view:last-child{
			border-bottom: 0;
		}
	}
</style>
