<template>
    <div class="contact">
        <div class="flex__center__center column  wrap">
            <p class="title">CONTACT US</p>
            <div class="flex__center__center">
                <span>——&emsp;</span>
                <span class="fs_38 c_1a">联系我们</span>
                <span>&emsp;——</span>
            </div>
        </div>
        <div class="img-box" @click="link">
            <img :src="infos.carousel[0].img_path" alt="">
        </div>
        <div class="list">
            <div class="flex__center column item">
                <p class="fs_26 c_b3 lh_40">联系方式</p>
                <div>
                    <text class="fs_32 c_4d lh_40" @click="call(infos.seat_machine)">{{infos.seat_machine}}</text>
                    <text class="fs_32 c_4d lh_40" @click="call(infos.telephone)">{{infos.telephone}}</text>
                </div>
            </div>
            <div class="flex__center column item">
                <p class="fs_26 c_b3 lh_40">客服微信</p>
                <p class="fs_32 c_4d lh_40">{{infos.wechat}}</p>
            </div>
            <div class="flex__center column item" @click="seeAddress">
                <p class="fs_26 c_b3 lh_40">公司地址</p>
                <p class="fs_32 c_4d lh_40">{{infos.address}}</p>
            </div>
        </div>
    </div>
</template>
<script>
const app=getApp();
export default {
    name: "Contact",
    data(){
        return{
            infos:{
                carousel:[{}]
            }
        }
    },
    methods:{
        link(){
            window.location.href=this.infos.carousel[0].url;
        },
		seeAddress(){
			uni.openLocation({ 
				latitude: Number(this.infos.lat),
				longitude: Number(this.infos.lng)
			});
		},
		call(cell){
			uni.makePhoneCall({
				phoneNumber: cell
			});
		}
    },
    onLoad(){
		app.$vm.getData({
			url:'Vip/contactUs',
			data: {},
			loading: 1
		}).then(res=>{
			if(res.code==1){
				this.infos=res.data.data;
			}
		})
    }

}
</script>
<style scoped>
.contact{
    position: fixed;
    top: 0;
    bottom: 0;
    padding: 0 45upx 30upx;
    background: #fff;
    align-items: center;
    overflow: auto;
}
.title{
    font-size: 70upx;
    color: #e6e6e6;
    line-height: 90upx;
    font-weight:normal;
}
.img-box{
    padding: 40upx 0 10upx;
}
.img-box img{
    width: 660upx;
    height: 260upx;
}
.item{
    padding: 30upx 30upx;
    margin-top: 10upx;
    background: #f5f5f5;
}
</style>
