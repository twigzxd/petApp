<template>
	<view class="jc-list">
		<slot></slot>
		<view class="flex justify-center" v-if="status=='hasError'" @tap="load">
			<text class="text-24 text-b3">{{contentText[status]}}</text>
		</view>
		<view class="flex justify-center" v-else>
			<text class="text-24 text-b3">{{contentText[status]}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		name:'jc-list',
		data() {
			return {
				
			}
		},
		props:{
			status :{ //状态
				type: String,
				default: 'nodata'
			},
			contentText:{ //文案
				type: Object,
				default:()=>{ 
					return {nodata:'暂无数据~',loading:'加载中...',finished:'我是有底线的~',hasError:'加载失败,点击重新加载'};
				}
			}
		},
		methods: {
			load(){
				this.$emit('load');
			}
		}
	}
</script>

<style scoped>
	
</style>
