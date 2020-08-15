<template>
    <div class="logistics">
        <div class="flex__between__center info-box">
            <div class="info-box__left flex__null__between">
                <span class="fs_26 c_1a">承运来源：{{express_name}}</span>
                <span class="fs_26 c_1a">运单编号：{{order_number}}</span>
            </div>
            <span class="fs_32 c_main">{{state}}</span>
        </div>
        <div class="flex wrap list">
            <div class="flex__null__center item">
                <span class="fs_28 c_98">收货地址：{{address}}</span>
                <div class="tipss"></div>
            </div>
            <div class="flex__null__center item" v-for="(item,index) in traces" :key="index">
                <span class="fs_28 c_98">{{item.AcceptStation}}<span v-if="item.Remark">({{item.Remark}})</span></span>
                <span class="fs_24 c_98">{{item.AcceptTime}}</span>
                <div class="flex__center__center tips--active" v-if="!index">
                    <div class="tips"></div>
                </div>
                <div class="tipss" v-else></div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "Logistics",
    data(){
        return{
            traces: [],
            address:"", //收货地址
            express_name: "", //承运来源
            order_number:"", //运单编号
            state:"", //运单状态
        }
    },
    onLoad(options){
		app.$vm.getData({
			url:'Mall/getExpressData',
			that: this,
			data: {
				order_id: options.id
			},
			loading: 1
		}).then(res=>{
			if(res.code==1){
				this.express_name=res.data.data.express_name;
				this.order_number=res.data.data.order_number;
				this.state=res.data.data.state;
				this.traces=res.data.data.traces;
				this.address=res.data.data.address;
			}
		})
    }
}
</script>
<style scoped>
.logistics{
    padding: 20upx;
}
.info-box{
    height: 140upx;
    padding: 0 30upx;
    border-radius: 10upx;
    background: #fff;
}
.info-box__left{
    height: 140upx;
    padding: 30upx 0;
}
.list{
    padding: 30upx;
    margin-top: 15upx;
    border-radius: 10upx;
    background: #fff;
}
.item{
    position: relative;
    padding: 30upx 0 30upx 30upx;
    line-height: 40upx;
    border-left: 4upx solid #cbcbcb;
}
.tipss{
    position: absolute;
    top: 50%;
    left: -9upx;
    margin-top: -7upx;
    width: 14upx;
    height: 14upx;
    background: #b3b3b3;
    border-radius: 50%;
}
.tips--active{
    position: absolute;
    top: 50%;
    left: -17upx;
    margin-top: -15upx;
    width: 30upx;
    height: 30upx;
    background: #FFE2E3;
    border-radius: 50%;
}
.tips--active .tips{
    width: 14upx;
    height: 14upx;
    background: #F93A42;
    border-radius: 50%;
}
</style>


