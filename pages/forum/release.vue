<template>
	<view class="container">
		<view class="p_lr_30 bb_ed flex title_line align-center">
			<view class="fs_28 c_1a">标题</view>
			<input v-model="name" class="fs_28 title_input" placeholder="填写标题~" placeholder-class="c_cc fs_28" />
		</view>
		<view class="p_lr_30">
			<div class="text-box">
				<textarea v-model="content" placeholder="记录你与爱宠的每一天..."></textarea>
			</div>
			<view class="flex wrap up-image-box">
				<view class="img-box" v-for="(item1,index1) in img_path" :key="index1">
					<image :src="item1" mode=""></image>
					<text class="iconfont icon-ai54 c_1a fs_48" @click="_removeimg(index1)"></text>
				</view>
				<view class="img-box ta_c">
					<image src="../../static/images/addimg2.png" mode="" @click="_chooseImage()"></image>
					<view class="p_re fs_20 c_b3" style="top:-70upx;">还可上传{{9-img_path.length}}张</view>
					<!-- <image src="../../static/images/add.png" mode="" @click="_chooseImage(index)"></image> -->
				</view>
				<!-- 视频 -->
				<view class="img-box" v-if="video_url">
					<video style="width:165upx;height:165upx" class="" :src="video_url"></video>
					<cover-view class="iconfont icon-ai54 c_1a fs_48 remove" @click="_removeVideo()"></cover-view>
				</view>
				<view class="img-box ta_c" v-if="video_url==''">
					<image src="../../static/images/addvideo.png" mode="" @click="_chooseVideo()"></image>
					<view class="p_re fs_20 c_b3" style="top:-70upx;">添加短视频</view>
					<!-- <image src="../../static/images/add.png" mode="" @click="_chooseImage(index)"></image> -->
				</view>
				
			</view>
			<view class="label">
				<text class="iconfont icon-biaoqian fs_32"></text>
				<text class="c_4d fs_28">标签</text>
				<text class="ml_20 fs_28 c_989BF9" @click="addLabel">+添加</text>
			</view>
			<view v-for="(item,index) in list" class="flex__between bb_ed align-center">
				<input placeholder="请输入标签内容" v-model="item.cate_name" class="flex_1 lh_100" />
				<text class="ml_20 fs_28 c_989BF9" @click="delLabel(index)">-删除</text>
			</view>

			<view class="submit ta_c c_ff fs_32" @click="publishNews()">发布话题</view>
		</view>

	</view>
</template>

<script>
	import {
		uniLoadMore
	} from '@dcloudio/uni-ui'
	const app = getApp();
	export default {
		data() {
			return {
				name: '',
				content: '',
				img_path: [],
				video_url: '',
				image_count: 9,
				list: [{
					cate_name: ''
				}]
			}
		},
		methods: {
			addLabel() {
				let obj = {
					cate_name: ''
				};
				this.list.push(obj)
			},
			delLabel(index) {
				this.list.splice(index, 1);
			},
			//选择图片
			_chooseImage(index) {
				var count = parseInt(this.image_count) - this.img_path.length;
				var that = this;
				uni.chooseImage({
					count: count,
					sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
					success: function(res) {
						that._imageUpload(res.tempFilePaths);
					}
				})
			},
			// 图片上传
			_imageUpload(tempFilePaths) {
				var that = this;
				uni.showLoading({
					title: '加载中'
				})
				uni.uploadFile({
					url: 'https://xachongniapp.jucheng01.net/app.php/Basic/saveFile',
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
								that.img_path.push(data);
								tempFilePaths.splice(0, 1);
								if (tempFilePaths.length > 0) {
									that._imageUpload(tempFilePaths);
								}
							} else {
								uni.showToast({
									title: '上传图片失败',
									icon: 'none'
								})
							}
						} else {
							uni.showToast({
								title: '上传图片失败',
								icon: 'none'
							})
						}
					}
				})
			},
			// 删除图片
			_removeimg(index) {
				this.img_path.splice(index, 1)
				// this.$set(this.order_product[index].img_path,this.order_product[index].img_path.splice(index1, 1));
			},
			//选择视频
			_chooseVideo() {
				var that = this;
				 uni.chooseVideo({
					count: 1,
					sourceType: ['camera', 'album'], // 可以指定来源是相册还是相机，默认二者都有
					success: function (res) {
						console.log(res);
						that._videoUpload(res.tempFilePath);
					},
					complete:function(res){
					}
				})
			},
			// 视频上传
			_videoUpload(tempFilePaths) {
				var that = this;
				uni.showLoading({
					title: '加载中'
				})
				uni.uploadFile({
					url: 'https://ycscapp.jucheng01.net/applet.php/Basic/saveFile',
					filePath: tempFilePaths,
					name: 'file',
					header: {
						'content-type': 'multipart/form-data'
					},
					success: function(res) {
			
					},
					complete: function(res) {
						console.log(res);
						uni.hideLoading();
						if (res.statusCode == 200) { //微信上传图片状态完成
							var res = JSON.parse(res.data);
							if (res.code == 1) { //控制器上传是否成功
								var data = res.data.url;
								that.video_url=data;
							} else {
								uni.showToast({
									title: '上传视频失败',
									icon: 'none'
								})
							}
						} else {
							uni.showToast({
								title: '上传视频失败',
								icon: 'none'
							})
						}
					}
				})
			},
			// 删除视频
			_removeVideo(index) {
				this.video_url='';
			},
			publishNews() {
				  
				let cate_name = this.list.map(item => item.cate_name);
				let param = {
					name: this.name, //标题
					content: this.content, //内容
					img_path: this.img_path, //多图 逗号分隔
					video_url: this.video_url, //视频地址
					cate_name: cate_name, //标签名 逗号分隔
				};
				if(!this.name){
					uni.showToast({
						title: '标题不能为空',
						icon: 'none'
					});
					return false
				}
				if(!this.content){
					uni.showToast({
						title: '内容不能为空',
						icon: 'none'
					});
					return false
				}
				app.$vm.getData({
					url: 'News/publishNews',
					that: this,
					data: param,
					loading: 1
				}).then(res => {
					if (res.code == 1) {
						uni.showModal({
							content: '发布成功',
							icon:'none',
							success: res => {
								uni.navigateBack({
									delta: -1
								})
							}
						})
						
					} else {
						uni.showToast({
							title: res.message,
							icon: 'none'
						});
					}
				});
			}
		}
	}
</script>

<style scoped>
	.container {
		background-color: #fff;
		min-height: 100vh;
		padding: 90upx 0upx 20upx;
	}

	.c_cc {
		color: #CCCCCC;
	}

	.title_line {
		padding-bottom: 25upx;
	}

	.title_input {
		border: 0px;
		padding: 0px 0px 0px 35px;
	}

	.text-box {
		padding: 30upx 0upx;
	}

	.up-image-box {}

	.up-image-box image {
		width: 165upx;
		height: 165upx;
	}

	.up-image-box .img-box {
		position: relative;
		margin-left: 10upx;
		margin-top: 10upx;
	}

	.img-box text {
		position: absolute;
		top: 0;
		right: 0;
	}

	.up-image-box .img-box:nth-child(4n+1) {
		margin-left: 0;
	}

	.label {
		margin-top: 90upx;
		margin-bottom: 20upx;
	}

	.fs_32.icon-biaoqian {
		font-size: 32upx;
		margin-right: 7upx;
	}

	.c_989BF9 {
		color: #989BF9;
	}

	input.lh_100 {
		height: 100upx;
		line-height: 100upx;
	}

	.submit {
		margin-top: 50upx;
		width: 690upx;
		height: 90upx;
		line-height: 90upx;
		background: linear-gradient(90deg, rgba(208, 164, 245, 1) 0%, rgba(255, 175, 220, 1) 100%);
		box-shadow: 0upx 6upx 8upx 0upx rgba(204, 132, 255, 0.24);
		border-radius: 45upx;
	}
	.remove{
		position: absolute;
		right: -5upx;
		top: -10upx;
		z-index: 111111;
		color: #fff;
	}
</style>
