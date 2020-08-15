<template>
	<view id="cash">
		<view class="header">
			<text>提现金额</text>
			<view> 
				<text>￥</text>
				<input type="number" placeholder="请输入金额" placeholder-style="color:#CBCBCB" v-model="money">
			</view>
			<view>
				<view>
					<text>可提现金币 </text>
					<text>¥{{allData.my_commission}}</text>
				</view>
				<text @tap="goRecord">提现记录</text>
			</view>
		</view>
		<view class="content">
			<view>
				<text>提现到</text>
				<text style="color: #333;">银行卡</text>
			</view>
			<view>
				<text>开户银行</text>
				<text>{{allData.card_bank}}</text>
				<!-- <input type="text" placeholder="请输入您的开户行" placeholder-style="color:#CBCBCB" v-model="card_bank"/> -->
			</view>
			<view>
				<text>开户名</text>
				<text>{{allData.card_name}}</text>
			</view>
			<view>
				<text>开户账号</text>
				<text>{{allData.card_account}}</text>
				<!-- <input type="number" placeholder="请输入您的开户账号" placeholder-style="color:#CBCBCB" v-model="card_account"/> -->
			</view>
			
		</view>
		<view class="title">需支付手续费{{allData.withdraw_cost}}%</view>
		<view class="confirm" @tap="withdrawal">提现</view>
		<!-- <view class="tips">
			<view class="uni-icon uni-icon-info-filled"></view>
			<text>温馨提示</text>
		</view>
		<view class="english">
			Maecenas pretium justo at nunc imperdiet, id bibendum ipsum feugiat. 
			Nunc vel nisi at risus rutrum venenatis eu a est. Nam suscipit pretium placerat. Quisque aliquet dictum
		</view> -->
	</view>
</template>

<script>
	const app=getApp();
	export default{
		data(){
			return{
				allData:{},//当前用户佣金
				money:'',//提现金额
				card_bank:'',//开户银行
				card_name:'',//开户名
				card_account:'',//开户账号
				withdraw_type_id:4,
			}
		},
		
		
		onShow(options) {
			const that = this
			that.money = ""
			that.getResult()
		},
		methods:{
			goRecord(){
				uni.navigateTo({
					url:"/pages/account/withdrawalsRecord"
				})
			},
			//数据
			getResult(){
				const that = this
				app.$vm.getData({
					url:'Distribution/getWithdrawData',
					data:{},
					loading:1,
				}).then(res=>{
					//传的参数
					if(res.code == 1){ 
						that.allData = res.data
					}
				})
			},	
			// 提交
			withdrawal(){
				const that = this
					app.$vm.getData({
						url:'Distribution/submitWithdraw',
						data:{
							money:that.money,
							card_bank: that.allData.card_bank,
							card_name: that.allData.card_name,
							card_account: that.allData.card_account,
							withdraw_type_id:that.withdraw_type_id
						},
						loading:1,
					}).then(res=>{
						//传的参数
						if(res.code == 1){
							uni.showModal({
								content: res.message,
								showCancel: false,
								success: (res) => {
									if(res.confirm){
										uni.navigateTo({
											url:"/pages/account/withdrawalsRecord"
										})
									}
								}
							})
						}else{
							uni.showModal({
								content: res.message,
								showCancel: false,
								confirmText: "确定"
							});
						}
						
					})
				
				
			}
		},
		
	}
</script>


<style>
	page{
		background: #F5F5F5;
	}
</style>
<style lang="less" scoped>
	#cash{
		width: 100%;
		height: 100%;
		.header{
			margin: 0 30upx;
			height: 320upx;
			margin-top: 19upx;
			background: #fff;
			border-radius: 10upx;
			&>text:nth-child(1){
				display: block;
				height: 45upx;
				margin-left: 28upx;
				padding-top: 32upx;
				margin-bottom: 49upx;
				color: #333333;
				font-size: 32upx;
				font-family: "常规体";
				font-weight: Regular;
			}
			&>view:nth-child(2){
				margin: 0 25upx 0 35upx;
				height: 88upx;
				line-height: 88upx;
				border-bottom:1upx solid #E5E5E5;
				font-family: "常规体";
				font-weight: Regular;
				color: #1D1E1F;
				display: flex;
				align-items: center;
				&>text{
					font-size: 46upx;
					// margin-left:14upx; 
				}
				&>input{
					font-size: 36upx;
					width:100%;
					height:100%;
					padding-left: 10upx;
				}
			}
			&>view:nth-child(3){
				margin: 0 25upx 0 35upx;
				height: 40upx;
				line-height: 40upx;
				display: flex;
				justify-content: space-between;
				padding-top: 24upx;
				&>view:nth-child(1){
					&>text:nth-child(1){
						color: #808080;
						font-size: 28upx;
						font-family:"常规体";
						font-weight: Regular;
						margin-right: 10upx;
					}
					&>text:nth-child(2){
						color: #1A1A1A;
						font-size: 30upx;
						font-family:"Avenir Heavy";
						font-weight: Heavy;
					}
				}
	
				&>text:nth-child(2){
					// display: block;
					margin-top: 5upx;
					width: 140upx;
					height: 40upx;
					border-radius: 27upx;
					border:1upx solid #F93A42;
					background:#FFF3F3;
					text-align: center;
					color: #F93A42;
					font-size: 24upx;
					font-family:"常规体";
					font-weight: Regular;
					
				}
			}
		}
		//提现操作
		.content{
			margin: 0 30upx;
			height: 399upx;
			background: #fff;
			margin-top:21upx; 
			border-radius: 10upx;
			&>view{
				margin: 0 30upx;
				height: 99upx;
				color:#333;
				font-size: 28upx;
				font-weight: Regular;
				font-family: "常规体";
				border-bottom:1upx solid #E5E5E5;
				display: flex;
				align-items: center;
				justify-content: space-between;
				&>text:nth-child(1){
					 display: block;
				}
				&>text:nth-child(2){
				 	display: block;	
					color:#CBCBCB; 
				}
				 // &>input{
					//  width:70%;
					//  text-align: right;
				 // }
			}
			&>view:last-child{
				border-bottom:0;
			}
			
		}
		//提示
		.title{
			width:100%;
			color: #808080;
			font-size: 26upx;
			height: 37upx;
			line-height: 37upx;
			text-align: center;
			// margin-top: 39upx;
			margin: 39upx 0;
		}
		//提现按钮
		.confirm{
			margin: 0 45upx;
			height: 90upx;
			line-height: 90upx;
			text-align: center;
			margin-bottom: 39upx;
			color: #fff;
			background: #2e2e2e;
			border-radius: 10upx;
		}
		//
		.tips{
			margin: 0 48upx;
			height: 33upx;
			display: flex;
			align-items: center;
			margin-bottom: 7upx;
			.uni-icon{
				margin-top: -30upx;
				width:20upx;
				height: 20upx;
				margin-right: 30upx;
				color: #999;
			}
			&>text{
				color: #999;
				font-size: 24upx;
			}
		}
		//
		.english{
			margin: 0 10upx 0 52upx;
			height: 120upx;
			color: #999;
			font-size: 24upx;
			font-family: "常规体";
			font-weight: Regular;
		}
	}
</style>
