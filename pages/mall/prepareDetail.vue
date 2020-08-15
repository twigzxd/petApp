<template>
    <view class="detail">
        <view class="swiper-box">
			<swiper indicator-dots="true" autoplay="true" indicator-active-color="#ffffff">
				<swiper-item v-for="(item,index) in product.img_path" :key="index">
					<image :src="item"></image>
				</swiper-item>
			</swiper>
        </view>

        <!-- 商品信息 -->
        <view class="info-box">
            <view>
                <text class="fs_24 c_main">¥</text>
                <text class="fs_36 c_main">{{product.price}}</text>
                <text class="fs_26 c_b3 line_through ml_10">¥{{product.price_original}}</text>
            </view>
            <p class="c_1a fs_32 lh_40 mt_20">{{product.name}}</p>
            <view class="mt_20">
                <text class="fs_24 c_98 lh_40">已售 {{product.sales}}</text>
                <view class="share-box" @click="share_show=!share_show">
                    <text class="jcicon jcicon-fenxiang1 fs_26 c_98"></text>
                    <text class="fs_24 c_98">分享</text>
                </view>
            </view>
        </view>
		<view class="expect-box">
			<view class="flex align-center expect">
				<text class="jcicon jcicon-miaosha c_main fs-30"></text>
				<text class="fs_30 c_main ml_20">预购时间</text>
				<text class="fs_28 c_1a ml_20">{{product.start_time}}—{{product.end_time}}</text>
			</view>
			<view class="flex__between__center mt_30">
				<view class="flex align-center">
					<text class="fs_28 c_1a">预购人数</text>
					<text class="fs_32 c_main ml_10">{{product.sales}}</text>
				</view>
				<view class="flex align-center">
					<text class="fs_28 c_1a">已预购金额</text>
					<text class="fs_32 c_main ml_10">¥{{product.actual_appoint_money}}</text>
				</view>
			</view>
		</view>

        <!-- 评价 -->
        <view class="modular">
            <view class="modular__title">
                <text class="fs_36 c_1a fw_500">商品评价</text>
                <text class="fs_30 c_80">（{{review_total}}）</text>
            </view>
            <view class="evaluate__item" v-if="review.length">
                <view class="flex item__header">
                    <image :src="review[0].headimgurl" alt=""></image>
                    <view class="flex__null__around ml_20">
                        <text class="fs_30 c_name">{{review[0].nickname}}</text>
						<view> 
							<text class="fs_26 c_98">{{review[0].create_time}}</text>
							<text class="fs_26 c_98" v-if="review[0].product_sku_name">&emsp;规格:{{review[0].product_sku_name}}</text>
						</view>
                    </view>
                </view>
                <p class="fs_30 c_1a mt_20 lh_40" v-if="review[0].content">{{review[0].content}}</p>
                <view class="flex wrap item__img mt_20" v-if="review[0].img_path.length">
                    <image :src="item" alt="" v-for="(item,index) in review[0].img_path" :key="index" @click="previewImage(index)"></image>
                </view>
            </view>
			<navigator :url="'./evaluateList?id='+product.id">
				<view class="flex__between__center modular__footer">
					<text class="fs_28 c_1a">查看全部评论</text>
					<text class="jcicon jcicon-jiantouarrow487 fs_30 c_98"></text>
				</view>
			</navigator>
        </view>

        <!-- 详情 -->
        <view class="modular" v-if="product.description">
            <view class="modular__title">
                <text class="fs_36 c_1a fw_500">商品详情</text>
            </view>
            <rich-text class="modular__content" :nodes="product.description"></rich-text>>
        </view>
		<!-- 底部操作 -->
        <view class="flex__between footer">
            <view class="flex__between__center footer__left">
                <view class="flex__center__between" @click="collect">
                    <text class="jcicon jcicon-shoucang fs_50 lh_50" :class="is_collect?'c_main':'c_b3'"></text>
                    <text class="fs_20" :class="is_collect?'c_main':'c_4d'">收藏</text>
                </view>
            </view>
            <view class="flex footer__right">
                <button @click='show=!show;orders.settlement_type=1'>加入购物车</button>
                <button @click='show=!show;orders.settlement_type=2'>立即购买</button>
            </view>
        </view>

        <!-- 规格modal -->
        <view>
            <view class='layer' v-show='show' @click='show=!show'></view>
            <view class='model' v-show='show'>
                <view class='model__info'>
                    <image :src='product.cover_img'></image>
                    <view class='flex__null__between model__info__right'>
                        <view class='flex__between__center'>
                            <view>
                                <text class='fs_24 c_main'>¥</text>
                                <text class='fs_32 c_main'>{{product.price}}</text>
                            </view>
                            <text class='jcicon jcicon-error c_b3' @click='show=!show'></text>
                        </view> 
                        <text class='fs_24 c_98'>库存：{{product.stock}}</text>
                        <text v-if="product_spec.length" class='fs_24 c_98'>已选规格：{{sku_name}}</text>
                    </view>
                </view>
                <view class="model__spec-box">
                    <view class='model__spec' v-for="(item,index) in product_spec" :key="index ">
                        <text class='fs_28 c_33'>{{item.spec_title}}</text>
                        <view class='flex wrap '>
                            <view 
                            v-for="(item1,index1) in item.spec_item" 
                            :key="index1" 
                            @click="switchSpec(index,index1)">
                                <view class="model__spec__item" :class="[item1.active?'active':'',item1.apply?'actives':'']">{{item1.spec_item_value}}</view>
                            </view>
                        </view>
                    </view>

                    <view class='flex__between__center model__num'>
                        <text class='fs_28 c_33'>数量</text>
                        <view class='stepper_components'>
                            <view class='count' @click='reduce'>
                                <text class='jcicon jcicon-jianhaocu c_4d fs_22'></text>
                            </view>
                            <view class='count count--big'>
                                <text class='fs_24'>{{orders.number}}</text>
                            </view>
                            <view class='count' @click='add'>
                                <text class='jcicon jcicon-jiahao c_4d fs_22'></text>
                            </view>
                        </view>
                    </view>
                </view>

                <view class='model__footer' @click="sure">
                    <button>确定</button>
                </view>
            </view>
        </view>
        <!-- 浮层菜单 -->
        <back-top v-back-top v-scroll-show:800="is_top" :show="is_top.value" :url="'/Index'"></back-top>
    </view>
</template>
<script>
const app=getApp();
export default {
    name: 'Detail',
    data(){
        return{
            share_show: false,//分享图层
            is_top:{value:false},
            product:{
                img_path:[]
            },
            product_spec: [],
            review_total: 0,
            review:[],
            ensure_modal: false,
            is_collect: 0,
            orders:{
                number: 1,
                settlement_type:1,
                product_id: '',
                sku: ''
            },
            show: false, //规格modal
            sku_name: '请选择',
            sku_arr: [], //选中规格id数组
        }
    },
    methods:{
        // 分享图层
        isShow(data){
            this.share_show=data;
        },
        // 收藏
        collect(){
			app.$vm.getData({
				url:'Mall/submitCollect',
				that: this,
				data: {
					product_id:this.product.id,
					source: 1
				},
				loading: 1
			}).then(res=>{
				uni.showToast({
					title: res.message,
					icon: 'none'
				});
				if(res.code==1&&res.message=='收藏成功'){
					this.is_collect= 1;
				}else if(res.code==1&&res.message=='取消收藏成功'){
					this.is_collect= 0;
				}
			})
        },
        // 选择规格 (下级规格 往里面push)
        switchSpec(index,index1) {
            // 判断当前是否还有库存
            if (this.product_spec[index].spec_item[index1].apply) {
                uni.showToast({
					title: '库存不足',
					icon: 'none'
				});
                return;
            }

            let product_sku = this.product_sku;//匹配规格数据
            let product_spec = this.product_spec;//规格列表
            let sku_arr = this.sku_arr;//选中规格
            sku_arr[index] = product_spec[index].spec_item[index1];
            let chose_sku = sku_arr.concat();//选中规格id,副本
            // 选中或取消
            if (product_spec[index].spec_item[index1].active) {
                // 取消 去掉样式
                product_spec[index].spec_item[index1].active = false;
                chose_sku.splice(index, 1,'');
                for(let i=0;i<chose_sku.length;i++){
                    if(chose_sku[i]){
                        this.proving(chose_sku[i].spec_item_id,res=>{
                            this.splitCheck(res,i);
                        }) 
                    }
                }
            } else {
                //清空当前行选中规格
                for (let i = 0; i < product_spec[index].spec_item.length; i++) {
                    product_spec[index].spec_item[i].active = false;
                }
                product_spec[index].spec_item[index1].active = true;
                this.proving(chose_sku[index].spec_item_id,res=>{
                    this.splitCheck(res,index);
                })  
            }

            let sku_code_str = ''; //副数组转为的字符串
            let chose_sku_vic=[];
            let chose_sku_name=[];
            let sku_name = '';//规格名称
            let product = this.product;
            let check_length=true;
            for(let i=0;i<chose_sku.length;i++){
                if(!chose_sku[i]){
                    check_length=false;
                    break;
                }
            }
            // 规格选全
            if (chose_sku.length == product_spec.length&&check_length) {
                for(let i=0;i<chose_sku.length;i++){
                    chose_sku_vic.push(chose_sku[i].spec_item_id);
                    chose_sku_name.push(chose_sku[i].spec_item_value);
                }
                sku_code_str=chose_sku_vic.sort().join('_');
                sku_name=chose_sku_name.join(',');
                for (let key in product_sku) {
                    if (key == sku_code_str) {
                        product.price = product_sku[key].price;
                        product.cover_img = product_sku[key].cover_img;
                        product.stock = product_sku[key].stock;
                        this.orders.sku = sku_code_str;
                    }
                }
            } else {
                product.price = this.product_vic.price;
                product.cover_img = this.product_vic.cover_img;
                sku_name = '请选择';
                product.stock = this.product_vic.stock;
                this.orders.sku = sku_code_str;
            }
            this.sku_arr=chose_sku;
            this.product_spec=product_spec;
            this.product=product;
            this.sku_name=sku_name;
        },
        // 初始
        initial(){
            let product_sku = this.product_sku;
            let being_sku = [];
            let being_item=[];
            for (let key in product_sku) {
                if (product_sku[key].stock) {
                    let item_str=[];
                    item_str = key.split('_');
                    for(let i=0;i<item_str.length;i++){
                        being_sku.push(item_str[i]);
                    }
                } 
            }
            for(let i=0;i<being_sku.length;i++){
                if(being_item.indexOf(being_sku[i]) == -1){
                    being_item.push(being_sku[i]);
                }
            }
            this.splitCheck(being_item);
        },
        // 返回有当前item_id的
        proving(spec_item_id, callback) {
            let product_sku = this.product_sku;
            let being_sku = [];
            let being_item=[];
            for (let key in product_sku) {
                if (key.indexOf(spec_item_id) != -1&&product_sku[key].stock) {
                    let item_str=[];
                    item_str = key.split('_');
                    for(let i=0;i<item_str.length;i++){
                        being_sku.push(item_str[i]);
                    }
                } 
            }
            for(let i=0;i<being_sku.length;i++){
                if(being_item.indexOf(being_sku[i]) == -1){
                    being_item.push(being_sku[i]);
                }
            }
            callback(being_item);
        },
        //拆分赋值
        splitCheck(being_item,index){
            let product_spec = this.product_spec;
            for (let i = 0; i < product_spec.length; i++) {
                if (i != index) {
                    for (let j = 0; j < product_spec[i].spec_item.length; j++) {
                        product_spec[i].spec_item[j].apply = true;
                    }
                }
            }
            for (let i = 0; i < product_spec.length; i++) {
                if (i != index) {
                    for (let j = 0; j < product_spec[i].spec_item.length; j++) {
                        for(let m = 0; m < being_item.length; m++){
                            if(being_item[m]==product_spec[i].spec_item[j].spec_item_id){
                                product_spec[i].spec_item[j].apply = false;
                                break;
                            }
                        }
                    }
                }
            }
        },
        // 对象深度克隆 
        cloneObj(obj){
            let str, newobj = obj.constructor === Array ? [] : {};
            if(typeof obj !== 'object'){
                return;
            } else if (JSON) {
                str = JSON.stringify(obj), //序列化对象
                newobj = JSON.parse(str); //还原
            } else {//如果不支持以上方法
                for (let i in obj) {
                    newobj[i] = typeof obj[i] === 'object' ? this.cloneObj(obj[i]) : obj[i];
                }
            }
            return newobj;
        },
        // 减
        reduce() {
            if (this.sku_arr.length != this.product_spec.length){
				uni.showToast({
					title: '请选择规格',
					icon: 'none'
				});
                return;
            }
            if (this.orders.number > 1) {
                this.orders.number=this.orders.number - 1;
            } else {
				uni.showToast({
					title: '不能再减了',
					icon: 'none'
				});
            }
        },
        // 加
        add() {
            if (this.sku_arr.length != this.product_spec.length) {
				uni.showToast({
					title: '请选择规格',
					icon: 'none'
				});
                return;
            }
            if (!this.product.stock) {
                this.orders.number=this.orders.number + 1;
            } else if (this.orders.number < this.product.stock) {
                this.orders.number=this.orders.number + 1;
            }else{
                this.orders.number=this.product.stock;
				uni.showToast({
					title: '库存不足' + this.product.stock,
					icon: 'none'
				});
            }
        },
        // 下单
        sure() {
            if (this.sku_arr.length != this.product_spec.length) {
				uni.showToast({
					title: '请选择规格',
					icon: 'none'
				});
                return;
            }
            // 加入购物车
            if (this.orders.settlement_type == 1) {
				app.$vm.getData({
					url:'Mall/updateDetailCart',
					that: this,
					data: this.orders,
					loading: 1
				}).then(res=>{
					if (res.code == 1) {
						this.show=false;
						uni.showToast({
							title: res.message,
							icon: 'none'
						});
					}else{
						uni.showToast({
							title: res.message,
							icon: 'none'
						});
					}
				})
            } else { 
                // 立即购买
				app.$vm.getData({
					url:'Mall/getOrderReady',
					that: this,
					data: this.orders,
					loading: 1
				}).then(res=>{
					if (res.code == 1) {
						uni.navigateTo({
							url: './order?product_id='+this.orders.product_id+'&number='+this.orders.number+'&sku='+this.orders.sku+'&settlement_type=2'
						});
					}else{
						uni.showToast({
							title: res.message,
							icon: 'none'
						});
					}
					
                })
            }
        },
        // 查看大图
        previewImage(index){
			uni.previewImage({
				current: index,
				urls: this.review[0].img_path,
				longPressActions: {
					itemList: ['发送给朋友', '保存图片', '收藏'],
					success: function (res) {
						console.log('选中了第' + (res.tapIndex + 1) + '个按钮');
					},
					fail: function (res) {
						console.log(res.errMsg);
					}    
				}
			});
        }
    },
    onLoad(options){
		app.$vm.getData({
			url:'Mall/getShopDetailData',
			that: this,
			data: {
				product_id: options.id,
			},
			loading: 1
		}).then(res=>{
			if(res.code==1){
				this.orders.product_id=res.data.product.id;
				this.product_sku=res.data.product_sku;
				this.product=res.data.product;
				this.product_vic=this.cloneObj(res.data.product);
				this.product_spec=res.data.product_spec;
				this.review_total=res.data.review_total;
				this.review=res.data.review;
				this.is_collect=res.data.is_collect;
				this.product.description=res.data.product.description.replace(/\<img/gi, '<img style="max-width:100%;height:auto" ');
				this.initial();
			}
		});
    }
}
</script>

<style scoped>
.swiper-box image{
    width:750upx;
    height:600upx;
}
.swiper-box swiper{
	height: 600upx;
}
.info-box{
    position: relative;
    padding: 25upx 30upx 25upx;
    background: #fff;
}
.publicity{
    height: 80upx;
    padding: 0 30upx;
    border-top: 2upx solid #e6e6e6;
    background: #fff;
}
.share-box{
    position: absolute;
    bottom: 25upx;
    right: 0;
    padding: 0 20upx;
    height: 40upx;
    line-height: 40upx;
    border-radius: 20upx 0 0 20upx;
    background: #f0f0f0;
}
/* 模块 */
.modular{
    margin-top: 15upx;
    padding: 0 30upx 0;
    background: #fff;
}
.modular__title{
    padding: 30upx 0;
}
.modular__content{
    padding-bottom:30upx;
}
.evaluate__item{
    padding-bottom: 30upx;
}
.item__header image{
    width: 80upx;
    height: 80upx;
    border-radius: 50%;
}
.item__img image{
    width: 165upx;
    height: 165upx;
    margin: 10upx 0 0 10upx;
}
.item__img image:nth-child(4n+1){
    margin-left: 0;
}
.item__reply{
    padding: 10upx 20upx;
    background: #f5f5f5;
    border-radius: 10upx;
}
.modular__footer{
    height: 90upx;
    border-top: 2upx solid #e6e6e6;
}
.null-box{
    border-top: 2upx solid #e6e6e6;
    height: 90upx;
}

/* modal */
.layer{
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    background: rgba(0,0,0,0.6);
    z-index: 2;
}
.ensure{
    position: fixed;
    bottom: 0;
    width: 100%;
    height: auto;
    z-index: 3;
    background: #fff;
}
.ensure__content{
    padding: 30upx;
}
.ensure-item{
    height: 130upx;
    border-top: 2upx solid #e6e6e6;
}
.ensure-item:nth-child(2){
    border: 0;
}
.ensure-item image{
    width: 60upx;
    height: 60upx;
    border-radius: 50%;
}
.ensure-item__right{
    height: 60upx;
    margin-left: 20upx;
}
.close-btn{
    width: 100%;
    height: 98upx;
    background: #F93A42;
    color: #fff;
    font-size: 32upx;
}
.footer{
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 98upx;
    z-index: 1;
}
.footer__left{
    width: 100%;
    padding: 0 30upx;
    background: #fff;
    border-top: 2upx solid #e6e6e6;
}

.footer__right button{
    width: 600upx;
    height: 98upx;
    background: #F93A42;
    font-size: 32upx;
    color: #fff;
	line-height: 98upx;
}

/* 规格model */
.model{
  position: fixed;
  bottom: 0;
  z-index: 3;
  width: 100%;
  background: #fff;
}
.model__info{
  display: flex;
  padding: 30upx 30upx 0;
}
.model__info image{
  display: block;
  width: 220upx;
  height: 220upx;
  margin-top: -60upx;
  border: 2upx solid #E6E6E6;
  border-radius: 10upx;
  background: #fff;
}
.model__info__right{
  width: 440upx;
  margin-left: 30upx;
}
.size-table{
  width: 120upx;
  height: 30upx;
  background: #1a1a1a;
  line-height: 30upx;
}
.model__spec-box{
    max-height: 700upx;
    padding: 0 30upx;
    margin: 10upx 0;
    overflow: auto;
}
.model__spec{
  padding: 30upx 0;
  border-bottom: 2upx solid #e6e6e6;
}
.model__spec__item{
    min-width: 60upx;
    margin: 20upx 20upx 0 0;
    padding: 0 20upx;
    height: 60upx;
    line-height: 56upx;
    text-align: center;
    font-size: 26upx;
    color: #989898;
    border: 2upx solid #CBCBCB;
    border-radius: 6upx;
}
.active{
    color: #F93A42;
    border: 2upx solid #F93A42;
}
.actives{
    background: #e8e8e8;
    color: #c8c9cc;
    border: none;
}
.model__num{
    height: 120upx;
}
/* 计步器 */
.stepper_components{
    display: flex;
    justify-content: space-between;
    width: 200upx;
    border: 2upx solid #e6e6e6;
}
.stepper_components .count{
    width: 66upx;
    height: 60upx;
    line-height: 60upx;
    text-align: center;
}
.stepper_components .count--big{
    width: 85upx;
    height: 60upx;  
    border-right: 2upx solid #e6e6e6;
    border-left: 2upx solid #e6e6e6;
    text-align: center;
}

.model__footer button{
    width: 100%;
    height: 98upx;
    line-height: 98upx;
    font-size: 32upx;
    background: #F93A42;
    color: #fff;
}
/* expect-box */
.expect-box{
	padding: 30upx;
	background: #fff;
}
.expect{
	height: 80upx;
	padding: 0 30upx;
	background: #FFEBEB;
}
</style>
