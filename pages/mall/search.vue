<template>
    <div class="search">
        <div class="flex__around search-box" style='align-items: center;'>
            <div class="flex align-center search__item" style='border-radius: 30upx;flex:1; margin-right: 5upx;'>
                <span class="fs_28 c_b3 jcicon jcicon-sousuo1">&nbsp;</span>
                <form action="javascript:return true;">
                    <input class="fs_28 c_b3 input" focus="true" v-model="keyword" placeholder="请输入关键字搜索" @confirm="setKeyword(keyword)" @input="clearInput">
                </form>
				<view class="uni-icon uni-icon-clear" v-if="showClearIcon" @click="clearIcon" style="color: #999;font-size: 40rpx;"></view>
            </div>
			<div class='cancel'>取消</div>
        </div>
        <div class="box" v-if="renders.search_history.length">
            <div class="flex__between">
                <span class="fs_28 c_80">历史搜索</span>
                <span class="jcicon jcicon-shanchu1 fs_32 c_80" @click="del"></span>
            </div>
            <div class="flex wrap content bb_1">
                <div class="item ellipsis_one" v-for="(item,index) in renders.search_history" :key="index" @click="setKeyword(item.content)">
                    <span class="fs_24 ">{{item.content}}</span>
                </div>
            </div>
        </div>
        <div class="box">
            <div class="flex__between">
                <span class="fs_28 c_80">热门搜索</span>
             <!--   <span class="iconfont icon-shanchu fs_32 c_80"></span> -->
            </div>
            <div class="flex wrap content">
                <div class="items ellipsis_one" v-for="(item,index) in renders.search_hot" :key="index" @click="setKeyword(item.content)">
                    <span class="fs_24 ">{{item.content}}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
const app=getApp();
export default {
    name:'Search',
    
    data(){
        return {
            renders:{
                search_hot:[],
                search_history:[]
            },
            keyword:'',
			showClearIcon: false,
        }
    },
    methods:{
        //搜索框出现插好
        clearInput: function(event) {
        	this.keyword = event.target.value;
        	if (event.target.value.length > 0) {
        		this.showClearIcon = true;
        	} else {
        		this.showClearIcon = false;
        	}
        },
        clearIcon: function() {
        	this.keyword = '';
        	this.showClearIcon = false;
        },
        setKeyword (data) { 
			app.globalData.keyword=data;
			app.$vm.getData({
				url:'Home/addSearchHistory',
				that: this,
				data: {		
					content:data,
					source:2
				},
				loading: 1
			}).then(res=>{
				if(res.code==1){
					
				}else{
					// uni.showToast({
					// 	title: res.message,
					// 	icon: 'none'
					// })
				}
			})
			uni.navigateTo({
				url: './list?first_category_id=0&second_category_id=0'
			})
        },
        // 删除历史记录
        del(){
			app.$vm.getData({
				url:'home/deleteHistory',
				that: this,
				data: {type: 1},
				loading: 1
			}).then(res=>{
				if(res.code==1){
					this.renders.search_history=[];
				}else{
					uni.showToast({
						title: res.message,
						icon: 'none'
					})
				}
			})
        }
    },
    onShow(){
		app.$vm.getData({
			url:'home/getSearchData',
			that: this,
			data: {},
			loading: 1
		}).then(res=>{
			this.renders=res.data;
		})
    }
}
</script>

<style scoped lang="less">
.box{
     padding: 30upx 30upx 0;
     background: #fff;
}
.content{
    padding-bottom: 30upx;
}
.input{
	padding: 5upx 0;
}
.item{
    margin: 20upx 20upx 0 0upx;
    // line-height: 60upx;
    padding: 8upx 20upx;
    background: #f5f5f5;
    border-radius: 30upx;
	background:rgba(243,244,255,1);
	border:1upx solid rgba(152,155,249,1);
	color: #767AFF;
}
.items{
    margin: 20upx 20upx 0 0upx;
    // line-height: 60upx;
    padding: 8upx 20upx;
    background: #f5f5f5;
    border-radius: 30upx;
	background:rgba(255,241,250,1);
	border:1px solid rgba(248,137,206,1);
	color: #FF8DD4;
}
.item_1{
	&>span{
		// margin: 0 20upx;
		// display: block;
		// height: 60upx;
		// // width: 100%;
		// padding: 0 0;
	}
}
.cancel{
	height:42upx;
	font-size:30upx;
	font-family:PingFangSC-Regular,PingFang SC;
	font-weight:400;
	color:rgba(77,77,77,1);
	line-height:42upx;
}
</style>


