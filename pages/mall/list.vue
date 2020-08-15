<template>
    <div class="list">
        <div class="flex__around search-box">
            <div class="flex align-center search__item">
                <span class="fs_28 c_b3 jcicon jcicon-sousuo1">&nbsp;</span>
                <input class="fs_28" type="text" placeholder="请输入关键字搜索" v-model="loads.keyword" @confirm="loadList(1)">
            </div>
        </div>
        <div class="flex__between__center nav">
            <div class="flex__between__center nav__left">
                <div class="flex__between__center">
					<picker @change="setSort" :value="sort_list" :range="sort_list" range-key="name">
						<view class="lh_40">
							<span class="fs_30" :class="loads.order_id!=4?'c_98b':'c_4d'">{{sort_list[sort_index].name}}</span>
							<span class="fs_30 jcicon jcicon-xiala2" :class="loads.order_id!=4?'c_98b':'c_4d'"></span>
						</view>
					</picker>
                    <span class="fs_30" :class="loads.order_id==4?'c_98b':'c_4d'" @click="loads.order_id=4;loadList(1)">销量优先</span>
                </div>
                <!-- <span class="fs_40 c_80 jcicon" :class="style?'jcicon-leimupinleifenleileibie':'jcicon-copy'" @click="style=!style"></span> -->
            </div>
			<div style='margin-right: 30upx;'>
				<span class="fs_40 c_80 jcicon" :class="style?'jcicon-leimupinleifenleileibie':'jcicon-copy'" @click="style=!style"></span>
			</div>
           <!-- <div class="flex__center__center screen-box" @click="sidebar=!sidebar">
                <span class="fs_30 c_4d">筛选</span>
                <span class="fs_30 c_80 jcicon jcicon-shaixuan"></span>
            </div> -->
        </div>
        <!-- 一行俩 -->
        <div class="column-box flex__between wrap" v-show="style">
			<navigator class="flex" :url="'./detail?id='+item.id" v-for="(item,index) in list" :key="index">
				<div class="column__item">
					<img :src="item.cover_img" alt="">
					<div class="column__info">
						<span class="fs_28 c_1a lh_40 ellipsis_two">{{item.name}}</span>
						<div class="mt_10 lh_40">
							<span class="fs_26 c_98b">¥</span>
							<span class="fs_30 c_98b">{{item.price}}</span>
							<span class="fs_24 c_b3" style='margin-left: 5upx;'>&ensp;已售{{item.sales}}</span>
						</div>
					</div>
				</div>
			</navigator>
        </div>
        <!-- 一行一个 -->
        <div class="row-box" v-show="!style&&list.length">
			<navigator :url="'./detail?id='+item.id" v-for="(item,index) in list" :key="index">
				<div class="flex row__item">
					<img :src="item.cover_img" alt="">
					<div class="flex__null__around row__info">
						<span class="fs_30 c_1a lh_40 ellipsis_two">{{item.name}}</span>
						<div class="mt_10 lh_40">
							<span class="fs_26 c_98b">¥</span>
							<span class="fs_36 c_98b">{{item.price}}</span>
						</div>
						<span class="fs_24 c_b3">&ensp;已售{{item.sales}}</span>
					</div>
				</div>
			</navigator>
        </div>
        <!-- 侧边栏 -->
        <div class="sidebar-box" v-show="sidebar">
            <div class="layer" @click="sidebar=!sidebar"></div>
            <div class="content">
                <p class="fs_40 c_1a fw_500">选择分类</p>
                <div class="sidebar__item bb_1" v-for="(item,index) in category" :key="index">
                    <div class="flex__between" @click="setClickNumber(index)">
                        <span class="fs_28 c_66">{{item.name}}</span>
                        <span class="jcicon fs_34 c_98" :class="!item.click_number?'jcicon-icon-shang':'jcicon-huaban'"></span>
                    </div>
                    <div class="flex wrap category__list" v-show="!item.click_number">
                        <div class="flex__around__center category__item ellipsis_one" :class="item1.is_choose?'active':''" v-for="(item1,index1) in item.lower_category" :key="index1" @click="setChose(index,index1)">
                            <span class="fs_24" :class="item1.is_choose?'c_ff':'c_4d'">{{item1.name}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex__end__center footer">
                <div class="flex"> 
                    <button class="reset" @click="reset">重置</button>
                    <button class="sure" @click="sure">确定</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
const app=getApp();
export default {
    name:'List',
    data(){
        return{
            sort_index: 0,
            style: true, //展示类型 ture：1行2;false:1行1
            sidebar: false,
            list:[],
            loads:{
                order_id: 1,
                second_category_id: '',
                keyword: '',
                page:1,
				type:''
            },
            category:[
                {
                    lower_category:[{}]
                }
            ],
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
    methods:{
        // 加载商品
        loadList(page){
        	app.$vm.getList({
        		url:'home/getListList',
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
		// 设置选中分类
		setChose(index,index1){
			this.category[index].lower_category[index1].is_choose=!this.category[index].lower_category[index1].is_choose;
		},
		// 分类展开关闭
		setClickNumber(index){
			this.category[index].click_number=!this.category[index].click_number
		},
        // 确定分类
        sure(){
            this.sidebar=false;
            this.loads.second_category_id='';
            let array=[];
            for(let i=0;i<this.category.length;i++){
                for(let j=0;j<this.category[i].lower_category.length;j++){
                    if(this.category[i].lower_category[j].is_choose){
                     array.push(this.category[i].lower_category[j].second_category_id);
                    }   
                }
            }
            this.loads.second_category_id=array.join(',');
			this.loadList(1);
        },
        // 重置分类
        reset(){
            this.loads.second_category_id='';
            for(let i=0;i<this.category.length;i++){
                for(let j=0;j<this.category[i].lower_category.length;j++){
                    if(this.category[i].lower_category[j].is_choose){
                        this.category[i].lower_category[j].is_choose=0;
                    }   
                }
            }
        }
    },
	onReachBottom(){
		this.loadList(2);
	},
    onLoad(options){
		console.log(options)
        if(app.globalData.keyword){
            this.loads.keyword=app.globalData.keyword;
        }
		if(options.type){
			this.loads.type=options.type
		}
		// if(options.second_category_id){
		// 	this.loads.second_category_id=options.second_category_id
		// }
		app.$vm.getData({
			url:'home/getListData',
			that: this,
			data:  {
				first_category_id: options.first_category_id,
				second_category_id: options.second_category_id
			},
			loading: 1
		}).then(res=>{
			if(res.code==1){
				this.category=res.data.category;
				let category_arr=[];
				
				for(let i=0;i<this.category.length;i++){
					for(let j=0;j<this.category[i].lower_category.length;j++){
						if(this.category[i].lower_category[j].is_chose==1){
							console.log(this.category.length)
							category_arr.push(this.category[i].lower_category[j].second_category_id);
							console.log(category_arr)
						}
					}
				}
				this.loads.second_category_id=category_arr.join();
				this.loadList(1);
			}
        })
    },
    onHide(){
		console.log(1)
        app.globalData.keyword='';
    },
	onUnload() {
		app.globalData.keyword='';
	}
}
</script>
<style scoped>
	.c_98b{
		color: #989BF9;
	}
    .nav{
        height: 90upx;
        background: #fff;
    }
    .nav__left{
        width: 600upx;
        padding: 0 30upx;
    }
    .nav__left>div{
        width: 340upx;
        height: 90upx;
    }
    .screen-box{
        width: 150upx;
        height: 40upx;
        border-left: 1upx solid #e6e6e6;
    }
    /* 商品 */
    .column-box{
        padding: 0 24upx;
    }
    .column__item{
        width: 340upx;
        margin-top: 20upx;
        background: #fff;
        border-radius: 10upx;
    }
    .column__item img{
        width: 340upx;
        height: 340upx;
        border-radius: 10upx 10upx 0 0;
    }
    .column__info{
        padding: 20upx 10upx;
    }
    /* 一行一个 */
    .row-box{
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
    /* 浮层 */
    .sidebar-box{
        position: fixed;
        top: 0;
        bottom: 0;
		z-index: 2;
    }
    .layer{
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 150upx;
        background: rgba(0, 0, 0, .6);
    }
    .content{
        position: absolute;
        left: 150upx;
        top: 0;
        bottom: 0;
        width: 600upx;
        padding: 40upx 30upx 130upx;
        background: #fff;
        overflow-y: scroll;
    }
    .sidebar__item{
        padding: 30upx 0;
    }
    .category__list{
        padding: 30upx 0 0;
    }
    .category__item{
        width: 170upx;
        height: 65upx;
        margin: 15upx 0 0 15upx; 
        border-radius: 6upx;
        background: #f5f5f5;
    }
    .category__item:nth-child(3n+1){
        margin-left: 0;
    }
    .category__item.active{
        background: #1a1a1a;
    }
    .footer{
        position: absolute;
        bottom: 0;
        left: 150upx;
        width: 600upx;
        height: 130upx;
        padding: 0 30upx;
        background: #fff;
        box-shadow: 2upx 0 6upx 2upx #e6e6e6;
    }
    .footer button{
        width: 180upx;
        height: 70upx;
        line-height: 70upx;
    }
    .reset{
        border-radius: 35upx 0 0 35upx;
        background: #F93A42;
        font-size: 30upx;
        color: #fff;
    }
    .sure{
        border-radius: 0 35upx 35upx 0;
        background: #1a1a1a;
        font-size: 30upx;
        color: #fff;
    }
</style>
