<template>
	<div>
		<!-- #ifdef APP-PLUS -->
		<view class="status_bar">
			<view class="top_view"></view>
		</view>
		<!-- #endif -->
			<div class="header">
				<navigator open-type="navigateBack" class="backbox">
					<text class="iconfont icon-zuojiantou c_ff"></text>
				</navigator>
				<span class="fs_32 c_ff">我的优惠券</span>
			</div>
			<div class="header-layer">
				<div class='useful'   @click='swit(1)'>
					<div class='usetxt' :class="loads.type==1?'active':'' ">可使用优惠券({{can_count}})</div>
					<div v-if='loads.type==1' class='bgf'></div>
				</div>
				<div class='useful'    @click="swit(2)">
					<div class='usetxt' :class="loads.type==2?'active':'' ">不可使用优惠券({{nocan_count}})</div>
					<div v-if='loads.type==2' class='bgf'></div>
				</div>
			</div>
			<div class='list' >
					<view class="li_item" v-for="(item,index) in list" :key='index'>
						<view class="moneys">
							<view>￥</view>
							<view>{{item.price}}</view>
						</view>
						<view style="flex: 1;margin-left: 20upx;position: relative;">
							<view class="shopname">{{item.name}}</view>
							<view class="alls">· {{item.brief}}</view>
							<view class="full">· 满{{item.coupon_limit}}元可用</view>
							<view class="full">· {{item.start_time}}~{{item.end_time}}可用</view>
							<view class="usebtn" v-if="loads.type==1" @click="use(item.id,item.price)">去使用</view>
							<image class="dateimg" v-if="loads.type==2&&item.status==3||loads.type==2&&item.status==4" src="../../static/images/date.png" mode=""></image>
							<image class="dateimg" v-if="loads.type==2&&item.status==2" src="../../static/images/use.png" mode=""></image>
						</view>
					</view>
			</div>
			<div class='nouse' @click='nouse'>
				不使用优惠券
			</div>
		</div>
</template>

<script>
	const app=getApp();
	export default {
	    name:'conpons',
	    data(){
	        return{
	          goods_amount:'',
			  can_count:'',
			  nocan_count:'',
			  loads:{
				  total_coupon:'',
				  type:1,
			  },
			  list:[]
	        }
	    },
		methods:{
			loadList(page){
				app.$vm.getList({
					url:'Coupon/chooseCoupon',
					that: this,
					data:this.loads,
					loading: 1,
					page
				});
			},
			swit(type){
				if(type==1){
					this.loads.type=1
				}else{
					this.loads.type=2
				}
				this.loadList(1)
			},
			nouse(){
				uni.navigateBack({
					delta:1
				})
			},
			use(id,price){
				 wx.setStorageSync('my_coupon_id', id)
				 wx.setStorageSync('coupon_money', price)
				 wx.navigateBack({
				      delta: 1
				 })
			}
		},
		onLoad(options) {
			// this.goods_amount=options.goods_amount
			this.goods_amount=1
			
		},
		onShow() {
			this.loads.total_coupon=this.goods_amount
			this.loadList(1)
			app.$vm.getData({
				url:'Coupon/chooseCouponNum',
				that:this,
				loading: 1,
				data:{
					total_coupon :this.goods_amount
				},
			}).then(res=>{
				if(res.code==1){
					this.can_count=res.data.can_count
					this.nocan_count=res.data.nocan_count
				}
			})
		},
	}
</script>
<style lang="scss" scoped>
	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
		background-color: #fff;
	}

	.top_view {
		height: var(--status-bar-height);
		width: 100%;
		position: fixed;
		background-color: #fff;
		top: 0;
		z-index: 999;
	}
</style>
<style>
	.header{
	    position: fixed;
	    z-index: 2;
	    width: 100%;
	    height:108upx;
	    /* padding: 0 30upx; */
	    /* height:350upx; */
	    background:linear-gradient(90deg,rgba(208,164,245,1),rgba(255,175,220,1) );
	    text-align: center;
	    line-height: 90upx;
		display: flex;
		padding-bottom: 20upx;
		align-items: center;
		justify-content: center;
		padding-top:75upx;
		top: 0;
	}
	.backbox{
		position: absolute;
		left: 20upx;
		top: 40upx;
	}
	.header-layer{
	    position: fixed;
	    top:100upx;
	    width: 100%;
	    height: 90upx;
	    background:linear-gradient(90deg,rgba(208,164,245,1),rgba(255,175,220,1));
		display: flex;
		align-items: center;
		justify-content: space-around;
		z-index: 22;
		
	}
	.bgf{
		width:60upx;
		height:6upx;
		background:rgba(255,255,255,1);
		position: absolute;
		left: 50%;
		transform: translate(-50%);
		bottom:0upx;
	}
	.useful{
		position: relative;
		height: 90upx;
		align-items: center;
		display: flex;
	}
	.usetxt{
		height:42upx;
		font-size:30upx;
		font-family:PingFangSC-Semibold,PingFang SC;
		font-weight:300;
		color:rgba(255,255,255,1);
		line-height:42upx;
		
	}
	.usetxt.active{
		font-weight:600
	}
	.nouse{
		position: fixed;
		height:98upx;
		left: 0;
		right: 0;
		bottom: 0;
		background:rgba(255,255,255,1);
		border:1upx solid rgba(230,230,230,1);
		font-size:28upx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:rgba(26,26,26,1);
		line-height:98upx;
		text-align: center;
	}
	.list{
		margin:200upx 30upx 0;
	}
	.li_item{
		background:rgba(255,255,255,1);
		box-shadow:0upx 0upx 10upx 0upx rgba(230,230,230,1);
		margin-bottom: 30upx;
		padding: 25upx 0upx ;
		background:rgba(255,255,255,1);
		display: flex;
		align-content: center;
		justify-content: center;
	}
	.moneys{
		display: flex;
		padding: 0 40upx;
		color: #F889CE;
		border-right: 1upx dotted #E6E6E6;
		align-items: center;
		
	}
	.moneys view:nth-child(1){
		height:28upx;
		font-size:24upx;
		font-family:DINAlternate-Bold,DINAlternate;
		font-weight:bold;
		color:rgba(248,137,206,1);
		line-height:28upx;
	}
	.moneys view:nth-child(2){
		height:73upx;
		font-size:56upx;
		font-family:DINAlternate-Bold,DINAlternate;
		font-weight:bold;
		color:rgba(248,137,206,1);
		line-height:73upx;
	}
	.shopname{
		/* height:40upx; */
		font-size:28upx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:rgba(26,26,26,1);
		line-height:40upx;
		margin-bottom: 10upx;
	}
	.alls{
		/* height:28upx; */
		font-size:20upx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:rgba(152,152,152,1);
		line-height:28upx;
	}
	.full{
		/* height:28upx; */
		font-size:20upx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:rgba(152,152,152,1);
		line-height:28upx;
	}
	.usebtn{
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		right: 20upx;
		height:40upx;
		background:linear-gradient(90deg,rgba(208,164,245,1) 0%,rgba(255,175,220,1) 100%);
		box-shadow:0upx 6upx 8upx 0upx rgba(204,132,255,0.24);
		border-radius:37upx;
		padding: 0 17upx;
		line-height: 40upx;
		color: #FFFFFF;
	}
	.dateimg{
		position: absolute;
		width: 94upx;
		height: 90upx;
		top: 0;
		right: 0;
	}
</style>
