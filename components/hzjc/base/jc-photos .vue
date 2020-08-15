<template>
	<view class="jc-photos">
		<view class="box"> 
			<view :class="['item__img','column'+column,index%column==0?'margin-left-0':'']" v-for="(item,index) in list" :key="index" @tap="see(index,item.type)">
				<image :src="item[imgKey]" :mode="mode"></image>
				<image class='item__video__btn' src='/static/components/play.png' v-if="item.type==2"></image>
			</view>
		</view>
		<!-- 视频播放 -->
		<view class="video-box" v-show="video_url">
			<view class="video-box__layer" @tap="closeVideo"></view>
			<video v-if="video_url" id="myVideo" :src="video_url" controls></video>
		</view>
	</view>
</template>

<script>
	export default {
		name:'jc-photos',
		data() {
			return {
				lists:[],
				img_list:[],
				active_index:0,
				video_url:''
			}
		},
		props:{
			list:{ //数据
				type: Array,
				default: []
			},
			imgKey:{ //键值
				type: String,
				default: ''
			},
			videoKey:{ //键值
				type: String,
				default: ''
			},
			isEnlarge:{ //是否放大
				type: Boolean,
				default:false
			},
			mode:{ //显示类型
				type: String,
				default:'aspectFill'
			},
			column:{ //一行几个
				type: [Number, String],
				default:3
			}
		},
		created() {
			for(let i=0;i<this.list.length;i++){
				this.img_list.push(this.list[i][this.imgKey]);
			}
		},
		methods: {
			 // 播放视频
			see(index,type) {
			    if (type == 1) {
					uni.previewImage({
						current: this.img_list[index], // 当前显示图片的http链接
						urls: this.img_list // 需要预览的图片http链接列表
					})
			    } else {
					this.video_url=this.list[index].video_url;
			    }
			},
			// 关闭视频
			closeVideo() {
				this.video_url='';
			}
		}
	}
</script>

<style scoped>
	.box{
		display: flex;
		flex-wrap: wrap;
		padding: 0 30upx;
	}
	.item__img{
	  position: relative;
	  border-radius: 10upx;
	}
	.column2{
	  width: 335upx;
	  height: 335upx;
	  margin: 20upx 0 0 20upx;
	  border-radius: 10upx;
	}
	.column2 image{
	  width: 335upx;
	  height: 335upx;
	  border-radius: 10upx;
	}
	.column3{
	  width: 220upx;
	  height: 220upx;
	  margin: 15upx 0 0 15upx;
	  border-radius: 10upx;
	}
	.column3 image{
	  width: 220upx;
	  height: 220upx;
	  border-radius: 10upx;
	}
	.column4{
	  width: 162upx;
	  height: 162upx;
	  margin: 14upx 0 0 14upx;
	  border-radius: 10upx;
	}
	.column4 image{
	  width: 162upx;
	  height: 162upx;
	  border-radius: 10upx;
	}
	.item__img .item__video__btn{
	  position: absolute;
	  right: 10rpx;
	  bottom: 10rpx;
	  width: 60rpx;
	  height: 60rpx;
	  border-radius: 50%;
	}
	/* 播放视频 */
	.video-box{
	  position: fixed;
	  top: 0;
	  left: 0;
	  bottom: 0;
	  width: 100%;
	  height: 100%;
	}
	.video-box__layer{
	  position: absolute;
	  top: 0;
	  left: 0;
	  width: 100%;
	  height: 100%;
	  background: rgba(0, 0, 0, .6);
	}
	.video-box video{
	  width: 100%;
	  height: 450upx;
	  top: 50%;
	  margin-top: -225upx;
	}
</style>
