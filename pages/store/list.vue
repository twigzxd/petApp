<template>
    <div class="list">
        <div class="flex__around search-box">
            <div class="flex align-center search__item">
                <span class="fs_28 c_b3 jcicon jcicon-sousuo1">&nbsp;</span>
                <input class="fs_28" type="text" placeholder="请输入关键字搜索" v-model="loads.keywords" @confirm="loadList(1)">
            </div>
        </div>
		
        <!-- <div class="flex__between__center nav">
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
                <span class="fs_40 c_80 jcicon" :class="style?'jcicon-leimupinleifenleileibie':'jcicon-copy'" @click="style=!style"></span>
            </div>
        </div> -->
		<!-- 下拉分类 -->
		<view class="flex__between lh_40 c_33 bg_ff select_cate fs_28 p_lr_30 pb_20 pt_40">
			<picker @change="setSort" :value="sort_list" :range="sort_list" range-key="name">
				<view class="lh_40">
					<span class="fs_30" :class="loads.style==0?'c_4d':'c_33'">{{loads.style==0?'默认':sort_list[sort_index].name}}</span>
					<span class="fs_30 jcicon jcicon-xiala2" :class="loads.category_id!=4?'c_33':'c_4d'"></span>
				</view>
			</picker>
			<picker @change="setSort2" :value="sort_list2" :range="sort_list2" range-key="name">
				<view class="lh_40">
					<span class="fs_30" :class="loads.score==0?'c_4d':'c_33'">{{loads.score==0?'星级':sort_list2[sort_index2].name}}</span>
					<span class="fs_30 jcicon jcicon-xiala2" :class="loads.score!=6?'c_33':'c_4d'"></span>
				</view>
			</picker>
			<view @click="changeStyle()">离我最近</view>
		</view>

        <!-- 一行一个 -->
		<view class="page_no_data" v-if="list.length==0"></view>
        <div class="row-box shadow" v-if="list.length!=0">
			<navigator :url="'./detail?id='+item.id" v-for="(item,index) in list" :key="index">
				<div class="flex row__item">
					<img :src="item.cover_img" alt="">
					<div class="flex__null__around row__info flex_1">
						<span class="fs_30 c_1a lh_40 ellipsis_two">{{item.name}}</span>
						<view class="flex__between c_66" style="font-size: 24upx;">
							<view class="flex__between fs_24">
							<text class="mr_5">评分</text>
							<text v-for="(item2,index2) in 5" :key="index2" class="iconfont icon-iospaw fs_34 ml_10" :class="item2<item.score?'c_pur':'c_ed'"></text></view>
							<view class="fs_24">距我{{item.distance||0}}km</view>
						</view>
					</div>
				</div>
			</navigator>
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
                page:1
            },
            category:[
                {
                    lower_category:[{}]
                }
            ],
			sort_index: 0,
			sort_list:[
			{id:2,name:'推荐'},
			{id:3,name:'上架时间'}],
			sort_index2: 0,
			sort_list2:[{ id:1,name:'一星'},
			{id:2,name:'二星'},
			{id:3,name:'三星'},{id:4,name:'四星'},{id:5,name:'五星'}],
			// loads:{category_id:'',score:1,lat:'39.623561',lng:'112.562356',keywords:'',style:0},
			loads:{category_id:'',score:'',lat:'',lng:'',keywords:'',style:''},
        }
    },
    methods:{
		// 排序方式()
		setSort(e){
			let index=e.detail.value;
		    this.sort_index=index;
		    this.loads.style=this.sort_list[index].id;
			this.loadList(1);
		},
		// 星级
		setSort2(e){
			let index=e.detail.value;
		    this.sort_index2=index;
		    this.loads.score=this.sort_list2[index].id;
			this.loadList(1);
		},
		// 离我最近
		changeStyle(){
			this.loads.style=1;
			this.loadList(1);
		},
        // 加载商品
        loadList(page){
        	app.$vm.getList({
        		url:'Collage/getIndexList',
        		that: this,
        		data: this.loads,
        		loading: 1,
        		page
        	});
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
		if(options.first_category_id){
			this.loads.category_id = options.first_category_id
		}
		this.loads.lat = uni.getStorageSync('lat');
		this.loads.lng = uni.getStorageSync('lng');
		this.loadList(1);
		console.log(options);
        if(app.globalData.keyword){
            this.loads.keyword=app.globalData.keyword;
        }
    },
    onHide(){
        app.globalData.keyword='';
    }
}
</script>
<style scoped>
	.search__item{
		border-radius:30upx;
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
        width: 240upx;
        height: 180upx;
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
	.shadow{
		padding-top:30upx;
		box-shadow:inset 0px 15px 30px -15px rgba(0,0,0,0.1);
	}
	.page_no_data{
		width:100%;
		height: 90upx;
		line-height: 90upx;
		text-align: center;
		color: #b3b3b3;
		font-size: 26upx;
		margin-top:10upx;
	}
	.page_no_data:after{
		content:'暂无数据~'
	}
</style>
