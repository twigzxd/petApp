<template>
	<view :class="['jc-pop-up',overlay?'overlay':'']" @tap="popUpHide">
		<slot></slot>
	</view>
</template>

<script>
	export default {
		name:'jc-pop-up',
		data() {
			return {
			}
		},
		props:{
			overlay:{//蒙版
				type: Boolean,
				default: true
			},
			overlayClose:{//点击蒙版关闭
				type: Boolean,
				default: true
			}
		},
		methods: {
			popUpHide(){
				if(this.overlayClose){
					this.$emit('hide');
				}
			}
		}
	}
</script>

<style scoped>
	.jc-pop-up{
		position: fixed;
		top: 0; 
		bottom: 0;
		width: 100%;
	}
	.overlay{
		background: rgba(0,0,0,.6);
	}
</style>
