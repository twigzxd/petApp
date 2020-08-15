<template>
    <view class="edit">
        <view class="flex align-center title">
            <text class="fs_28 c_98">联系人</text>
        </view>
        <view class="flex__between__center item bb_1">
            <text class="fs_28 c_1a">姓名</text>
            <input class="fs_28" v-model="creates.linkman" type="text" placeholder="请填写收货人姓名">
        </view>
        <view class="flex__between__center item">
            <text class="fs_28 c_1a">手机</text>
            <input class="fs_28" v-model="creates.mobile_phone" type="text" placeholder="请填写收货手机号码">
        </view>
        <view class="flex align-center title">
            <text class="fs_28 c_98">收货地址</text>
        </view>
		<view class="flex__between__center item bb_1">
		    <text class="fs_28 c_1a">国家</text>
		    <input class="fs_28" v-model="creates.country" type="text" placeholder="请填写国家">
		</view>
		<view class="flex__between__center item bb_1">
		    <text class="fs_28 c_1a">省</text>
		    <input class="fs_28" v-model="creates.province" type="text" placeholder="请填写省">
		</view>
		<view class="flex__between__center item bb_1">
		    <text class="fs_28 c_1a">市</text>
		    <input class="fs_28" v-model="creates.city" type="text" placeholder="请填写市">
		</view>
        <!-- <view class="flex__between__center item bb_1" @click="picker_show=true">
            <text class="fs_28 c_1a">所在地区</text>
            <view>
                <text class="fs_28 c_1a">&ensp;{{address}}</text>
                <text class="jcicon jcicon-xiala1 fs_20 c_b3"></text>
            </view>
        </view> -->
        <view class="flex__between__center item" >
            <input class="fs_28" v-model="creates.address" type="text"  placeholder="请填写详细地址">
            <text class="fs_26 jcicon jcicon-dingwei c_98b"  @click="location"></text>
        </view>
		<view class="flex__between__center item bb_1 mt_15">
		    <text class="fs_28 c_1a">邮编</text>
		    <input class="fs_28" v-model="creates.post_code" type="text" placeholder="请填写邮编">
		</view>
		<view class="flex__between__center item ">
		    <text class="fs_28 c_1a">邮箱</text>
		    <input class="fs_28" v-model="creates.email" type="text" placeholder="请填写邮箱">
		</view>
        <view class="flex__between__center item mt_15">
            <text class="fs_28 c_1a">设为默认</text>
            <text class="jcicon jcicon-unselected fs_34 c_98" v-if="creates.is_default==1" @click="creates.is_default=2"></text>
            <text class="jcicon jcicon-dui fs_34 c_98b" v-else @click="creates.is_default=1"></text>
        </view>
        <view class="footer">
            <button @click="createAddress">保存</button>
        </view>
		<view class="picker-box" v-show="picker_show">
            <div class="layer" @click="picker_show=false"></div>
			<view class="flex__between__center picker-nav">
				<text class="fs_30 c_98" @click="picker_show=false">取消</text>
				<text class="fs_30" style="color:#8BDF4F;" @click="citySure">确定</text>
			</view>
			<picker-view @change="cityChange" :value="picker_value">
				<picker-view-column>
					<view v-for="(item,index) in provinces" class="flex__center__center" :key="index">
						{{item.name}}
					</view>
				</picker-view-column>
				<picker-view-column>
					<view v-for="(item,index) in citys" class="flex__center__center" :key="index">
						{{item.name}}
					</view>
				</picker-view-column>
				<picker-view-column>
					<view v-for="(item,index) in areas" class="flex__center__center" :key="index">
						{{item.name}}
					</view>
				</picker-view-column>
			</picker-view>
		</view>
    </view>
</template>
<script>
const app=getApp();
export default {
    name: "Edit",
    data(){
        return{
            picker_show: false,
            bMap: false,
            provinces: [],
            citys: [],
            areas: [],
			provinces_vic: [],
			citys_vic: [],
			areas_vic: [],
			provinces_id: '',
			city_id: '',
			area_id: '',
			provinces_name: '',
			city_name: '',
			area_name: '',
            address: '',
            creates:{
                id: '',
                is_default: 1,
                linkman: '',
                mobile_phone: '',
                address: '',
				country:'',
				province:'',
				city:'',
				post_code:'',
				email:'',
            }
        }
    },
    methods:{
         // 处理省市县联动逻辑
   //      cityChange(e) {
			// let values=e.detail.value;
   //          let provinces = this.provinces_vic;
   //          let citys = this.citys_vic;
   //          let areas = this.areas_vic;
			// let prov_id = provinces[values[0]].id;
   //          如果省份选择项和之前不一样，表示滑动了省份，此时市默认是省的第一组数据，
   //          if (prov_id != this.province_id) {
			// 	this.province_id=prov_id;
			// 	this.province_name=provinces[values[0]].name;
   //              if (citys[prov_id].length){
   //                  this.provinces=provinces;
   //                  this.citys=citys[prov_id];
			// 		this.city_id=this.citys[values[1]].id;
			// 		this.city_name=this.citys[values[1]].name;
   //                  this.areas=areas[this.city_id];
			// 		this.area_id=this.areas[values[2]].id;
			// 		this.area_name=this.areas[values[2]].name;
   //              }else{
   //                  this.citys=citys[prov_id];
			// 		this.city_id=this.citys[values[1]].id;
			// 		this.city_name=this.citys[values[1]].name;
   //                  this.areas=[];
			// 		this.area_id='';
			// 		this.area_name='';
   //              }
   //          } else if (citys[prov_id][values[1]].id != this.city_id) {
   //              滑动选择了第二项数据，即市，此时区显示省市对应的第一组数据
			// 	this.city_id=this.citys[values[1]].id;
			// 	this.city_name=this.citys[values[1]].name;
   //              this.areas=areas[this.city_id];
			// 	this.area_id=this.areas[values[2]].id;
			// 	this.area_name=this.areas[values[2]].name;
   //          }else{
			// 	this.area_id=this.areas[values[2]].id;
			// 	this.area_name=this.areas[values[2]].name;
			// }
   //      },
        // 确定
        // citySure(){
        //     this.picker_show=false;
        //     this.creates.province_id=this.province_id;
        //     this.creates.city_id=this.city_id;
        //     this.creates.area_id=this.area_id;
        //     this.address=this.province_name+this.city_name+this.area_name;
        // },
		// 经纬度
		location() {
			let that = this;
					uni.getLocation({
						type: 'wgs84', 
						success(res) {
							const latitude = res.latitude
							const longitude = res.longitude
							that.creates.lat=res.latitude
							that.creates.lng=res.longitude 
							uni.chooseLocation({
								latitude,
								longitude,
								success(res) {
									that.creates.address=res.address;
									that.creates.lat=res.latitude
									that.creates.lng=res.longitude 
								}
							})
						}
					})
	
		 },
        // create
        createAddress(){
            for(let key in this.creates){
                if(!this.creates[key]&&key!='id'){
					uni.showToast({
						title: '请将信息填写完整',
						icon: 'none'
					});
                    return;
                }
            }
			app.$vm.getData({
				url:'Address/addressEdit',
				that: this,
				data: this.creates,
				loading: 1,
			}).then(res=>{
				if(res.code==1){
					uni.showModal({
						content: res.message,
						showCancel: false,
						success: function (res) {
							uni.navigateBack()
						}
					});
                }else{
					uni.showToast({
						title: res.message,
						icon: 'none'
					});
				}
            })
        },
        // 获取地址
        getAddress(param_id){
			app.$vm.getData({
				url:'Address/getAddressData',
				that: this,
				data: {id: param_id},
				loading: 1,
			}).then(res=>{
				// 编辑渲染
				console.log(res.data)
				this.address=res.data.province+res.data.city+res.data.area;
				this.creates.country=res.data.country
				this.creates.address=res.data.address;
				this.creates.linkman=res.data.linkman;
				this.creates.province=res.data.province
				this.creates.city=res.data.city
				this.creates.post_code=res.data.post_code
				this.creates.email=res.data.email
				this.creates.mobile_phone=res.data.mobile_phone;
				this.creates.id=res.data.id;
				this.creates.province_id=res.data.province_id;
				this.creates.city_id=res.data.city_id;
				this.creates.area_id=res.data.area_id;
				this.creates.is_default=res.data.is_default;
            })
        }
    },
    onLoad(options){
		// 编辑获取信息
		if(options.id!=0){
			this.getAddress(options.id);
		}
		app.$vm.getData({
			url:'Address/getRegionAll',
			that: this,
			data: {},
			loading: 1,
		}).then(res=>{
			if(res.code==1){
				let addressArray=res.data.region_data;
				let cityy = []; //返回的数组 市
				let areass = []; //返回的数组 区
				let subprovince = {}
				for (let i = 0; i < addressArray.length; i++) {
					subprovince = {
						id: i + 1,
						name: addressArray[i].name
					}
					this.provinces_vic.push(subprovince); //属性
				}
				for (let i = 0; i < addressArray.length; i++) {
					cityy.push(addressArray[i].city); //属性
				}
				for (let i = 0; i < cityy.length; i++) {
					for (let ii = 0; ii < cityy[i].length; ii++) {
						areass.push(cityy[i][ii].area); //属性
					}
				}
				// 不知道你们怎么想的，我是硬配合
				this.citys_vic[0]={id:'',name:''};
				for (let i = 0; i < cityy.length; i++) {
					this.citys_vic[i + 1] = cityy[i]
				}
				let areas = {}
				this.areas_vic[0]={id:'',name:''};
				for (let i = 0; i < areass.length; i++) {
					this.areas_vic[i + 1] = areass[i]
				}
				// picker-view
				let id = this.provinces_vic[0].id;
				this.provinces=this.provinces_vic;
				this.citys=this.citys_vic[id];
				this.areas=this.areas_vic[this.citys_vic[id][0].id];
			}
		})
    }
}
</script>
<style scoped>
.c_98b{
	color: #989BF9;
}
.title{
    height: 90upx;
    padding: 0 30upx;
}
.item{
    height: 100upx;
    padding: 0 30upx;
    background: #fff;
}
.item input{
    width: 600upx;
}
.mt_15{
    margin-top: 15upx;
}
iframe{
    position: fixed;
    top: 0;
    bottom: 0;
    height: 100%;
}
.footer{
    position: fixed;
    bottom: 0;
    width: 100%;
}
.footer button{
    width: 100%;
    height: 98upx;
    line-height: 98upx;
    font-size: 32upx;
    background:linear-gradient(90deg,rgba(208,164,245,1) 0%,rgba(255,175,220,1) 100%);
    color: #fff;
}
/* picker */
.picker-box{
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    z-index: 1;
}
.layer{
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.6);
    z-index: 1;
}
picker-view{
    position: absolute;
    bottom: 0;
    width: 100%;
	height: 40vh;
    z-index: 2;
	background: #fff;
}
.picker-nav{
	position: absolute;
	bottom: 40vh;
    z-index: 2;
	width: 100%;
	height: 100upx;
	padding: 0 30upx;
	background: #fff;
	border-bottom: 2upx solid #e6e6e6;
}
.jcicon-dingwei{
	font-size: 40upx;
}
</style>

