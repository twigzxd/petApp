<template>
    <div class="evaluate">
        <div class="flex wrap nav">
            <div class="flex__center__center nav__item" :class="loads.index==index?'active':''" v-for="(item,index) in classify" :key="index" @click="setIndex(index)">
                <span class="fs_24" :class="loads.index==index?'c_6A6EFF':'c_66'">{{item.sub_classify}}({{item.num}})</span>
            </div>
        </div>
        <!-- 评价 -->
        <div class="evaluate-box">
            <div class="evaluate__item" v-for="(item,index) in list" :key="index">
                <div class="flex item__header">
                    <img :src="item.headimgurl" alt="">
                    <div class="flex__null__around ml_20">
                        <span class="fs_30 c_name">{{item.nickname}}</span>
                        <div> 
                            <span class="fs_26 c_98">{{item.create_time}}</span>
                            <span class="fs_26 c_98" v-if="item.product_sku_name">&emsp;规格:{{item.product_sku_name}}</span>
                        </div>
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
        </div>
    </div>
</template>
<script>
const app=getApp();
export default {
    name: 'Evaluate',
    data(){
        return{
            loads:{
                product_id:'',
                index:0
            },
            list:[],
            review:{},
            classify: [{
                id: 1,
                sub_classify: "全部",
                num: 0
            },
            {
                id: 2,
                sub_classify: "有图",
                num: 0
            }, {
                id: 3,
                sub_classify: "好评",
                num: 0
            }, {
                id: 4,
                sub_classify: "中评",
                num: 0
            }, {
                id: 5,
                sub_classify: "差评",
                num: 0
            }]
        }
    },
    methods:{
        loadList(page){
        	app.$vm.getList({
        		url:'home/getProductReviewList',
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
    onLoad(options){
        this.loads.product_id=options.id;
		app.$vm.getData({
			url:'home/getProductReviewData',
			that: this,
			data: {product_id:options.id},
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
    background:rgba(245,245,245,1);
    border-radius:25upx;
	color: #1A1A1A;
}
.nav__item:nth-child(4n+1){
    margin-left: 0;
}
.nav__item.active{
	background:rgba(243,244,255,1);
	border-radius:25upx;
	border:2upx solid rgba(152,155,249,1);
	color: #6A6EFF;
	
}
.c_6A6EFF{
	color: #6A6EFF;
}
/* 评价 */
.evaluate-box{
    background: #fff;
}
.evaluate__item{
    padding: 30upx;
    border-bottom: 2upx solid #e6e6e6;
}
.evaluate__item:last-child{
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
</style>
