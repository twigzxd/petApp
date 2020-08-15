<template>
	<view id="rankingList">
		<view class="header">
			<view>
				<text>排行榜</text>
				<text>距离NO.1还差一丢丢的努力！</text>
			</view>
			<image src="../../static/images/phb.png"></image>
		</view>
		<view class="tab">
			<view :class="loads.index==index?'active':''" v-for="(item,index) in nva_list" :key="index" @tap="tabIndex(index)">{{item.text}}
				<view :class="loads.index==index? 'active1':''"></view>
			</view>
		</view>
		<view class="time">{{text}} 时时更新今日签到信息</view>
		<view class="content" v-if="list.length">
			<view class="today">
				<view v-for="(item,index) in list" :key="index" class="data">
					<view>
						<view v-if="item.number==1">
							<image src="../../static/images/one.png"></image>
						</view>
						<view v-else-if="item.number==2">
							<image src="../../static/images/two.png"></image>
						</view>
						<view v-else-if="item.number==3">
							<image src="../../static/images/three.png"></image>
						</view>
						<view v-else>
							<view>{{item.number}}</view>
						</view>
						<view>
							<image :src="item.headimgurl"></image>
							<view>
								<text>{{item.nickname}}</text>
								<text>{{item.text}}</text>
							</view>
						</view>
					</view>
					<text>{{item.count}}</text>
				</view>
			</view>
		</view>
		<view class="no" v-else>
			暂无数据~
		</view>
		<view class="tapScroll" @tap="goTop(e)" :hidden="go_top_hidden">
			<image src="../../static/images/s6.png"></image>
		</view>
	</view>
</template>

<script>
	const app=getApp();
	export default{
		data(){
			return{
				loads:{
					index:0,
				},
				text:'',
				go_top_hidden: true,
				nva_list:[
					{text:"今日签到",status:0},
					{text:"累计签到排行",status:1},	
				],
				list:[]
				
			}
		},
		onShow() {
			this.getResult(1)
		},
		methods:{
			//tab
			tabIndex(index) {
				this.loads.index = index
				this.getResult(1)
			  },
			  //置顶
			 goTop() {
			  	uni.pageScrollTo({
			  		scrollTop: 0,
			  	})
			 },
			 //滑动一定位置出现
			 onPageScroll: function(e) {
				var go_top_hidden = e.scrollTop > 80 ? false : true
				this.go_top_hidden = go_top_hidden
			},
			//数据
			getResult(page){
				app.$vm.getList({
					url:'Sign/getRankingList',
					that:this,
					data: this.loads,
					loading:1,
					page
				}).then(res=>{
					if(res.code == 1){
						this.text = res.data.data_list.data[0].text
					}
				})
			},
		}
	}
</script>
<style>
	page{
		background: #F8FAFA;
	}
</style>
<style lang="less" scoped>
	#rankingList{
		width:100%;
		height: 100%;
		//头部
		.header{
			width: 100%;
			height: 209upx;
			background: #515E6A;
			display: flex;
			// align-items: center;
			justify-content: space-between;
			&>view{
				margin-left: 54upx;
				line-height: 1;
				&>text{
					display: block;
				}
				&>text:nth-child(1){
					padding-top: 55upx;
					margin-bottom: 15upx;
					color: #fff;
					font-size: 50upx;
					font-family:"中黑体" ;
					font-weight:Medium;
				}
				&>text:nth-child(2){
					height: 33upx;
					line-height: 33upx;
					color: #fff;
					font-size: 24upx;
					font-family:"常规体" ;
					font-weight:Regular;
				}
			}
			&>image{
				display: block;
				width: 179upx;
				height: 210upx;
				padding-top: 9upx;
				margin-right: 97upx;
			}
		}
		//tab
		.tab{
			width:100%;
			height: 85upx;
			background: #2E2E2E;
			display: flex;
			// justify-content: space-between;
			align-items: center;
			justify-content: space-between;
			&>view{
				color: #fff;
				font-size: 26upx;
				font-family:"常规体" ;
				font-weight:Regular;
				position:relative;
				position: relative;
				-webkit-box-flex: 1;
				-moz-box-flex: 1;
				width: 0;
				-webkit-flex: 1;
				text-align: center;
			}
			.active{
				color: #fff;
				font-weight: bold;
				font-size: 32upx;
				line-height: 2.2;
			}
			.active1{
				width:0;
				height:0;
				border-width:0 10upx 10upx;
				border-style:solid;
				border-color:transparent transparent #fff;/*透明 透明  灰*/
				margin:-8rpx auto;
			}
		
		}
		//
		.time{
			margin: 23upx 125upx;
			height: 60upx;
			border-radius: 36upx;
			background: #FFF3F3;
			text-align: center;
			line-height: 60upx;
			color: #F93A42;
			font-size: 24upx;
			font-family:"常规体" ;
			font-weight:Regular;
		}
		//
		.content{
			width:100%;
			height:100%;
			.today{
				width:100%;
				height:100%;
				.data{
					margin: 0 30upx;
					height: 128upx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					border-bottom:1upx solid #E6E6E6;
					&>view{
						display: flex;
						align-items: center;
						justify-content: space-between;
						&>view:nth-child(1){
							display: flex;
							align-items: center;
							justify-content: center;
							color: #939FAA;
							font-size: 28upx;
							font-family: "DIN Alternate Bold";
							font-weight: bold;
							margin-right: 39upx;
							&>view{
								width:35upx;
								height: 42upx;
								line-height: 42upx;
								text-align: center;
							}
							&>image{
								width:35upx;
								height: 42upx;
							}
						}
						&>view:nth-child(2){
							display: flex;
							align-items: center;
							justify-content: space-between;
							&>image{
								width:70upx;
								height: 70upx;
								border-radius: 70upx;
								margin-right: 19upx;
								display: block;
							}
							&>view{
								line-height: 1;
								&>text:nth-child(1){
									display: block;
									height: 40upx;
									line-height: 40upx;
									color: #666666;
									font-size: 28upx;
									font-family:"常规体" ;
									font-weight:Regular;
								}
								&>text:nth-child(2){
									display: block;
									height: 34upx;
									line-height: 34upx;
									color: #B3B6C1;
									font-size: 24upx;
									font-family:"Avenir Book" ;
									font-weight:Book;
									
								}
							}
						}
					}
					&>text{
						color: #2E2E2E;
						font-size: 40upx;
						font-family:"Avenir Heavy" ;
						font-weight:Heavy;
					}
				}
			
			}
			
			
		}
		.no{
			color: #999;
			font-size: 30upx;
			text-align: center;
			width: 100%;
		}
	}
	/*返回头部*/
	.tapScroll {
		position: fixed;
		bottom: 100upx;
		right: 25upx;
		z-index:10;
		&>image {
			width: 67upx;
			height: 67upx;
			border-radius: 67upx;
		}
	}
</style>
