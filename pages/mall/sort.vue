<template>
    <view class="category">
		<navigator url="/pages/mall/search" hover-class="none">
			<view class="flex__around search-box bb_1" >
				<view class="flex align-center search__item" style="border-radius: 30upx;">
					<text class="fs_28 c_b3 jcicon jcicon-sousuo1"></text>
					<text class="fs_28 c_b3">&nbsp;请输入关键字搜索</text>
				</view>
			</view>
		</navigator>
        <view class="content">
            <view class="sidebar">
                <view class="flex__around__center sidebar__item" v-for="(item,index) in category" :key="index" @click="setCategory(index)">
                    <view class="sidebar__item-tips" :class="first_category_id==item.first_category_id?'active':''"></view>
                    <text class="fs_28  " :class="first_category_id==item.first_category_id?'c_1a':'c_66'" >{{item.name}}</text>
                </view>
            </view>
            <view class="category-son">
                <image class="mt_20" v-if="category[category_index].advert_img" :src="category[category_index].advert_img" alt=""></image>
                <view class="flex wrap">
                    <view class="flex__center__between category__item" v-for="(item,index) in category[category_index].lower_category" :key="index" @click="sureCategory(index)">
                        <image class="mt_40" :src="item.cover_img" alt=""></image>
                        <text class="fs_24 c_4d lh_40 mt_10">{{item.name}}</text>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
const app=getApp();
export default {
    name: 'Category',
    data(){
        return{
            first_category_id: '',
            category_index: 0,
            category:[
                {
                    advert_img:'',
                    lower_category:[{}]
                }
            ]
        }
    },
    methods:{ 
        // 切换一级类别
        setCategory(index){
            this.first_category_id=this.category[index].first_category_id;
            this.category_index=index;
        },
        // 选中分类
        sureCategory(index){
            let lower_category=this.category[this.category_index].lower_category;
            let arr=[];
            let two_id='';
			console.log(lower_category[index].second_category_id,index)
			
            if(index){
				uni.navigateTo({
					url: './list?first_category_id=0&second_category_id='+lower_category[index].second_category_id
				})
            }else{
                for(let i=0;i<lower_category.length;i++){
                   arr.push(lower_category[i].second_category_id);
                }
                two_id=arr.join(',');
				uni.navigateTo({
					url: './list?first_category_id='+lower_category[0].first_category_id+'&second_category_id=0'
				})
            }
        }
    },
    onLoad(options){
		app.$vm.getData({
			url:'home/getCategoryData',
			that: this,
			data: {},
			loading: 1
		}).then(res=>{
			// 判断进入分类时是否有默认
			if(!options.id){
				this.first_category_id=res.data.category[0].first_category_id;
			}else{
				this.first_category_id=options.id;
			}
			this.category=res.data.category;
			for(let i=0;i<this.category.length;i++){
				if(this.first_category_id==this.category[i].first_category_id){
					this.category_index=i;
				}
			}
        })
    }
}
</script>
<style scoped>
	.c_66{
		color: #666666;
	}
    .content{
        position: fixed;
        top: 90upx;
        bottom: 0;
        width: 100%;
        background: #fff;
    }
    .sidebar{
        position: absolute;
        top: 0;
        bottom: 0;
        width: 170upx;
        border-right: 2upx solid #e6e6e6;
        overflow: auto;
    }
    .sidebar__item{
        height: 100upx;
    }
    .sidebar__item-tips{
        position: absolute;
        left: 0;
        width: 100%;
        height: 40upx;
    }
    .active{
        border-left: 6upx solid #989BF9;
    }
    .category-son{
        position: absolute;
        left: 170upx;
        top: 0;
        bottom: 0;
        padding: 10upx 30upx;
        overflow-y: scroll;
    }
    .category-son image{
        width: 520upx;
        height: 220upx;
        border-radius: 10upx;
    }
    .category__item image{
        width: 120upx;
        height: 120upx;
        border-radius: 50%;
    }
    .category__item{  
        margin-left: 80upx;
    }
    .category__item:nth-child(3n+1){
        margin-left: 0;
    }
</style>


