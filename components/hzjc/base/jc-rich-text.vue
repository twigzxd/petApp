<template>
	<view class="jc-rich-text">
		<rich-text :nodes="content" :space="space"></rich-text>
	</view>
</template>

<script>
	export default {
		name:'jc-rich-text',
		data() {
			return {
				content:''
			}
		},
		props:{
			nodes:{ //富文本内容
				type: String,
				default: ''
			},
			space:{ //显示连续空格
				type: Boolean,
				default:false
			}
		},
		created() {
			this.content=this.nodes.replace(/\<img/gi, '<img style="max-width:100%;height:auto"')
		}
	}
</script>

<style scoped>
	
</style>
