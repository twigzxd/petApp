<template>
    <div class="my-evaluate">
        <!-- <div class="flex wrap nav">
            <div class="flex__center__center nav__item" :class="loads.index==index?'active':''" v-for="(item,index) in classify" :key="index" @click="setIndex(index)">
                <span class="fs_24" :class="loads.index==index?'c_main':'c_66'">{{item.sub_classify}}({{item.num}})</span>
            </div>
        </div> -->
		<div class='head'>
			<div class='oneitem ' :class="type==0?'active':''"  @click='swich(0)'>
				商城评价
			</div>
			<div class='oneitem' :class="type==1?'active':''" @click='swich(1)'>
				门店评价
			</div>
		</div>
        <!-- 评价 -->
        <div class="evaluate-box" v-if="type==0">
			<navigator :url="'/pages/mall/detail?id='+item.product_id" hover-class="none" v-for="(item,index) in list" :key="index">
				<div class="evaluate__item">
					<div class="flex item__header">
						<img :src="item.headimgurl" alt="">
						<div class="flex__null__around ml_20">
							<span class="fs_30 c_name">{{item.nickname}}</span>
							<span class="fs_26 c_98">{{item.create_time}}&emsp;规格:{{item.product_sku_name}}2</span>
						</div>
					</div>
					<p class="fs_30 c_1a mt_20 lh_40" v-if="item.content">{{item.content}}</p>
					<div class="flex wrap item__img" v-if="item.img_path.length">
						<img :src="item1" alt="" v-for="(item1,index1) in item.img_path" :key="index1" @click="previewImage(index,index1)">
					</div>
					<div class="item__reply" v-if="item.is_replay==2">
						<span class="fs_26 c_80 lh_36">掌柜回复：{{item.replay}}</span>
					</div>
				</div>
			</navigator>
        </div>
		<!--   门店评价-->
		<div v-else class='shopbox'>
			<div class='shop_item' v-for="(item,index) in list" :key="index">
				<div class='header'>
					<image :src='item.headimgurl' alt="">
					<div class='item_right'>
						<div class='nickname'>{{item.nickname}}</div>
						<div class='item_bottom'>
							<div class='givestart'>
								<div class='score'>评分</div>
								<div class='starbox'>
									<div class="iconfont icon-iospaw" v-for='(item,indexs) in stars' :key='indexs'  :class="indexs<=item.star-1?'choose':''"></div>
								</div>
							</div>
							<div class='date'>{{item.create_time}}</div>
						</div>
					</div>
				</div>
				<div class='content'>{{item.content}}</div>
				<div class='photosbox'>
					<image class="photo"   v-for="(item,index) in item.img_path" :key='index' :src="item" mode=""></image>
					<div style='clear:both'></div>
				</div>
				<div class='goodbox'>
					<image :src="item.product_cover_img"></image>
					<view >
						<view class="ellipsis_one name">{{item.product_name}}</view>
						<div class='givestart'>
							<div class='score'>评分</div>
							<div class='starbox'>
								<div class="iconfont icon-iospaw" v-for='(item,indexs) in stars' :key='indexs'  :class="indexs<=item.score-1?'choose':''"></div>
							</div>
						</div>
					</view>
				</div>
			</div>
		</div>
    </div>
</template>
<script>
const app=getApp();
export default {
    name: 'MyEvaluate',
    data(){
        return{
            loads:{
                index:0,
				type:1
            },
            list:[],
            review:{},
            classify: [{
                sub_classify: "全部",
                num: 0
            },
            {
                sub_classify: "有图",
                num: 0
            }, {
                sub_classify: "好评",
                num: 0
            }, {
                sub_classify: "中评",
                num: 0
            }, {
                sub_classify: "差评",
                num: 0
            }],
			type:0,
			stars:['','','','',''],
			star:3,
			photos:['../../static/images/logo.png','../../static/images/logo.png','../../static/images/logo.png','../../static/images/logo.png','../../static/images/logo.png','../../static/images/logo.png']
        }
    },
    methods:{
		swich(type){
			if(type==0){
				this.type=0
				this.loads.type=1;
				this.loadList(1);
			}else{
				this.type=1
				this.loads.type=2;
				this.loadList(1);
			}
		},
		loadList(page){
			app.$vm.getList({
				url:'Home/getMyReviewList',
				that: this,
				data: this.loads,
				loading: 1,
				page
			});
		},
		// nav切换
		setIndex(index){
			this.loads.index=index;
			this.loadList(1);
		},
        // 查看大图
        previewImage(index,index1){
			uni.previewImage({
				current: index1,
				urls: this.list[index].img_path,
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
	onReachBottom(){
		this.loadList(2);
	},
    onLoad(){
		app.$vm.getData({
			url:'home/getMyReviewData',
			that: this,
			data: {},
			loading: 1
		}).then(res=>{
			if(res.code==1){
				this.classify[0].num = res.data.review.all_count;
				this.classify[1].num = res.data.review.has_img_count;
				this.classify[2].num = res.data.review.goods_review_count;
				this.classify[3].num = res.data.review.middle_review_count;
				this.classify[4].num = res.data.review.bad_review_count;
			}
		})
		this.loadList(1);
    }
}
</script>

<style scoped>
	.head{
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: #FFFFFF;
	}
	.oneitem{
		padding: 23upx 0;
		border-bottom: 2upx solid rgba(245,245,245,1);
		text-align: center;
		flex: 1;
		color: #666666;
	}
	.oneitem.active{
		color: #1A1A1A;
		border-bottom: 2upx solid #989BF9;
	}
/* 选项卡 */
.nav{
    padding: 20upx 30upx 30upx;
    background: #fff;
    border-bottom: 2upx solid #e6e6e6;
}
.nav__item{
    width: 165upx;
    height: 50upx;
    margin: 10upx 0 0 10upx;
    border-radius: 4upx;
    background: #f5f5f5;
}
.nav__item:nth-child(4n+1){
    margin-left: 0;
}
.nav__item.active{
    background: #FFEEED;
    border: 2upx solid #F93A42;
}
/* 评价 */
.evaluate-box{
    background: #fff;
}
.evaluate__item{
    padding: 30upx;
    border-bottom: 2upx solid #e6e6e6;
}
.evaluate-box navigator:last-child .evaluate__item{
    border: 0;
}
.item__header img{
    width: 80upx;
    height: 80upx;
    border-radius: 50%;
}
.item__img{
    margin-top: 20upx;
    padding-bottom: 30upx;
}
.item__img img{
    width: 165upx;
    height: 165upx;
    margin: 10upx 0 0 10upx;
}
.item__img img:nth-child(4n+1){
    margin-left: 0;
}
.item__reply{
    padding: 10upx 20upx;
    background: #f5f5f5;
    border-radius: 10upx;
}
.shopbox{
	background: #FFFFFF;
	padding: 30upx;
}
.shop_item{
	margin-bottom: 15upx;
}
.shop_item .header{
	display: flex;
	justify-content: space-between;
	margin-bottom: 30upx;
}
.shop_item .header image{
	display: block;
	border-radius: 50%;
	width: 80upx;
	height: 80upx;
	margin-right: 20upx;
}
.item_right{
	flex: 1;
}
.nickname{
	height:34upx;
	font-size:24upx;
	font-family:Avenir-Heavy,Avenir;
	font-weight:800;
	color:rgba(51,51,51,1);
	line-height:33upx;
	margin-bottom: 7upx;
}
.item_bottom{
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.givestart{
	display: flex;
	align-items: center;
}
.score{
	height:33upx;
	font-size:24upx;
	font-family:PingFangSC-Regular,PingFang SC;
	font-weight:400;
	color:rgba(26,26,26,1);
	line-height:33upx;
	margin-right: 11upx;
}
.date{
	height:33upx;
	font-size:24upx;
	font-family:Avenir-Roman,Avenir;
	font-weight:normal;
	color:rgba(152,152,152,1);
	line-height:33upx;
}
.starbox{
	display: flex;
	align-items: center;
	font-size: 28upx;
	color: #EDEDED;
}
.starbox .choose{
	color: #F889CE;
}
.content{
	font-size:28upx;
	font-family:PingFangSC-Regular,PingFang SC;
	font-weight:400;
	color:rgba(77,77,77,1);
	line-height:40upx;
	margin-bottom: 30upx;
}
.photo{
	float: left;
	margin-right: 16upx;
	width:160upx;
	height: 160upx;
	margin-bottom: 15upx;
}
.photo:nth-child(4n){
	margin-right: 0;
}
.goodbox{
	background: #FAFAFA;
	padding: 23upx 30upx;
	display: flex;
	
}
.goodbox image{
	width: 150upx;
	height: 113upx;
	margin-right: 30upx;
}
.name{
	height:37upx;
	font-size:26upx;
	font-family:PingFangSC-Regular,PingFang SC;
	font-weight:400;
	color:rgba(26,26,26,1);
	line-height:37upx;
	margin-bottom: 30upx;
}
</style>
