<template>
	<div class='index'>
		<rich-text class="modular__content" :nodes="read_text"></rich-text>
		<div class='btn' v-if='show' @click='current'>确认注销账户</div>
	</div>
</template>

<script>
	const app = getApp();
	export default{
		data(){
			return{
				read_text:'',
				show:false
			}
		},
		methods:{
			current(){
				console.log(1)
				app.$vm.getData({
					url:'Register/logout',
					data:{},
					that:this,
					loading:1,
				}).then(res=>{
					if(res.code==1){
						
						uni.setStorageSync('user_id', ''); 
						uni.reLaunch({
							url:'./messagelogin'
						})
					}else{
						uni.showToast({
							icon:'none',
							title:res.message
						})
					}
					
				
				})
			}
		},
		onShow() {
			app.$vm.getData({
				url:'Register/getAgreement',
				that:this,
				data:{},
				loading:1
			}).then(res=>{
				if(res.code==1){
					this.read_text = res.data.agreement
					this.show=true
				}
				
			})
		}
	}
</script>

<style>
	page{
		background: #FFFFFF;
	}
</style>
<style scoped>
	.index{
		margin: 40upx 30upx;
	}
	.btn{
		/* position: fixed;
		left: 0;
		right: 0;
		bottom: 61upx; */
		height:90upx;
		margin: 30upx 30upx;
		background:linear-gradient(90deg,rgba(208,164,245,1) 0%,rgba(255,175,220,1) 100%);
		box-shadow:0px 6px 8px 0px rgba(204,132,255,0.24);
		border-radius:45upx;
		text-align: center;
		line-height: 90upx;
		color: #FFFFFF;
		font-size: 32upx;
	}
</style>
