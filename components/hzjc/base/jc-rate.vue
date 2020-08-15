<template>
	<view class="jc-rate">
		<view class="item" :style="index<star?'background:'+color:''" v-for="(item,index) in maxStar" :key="index" @tap="rateSelect(index)">
			<text class="iconfont icon-star text-30 text-ff"></text>
		</view>
	</view>
</template>

<script>
	export default {
		name:'jc-rate',
		data() {
			return {
				star:this.defaultStar
			}
		},
		props:{
			maxStar:{ //最大评级
				type: Number,
				default: 5
			},
			defaultStar:{ //默认评级
				type: Number,
				default: 3
			},
			color:{ //active颜色
				type: String,
				default: '#F10101'
			},
			size:{ //星星大小 medium / small / mini
				type: String,
				default: 'medium'
			},
			disable:{ //是否禁用
				type: Boolean,
				default: false
			}
		},
		methods: {
			rateSelect(index){
				this.star=index+1;
				this.$emit('change', this.star);
			}
		}
	}
</script>

<style scoped>
	.jc-rate{
		display: flex;
	}
	.item{
		display: flex;
		justify-content: center;
		align-items: center;
		width: 36upx;
		height: 36upx;
		margin-left: 26upx;
		background: #e6e6e6;
		border-radius: 10upx;
	}
</style>
