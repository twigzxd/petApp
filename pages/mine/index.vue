<template>
    <div class="mine">
        <!-- 头部信息 -->
        <div class="flex header">
            <img :src="infos.info.headimgurl" alt="">
			<view class="ml_30 header__right">
				<view class="flex__between__center">
					<text class="fs_36 c_ff">{{infos.info.nickname}}</text>
					<navigator url="./signIn" hover-class="none">
						<view class="sign-box">
							<text class="fs_26 c_ff">签到</text>
						</view>
					</navigator>
				</view>
				<view class="vip-box flex__center" v-if="infos.user.is_vip">
					<text class="jcicon jcicon-vip5 fs_38 c_tip"></text>
					<text class="fs_24 c_ff" decode="true">{{infos.user.grade_name}}&ensp;{{infos.user.vip_time}}到期</text>
				</view>
				<view class="mt_15">
					<text class="fs_24 c_ff">邀请码{{infos.user.invite_code}}</text>
				</view>
			</view>
        </div>
        <!-- 子项 -->
        <div class="modular">
			<navigator :url="item.path" v-for="(item,index) in nav_list" :key="index">
				<div class="flex__between__center modular__item">
					<div class="flex align-center">
						<span class="jcicon fs_40 c_4d" :class="item.icon"></span>
						<span class="fs_28 c_4d ml_20">{{item.text}}</span>
					</div> 
					<span class="jcicon jcicon-jiantouarrow487 fs_26 c_4d"></span>
			 	</div>
			</navigator>
        </div>
		<view class="flex__center__center mt_40">
				<text class="fs_26 c_80" decode="true">山西亿未来网络科技有限公司&ensp;版权所有</text>
		</view>
    </div>
</template>
<script>
const app=getApp();
export default {
    name: "Mine",
    data(){
        return{
            infos: {},
            nav_list:[
				{
					text:'我的信息',
					icon:'jcicon-xinxi',
					path:'./personal'
				}, 
				{
					text:'我的订单',
					icon:'jcicon-tongchoudingdan',
					path:'../mall/myOrder?index=0'
				},
				{
					text:'我的地址',
					icon:'jcicon-tongchoudingdan',
					path:'../address/index'
				},
				{
					text:'日历签到',
					icon:'jcicon-rili',
					path:'/pages/mine/signIn'
				},
				{
					text:'签到排行',
					icon:'jcicon-paihang',
					path:'/pages/account/rankingList'
				},
				{
					text:'我的账户',
					icon:'jcicon-qian',
					path:'../account/index'
				},
				{
					text:'我的收藏',
					icon:'jcicon-shoucang',
					path:'../mall/collect'
				},
				{
					text:'我的评价',
					icon:'jcicon-bianji',
					path:'../mall/myEvaluate'
				},
				{
					text:'我的预购',
					icon:'jcicon-paihang',
					path:'../mall/prepare'
				},
				{
					text:'联系我们',
					icon:'jcicon-paihang',
					path:'./contact'
				},
				{
					text:'退出登录',
					icon:'jcicon-paihang',
					path:'./login'
				}
            ]
        }
    },
    onShow(){
		app.$vm.getData({
			url:'mall/getVipData',
			that: this,
			data: {openid: 'test'},
			loading: 1
		}).then(res=>{
			if(res.code==1){
				this.infos=res.data;
			}
		})
    }
}
</script>
<style scoped>
.header{
    padding: 60upx 30upx 60upx 50upx;
	background:linear-gradient(360deg,rgba(81,94,106,1) 0%,rgba(46,46,46,1) 100%);
}
.header img{
    width: 120upx;
    height: 120upx;
    border-radius: 50%;
}
.header__right{
	width: 520upx;
}
.sign-box{
	width: 130upx;
	height: 50upx;
	border-radius:25px;
	line-height: 46upx;
	text-align: center;
	border:2upx solid #fff;
}
.vip-box{
	width: fit-content;
    height: 40upx;
    padding: 0 10upx;
    margin-top: 15upx;
    background: rgba(0,0,0,0.5);
}
/* 订单 */
.order-box{
    padding: 30upx 30upx 0;
    background: #fff;
}
.order-box__header{
    height: 70upx;
}
.order-nav{
    padding: 20upx 0;
}
.order-nav__item{
    position: relative;
}
.order-nav__item .tips{
    position: absolute;
    top: -20upx;
    right: -20upx;
    width: 30upx;
    height: 30upx;
    border-radius: 50%;
    background: #F93A42;
    line-height: 30upx;
    text-align: center;
}
/* 子项 */
.modular{
    margin-top: 15upx;
    background: #fff;
    padding: 0 30upx;
}
.modular__item{
    height: 100upx;
}
</style>


