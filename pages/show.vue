<template>
	<view class="show">
		<!-- back-home -->
		<jc-back-home url="/pages/webview" scroll-top="500">
			<!-- swiper -->
			<view class="swiper-box">
				<jc-swiper :list="swiper_list" @switch="swiperSwitch" @change="swiperChange"></jc-swiper>
			</view>
			<!-- area -->
			<jc-area :list="area_list" v-if="area_list.length" @cancel="cancelArea" @change="changeArea" @confirm="confirmArea"></jc-area>
			<!-- rate -->
			<view class="padding-tb-30">
				<jcRate @change="changeRate"></jcRate>
			</view>
			<!-- stepper -->
			<view class="bg-ff padding-tb-30">
				<jc-stepper></jc-stepper>
			</view>
			<!-- search -->
			<jcSearch :cancelButton="false" @input="inputInput" @blur="inputBlur" @focus="inputFocus" @confirm="inputConfirm"></jcSearch>
			<!-- image-upload -->
			<jc-image-upload @upload="imageUpload">
				<image class="head-upload" :src="img_url" mode=""></image>
			</jc-image-upload>
			<jc-images-upload :count="img_count" @upload="imagesUpload" @delete="imagesDelete"></jc-images-upload>
			<!-- tabs -->
			<jc-tabs :list="tabs_list" list-key="name" active="5" @switch="changeTabs"></jc-tabs>
			<!-- jc-swiper-group -->
			<jc-swiper-group v-if="category_list.length" :list="category_list" @switch="changeCategory"></jc-swiper-group>
			<!-- photos -->
			<jc-photos :list="tabs_list" img-key="img" video-key="video" :column="2"></jc-photos>
			<!-- rich-text -->
			<jc-rich-text :nodes="content"></jc-rich-text>
			<!-- tabs-vertical -->
			<jc-tabs-vertical v-if="vertical_list.length" :list="vertical_list" :top="375" @switch="changeVTabs"></jc-tabs-vertical>
			<!-- pop-up -->
			<!-- <jc-pop-up v-show="is_hidden" @hide="popUpHide"></jc-pop-up> -->
			<jc-list :status="load_status"></jc-list>
			<view class="height1000"></view>
		</jc-back-home>
	</view>
</template>

<script>
	import jcTabs from "@/components/hzjc/base/jc-tabs.vue"
	import jcBackHome from "@/components/hzjc/base/jc-back-home.vue"
	import jcPhotos from "@/components/hzjc/base/jc-photos .vue"
	import jcRichText from "@/components/hzjc/base/jc-rich-text.vue"
	import jcArea from "@/components/hzjc/base/jc-area.vue"
	import jcRate from "@/components/hzjc/base/jc-rate.vue"
	import jcSearch from "@/components/hzjc/base/jc-search.vue"
	import jcImageUpload from "@/components/hzjc/base/jc-image-upload.vue"
	import jcImagesUpload from "@/components/hzjc/base/jc-images-upload.vue"
	import jcSwiperGroup from "@/components/hzjc/base/jc-swiper-group.vue"
	import jcTabsVertical from "@/components/hzjc/base/jc-tabs-vertical.vue"
	import jcPopUp from "@/components/hzjc/base/jc-pop-up.vue"
	import jcSwiper from "@/components/hzjc/base/jc-swiper.vue"
	import jcStepper from "@/components/hzjc/base/jc-stepper.vue"
	import jcList from "@/components/hzjc/base/jc-list.vue"
	export default {
		name:'Show',
		components: {jcTabs,jcBackHome,jcPhotos,jcRichText,jcArea,jcRate,jcList,
		jcSearch,jcImageUpload,jcImagesUpload,jcSwiperGroup,jcTabsVertical,jcPopUp,jcSwiper,jcStepper},
		data() {
			return {
				tabs_list:[
					{id:1,name:'tab1',type:1,img:'/static/avatar.png'},
					{id:2,name:'tab1',type:2,img:'/static/logo.png',video_url:'https://vdept.bdstatic.com/556a4379434c65414157796949494831/4741475a4464346a/12b9d99ca049f990b692d1b7490592886e3846a7b2da86edeecad01ab110ad5d9e0ba0ffecfecd6d37b5cac5a4965e81732817a756c701186d5f067e9d574134.mp4?auth_key=1579085044-0-0-5fa4c4f4748ced8d691ac5dc392f7b50'},
					{id:3,name:'tab1',type:1,img:'/static/avatar.png'},
					{id:1,name:'tab1',type:1,img:'/static/logo.png'},
					{id:2,name:'tab1',type:1,img:'/static/smil.png'},
					{id:3,name:'tab1',type:1,img:'/static/microphone.png'},
					{id:1,name:'tab1',type:1,img:'/static/loading.png'},
					{id:2,name:'tab1',type:1,img:'/static/smil.png'},
					{id:3,name:'tab1',type:1,img:'/static/logo.png'}
				],
				content:'<p style="margin-top: 1.12em; margin-bottom: 1.12em; padding: 0px;"><img alt="undefined" src="https://img.alicdn.com/imgextra/i3/1828229631/TB2ZOBCopooBKNjSZPhXXc2CXXa_!!1828229631.jpg"/></p><p style="margin-top: 1.12em; margin-bottom: 1.12em; padding: 0px;"><img alt="undefined" src="https://img.alicdn.com/imgextra/i1/1828229631/TB21jd_oBnTBKNjSZPfXXbf1XXa_!!1828229631.jpg"/><br/><img alt="undefined" src="https://img.alicdn.com/imgextra/i1/1828229631/TB2_.HHoyMnBKNjSZFoXXbOSFXa_!!1828229631.jpg"/><br/><img alt="undefined" src="https://img.alicdn.com/imgextra/i2/1828229631/TB2cEMgoBsmBKNjSZFsXXaXSVXa_!!1828229631.jpg"/><br/><img alt="undefined" src="https://img.alicdn.com/imgextra/i2/1828229631/TB2hktuorwrBKNjSZPcXXXpapXa_!!1828229631.jpg" class=""/><br/><img alt="undefined" src="https://img.alicdn.com/imgextra/i4/1828229631/TB2YEMgoBsmBKNjSZFsXXaXSVXa_!!1828229631.jpg" class=""/><br/><img alt="undefined" src="https://img.alicdn.com/imgextra/i3/1828229631/TB26jl4oEOWBKNjSZKzXXXfWFXa_!!1828229631.jpg" class=""/></p><h3 class="spec-title" style="margin: 0px 0px 15px; padding: 0px; font-size: 16px; border-bottom: 1px solid rgb(238, 238, 238);">价格说明</h3><p class="title" style="margin-top: 0px; margin-bottom: 0px; padding: 0px; color: rgb(254, 112, 47);">划线价格</p><p class="info" style="margin-top: 0px; margin-bottom: 15px; padding: 0px; color: rgb(102, 102, 102);">指商品的专柜价、吊牌价、正品零售价、厂商指导价或该商品的曾经展示过的销售价等，<span style="color: rgb(51, 51, 51); font-weight: 600;">并非原价</span>，仅供参考。</p><p class="title" style="margin-top: 0px; margin-bottom: 0px; padding: 0px; color: rgb(254, 112, 47);">未划线价格</p><p class="info" style="margin-top: 0px; margin-bottom: 15px; padding: 0px; color: rgb(102, 102, 102);">指商品的<span style="color: rgb(51, 51, 51); font-weight: 600;">实时标价</span>，不因表述的差异改变性质。具体成交价格根据商品参加活动，或会员使用优惠券、积分等发生变化，最终以订单结算页价格为准。</p><p class="info" style="margin-top: 0px; margin-bottom: 15px; padding: 0px; color: rgb(102, 102, 102);">商家详情页（含主图）以图片或文字形式标注的一口价、促销价、优惠价等价格可能是在使用优惠券、满减或特定优惠活动和时段等情形下的价格，具体请以结算页面的标价、优惠条件或活动规则为准。</p><p class="info" style="margin-top: 0px; margin-bottom: 15px; padding: 0px; color: rgb(102, 102, 102);">此说明仅当出现价格比较时有效，具体请参见《淘宝价格发布规范》。若商家单独对划线价格进行说明的，以商家的表述为准。</p><h5 style="margin: 0px 0px 0px 10px; padding: 0px; font-size: 15px;">看了该宝贝的人还看了</h5><p><br/></p>',
				area_list:[],
				category_list:[],
				vertical_list:[],
				swiper_list:[
					{id:1,name:'tab1',type:1,img_url:'/static/logo.png'},
					{id:2,name:'tab1',type:2,img_url:'/static/logo.png',video_url:'https://vdept.bdstatic.com/556a4379434c65414157796949494831/4741475a4464346a/12b9d99ca049f990b692d1b7490592886e3846a7b2da86edeecad01ab110ad5d9e0ba0ffecfecd6d37b5cac5a4965e81732817a756c701186d5f067e9d574134.mp4?auth_key=1579085044-0-0-5fa4c4f4748ced8d691ac5dc392f7b50'},
					{id:3,name:'tab1',type:1,img_url:'/static/logo.png'},
					{id:1,name:'tab1',type:1,img_url:'/static/logo.png'}
				],
				img_url:'/static/loading.png',
				img_count:9,
				is_hidden:false,
				load_status:''
			}
		},
		onLoad() {
			// 获取所有省市区
			this.request.getData('Address/getRegionAll').then(res=>{
				this.area_list=res.data.region_data;
			})
			// 获取分类列表
			this.request.getData('Mall/getIndexData').then(res=>{
				this.category_list=res.data.category;
				// this.swiper_list=res.data.carousel;
			})
			
			this.request.getData('Mall/getCategoryData').then(res=>{
				this.vertical_list=res.data.category;
			})
			this.request.getList({
				url:'Mall/getIndexList',
				data:{},
				that:this,
				page:1
			})
		},
		methods: {
			// jc-tabs
			changeTabs(value){
				this.request.toast('jcTabs回调(当前索引):'+value);
			},
			// 
			changeVTabs(value){
				this.request.toast('jcTabsVertical回调(当前索引):'+value);
			},
			// jc-swiper
			swiperSwitch(value){
				this.request.toast('jcSwiper回调(当前索引):'+value);
			},
			swiperChange(e){
				console.log(e);
			},
			// jc-swiper-grounp
			changeCategory(value){
				this.request.toast('jcSwiperGroup回调(当前索引):'+value);
			},
			// jc-area
			cancelArea(){
				this.request.toast('jcArea回调cancel');
			},
			changeArea(obj){
				this.request.toast('jcArea回调change');
			},
			confirmArea(obj){
				this.request.toast('jcArea回调confirm');
			},
			// jc-rate
			changeRate(value){
				this.request.toast('jcRate回调change');
			},
			// jc-search
			inputInput(value){
				this.request.toast('jcSearch回调input');
			},
			inputBlur(value){
				this.request.toast('jcSearch回调blur');
			},
			inputFocus(value){
				this.request.toast('jcSearch回调focus');
			},
			inputConfirm(value){
				this.request.toast('jcSearch回调confirm');
			},
			cancel(value){
				this.request.toast('jcSearch回调cancel');
			},
			// jc-image-upload
			imageUpload(value){
				this.request.toast('jcArea回调cancel');
				this.img_url=value[0];
			},
			imagesUpload(value){
				this.img_count--;
				for(let i=0;i<res.length;i++){
					this.img_list.push(value[0]);
				}
			},
			imagesDelete(index){
				this.img_list.splice(index,1);
			},
			// pop-up
			popUpHide(){
				this.is_hidden=false;
				this.request.toast('弹出框关闭');
			},
			// jc-stepper
			stepChange(value){
				this.request.toast('jcStepper回调(当前索引):'+value);
			}
		}
	}
</script>

<style scoped>
	.height1000{
		height: 3000upx;
	}
	.head-upload{
		width: 60upx;
		height: 60upx;
		border-radius: 50%;
	}
	.swiper-box{
		width: 750upx;
		height: 750upx;
		border-radius: 20upx;
		overflow: hidden;
	}
</style>
