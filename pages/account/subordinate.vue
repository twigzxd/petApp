<template>
	<view id="subordinate">
		<view class="header">
			<view class="top">
				<view class="search">
					<view class="uni-icon uni-icon-search"></view>
					<input type="search" placeholder="请输入关键字搜索" placeholder-style="color:#B3B3B3" v-model="loads.keyword"/>
				</view>
				<view class="message">
					<image :src="allData.info.headimgurl"></image>
					<view>{{allData.info.nickname}}</view>
				</view>
			</view>
			<view class="invitation">
				<view>
					<view class="invitation-lf">
						<text>{{allData.today_number}}</text>
						<text>今日邀请</text>
					</view>
					<text></text>
					<view class="invitation-ri">
						<text>{{allData.history_number}}</text>
						<text>历史邀请</text>
					</view>
				</view>
			</view>
		</view>
		<view class="content">
			<view class="listNumber">邀请列表（共{{acount}}人）</view>
			<view class="listConter">
				<view v-for="(item,index) in list" :key="index">
					<view class="list-lf">
						<image :src="item.headimgurl"></image>
						<view>
							<text>{{item.nickname}}</text>
							<text>{{item.subscribe_time}}</text>
						</view>
					</view>
					<view class="list-rg">+￥{{item.take_commission}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	const app=getApp();
	export default{
		data(){
			return{
				loads:{
					keyword:'',//关键字
				},
				allData:{
					info:[],
				},//数据数组方式
				page:1,
				acount:0,	//列表数据大的
				list:[]
			}
		},
		onShow(){
			const that = this
			this.getResult()
			this.current_page=1;
			this.getResultList(1);
		},
		onReachBottom(){
			this.getResultList(2);
		},
		
		methods:{
			//数据
			getResult(){
				app.$vm.getData({
					url:'Distribution/getMySubordinatesData',
					that: this,
					data:{},
					loading:1,
				}).then(res=>{
					//传的参数
					if(res.code == 1){ 
						this.allData = res.data
					}else{
						uni.showModal({
							content: res.message,
							icon:'none',
						});
					}
				})
			},
			getResultList(page){
				app.$vm.getList({
					url:'Distribution/getMySubordinatesList',
					that: this,
					data:this.loads,
					loading:1,
					page,
				}).then(res=>{
					if(res.code==1){
						this.acount=res.data.data_list.total;
					}
				})
			}
		},
		watch:{
			'loads.keyword':{
				handler(newVal, oldVal){
					const that = this
					if(newVal!=oldVal){
						setTimeout(function(){
							that.getResultList(1);
						},1000)
					}
				}
			}
		}
	}
</script>
<style>
	page{
		background:#F5F5F5 ;
	}
</style>
<style lang="less" scoped>
	#subordinate{
		width:100%;
		height:100%;
		.header{
			width:100%;
			height:485upx;
			position: relative;
			.top{
				padding-top: 20upx;
				width:100%;
				height:305upx;
				background: #515E6A;
				.search{
					margin: 0 30upx ;
					height:60upx;
					 border-radius: 6upx;
					 font-size: 28upx;
					 color: #4d4d4d;
					 display: flex;
					 align-items: center;
					 justify-content: space-between;
					 background:#F2F2F2;
					 margin-top: 20upx;
					 margin-bottom: 40upx;
					&>view{
						margin: 0upx 10upx 0 10upx;
					}
					&>input{
						width:100%;
						height:100%;
					}
				}
				.message{
					margin: 0 30upx;
					height: 120upx;
					display: flex;
					align-items: center;
					&>image{
						display: blockl;
						width:120upx;
						height: 120upx;
						border-radius: 120upx;
						margin-right: 41upx;
					}
					&>view{
						color: #fff;
						font-size: 36upx;
					}
				}
				
			}
			.invitation{
				width: 92%;
				height: 160upx;
				position: absolute;
				bottom: 43upx;
				background: #fff;
				left:4%;
				border-radius: 10upx;
				&>view{
					margin-top: 43upx;
					display: flex;
					justify-content: space-between;
					&>view{
						width:50%;
						height: 117upx;
						text-align: center;
						&>text{
							display: block;
							line-height: 1;
						}
						&>text:nth-child(1){
							height: 48upx;
							line-height: 48upx;
							color: #1A1A1A;
							font-size: 42upx;
							font-weight: bold;
							margin-bottom: 3upx;
						}
						&>text:nth-child(2){
							color: #989898;
							font-size: 26upx;
							height: 37upx;
							line-height: 37upx;
						}
					}
					&>text{
						display: block;
						width:4upx;
						height: 60upx;
						background: #e6e6e6;
					}
				}
			}
		}
		.content{
			margin: 0 30upx;
			height: 100%;
			background: #fff;
			border-radius: 10upx;
			.listNumber{
				height: 68upx;
				width:100%;
				padding-left:28upx;
				padding-top: 27upx;
			}
			.listConter{
				width:100%;
				height:100%;
				&>view{
					margin: 0 30upx;
					height: 129upx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					border-bottom: 1upx solid #E5E5E5;
					.list-lf{
						display: flex;
						align-items: center;
						justify-content: space-between;
						height: 100%;
						&>image{
							width:70upx;
							height: 70upx;
							border-radius: 70upx;
							display: block;
							margin-right: 17upx;
						}
						&>view{
							line-height: 1;
							&>text:nth-child(1){
								color: #333333;
								font-size: 28upx;
								margin-bottom: 20upx;
								display: block;
							}
							&>text:nth-child(2){
								color: #989898;
								font-size: 24upx;
								display: block;
							}
						}
					}
					.list-rg{
						color: #1A1A1A;
						font-size: 28upx;
						font-weight: 700;
					}
				}
				&>view:last-child{
					border-bottom:none;
				}
			}
		}
	}
	.uni-icon{
		font-size: 40upx;
	}
</style>
