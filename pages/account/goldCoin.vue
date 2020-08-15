<template>
	<view id="goldCoin">
		<view class="header">
			<text>账户金币</text>
			<text>{{money_my}}</text>
		</view>
		<view class="title">
			<view :class="loads.index==index?'active1':''" v-for="(item,index) in nav_list" :key="index" @click="setIndex(index)">
				<text :class="loads.index==index?'active':''">{{item.text}}</text>
			</view>
		</view>
		<view class="container" v-if="list.length">
			<view class="whole">
				<view v-for="(item,index) in list" :key="index">
					<view>
						<text>{{item.show_text}}</text>
						<text>{{item.update_time}}</text>
					</view>
					<text>{{item.money}}</text>
				</view>
			</view>
		</view>
		<view class="conter" v-else>暂无数据~</view>
	</view>
</template>

<script>
	const app=getApp();
	export default {
		data() {
			return{
				loads:{
					index: 0
				},
				money_my: "", //当前用户金币余额
				page:1,
				list:[],
				nav_list:[
					{text:'全部',status: 0},
					{text:'收入',status: 1},
					{text:'支出',status: 2},
				] 
			}
		},
		onLoad(options) {
			this.loads.index=options.index;
		},
		onShow() {
			this.getResult()
			this.search(1)
		},
		onReachBottom(){
			this.search(2)
		},
		
		methods:{
			//数据切换
			setIndex(index){
				this.loads.index=index;
				this.search(1);
			},
			search(page){
				app.$vm.getList({
					url:'Distribution/getDistributionLogList',
					that:this,
					data: this.loads,
					loading:1,
					page
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
					//传的参数
					if(res.code == 1){ 
						that.money_my = res.data.money_my
					}else{
						uni.showModal({
							content: res.message,
							icon:'none',
						});
					}
				})
			}, 
		}
	}
</script>

<style>
	page{
		background: #F5F5F5;
	}
</style>
<style lang="less" scoped>
	#goldCoin{
		width:100%;
		height:100%;
		.header{
			width:100%;
			height: 220upx;
			background: #515E6A;
			&>text{
				color:#fff;
				margin-left: 40upx;
				display: block;
				line-height: 1;
			}
			&>text:nth-child(1){
				padding-top: 49upx;
				font-size:30upx;
				padding-bottom: 6upx;
				 
			}
			&>text:nth-child(2){
				font-size:66upx;
				height: 90upx;
				line-height: 90upx;
				// margin-bottom: 6upx;
				font-family:'Avenir Heavy';
				font-weight: Heavy;
				 
			}
		}
		//导航
		.title{
			width: 100%;
			height: 90upx;
			font-size: 32upx;
			line-height: 90upx;
			position: relative;
			background: #fff;
			// text-align: center;
			&>view{
				// width: 50%;
				height: 100%;
				float: left;
				color: #777777;
				overflow: hidden;
				text-align: center;
				margin-right: 86upx;
			}
			&>view:nth-child(1){
				margin-left: 29upx;
				
			}
			.active{
				color: #1A1A1A;
				font-size: 34upx;
				font-family: "中黑体";
				font-weight:Medium;
			}
			.active1{
				height: 100%;
				border-radius: 4upx;
				border-bottom:6upx solid #1A1A1A;
			}
		}
		//内容
		.container{
			width:100%;
			height: 100%;
			//全部
			.whole{
				width:100%;
				height: 100%;
				&>view{
					width:100%;
					height: 139upx;
					border-bottom: 1upx solid #E5E5E5;
					display: flex;
					justify-content: space-between;
					align-items: center;
					background: #fff;
					&>view{
						margin-left: 31upx;
						height: 100%;
						line-height: 1;
						&>text{
							display: block;
						}
						&>text:nth-child(1){
							padding-top: 36upx;
							height: 40upx;
							line-height: 40upx;
							color: #333333;
							font-size: 28upx;
							font-weight: Regular;
						}
						&>text:nth-child(2){
							height: 33upx;
							line-height: 33upx;
							color: #989898;
							font-size: 24upx;
							font-weight: Regular;
						}
					}
					&>text{
						display: block;
						height: 100%;
						line-height: 139upx;
						color: #1A1A1A;
						font-size: 28upx;
						font-weight: 600;
						font-family: "中黑体";
						text-align: right;
						margin-right: 44upx;
					}
				}
				&>view:last-child{
					border-bottom:0;
				}
			 }
		}
		//
		.conter{
			color: #999;
			font-size: 30upx;
			text-align: center;
			width: 100%;
			margin-top:30upx;
		}
	}
</style>
