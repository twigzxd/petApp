<template>
    <div class="prepare">
        <div class="flex__between search-box">
            <div class="flex align-center search__item">
                <span class="fs_28 c_b3 jcicon jcicon-sousuo1">&nbsp;</span>
                <input class="fs_28 c_b3 ml_10" type="text" placeholder="请输入关键字搜索" v-model="loads.keyword">
            </div>
        </div>
		<div class="flex__between__center nav">
		    <div class="flex__between__center nav__left">
		        <div class="flex__between__center">
					<picker @change="setSort" :value="sort_list" :range="sort_list" range-key="name">
						<view class="lh_40">
							<span class="fs_30" :class="loads.order_id!=4?'c_main':'c_4d'">{{sort_list[sort_index].name}}</span>
							<span class="fs_30 jcicon jcicon-xiala2" :class="loads.order_id!=4?'c_main':'c_4d'"></span>
						</view>
					</picker>
		            <span class="fs_30" :class="loads.order_id==4?'c_main':'c_4d'" @click="loads.order_id=4;loadList(1)">销量优先</span>
		        </div>
		    </div>
		</div>
        <!-- 列表 -->
		<div class="row-box">
			<navigator :url="'./prepareDetail?id='+item.id" v-for="(item,index) in list" :key="index">
				<div class="flex row__item">
					<img :src="item.cover_img" alt="">
					<div class="flex__null__around row__info">
						<div class="flex ellipsis_two">
							<span class="fs_30 c_1a lh_40">{{item.name}}</span>
						</div>
						<div class="mt_10 lh_40">
							<span class="fs_26 c_main">¥</span>
							<span class="fs_36 c_main">{{item.price}}</span>
						</div>
						<text class="fs_24 c_80">已有{{item.price}}人预购</text>
					</div>
				</div>
			</navigator>
		</div>
    </div>
</template>
<script>
const app=getApp();
export default {
    name:'Prepare',
    data(){
        return{
            edit_switch: false,
            list: [],
            loads: {
                keyword:'',
				order_id: 1
            },
            sort_index: 0,
            sort_list:[
                {
                    id:1,
                    name:'综合排序'
                },
                {
                    id:2,
                    name:'价格降序'
                },
                {
                    id:3,
                    name:'价格升序'
                }
            ]
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
				url:'Mall/getShopList',
				that: this,
				data: this.loads,
				loading: 1,
				page
			});
		},
		// 排序方式
		setSort(e){
			let index=e.detail.value;
		    this.sort_index=index;
		    this.loads.order_id=this.sort_list[index].id;
			this.loadList(1);
		},
    }
}
</script>
<style>
	.search-box{
		position: fixed;
		top: 0;
	}
    .search__item{
        width: 690upx;
    }
	.nav{
		position: fixed;
		top: 90upx;
		width: 100%;
	    height: 90upx;
		padding: 0 30upx;
	    background: #fff;
		border-bottom: 2upx solid #e6e6e6;
	}
	.nav__left>div{
	    width: 340upx;
	    height: 90upx;
	}
    .row-box{
		margin-top: 180upx;
        overflow: hidden;
        padding: 0 30upx 30upx;
        background: #fff;
    }
    .row__item{
        margin-top: 30upx;
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
</style>

