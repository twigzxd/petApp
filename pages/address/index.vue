<template>
    <view class="address-index">
		<navigator url="./edit?id=0">
			<view class="flex align-center header">
				<text class="jcicon jcicon-jiahao1 fs_34 c_98b"></text>
				<text class="fs_30 c_1a ml_10">新增收货地址</text>
			</view>
		</navigator>
        <view class="list">
            <view class="item" v-for="(item,index) in list" :key="index" @click="setAddressId(item.id)">
                <view class="item__top">
                    <view>
                        <text class="fs_30 c_1a">{{item.linkman}}</text>
                        <text class="fs_30 c_1a ml_20">&emsp;{{item.mobile_phone}}</text>
                    </view>
                    <view class="mt_20">
                        <text class="fs_28 c_80 lh_34">{{item.province}}{{item.city}}{{item.area}}{{item.address}}</text>
                    </view>
                </view>
                <view class="flex__between__center item__bottom">
                    <view v-if="item.is_default==1" @click.stop="setDefault(item.id)">
                        <text class="jcicon jcicon-unselected fs_34 c_98"></text>
                        <text class="fs_26 c_98 ml_10">设为默认</text>
                    </view>
                    <view v-else>
                        <text class="jcicon jcicon-dui fs_34 c_98b"></text>
                        <text class="fs_26 c_1a ml_10">默认地址</text>
                    </view>
                    <view class="flex__between__center">
						<view @click.stop="link(item.id)">
							<text class="jcicon jcicon-bianji fs_34 c_98"></text>
							<text class="fs_26 c_98 ml_10">编辑</text>
						</view>
                        <view class="ml_50" @click.stop="del(item.id)">
                            <text class="jcicon jcicon-shanchu1 fs_34 c_98"></text>
                            <text class="fs_26 c_98">&nbsp;删除</text>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
const app=getApp();
export default {
    name:"AddressIndex",
    data(){
        return{
            list:[]
        }
    },
    methods:{
		// 跳转编辑
		link(id){
			uni.navigateTo({
				url: '/pages/address/edit?id='+id,
				complete(res){
					console.log(res);
				}
			})
		},
        // 数据
        load(){
			app.$vm.getData({
				url:'Address/getMyAddress',
				that: this,
				data: {},
				loading: 1,
			}).then(
                res=>{
                    if(res.code==1){
                        this.list=res.data;
                    }
                }
            )
        },
        // 设置默认
        setDefault(id){
			app.$vm.getData({
				url:'Address/changeDefault',
				that: this,
				data: {
					id: id
				},
				loading: 1,
			}).then(
                res=>{
                    if(res.code==1){
						uni.showToast({
							title: res.message,
							icon: 'none'
						});
                        this.load();
                    }
                }
            ) 
        },
        // 删除
        del(id){
            uni.showModal({
                content: '确定删除该地址？',
				success(res) {
					if(res.confirm){
						app.$vm.getData({
							url:'Address/deleteAddress',
							that: this,
							data:{id: id},
							loading: 1
						}).then(res=>{
							if(res.code==1){ 
								this.load();
							}
						}) 
					}
				}
            })
        },
        // 选择地址
        setAddressId(data){
			app.globalData.address_id=data;
			uni.navigateBack();
			// const pages = getCurrentPages();
			// const currPage = pages[pages.length - 1]; // 当前页
			// const prevPage = pages[pages.length - 2]; // 上一个页面
			// // 如果存在上一页
			// console.log(data,prevPage.data.orders.address_id)
			// if(prevPage){
			// 	prevPage.setData({
			// 		'orders.address_id':data
			// 	})
			// 	uni.navigateBack()
			// }
        }
    },
    onShow(){
		this.load();
    }
}
</script>
<style scoped>
.header{
    height: 100upx;
    padding: 0 30upx;
    margin-top: 15upx;
    background: #fff;
}
.item{
    padding: 0 30upx;
    margin-top: 15upx;
    background: #fff;
}
.item__top{
    padding: 30upx 0; 
    border-bottom: 2upx solid #e6e6e6;
}
.item__bottom{
    height: 100upx;
}
.c_98b{
	color: #989BF9;
}
</style>

