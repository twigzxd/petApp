<template>
	<view class="index">
		<rich-text :nodes="deal"></rich-text>
	</view>
</template>

<script>
	const app=getApp();
	export default {
	    name:'conpons',
	    data(){
	        return{
				deal:''
	        }
	    },
		methods:{
			
		},
		onShow(){
			app.$vm.getData({
				url:'Register/getUserTips',
				that:this,
				data:{},
				loading:1
			}).then(res=>{
				if(res.code==1){
					this.deal = res.data.user_tips
				}
				
			})
		},
	}
</script>
<style>
	page{
		background: #FFFFFF;
	}
</style>
<style scoped>
	.index{
		margin: 30upx;
	}
</style>
