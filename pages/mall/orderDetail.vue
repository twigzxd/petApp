<template>
    <div class="order-detail">
		<!-- #ifdef APP-PLUS -->
		<view class="status_bar">
			<view class="top_view"></view>
		</view>
		<!-- #endif -->
		<div class="head">
			<navigator open-type="navigateBack" class="backbox">
				<text class="iconfont icon-zuojiantou c_ff"></text>
			</navigator>
			<span class="fs_32 c_ff">订单详情</span>
		</div>
        <div class="flex__column header">
            <span class="fs_40 c_ff lh_50">{{orders.status_name}}</span>
            <span class="fs_28 c_ff lh_40">订单编号：{{orders.order_number}}</span>
        </div>
        <!-- 地址信息 -->
        <div class="flex__column address">
            <span class="fs_34 c_1a lh_50">{{orders.linkman}}&emsp;{{orders.mobile_phone}}</span>
            <span class="fs_28 c_66 lh_40">{{orders.province}}{{orders.city}}{{orders.area}}{{orders.address}}</span>
        </div>
        <!-- 商品列表 -->
        <div class="sale-box">
            <div class="flex sale__item" v-for="(item,index) in orders.order_product" :key="index">
                <img :src="item.product_cover_img" alt="">
                <div class="flex__null__around sale__item__right">
                    <span class="fs_26 c_1a lh_36 ellipsis_two">{{item.product_name}}</span>
                    <span class="fs_22 c_98" v-if="item.product_sku_name">规格: {{item.product_sku_name}}</span>
                    <div class="flex__between">
                        <span class="fs_30 c_98b"><span class="fs_22">¥</span>{{item.product_price}}</span>
                        <span class="fs_26 c_80">x{{item.number}}</span>
                    </div>
                </div>
            </div>
        </div>
        <!-- 支付信息-->
        <div class="info-box">
            <div class="flex__between__center info__item">
                <span class="fs_26 c_80">商品总价</span>
                <span class="fs_26 c_4d">¥{{orders.total_price}}</span>
            </div>
            <div class="flex__between__center info__item" v-if="orders.freight!='0.00'">
                <span class="fs_26 c_80">运费</span>
                <span class="fs_26 c_4d">¥{{orders.freight}}</span>
            </div>
            <div class="flex__between__center info__item" v-else>
                <span class="fs_26 c_80">运费</span>
                <span class="fs_26 c_4d">{{orders.freight_name}}</span>
            </div>
            <div class="flex__between__center info__item" v-if="orders.coupon_money">
                <span class="fs_26 c_80">优惠券</span>
                <span class="fs_26 c_4d">-¥{{orders.coupon_money}}</span>
            </div>
            <div class="flex__between__center info__item">
                <span class="fs_26 c_80">实付款</span>
                <span class="fs_26 c_98b">¥{{orders.pay_money}}</span>
            </div>
        </div>
        <div class="info-box">
            <div class="flex__between__center info__item">
                <span class="fs_26 c_80">支付方式</span>
                <span class="fs_26 c_4d">{{orders.pay_way_name}}</span>
            </div>
            <div class="flex__between__center info__item">
                <span class="fs_26 c_80">备注</span>
                <span class="fs_26 c_4d" v-if="orders.remark">{{orders.remark}}</span>
                <span class="fs_26 c_4d" v-else>暂无</span>
            </div>
            <div class="flex__between__center info__item">
                <span class="fs_26 c_80">下单时间</span>
                <span class="fs_26 c_4d">{{orders.order_time}}</span>
            </div>
            <div class="flex__between__center info__item" v-if="orders.pay_time">
                <span class="fs_26 c_80">付款时间</span>
                <span class="fs_26 c_4d">{{orders.pay_time}}</span>
            </div>
            <div class="flex__between__center info__item" v-if="orders.express_time">
                <span class="fs_26 c_80">发货时间</span>
                <span class="fs_26 c_4d">{{orders.express_time}}</span>
            </div>
            <div class="flex__between__center info__item" v-if="orders.confirm_time">
                <span class="fs_26 c_80">收货时间</span>
                <span class="fs_26 c_4d">{{orders.confirm_time}}</span>
            </div>
        </div>
        <!-- 底部操作 -->
        <div class="flex__end__center footer" v-if="orders.status!=6">
            <button class="hollow-btn" v-if="orders.status==1" @click="cancel(orders.id)">取消订单</button>
            <button class="hollow-btn" v-if="orders.status==4||orders.status==5||orders.status==7||orders.status==8" @click="del(orders.id)">删除订单</button>
            <!-- <button class="hollow-btn" v-if="orders.status==3||orders.status==4||orders.status==5" @click="setLogistics(orders.id)">查看物流</button> -->
			<button class="hollow-btn" v-if="orders.status==3||orders.status==4||orders.status==5" @click="call(orders.service_phone)">联系商家</button>
            <button class="hollow-btn" v-if="orders.status==2" @click="refund(orders.id)">申请退款</button>
            <button class="solid-btn bg_98b" v-if="orders.status==4"  @click="evaluate(orders.id)">评价</button>
            <button class="solid-btn bg_98b" v-if="orders.status==3" @click="harvest(orders.id)">确认收货</button>
            <button class="solid-btn bg_98b" v-if="orders.status==1" @click="pay(orders.id)">支付</button>
            <button class="solid-btn bg_98b" v-if="orders.status==2" @click="remind(orders.id)">提醒发货</button>
        </div>
    </div>
</template>
<script>
const app=getApp();
export default {
    name: "OrderDetail",
    data(){
        return{
            refresh: false,
            orders:{
                order_product:[]
            }
        }
    },
    methods:{
		evaluate(id){
			uni.navigateTo({
				url:'./evaluate?id='+id
			})
		},
          // 提醒发货
        remind(id){
			app.$vm.getData({
				url:'home/submitRemind',
				that: this,
				data: {
					order_id: id
				},
				loading: 1
			}).then(res=>{
				uni.showModal({
					content: res.message,
					showCancel: false
				});
            })
        },
		// 打电话
		call(phone){
			uni.makePhoneCall({
				phoneNumber:phone
			})
		},
        // 取消订单
        cancel(id){
			const _this=this;
			uni.showModal({
			    content: '确认取消该订单？',
				success(modal_res){
					if(modal_res.confirm){
						app.$vm.getData({
							url:'home/cancelOrder',
							that: _this,
							data: {
								order_id: id
							},
							loading: 1
						}).then(res=>{
							uni.showModal({
								content: res.message,
								showCancel: false,
								success(){
									uni.navigateBack({
										delta:1
									})
								}
							});
						})
					}
				}
			})
        },
        // 申请退款
        refund(id){
            const _this=this;
            uni.showModal({
                content: '确认申请退款该订单？',
            	success(modal_res){
            		if(modal_res.confirm){
            			app.$vm.getData({
            				url:'home/submitRefund',
            				that: _this,
            				data: {
            					order_id: id
            				},
            				loading: 1
            			}).then(res=>{
            				uni.showModal({
            					content: res.message,
            					showCancel: false,
            					success(){
            						uni.navigateBack({
            							delta:1
            						})
            					}
            				});
            			})
            		}	
            	}
            })
        },
        // 删除订单
        del(id){
            const _this=this;
            uni.showModal({
                content: '确认删除该订单？',
            	success(modal_res){
            		if(modal_res.confirm){
            			app.$vm.getData({
            				url:'home/submitDeleteOrder',
            				that: _this,
            				data: {
            					order_id: id
            				},
            				loading: 1
            			}).then(res=>{
            				uni.showModal({
            					content: res.message,
            					showCancel: false,
            					success(){
            						uni.navigateBack({
            							delta:1
            						})
            					}
            				});
            			}) 
            		}
            	}
            })
        },
        // 查看物流
        setLogistics(id){
            this.$store.commit('setLogistics','/wechat.php/Mall/getExpressData');
            this.$router.push('/Mall/Logistics/'+id);
        },
        // 确认收货
        harvest(id){
            const _this=this;
            uni.showModal({
                content: '确认收货？',
            	success(modal_res){
            		if(modal_res.confirm){
            			app.$vm.getData({
            				url:'home/confirmOrder',
            				that: _this,
            				data: {
            					order_id: id
            				},
            				loading: 1
            			}).then(res=>{
            				uni.showModal({
            					content: res.message,
            					showCancel: false,
            					success(){
            						uni.navigateBack({
            							delta:1
            						})
            					}
            				});
            			})
            		}
            	}
            })
        },
        // 支付

        pay(id){
			app.$vm.getData({
				url:'home/payOrder',
				that: this,
				data: {
					order_id: id
				},
				loading: 1
			}).then(res=>{
				if(res.code==1){
					let orderInfo = JSON.stringify(res.data.pay_parameters)
					console.log(orderInfo)
					uni.requestPayment({
					                  provider: 'wxpay',
					                  orderInfo: orderInfo, //微信、支付宝订单数据
					                  success: function (res) {
										  uni.showToast({title: '支付成功',icon: 'none'});
											  console.log('success:' + JSON.stringify(res));
											uni.redirectTo({
											url: '/pages/mall/myOrder'
										 })
					                  },
					                  fail: function (err) {
					                  uni.showModal({
					                    content: '付款失败',
					                    showCancel: false,
					                  })
									  uni.redirectTo({
									  	 url: '/pages/mall/myOrder'
									  })
					       console.log('fail:' + JSON.stringify(err));
					    }
					});
					// uni.redirectTo({
					// 	url: '/pages/mall/myOrder'
					// })
				}else{
					uni.showModal({
						content: res.message,
						showCancel: false
					});
				}
			})
        }          
    },
    onLoad(options){
		app.$vm.getData({
			url:'home/getOrderDetailData',
			that: this,
			data: {
				order_id: options.id
			},
			loading: 1
		}).then(res=>{
			if(res.code==1){
				this.orders=res.data.order;
			}
			console.log(this.orders)
        })
    }
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
<style scoped>
	.bg_98b{
		background: #989BF9;
	}
	.backbox{
		position: absolute;
		left: 20upx;
		top: 45upx;
	}
	.head{
	    position: fixed;
	    z-index: 2;
	    width: 100%;
	    height: 100upx;
	    padding: 0 30upx;
	    /* height:350upx; */
	    background:linear-gradient(90deg,rgba(208,164,245,1) 0%,rgba(255,175,220,1) 100%);
	    text-align: center;
	    line-height: 90upx;
		display: flex;
		padding-top: 90upx;
		padding-bottom: 20upx;
		align-items: center;
		justify-content: center;
		/* padding-top: 55upx; */
		top: 0;
	}
.header{
    padding: 100upx 30upx 20upx;
   background:linear-gradient(90deg,rgba(208,164,245,1) 0%,rgba(255,175,220,1) 100%);
}
.c_98b{
	color: #989BF9;
}
.address{
    padding: 30upx;
    background: #fff;
}
.sale-box{
    padding: 0 30upx 30upx;
    margin-top: 15upx;
    background: #fff;
    overflow: hidden;
}
.sale__item{
    margin-top: 30upx;
}
.sale__item:last-child{
    border: 0;
}
.sale__item img{
    width: 180upx;
    height: 180upx;
    border-radius: 10upx;
}
.sale__item__right{
    width: 480upx;
    margin-left: 30upx;
}
.info-box{
    padding: 10upx 30upx;
    margin-top: 15upx;
    background: #fff;
}
.info__item{
    height: 60upx;
}
.footer{
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 98upx;
    padding: 0 30upx;
    background: #fff;
}
.footer button{
    height: 60upx;
    padding: 0 30upx;
    border-radius:30upx;
    margin-left: 10upx;
	line-height: 60upx;
}
.footer .hollow-btn{
    background: none;
    border: 2upx solid #e6e6e6;
    font-size: 26upx;
    color: #808080;
}
.footer .solid-btn{
    /* background: #1a1a1a; */
    font-size: 26upx;
    color: #fff;
}
</style>


