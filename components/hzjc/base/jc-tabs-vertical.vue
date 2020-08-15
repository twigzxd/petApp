<template>
	<view class="jc-tabs-vertical">
		<view class="VerticalBox">
			<scroll-view class="VerticalNav nav" scroll-y scroll-with-animation :scroll-top="scroll_top" :style="'height:calc(100vh - '+top+'upx)'">
				<view class="cu-item" :class="index==active_index?'cur':''" :style="index==active_index?'color:'+activeColor:''" v-for="(item,index) in lists" :key="index" @tap="TabSelect" :data-index="index">
					{{item}}
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		name:'jc-tabs-vertical',
		data() {
			return {
				lists:[],
				active_index:this.active,
				scroll_top: 0
			}
		},
		props:{
			list:{ //数据
				type: Array,
				default: []
			},
			listKey:{ //键值
				type: String,
				default: 'name'
			},
			active:{ //当前索引
				type: [Number, String],
				default: 0
			},
			activeColor :{ //当前选中颜色
				type: String,
				default: '#F10200'
			},
			top:{ //距离顶部距离
				type: Number,
				default: 0
			}
		},
		created(){
			if(this.listKey){
				for(let i=0;i<this.list.length;i++){
					this.lists.push(this.list[i][this.listKey]);
				}
			}
		},
		methods: {
			TabSelect(e){
				this.active_index = e.currentTarget.dataset.index;
				this.scroll_top = (e.currentTarget.dataset.index - 1) * 50;
				// 回调（当前选中值）
				this.$emit('switch', this.active_index);
			}
		}
	}
</script>

<style scoped>
	.fixed {
		position: fixed;
		z-index: 99;
	}
	
	.VerticalNav.nav {
		width: 200upx;
		white-space: initial;
	}
	
	.VerticalNav.nav .cu-item {
		width: 100%;
		text-align: center;
		background-color: #fff;
		margin: 0;
		border: none;
		height: 50px;
		position: relative;
	}
	
	.VerticalNav.nav .cu-item.cur {
		background-color: #f1f1f1;
	}
	
	.VerticalNav.nav .cu-item.cur::after {
		content: "";
		width: 8upx;
		height: 30upx;
		border-radius: 10upx 0 0 10upx;
		position: absolute;
		background-color: currentColor;
		top: 0;
		right: 0upx;
		bottom: 0;
		margin: auto;
	}
	
	.VerticalBox {
		display: flex;
	}
	
	.VerticalMain {
		background-color: #f1f1f1;
		flex: 1;
	}
</style>
