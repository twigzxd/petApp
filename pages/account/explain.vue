<template>
	<view id="explain">
		<view>
			<rich-text :nodes="dataInfo" class="richTest"></rich-text>
		</view>
	</view>
</template>

<script>
	const app = getApp()
	export default{
		data(){
			return{
				dataInfo:""
			}
		},
		onShow() {
			this.getresult()
		},
		methods:{
			getresult(){
				const that = this
				app.$vm.getData({
					url:'Distribution/getRemark',
					data:{},
					loading:1
				}).then(res=>{
					if(res.code == 1){
						that.dataInfo = res.data
					}
				})
			}
		}
	}
</script>

<style>
	page{
		background: #fff;
	}
</style>
<style lang="less" scoped>
	#explain{
		width:100%;
		height: 100%;
		&>view{
			margin: 0 42upx 0 50upx;
			height: 100%;
			.richTest{
				color: #080808;
				font-size: 26upx;
				font-weight: 400;
				font-family: '常规体';
			}
		}
		
	}
</style>