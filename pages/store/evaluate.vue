<template>
	<div class="evaluate">
		<!-- 商品列表 -->
		<div class="sale-box" v-for="(item,index) in order_product" :key="index">
			<div class="flex sale__item align-center">
				<img :src="item.cover_img" alt="">
				<div class="flex__null__around sale__item__right flex_1">
					<span class="fs_26 c_1a lh_36 ellipsis_two">{{item.name}}</span>
				</div>
			</div>
			<div class="flex__between__center star-box">
				<span class="fs_28 c_4d">描述相符</span>
				<span>&nbsp;</span>
				<span @click='star(index,index1)' v-for="(item1,index1) in item.star_array" :key="index1" class="iconfont icon-iospaw fs_40"
				 :class="item1.is_chose?'c_pur':'c_e6'"></span>
				<span>&nbsp;</span>
				<span v-if="item.star>3">好评</span>
				<span v-else-if="item.star==3">中评</span>
				<span v-else>差评</span>
			</div>
			<div class="text-box">
				<textarea v-model="item.content" placeholder="亲，咱平台的服务能够达到您的预期吗？您的评价是商家不 断进步的源泉，写点什么吧"></textarea>
			</div>
			<view class="flex wrap up-image-box">
				<view class="img-box" v-for="(item1,index1) in item.img_path" :key="index1">
					<image :src="item1" mode=""></image>
					<text class="iconfont icon-ai54 c_1a fs_48" @click="_removeimg(index,index1)"></text>
				</view>
				<view class="img-box ta_c">
					<image src="../../static/images/addimg2.png" mode="" @click="_chooseImage(index)"></image>
					<view class="p_re fs_20 c_b3" style="top:-70upx;">还可上传{{9-item.img_path.length}}张</view>
					<!-- <image src="../../static/images/add.png" mode="" @click="_chooseImage(index)"></image> -->
				</view>
			</view>
		</div>
		<div class="footer">
			<button @click="evaluate">评价</button>
		</div>
	</div>
</template>
<script>
	const app = getApp();
	export default {
		name: "Evaluate",
		data() {
			return {
				img_list:[],
				order_product: [],
				evaluates: {
					source: 1,
					product_id: '',
					review_product: '',
					star_array:[]
				},
				image_count: 9,
			}
		},
		methods: {
			// 评星
			star(index, index1) {
				for (let i = 0; i < 5; i++) {
					this.order_product[index].star_array[i].is_chose = false;
				}
				for (let i = 0; i < index1 + 1; i++) {
					this.order_product[index].star_array[i].is_chose = true;
				}
				this.order_product[index].star = index1 + 1;
			},
			// 评价
			evaluate() {
				let params = {
					product_id:this.order_product[0].id,//门店ID
					star:this.order_product[0].star,//星级
					content:this.order_product[0].content,//评论内容
					img_path:this.order_product[0].img_path//评论图片，逗号分隔
				}
				app.$vm.getData({
					url: 'Collage/submitOrderReview', 
					that: this,
					data: params,
					loading: 1
				}).then(res => {
					// this.order_product = res.data.order_product;
					uni.showModal({
						content: res.message,
						showCancel: false,
						success() {
							uni.navigateBack()
						}
					});
				})
			},
			//选择图片
			_chooseImage(index) {
				var count = parseInt(this.image_count) - this.order_product[index].img_path.length;
				var that = this;
				console.log(count);
				uni.chooseImage({
					count: count,
					sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
					success: function(res) {
						that._imageUpload(res.tempFilePaths,index);
					}
				})
			},
			// 图片上传
			_imageUpload(tempFilePaths,index) {
				var that = this;
				uni.showLoading({
					title: '加载中'
				})
				uni.uploadFile({
					url: 'https://ycscapp.jucheng01.net/applet.php/Basic/saveFile',
					filePath: tempFilePaths[0],
					name: 'file',
					header: {
						'content-type': 'multipart/form-data'
					},
					success: function(res) {

					},
					complete: function(res) {
						uni.hideLoading();
						if (res.statusCode == 200) { //微信上传图片状态完成
							var res = JSON.parse(res.data);
							if (res.code == 1) { //控制器上传是否成功
								var data = res.data.url;
								that.order_product[index].img_path.push(data);
								tempFilePaths.splice(0, 1);
								if(tempFilePaths.length>0){
									that._imageUpload(tempFilePaths,index);
								}
							} else {
								uni.showToast({
									title:'上传图片失败',
									icon: 'none'
								})
							}
						} else {
							uni.showToast({
								title:'上传图片失败',
								icon: 'none'
							})
						}
					}
				})
				// that.order_product[index].img_path.push('https://juchenghb1.oss-cn-qingdao.aliyuncs.com/ycscapp/uid2/applet/20190527/5cebc886b8d0c.png')
			},
			// 删除图片
			_removeimg(index,index1) {
				console.log(this.order_product[index].img_path);
				this.$set(this.order_product[index].img_path,this.order_product[index].img_path.splice(index1, 1));
			}
		},
		onLoad(options) {
			this.evaluates.product_id = options.id;
			app.$vm.getData({
				url: 'Collage/getReviewData',
				that: this,
				data: {
					product_id: options.id
				},
				loading: 1
			}).then(res => {
				if (res.code == 1) {
					let arr = [];
					let obj = {
						content:'',
						star_array:[
							{id: 1, is_chose: 1},
							{id: 2, is_chose: 1},
							{id: 3, is_chose: 1},
							{id: 4, is_chose: 1},
							{id: 5, is_chose: 1},
						],
						img_path:[],
						id:res.data.id,
						cover_img:res.data.cover_img,
						name:res.data.name,
						star:5
					}
					
					arr.push(obj);
					this.order_product = arr;
				} 
				else if (res.code == 201) {
					uni.showModal({
						content: res.message,
						showCancel: false,
						success() {
							uni.navigateBack()
						}
					});
				} else {
					uni.showToast({
						title: res.message,
						icon: 'none'
					});
				}
			})
		}
	}
</script>
<style scoped>
	.evaluate{
		background-color: #fff;
		min-height: 100vh;
	}
	.sale-box {
		padding: 0 0 30upx;
		margin-top: 15upx;
		overflow: hidden;
	}

	.sale-box:first-child {
		margin-top: 0;
	}

	.sale__item {
		background: #FAFAFA;
		margin: 30upx;
		padding: 25upx 30upx;
	}

	.sale__item:last-child {
		border: 0;
	}

	.sale__item img {
		width: 150upx;
		height: 112.5upx;
		border-radius: 10upx;
	}

	.sale__item__right {
		flex: 1;
		margin-left: 30upx;
	}

	.star-box {
		height: 100upx;
		padding: 0 30upx;
		border-bottom: 2upx solid #e6e6e6;
	}

	.text-box {
		padding: 30upx;
	}

	.text-box textarea {
		width: 100%;
		height: 150upx;
		line-height: 38upx;
		font-size: 26upx;
		resize: none;
	}
	
	.up-image-box{
		padding: 0 30upx;
	}
	.up-image-box image{
		width: 165upx;
		height: 165upx;
	}
	.up-image-box .img-box{
		position: relative;
		margin-left: 10upx;
		margin-top: 10upx;
	}
	.img-box text{
		position: absolute;
		top: 0;
		right: 0;
	}
	.up-image-box .img-box:nth-child(4n+1){
		margin-left: 0;
	}
	.footer {
		position: fixed;
		bottom: 0;
		width: 100%;
	}

	.footer button {
		width: 100%;
		height: 98upx;
		line-height: 98upx;
		font-size: 32upx;
		background:linear-gradient(90deg,rgba(208,164,245,1) 0%,rgba(255,175,220,1) 100%);
		color: #fff;
	}
	.iconfont.fs_40{
		font-size: 36upx!important;
	}
</style>
