<template>
	<view class="jc-image-upload" @tap="chooseImage">
		<slot></slot>
	</view>
</template>

<script>
	export default {
		name:'jc-image-upload',
		data() {
			return {}
		},
		methods: {
			chooseImage() {
				this.common.chooseImage(1).then(res=>{
					this.$emit('upload',res);
				})
			}
		}
	}
</script>

<style scoped>
	
</style>
