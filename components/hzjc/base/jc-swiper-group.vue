<template>
	<view class="jc-swiper-group">
		<swiper :indicator-dots="indicatorDots" :indicator-color="indicatorColor" :indicator-active-color="indicatorActiveColor" :class="indicatorDots?'height-360':'height-300'">
			<swiper-item :class="indicatorDots?'padding-bottom-60':'padding-bottom-30'" v-for="(item,index) in category_list" :key="index">
				<view class="item" v-for="(item1,index1) in item" :key="index1" @tap="tabSelect(index,index1)">
					<image :src="item1.cover_img" :style="'border-radius:'+imgRadius+'upx'"></image>
					<text class="text-24 text-4d">{{item1.name}}</text>
				</view>
			</swiper-item> 
		</swiper>
	</view>
</template>

<script>
	export default {
		name:'jc-swiper-group',
		data() {
			return {
				category_list:[]
			}
		},
		props:{
			list: { //数据
				type: Array,
				default:[]
			},
			imgRadius :{
				type: Number,
				default: 0
			},
			indicatorDots :{//指示点
				type: Boolean,
				default: true
			},
			indicatorColor :{//指示点默认颜色
				type: String,
				default: '#EDEDED'
			},
			indicatorActiveColor :{//指示点选中颜色
				type: String,
				default: '#F10101'
			},
			columnNum :{//一行有几个
				type: Number,
				default: 5
			}
			// textSize:{ //文字大小
			// 	type: Number,
			// 	default: 24
			// },
			// textColor:{ //文字颜色
			// 	type: String,
			// 	default: '#4D4D4D'
			// }
		},
		created(){
			let num=Math.floor(this.list.length/this.columnNum);
			for(let i=0;i<num;i++){
				let l_array=[];
				for(let j=i*this.columnNum*2;j<(i+1)*this.columnNum*2;j++){
					if(this.list[j]){
						l_array.push(this.list[j]);
					}
				}
				this.category_list.push(l_array);
			}
		},
		methods: {
			tabSelect(index,index1){
				this.$emit('switch',index*this.columnNum*2+index1+1);
			}
		}
	}
</script>

<style scoped>
	.height-360{
		height: 360upx;
	}
	.height-300{
		height: 300upx;
	}
	.jc-swiper-group swiper-item{
		display: flex;
		flex-wrap: wrap;
		height: 300upx!important;
	}
	.item{
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		width: 150upx;
		height: 120upx;
		margin-top: 30upx;
	}
	.item image{
		width: 80upx;
		height: 80upx;
	}
</style>
