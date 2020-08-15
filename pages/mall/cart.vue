<template>
    <div class="cart">
		<!-- #ifdef APP-PLUS -->
		<view class="status_bar">
			<view class="top_view"></view>
		</view>
		<!-- #endif -->
        <div v-if="cart_show">
            <div class="header">
				<navigator open-type="navigateBack"  class="back-box">
					<text class="iconfont icon-zuojiantou c_ff"></text>
				</navigator>
                <span class="fs_32 c_ff">购物车</span>
                <div class="flex align-center" v-show="!edit_switch" @click="edit_switch=!edit_switch">
                    <span class="jcicon jcicon-bianji fs_36 c_ff"></span>
                    <span class="fs_28 c_ff ml_10">编辑</span>
                </div>
                <div class="flex align-center" v-show="edit_switch" @click="edit_switch=!edit_switch">
                    <span class="jcicon jcicon-chenggong- fs_30 c_ff"></span>
                    <span class="fs_28 c_ff ml_10">完成</span>
                </div>
            </div>
            <div class="header-layer"></div>
            <!-- 商品列表 -->
            <div class="modular">
                <div>
                    <div class="flex modular__item"  v-for="(item,index) in effective_cart" :key="index">
                        <div class="flex__center__center checkbox__item">
							<text class="jcicon jcicon-dui c_bl fs_36" v-if="item.is_select" @click="setSingle(item.id,index)"></text>
							<text class="jcicon jcicon-unselected c_80 fs_36" v-else @click="setSingle(item.id,index)"></text>
                        </div>
                        <div class="flex modular__item__info">
                            <img :src="item.cover_img" alt="" v-link="'/Mall/Detail/'+item.product_id">
                            <div class="flex__null__around modular__item__right">
                                <span class="fs_26 c_1a lh_36 ellipsis_two" style="width: 390upx;" v-link="'/Mall/Detail/'+item.product_id">{{item.name}}</span>
                                <view class="fs_22 c_98 product_sku" v-if="item.product_sku">规格:{{item.product_sku_name}}</view>
                                <div class="flex__between__center">
                                    <span class="c_98b fs_30"><span class="fs_22">¥</span>{{item.price}}</span>
                                    <div class='stepper_components'>
                                        <div class='count' @click.stop='reduce(index)'>
                                            <span class='jcicon jcicon-jianhaocu c_4d fs_22'></span>
                                        </div>
                                        <div class='count count--big'>
                                            <span class='fs_24'>{{item.number}}</span>
                                        </div>
                                        <div class='count' @click.stop='add(index)'>
                                            <span class='jcicon jcicon-jiahao c_4d fs_22'></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> 
                <!-- 失效商品列表 -->
                <div class="mt_20" v-if="invalid_cart.length">
                    <div class="flex__between modular__title">
                        <span class="fs_28 c_66">失效宝贝{{invalid_cart.length}}件</span>
                        <span class="fs_28 c_98b" @click="clear">清空失效宝贝</span>
                    </div>
                    <div class="flex modular__item" v-for="(item,index) in invalid_cart" :key="index">
                        <div class="modular__item-layer"></div>
                        <div class="flex__center__center checkbox__item">
                            <span class="invalid-box">失效</span>
                        </div>
						<div class="flex modular__item__info">
							<img :src="item.cover_img" alt="">
							<div class="flex__null__around modular__item__right">
								<span class="fs_26 c_1a lh_36 ellipsis_two" style='width: 390upx;'>{{item.name}}{{item.name}}</span>
								<span class="fs_22 c_98" v-if="item.product_sku">规格:{{item.product_sku_name}}</span>
								<span class="c_98b fs_30"><span class="fs_22">¥</span>{{item.price}}</span>
							</div>
						</div>
                    </div>
                </div>
            </div>
            <!-- 底部操作栏 -->
            <div class="flex__between__center footer">
                <div class="flex__between__center footer__left">
					<text class="jcicon jcicon-dui c_bl fs_36" v-if="is_all" @click="setAll"></text>
					<text class="jcicon jcicon-unselected c_80 fs_36" v-else @click="setAll"></text>
                    <span class="fs_32 c_4d ml_10">全选</span>
                </div>
                <div class="flex align-center">
                    <div>
                        <span class="fs_28 c_4d">合计：</span>
                        <span class="c_98b fs_24">¥</span>
                        <span class="c_98b fs_32">{{total_money}}</span>
                    </div>
                    <button class="cancel" @click="del" v-show="edit_switch">删除&ensp;({{total_number}})</button>
                    <button class="cancel" @click="balance" v-show="!edit_switch">结算&ensp;({{total_number}})</button>
                </div>
            </div>
        </div>
        <div class="nothing-box " v-else>
			<div class="headers">
				<navigator open-type="navigateBack" class="backbox">
					<text class="iconfont icon-zuojiantou c_1a"></text>
				</navigator>
			    <span class="fs_32 c_1a">购物车</span>
			</div>
            <div class="flex__center__around" style='margin-top: 152upx;'>
                <img class='cartnull' src="@/static/images/cartnull.png" alt="">
                <p class="fs_32 c_4d mt_30" style='margin-top: 120upx;'>给主子的购物车竟然是空的～</p>
				<view class="goindex">去给主子买肉肉</view>
            </div>
        </div>
    </div>
</template>
<script>
const app=getApp();
export default {
    name:'Cart',
    data(){
        return{
            cart_show: true, //购物车缺省
            edit_switch: false, //是否全选
            is_all: 0, //是否全选
            cart_id: '', //购物车操作id
            effective_cart: [],
            invalid_cart: [],
            total_number: 0,
            total_money: ''
        }
    },
	onShow(){
	    this.load();
	},
    methods:{
        // 获取数据
        load(){
			app.$vm.getData({
				url:'home/getCartData',
				that: this,
				data: {},
				loading: 1
			}).then(res=>{
				if(res.code==1){
					this.effective_cart=res.data.effective_cart;
					this.invalid_cart=res.data.invalid_cart;
					this.total_money=res.data.total_money;
					this.total_number=res.data.total_number;
				}
			})
        },
        // 减
        reduce(index){
            if(this.effective_cart[index].number==1){
				uni.showToast({
					title: '最少购买1件哦!',
					icon: 'none'
				})
                return;
            }
            this.effective_cart[index].number=this.effective_cart[index].number-1;
            let goods=this.effective_cart[index];
			app.$vm.getData({
				url:'home/updateCart',
				that: this,
				data: {
					product_id: goods.product_id,
					number: goods.number,
					sku: goods.product_sku
				},
				loading: 0
			}).then(res=>{
				if(res.code==1){
					if(!goods.number){
						this.load();
						uni.showToast({
							title: res.message,
							icon: "none"
						})
					}
					this.total_money=res.data.total_money;
					this.total_number=res.data.total_number;
				}else{
					uni.showToast({
						title: res.message,
						icon: "none"
					})
				}
			})
        },
        // 加
        add(index){
            this.effective_cart[index].number=this.effective_cart[index].number+1;
            let goods=this.effective_cart[index];
			app.$vm.getData({
				url:'home/updateCart',
				that: this,
				data: {
					product_id: goods.product_id,
					number: goods.number,
					sku: goods.product_sku
				},
				loading: 0
			}).then(res=>{
				if(res.code==1){
					this.total_money=res.data.total_money;
					this.total_number=res.data.total_number;
				}else{
					this.effective_cart[index].number=goods.number-1;
					uni.showToast({
						title: res.message,
						icon: 'none'
					})
				}
				
			})
        },
        // 全选
        setAll(){
			if(this.is_all){
				this.is_all=0;
			}else{
				this.is_all=1;
			}
            for(let i=0;i<this.effective_cart.length;i++){
                if(this.is_all){
                    this.effective_cart[i].is_select=1;
                }else{
                    this.effective_cart[i].is_select=0;
                }
            }
			app.$vm.getData({
				url:'home/updateCartAll',
				data: {
					is_select: this.is_all
				},
				loading: 1
			}).then(res=>{
				if(res.code==1){
					this.total_money=res.data.total_money;
					this.total_number=res.data.total_number;
				}else{
					uni.showToast({
						title: res.message,
						icon: "none"
					})
				}
            })
        },
        // 单个复选框
        setSingle(id,index){
			if(this.effective_cart[index].is_select){
				this.effective_cart[index].is_select=0;
			}else{
				this.effective_cart[index].is_select=1;
			}
			app.$vm.getData({
				url:'home/updateCartSelect',
				data: {
					cart_id: id,
					is_select: this.effective_cart[index].is_select
				},
				loading: 0
			}).then(res=>{
				if(res.code==1){
					this.total_money=res.data.total_money;
					this.total_number=res.data.total_number;
				}else{
					uni.showToast({
						title: res.message,
						icon: "none"
					})
				}
			})
        },
        // 删除
        del(){
            if(this.cart_id){
				app.$vm.getData({
					url:'home/deleteCart',
					data: {
						cart_id: this.cart_id
					},
					loading: 1
				}).then(res=>{
					if(res.code==1){
						this.load();
					}
					uni.showToast({
						title: res.message,
						icon: "none"
					})
				})
            }else{
				uni.showToast({
					title: '您未选中宝贝',
					icon: "none"
				})
            }
        },
        // 清楚无效商品
        clear(){
			app.$vm.getData({
				url:'home/deleteInvalid',
				data: {},
				loading: 1
			}).then(res=>{
				if(res.code==1){
					this.load();
				}
				uni.showToast({
					title: res.message,
					icon: "none"
				})
			})
        },
        // 结算
        balance(){
			const _this=this;
            if (this.total_number) {
				app.$vm.getData({
					url:'home/verificationStock',
					that: this,
					data: {},
					loading: 1
				}).then(res=>{
					if(res.code==1){
						uni.navigateTo({
							url: './order?settlement_type=1'
						})
					}else{
						uni.showToast({
							title: res.message,
							icon: "none"
						})
					}
                }).catch(res=>{
					uni.showModal({
						content: res.message,
						showCancel: false,
						success(){
							_this.loadList(1);
						}
					});
				})
            }else{
				uni.showToast({
					title: "请选择商品",
					icon: "none"
				})
            }
        }
    },
    watch: {
        effective_cart:{
            handler(newVal, oldVal){
                let all_arr=[];
                if(newVal.length){
                    this.cart_show=true;
                    for(let i=0;i<newVal.length;i++){
                        if(newVal[i].is_select){
                            all_arr.push(newVal[i].id);
                        }
                    }
                    this.cart_id=all_arr.join(',');
                    if(all_arr.length==newVal.length){
                        this.is_all=1;
                    }else{
                        this.is_all=0;
                    }
                }else{
                    this.cart_show=false;
                    this.is_all=0;
                }
                
            },
            deep: true
        }
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
	.c_bl{
		color: #989BF9;
	}
	.product_sku{
		background:rgba(245,245,245,1);
		border-radius:20upx;
		padding: 5upx 15upx;
		margin-bottom: 20upx;
	}
	.c_98b{
		color: #989BF9;
	}
    /* 无内容 */
    .nothing-box{
        position: fixed;
        top: 0;
        bottom: 0;
        width: 100%;
        background: #E9ECF1;
    }
    .nothing-box .cartnull{
      width: 389upx;
      height: 242upx;
    }
    .header{
        position: fixed;
        z-index: 2;
        width: 100%;
        height: 90upx;
        padding: 0 30upx;
        /* height:350upx; */
        background:linear-gradient(90deg,rgba(208,164,245,1) 0%,rgba(255,175,220,1) 100%);
        text-align: center;
        line-height: 90upx;
		display: flex;
		padding-top: 80upx;
		padding-bottom: 20upx;
		align-items: center;
		justify-content: space-between;
    }
	.headers{
		position: relative;
		z-index: 2;
		width: 100%;
		height: 90upx;
		padding: 0 30upx;
		/* height:350upx; */
		background:#E9ECF1;
		text-align: center;
		line-height: 90upx;
		display: flex;
		padding-top: 80upx;
		padding-bottom: 20upx;
		align-items: center;
		justify-content: center;
	}
	.backbox{
		position: absolute;
		left: 20upx;
		top: 40upx;
	}
    .header-layer{
        position: fixed;
        top: 90upx;
        width: 100%;
        height: 220upx;
        background:linear-gradient(90deg,rgba(208,164,245,1) 0%,rgba(255,175,220,1) 100%);
    }
    .header>div{
        /* position: absolute;
        top: 0;
        right: 30upx; */
    }
    /* 商品列表 */
    .modular{
        position: relative;
        z-index: 1;
        padding: 90upx 20upx 98upx;
    }
	.modular__title{
        padding: 30upx;
        background: #fff;
		border-bottom: 2upx solid #e6e6e6;
		border-radius: 10upx 10upx 0 0;
	}
    .modular__item{
        position: relative;
        width: 710upx;
        height: 240upx;
        padding: 30upx;
        background: #fff;
        /* border-bottom: 2upx solid #e6e6e6; */
    }
    .modular__item__info{
        position: absolute;
        left: 80upx;
    }
    .modular__item__right{
        /* width: 390upx; */
        margin-left: 30upx;
    }
    .modular__item-layer{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255,255,255,0.4);
    }
    .modular__item:first-child{
        border-radius:20upx 20upx 0 0;
    }
    .modular__item:last-child{
        border-radius: 0 0 20upx 20upx;
        border: 0;
    }
    .modular__item img{
        width:180upx;
        height:180upx;
        border-radius:10upx;
    }
    .checkbox__item{
        position: absolute;
        left: 0;
        width: 80upx;
        height: 180upx;
    }
    .invalid-box{
        height: 30upx;
        padding: 0 12upx;
        background: #cbcbcb;
        line-height: 30upx;
        font-size: 22upx;
        color: #fff;
        border-radius: 30upx;
    }
    /* footer */
    .footer{
        position: fixed;
        z-index: 3;
        width: 100%;
        bottom: 0;
        height: 98upx;
        background: #fff;
    }
    .footer__left{
        padding: 0 30upx;
    }
    .cancel{
        width: 250upx;
        height: 98upx;
        margin-left: 30upx;
        background: #989BF9;
        color: #fff;
        font-size: 32upx;
		line-height: 98upx;
    }
    /* 计步器 */
    .stepper_components{
        display: flex;
        justify-content: space-between;
        width: 180upx;
        height: 50upx;
        border: 2upx solid #e6e6e6;
        border-radius: 10upx;
    }
    .stepper_components .count{
        width: 54upx;
        height: 46upx;
        line-height: 46upx;
        text-align: center;
    }
    .stepper_components .count--big{
        width: 70upx;
        height: 46upx;  
        border-right: 2upx solid #e6e6e6;
        border-left: 2upx solid #e6e6e6;
        text-align: center;
    }
	.goindex{
		width:280upx;
		height:80upx;
		background:linear-gradient(90deg,rgba(208,164,245,1) 0%,rgba(255,175,220,1) 100%);
		border-radius:40upx;
		line-height: 80upx;
		text-align: center;
		font-size:26upx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:rgba(255,255,255,1);
		margin-top: 75upx;
	}
</style>

