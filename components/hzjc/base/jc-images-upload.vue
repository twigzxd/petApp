<template>
	<view class="jc-images-upload">
		<view class="cu-form-group">
			<view class="grid col-4 grid-square flex-sub">
				<view class="bg-img" v-for="(item,index) in img_list" :key="index" @tap="viewImage" :data-url="imgList[index]">
				 <image :src="img_list[index]" mode="aspectFill"></image>
					<view class="cu-tag bg-red" @tap.stop="delImg" :data-index="index">
						<text class='cuIcon-close'></text>
					</view>
				</view>
				<view class="solids" @tap="chooseImage" v-if="img_list.length<count">
					<text class='cuIcon-cameraadd'></text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:'jc-images-upload',
		data() {
			return {
				img_list: []
			}
		},
		props:{
			sizeType:{ //压缩
				type: Array,
				default:()=>{
					return ['original', 'compressed']
				} 
			},
			sourceType:{ //来源
				type: Array,
				default:()=>{
					return ['album','camera']
				}  
			},
			count:{ //最多上传几个
				type: Number,
				default:1
			}
		},
		methods: {
			chooseImage() {
				this.common.chooseImage(this.count,this.sizeType,this.sourceType).then(res=>{
					for(let i=0;i<res.length;i++){
						this.img_list.push(res[0]);
					}
					this.$emit('upload',res);
				})
			}, 
			viewImage(e) {
				uni.previewImage({
					urls: this.imgList,
					current: e.currentTarget.dataset.url
				});
			},
			delImg(e) {
				uni.showModal({
					content: '确定要删除这段回忆吗？',
					cancelText: '再看看',
					confirmText: '再见',
					success: res => {
						if (res.confirm) {
							this.img_list.splice(e.currentTarget.dataset.index, 1);
							_this.$emit("delete",e.currentTarget.dataset.index);
						}
					}
				})
			}
		}
	}
</script>

<style scoped>
	
</style>
