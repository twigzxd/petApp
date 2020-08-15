<template>
	<div class="evaluate">
		<!-- 商品列表 -->
		<div class="sale-box" v-for="(item,index) in order_product" :key="index">
			<div class="flex sale__item">
				<img :src="item.product_cover_img" alt="">
				<div class="flex__null__around sale__item__right">
					<span class="fs_26 c_1a lh_36 ellipsis_two">{{item.product_name}}</span>
					<span class="fs_22 c_98" v-if="item.product_sku_name">规格: {{item.product_sku_name}}</span>
					<span v-else></span>
				</div>
			</div>
			<div class="flex__between__center star-box">
				<span class="fs_28 c_1a">描述相符</span>
				<span>&nbsp;</span>
				<span @click='star(index,index1)' v-for="(item1,index1) in item.star_array" :key="index1" class="iconfont icon-iospaw "
				 :class="item1.is_chose?'pink':'c_e6'"></span>
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
					<!-- <text class="iconfont icon-ai54 c_1a fs_48" @click="_removeimg(index,index1)"></text> -->
					<image class="del" src="../../static/images/del.png"   @click="_removeimg(index,index1)" mode=""></image>
				</view>
				<view class="img-box " style="position:relative;" v-if="count!=0">
					<image src="../../static/images/add.png" mode="" @click="_chooseImage(index)"></image>
					<view class="up" v-if="count==9">上传图片</view>
					<view class="up" v-if="count<=8">还可上传{{count}}张</view>
				</view>
			</view>
		</div>
		<div class="footer">
			<button @click="evaluate">提交</button>
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
					order_id: '',
					review_product: ''
				},
				image_count: 9,
				count:9,
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
				let order_arr = [];
				for (let i = 0; i < this.order_product.length; i++) {
					let order_obj = {};
					order_obj.product_id = this.order_product[i].product_id;
					order_obj.content = this.order_product[i].content;
					order_obj.product_name = this.order_product[i].product_name;
					order_obj.star = this.order_product[i].star;
					order_obj.sku = this.order_product[i].product_sku;
					order_obj.img_path = this.order_product[i].img_path;
					order_arr.push(order_obj);
				}
				this.evaluates.review_product = JSON.stringify(order_arr);
				app.$vm.getData({
					url: 'home/submitReview', 
					that: this,
					data: this.evaluates,
					loading: 1
				}).then(res => {
					this.order_product = res.data.order_product;
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
								var count = parseInt(that.image_count) - that.order_product[index].img_path.length;
								that.count=count
								console.log(count)
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
				var count = parseInt(this.image_count) - this.order_product[index].img_path.length;
				this.count=count
				
			}
		},
		onLoad(options) {
			this.evaluates.order_id = options.id;
			// console.log(localStorage.user_id)
			console.log(options.id)
			app.$vm.getData({
				url: 'home/getReviewData',
				that: this,
				data: {
					order_id: options.id
				},
				loading: 1
			}).then(res => {
				if (res.code == 1) {
					this.order_product = res.data.order_product;
					console.log(this.order_product)
				} else if (res.code == 201) {
					uni.showToast({
						content: res.message,
						showCancel: false,
						success() {
							uni.navigateBack()
						}
					});
				} else {
					// uni.showToast({
					// 	title:res.message,
					// 	icon: 'none'
					// });
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
	.icon-iospaw{
		font-size: 45upx;
	}
	.pink{
		color: #F889CE;
	}
	.sale-box {
		padding: 0 0 30upx;
		margin-top: 15upx;
		/* background: #FAFAFA; */
		overflow: hidden;
	}

	.sale-box:first-child {
		margin-top: 0;
	}

	.sale__item {
		margin: 30upx;
		background: #FAFAFA;
		padding: 24upx 30upx;
	}

	.sale__item:last-child {
		border: 0;
	}

	.sale__item img {
		width:150upx;
		height:113upx;
		border-radius:10upx;
	}

	.sale__item__right {
		width: 480upx;
		margin-left: 30upx;
	}

	.star-box {
		height: 100upx;
		margin: 0 30upx;
		border-bottom: 2upx dotted #e6e6e6;
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
	.img-box .del{
		position: absolute;
		top: -5upx;
		right: -5upx;
		width: 30upx;
		height: 30upx;
		display:block;
	}
	.up{
		position: absolute;
		transform: translate(-50%);
		left: 50%;
		bottom: 35upx;
		height:28upx;
		font-size:20upx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:rgba(179,179,179,1);
		line-height:28upx;
		width:140upx;
		text-align: center;
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
	
</style>
