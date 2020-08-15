<template>
	<view class="jc-swiper">
		<swiper class="screen-swiper" :indicator-dots="indicatorDots" :indicator-active-color="indicatorActiveColor" :autoplay="autoplay" 
		:current="current" :circular="circular" :interval="interval" :duration="duration" :disable-touch="disableTouch" :touchable="touchable" @change="tabChange">
			<swiper-item v-for="(item,index) in list" :key="index" :data-index="index">
				<image :src="item[imgKey]" :mode="mode" v-if="item.type==1"></image>
				<video :src="item[videoKey]" v-if="item.type==2" :enable-progress-gesture="false"></video>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
		name:'jc-swiper',
		data() {
			return {
				
			}
		},
		props:{
			list:{ //数据
				type: Array,
				default: []
			},
			imgKey:{ //图片键值
				type: String,
				default: 'img_url'
			},
			videoKey:{ //视频键值
				type: String,
				default: 'video_url'
			},
			mode:{//图片显示样式
				type: String,
				default: 'scaleToFill'
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
			autoplay:{//自动切换
				type: Boolean,
				default: false
			},
			current:{//当前所在滑块的 index
				type: Number,
				default: 0
			},
			currentItemId:{//当前所在滑块的 item-id ，不能与 current 被同时指定
				type: String,
				default: ''
			},
			interval:{//自动切换时间间隔
				type: Number,
				default: 5000
			},
			duration:{//滑动动画时长
				type: Number,
				default: 500
			},
			circular:{//是否采用衔接滑动
				type: Boolean,
				default: false
			},
			vertical:{//滑动方向是否为纵向
				type: Boolean,
				default: false
			},
			disableTouch:{//是否禁止用户 touch 操作
				type: Boolean,
				default: false
			},
			touchable:{//是否监听用户的触摸事件
				type: Boolean,
				default: true
			},
			duration:{//滑动动画时长
				type: Number,
				default: 500
			},
			easingFunction:{//指定 swiper 切换缓动动画类型，有效值：default、linear、easeInCubic、easeOutCubic、easeInOutCubic
				type: String,
				default:'default'
			}
		},
		methods: {
			tabSelect(e){
				let index = e.currentTarget.dataset.index;
				this.$emit('switch',index);
			},
			tabChange(e){
				this.$emit('change',e);
			}
		}
	}
</script>

<style scoped>
	.jc-swiper,swiper{
		width: 100%;
		height: 100%;
	}
</style>
