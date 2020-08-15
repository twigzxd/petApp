<template>
	<view>
		<web-view :src="orderPaymentId"></web-view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				orderPaymentId:'',
			}
		},
		onLoad(option){
			this.orderPaymentId = option.url
			// console.log(this.orderPaymentId)
		},
	}
</script>

<style>
</style>
