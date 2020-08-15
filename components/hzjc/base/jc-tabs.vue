<template>
	<view class="jc-tabs">
		<scroll-view scroll-x class="bg-white nav" scroll-with-animation :scroll-left="scroll_left">
			<view class="flex text-center">
				<view class="cu-item flex-sub" :class="index==active_index?'cur':''" :style="index==active_index?'color:'+activeColor:''" v-for="(item,index) in lists" :key="index" @tap="tabSelect" :data-index="index">
					{{item}}
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		name:'jc-tabs',
		data() {
			return {
				scroll_left:0,
				active_index:this.active,
				lists:[]
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
			tabSelect(e) {
				this.active_index = e.currentTarget.dataset.index;
				this.scroll_left = (e.currentTarget.dataset.index - 1) * 60;
				// 回调（当前选中值）
				this.$emit('switch', this.active_index);
			}
		}
	}
</script>

<style scoped>
	
</style>
