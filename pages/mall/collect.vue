<template>
    <div class="collect">
		<!-- #ifdef APP-PLUS -->
		<view class="status_bar">
			<view class="top_view"></view>
		</view>
		<!-- #endif -->
        <div class=" header " style='background:rgba(245,245,245,1);align-items: center;'>
			<navigator open-type="navigateBack" class="back-box">
				<text class="iconfont icon-zuojiantou " ></text>
			</navigator>
            <div class="flex align-center search__item">
                <span class="fs_28 c_b3 jcicon jcicon-sousuo1">&nbsp;</span>
                <input style="background: #FFFFFF;padding: 10upx 0;" class="fs_28 c_b3" type="text" placeholder="请输入关键字搜索" v-model="loads.keyword" @confirm="loadList(1)">
            </div>
            <div class="flex align-center" v-show="!edit_switch" @click="edit_switch=!edit_switch">
                <!-- <span class="jcicon jcicon-bianji fs_32 c_1a"></span> -->
                <span class="fs_28 c_1a ml_10">管理</span>
            </div>
            <div class="flex align-center" v-show="edit_switch" @click="edit_switch=!edit_switch">
                <!-- <span class="jcicon jcicon-chenggong- fs_32 c_1a"></span> -->
                <span class="fs_28 c_1a ml_10">完成</span>
            </div> 
        </div>
        <!-- 列表 -->
		<div class="row-box" v-for="(item,index) in list" :key="index">
			<!-- <navigator :url="'./detail?id='+item.product_id" > -->
				<div class="flex row__item" :class="edit_switch?'left_60':''"  >
					<div class="flex align-center checkbox__item" v-show="edit_switch">
						<text class="jcicon jcicon-dui   fs_36" v-if="item.is_chose" @click="setChose(item.id,index)"></text>
						<text class="jcicon jcicon-unselected c_80 fs_36" v-else @click="setChose(item.id,index)"></text>
					</div>
					<img :src="item.cover_img" alt="" @click='go(item.product_id,item.is_invalid)'>
					<div class="flex__null__around row__info" @click='go(item.product_id,item.is_invalid)'>
						<div class="flex ellipsis_two">
							<span v-if="item.is_invalid==2" class="invalid-box">失效</span>
							<span class="fs_30 c_1a lh_40">{{item.name}}</span>
						</div>
						<div class="mt_10 lh_40">
							<span class="fs_26 c_98b">¥</span>
							<span class="fs_36 c_98b">{{item.price}}</span>
						</div>
					</div>
				</div>
			<!-- </navigator> -->
		</div>
        <!-- 底部操作栏 -->
        <div class="flex__between__center footer" v-show="edit_switch">
            <div class="flex__between__center footer__left">
				<text class="jcicon jcicon-dui   fs_36" v-if="is_all" @click="setAll"></text>
				<text class="jcicon jcicon-unselected c_80 fs_36" v-else @click="setAll"></text>
				<span class="fs_32 c_4d ml_10">全选</span>
            </div>
            <div class="flex align-center">
                <span class="fs_32 c_98b" @click="del">清空失效宝贝</span>
                <button class="cancel" @click="cancel">取消收藏</button>
            </div>
        </div>
    </div>
</template>
<script>
const app=getApp();
export default {
    name:'Collect',
    data(){
        return{
            edit_switch: false,
            is_all: 0,
            list: [],
            loads: {
                keyword:''
            }
        }
    },
	onLoad(){
		this.loadList(1);
	},
	onReachBottom(){
		this.loadList(2);
	},
    methods:{
		// 加载商品
		loadList(page){
			app.$vm.getList({
				url:'home/getMyCollectList',
				that: this,
				data: this.loads,
				loading: 1,
				page
			});
		},
		go(id,type){
			if(type==2){
				uni.navigateTo({
					url:'../program/noexitgood'
				})
			}else{
				uni.navigateTo({
					url:'./detail?id='+id
				})
			}
		},
		// 单选
		setChose(id,index){
			if(this.list[index].is_chose){
				this.list[index].is_chose=0
			}else{
				this.list[index].is_chose=1;
			}
            let all_arr=[];
			for(let i=0;i<this.list.length;i++){
				if(this.list[i].is_chose){
					all_arr.push(this.list[i].id);
				}
			}
			if(all_arr&&all_arr.length==this.list.length){
				this.is_all=1;
			}else{
				this.is_all=0;
			}
			this.all_id=all_arr.join(',')
		},
        // 全选
        setAll(){
			if(this.is_all){
				this.is_all=0;
			}else{
				this.is_all=1;
			}
            for(let i=0;i<this.list.length;i++){
                if(this.is_all){
                    this.list[i].is_chose=1;
                }else{
                    this.list[i].is_chose=0;
                }
            }
        },
        // 清楚失效的收藏
        del(){
			app.$vm.getData({
				url:'home/deleteCollectInvalid',
				that: this,
				data: {},
				loading: 1
			}).then(res=>{
				uni.showToast({
					title: res.message,
					icon: 'none'
				})
				if(res.code==1){
					this.loadList(1);
				}
			})
        },
        // 取消收藏
        cancel(){
			const _this=this;
			app.$vm.getData({
				url:'home/deleteMyCollect',
				that: this,
				data: {my_collect_id: this.all_id},
				loading: 1
			}).then(res=>{
				if(res.code==1){
					uni.showModal({
						content: res.message,
						showCancel: false,
						success(){
							_this.loadList(1);
						}
					});
				}
			})
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
<style>
	.jcicon-dui{
		color: #989BF9;
	}
	.c_98b{
		color: #989BF9;
	}
    .search__item{
        /* width: 580upx; */
		flex: 1;
		background: #FFFFFF;
		margin: 0 30upx;
		border-radius: 33upx;
    }
    .row-box{
        overflow: hidden;
        padding: 0 30upx 30upx;
        background: #fff;
		margin: 0 20upx 20upx;
		border-radius:20upx;
    }
    .row__item{
        position: relative;
        margin-top: 30upx;
    }
    .left_60{
        left: 60upx;
    }
    .row__item img{
        width: 280upx;
        height: 280upx;
        border-radius: 10upx;
    }
    .row__info{
		width: 380upx;
        margin-left: 30upx;
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
    .checkbox__item{
        position: absolute;
        left: -60upx;
        height: 280upx;
    }
    /* footer */
    .footer{
        position: fixed;
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
	.back-box{
		color: #000000;
	}
	.header{
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 60upx 30upx 20upx;
	}
</style>

